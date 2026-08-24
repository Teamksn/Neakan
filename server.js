const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Bypass-Tunnel-Reminder', 'bypass-tunnel-reminder']
}));

app.use(express.json());

// បញ្ជីផ្ទុកទិន្នន័យ APV
let apvDatabase = {
  '103992': { status: 'UNUSED', deviceId: null, expiresAt: null },
  '111111': { status: 'UNUSED', deviceId: null, expiresAt: null },
  '200101': { status: 'UNUSED', deviceId: null, expiresAt: null },
  '222222': { status: 'UNUSED', deviceId: null, expiresAt: null },
  '242134': { status: 'UNUSED', deviceId: null, expiresAt: null },
  '242756': { status: 'UNUSED', deviceId: null, expiresAt: null },
  '471140': { status: 'UNUSED', deviceId: null, expiresAt: null }
};

// Root Route
app.get('/', (req, res) => {
  res.send('Neakan API Server is running successfully!');
});

// API Dashboard សម្រាប់ទាញយកបញ្ជីកូដ
app.get('/api/dashboard', (req, res) => {
  const now = Date.now();
  Object.keys(apvDatabase).forEach(code => {
    if (apvDatabase[code].status === 'ACTIVE' && apvDatabase[code].expiresAt && now >= apvDatabase[code].expiresAt) {
      apvDatabase[code].status = 'UNUSED';
      apvDatabase[code].deviceId = null;
    }
  });
  res.json({ status: 'SUCCESS', data: apvDatabase });
});

// API Admin Action សម្រាប់ Lock ឬ Reset
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

  res.status(400).json({ status: 'FAILED', message: 'សកម្មភាពមិនត្រឹមត្រូវ!' });
});

// API ផ្ទៀងផ្ទាត់ការទូទាត់ និងដោះសោរ
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
    const expiresAt = now + (2 * 60 * 1000); // កំណត់ ២ នាទី
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server កំពុងដំណើរការលើ Port ${PORT}`);
});

process.on('uncaughtException', (err) => console.error('Uncaught Exception:', err.message));
process.on('unhandledRejection', (reason) => console.error('Unhandled Rejection:', reason));
