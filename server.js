const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Bypass-Tunnel-Reminder', 'bypass-tunnel-reminder']
}));

app.use(express.json());

// មូលដ្ឋានទិន្នន័យ APV
let apvDatabase = {
  '103992': { status: 'UNUSED', deviceId: null, expiresAt: null },
  '111111': { status: 'UNUSED', deviceId: null, expiresAt: null },
  '200101': { status: 'UNUSED', deviceId: null, expiresAt: null },
  '222222': { status: 'UNUSED', deviceId: null, expiresAt: null },
  '242134': { status: 'UNUSED', deviceId: null, expiresAt: null },
  '242756': { status: 'UNUSED', deviceId: null, expiresAt: null },
  '266721': { status: 'UNUSED', deviceId: null, expiresAt: null },
  '471140': { status: 'UNUSED', deviceId: null, expiresAt: null }
};

// Root Route
app.get('/', (req, res) => {
  res.send('Neakan API Server is running successfully!');
});

// API ទាញទិន្នន័យសម្រាប់ Dashboard
app.get('/api/dashboard', (req, res) => {
  const now = Date.now();
  Object.keys(apvDatabase).forEach(code => {
    if (apvDatabase[code].status === 'ACTIVE' && apvDatabase[code].expiresAt && now >= apvDatabase[code].expiresAt) {
      apvDatabase[code].status = 'UNUSED';
      apvDatabase[code].deviceId = null;
      apvDatabase[code].expiresAt = null;
    }
  });
  res.json({ status: 'SUCCESS', data: apvDatabase });
});

// API Admin Action (ចុច Lock ឬ Reset ចេញពី Dashboard)
app.post('/api/admin-action', (req, res) => {
  const { action, code } = req.body;

  if (action === 'LOCK_ONE' && code && apvDatabase[code]) {
    apvDatabase[code].status = 'LOCKED';
    apvDatabase[code].deviceId = 'BLOCKED';
    apvDatabase[code].expiresAt = Date.now();
    return res.json({ status: 'SUCCESS', message: `បាន Lock កូដ ${code} រួចរាល់!` });
  }

  if (action === 'LOCK_ALL' || action === 'RESET_ALL') {
    Object.keys(apvDatabase).forEach(c => {
      apvDatabase[c].status = 'UNUSED';
      apvDatabase[c].deviceId = null;
      apvDatabase[c].expiresAt = null;
    });
    return res.json({ status: 'SUCCESS', message: 'បាន Reset/Lock ឧបករណ៍ទាំងអស់ជោគជ័យ!' });
  }

  if (action === 'DELETE_CODE' && code) {
    delete apvDatabase[code];
    return res.json({ status: 'SUCCESS', message: `បានលុបកូដ ${code}!` });
  }

  res.status(400).json({ status: 'FAILED', message: 'សកម្មភាពមិនត្រឹមត្រូវ!' });
});

// API ផ្ទៀងផ្ទាត់ និងដោះសោរវីដេអូសម្រាប់ User
app.post('/api/verify-payment', (req, res) => {
  const { code, deviceId } = req.body;

  if (!code || code.length !== 6) {
    return res.status(400).json({ status: 'FAILED', message: 'លេខកូដ APV មិនត្រឹមត្រូវ!' });
  }

  const record = apvDatabase[code];

  if (!record) {
    return res.status(400).json({ status: 'FAILED', message: 'លេខកូដ APV នេះមិនមានក្នុងប្រព័ន្ធទេ!' });
  }

  if (record.status === 'LOCKED') {
    return res.status(400).json({ status: 'FAILED', message: 'លេខកូដនេះត្រូវបាន Lock ដោយ Admin!' });
  }

  const now = Date.now();

  if (record.status === 'UNUSED' || !record.expiresAt || now >= record.expiresAt) {
    const expiresAt = now + (2 * 60 * 1000); // កំណត់ ២ នាទី (ឬ ២៤ ម៉ោង)
    apvDatabase[code] = {
      status: 'ACTIVE',
      deviceId: deviceId || 'DEV-UNKNOWN',
      expiresAt: expiresAt
    };
    return res.json({
      status: 'SUCCESS',
      message: 'ដោះសោរជោគជ័យ!',
      expiresAt: expiresAt
    });
  }

  if (record.deviceId && record.deviceId !== deviceId) {
    return res.status(400).json({
      status: 'FAILED',
      message: 'លេខកូដ APV នេះត្រូវបានប្រើប្រាស់លើឧបករណ៍ផ្សេងរួចហើយ!'
    });
  }

  return res.json({
    status: 'SUCCESS',
    message: 'ការផ្ទៀងផ្ទាត់ជោគជ័យ!',
    expiresAt: record.expiresAt
  });
});

// 🌐 ផ្ទាំងគ្រប់គ្រង Admin Dashboard Online (បើកមើលតាម Browser បានគ្រប់ទីកន្លែង)
app.get('/admin/apv-status', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="km">
<head>
  <meta charset="UTF-8">
  <title>ផ្ទាំងគ្រប់គ្រងទិន្នន័យ APV - Cloud Admin</title>
  <link href="https://fonts.googleapis.com/css2?family=Battambang:wght@400;700&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; font-family: 'Battambang', sans-serif; margin: 0; padding: 0; }
    body { background: #f0f2f5; padding: 25px; color: #333; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; }
    .title { font-size: 22px; font-weight: bold; color: #1a1a1a; display: flex; align-items: center; gap: 10px; }
    .btn-group { display: flex; gap: 10px; }
    .btn { padding: 8px 16px; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; color: #fff; }
    .btn-danger { background: #dc3545; }
    .btn-primary { background: #0088cc; }
    .card { background: #fff; border-radius: 10px; padding: 20px; margin-bottom: 25px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
    .card-title { font-size: 16px; font-weight: bold; margin-bottom: 15px; display: flex; align-items: center; gap: 8px; }
    table { width: 100%; border-collapse: collapse; margin-top: 10px; }
    th { background: #e8f5e9; color: #2e7d32; text-align: left; padding: 12px; font-size: 13px; }
    td { padding: 12px; border-bottom: 1px solid #eee; font-size: 13px; }
    .badge { padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: bold; }
    .badge-active { background: #e8f5e9; color: #2e7d32; }
    .badge-unused { background: #e3f2fd; color: #1565c0; }
    .badge-locked { background: #ffebee; color: #c62828; }
    .btn-action { padding: 4px 10px; background: #dc3545; color: #fff; border: none; border-radius: 4px; cursor: pointer; font-size: 12px; }
  </style>
</head>
<body>
  <div class="header">
    <div class="title">📊 ផ្ទាំងគ្រប់គ្រងទិន្នន័យ APV (Online Cloud)</div>
    <div class="btn-group">
      <button class="btn btn-danger" onclick="adminAction('LOCK_ALL')">🔒 Lock All Devices</button>
      <button class="btn btn-primary" onclick="adminAction('RESET_ALL')">🔄 Reset All Devices</button>
    </div>
  </div>

  <div class="card">
    <div class="card-title" style="color: #f57c00;">🟡 កំពុងប្រើប្រាស់ (<span id="activeCount">0</span>)</div>
    <table>
      <thead>
        <tr>
          <th>លេខ APV</th>
          <th>ស្ថានភាព</th>
          <th>Device ID</th>
          <th>រយៈពេលនៅសល់</th>
          <th>ផុតកំណត់</th>
          <th>សកម្មភាព</th>
        </tr>
      </thead>
      <tbody id="activeTableBody"><tr><td colspan="6" style="text-align:center; color:#888;">មិនមានអ្នកកំពុងប្រើប្រាស់ឡើយ</td></tr></tbody>
    </table>
  </div>

  <div class="card">
    <div class="card-title" style="color: #2e7d32;">🟢 ទំនេរ / ត្រូវបាន Lock (<span id="idleCount">0</span>)</div>
    <table>
      <thead>
        <tr>
          <th>លេខ APV</th>
          <th>ស្ថានភាព</th>
          <th>ផុតកំណត់</th>
          <th>សកម្មភាព</th>
        </tr>
      </thead>
      <tbody id="idleTableBody"></tbody>
    </table>
  </div>

  <script>
    async function fetchDashboardData() {
      try {
        const res = await fetch('/api/dashboard');
        const result = await res.json();
        if (result.status === 'SUCCESS') {
          renderTables(result.data);
        }
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      }
    }

    function renderTables(data) {
      const activeBody = document.getElementById('activeTableBody');
      const idleBody = document.getElementById('idleTableBody');
      let activeRows = '';
      let idleRows = '';
      let activeCount = 0;
      let idleCount = 0;
      const now = Date.now();

      Object.keys(data).forEach(code => {
        const item = data[code];
        if (item.status === 'ACTIVE' && item.expiresAt && now < item.expiresAt) {
          activeCount++;
          const remainingSec = Math.floor((item.expiresAt - now) / 1000);
          const m = Math.floor(remainingSec / 60);
          const s = remainingSec % 60;
          const expDate = new Date(item.expiresAt).toLocaleTimeString();

          activeRows += \`
            <tr>
              <td><strong>\${code}</strong></td>
              <td><span class="badge badge-active">ACTIVE</span></td>
              <td><code>\${item.deviceId}</code></td>
              <td style="color:#2e7d32; font-weight:bold;">\${m} នាទី \${s} វិនាទី</td>
              <td>\${expDate}</td>
              <td><button class="btn-action" onclick="adminAction('LOCK_ONE', '\${code}')">🔒 Lock / Kick</button></td>
            </tr>\`;
        } else {
          idleCount++;
          const statusBadge = item.status === 'LOCKED' 
            ? '<span class="badge badge-locked">LOCKED</span>' 
            : '<span class="badge badge-unused">UNUSED</span>';
          
          idleRows += \`
            <tr>
              <td><strong>\${code}</strong></td>
              <td>\${statusBadge}</td>
              <td>\${item.expiresAt ? new Date(item.expiresAt).toLocaleString() : 'គ្មាន'}</td>
              <td><button class="btn-action" onclick="adminAction('DELETE_CODE', '\${code}')">🗑️ លុប</button></td>
            </tr>\`;
        }
      });

      document.getElementById('activeCount').innerText = activeCount;
      document.getElementById('idleCount').innerText = idleCount;
      activeBody.innerHTML = activeRows || '<tr><td colspan="6" style="text-align:center; color:#888;">មិនមានអ្នកកំពុងប្រើប្រាស់ឡើយ</td></tr>';
      idleBody.innerHTML = idleRows;
    }

    async function adminAction(action, code = null) {
      if (confirm('តើអ្នកពិតជាចង់អនុវត្តសកម្មភាពនេះមែនទេ?')) {
        await fetch('/api/admin-action', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action, code })
        });
        fetchDashboardData();
      }
    }

    setInterval(fetchDashboardData, 1000);
    fetchDashboardData();
  </script>
</body>
</html>
  `);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server កំពុងដំណើរការលើ Port ${PORT}`);
});

process.on('uncaughtException', (err) => console.error('Uncaught Exception:', err.message));
process.on('unhandledRejection', (reason) => console.error('Unhandled Rejection:', reason));
