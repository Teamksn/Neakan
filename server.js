const express = require('express');
const cors = require('cors');
const TelegramBot = require('node-telegram-bot-api');

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Bypass-Tunnel-Reminder', 'bypass-tunnel-reminder']
}));

app.use(express.json());

// 🔑 Telegram Bot Token ពី Environment Variables
const BOT_TOKEN = process.env.BOT_TOKEN;
const SERVER_URL = 'https://neakan-backend.onrender.com';

let bot = null;

if (BOT_TOKEN) {
  bot = new TelegramBot(BOT_TOKEN);
  bot.setWebHook(`${SERVER_URL}/bot${BOT_TOKEN}`)
    .then(() => console.log('🤖 Telegram Webhook ត្រូវបានភ្ជាប់ជោគជ័យ!'))
    .catch((err) => console.error('Webhook Error:', err.message));
}

// 🗄️ មូលដ្ឋានទិន្នន័យ APV
let apvDatabase = {
  '103992': { status: 'UNUSED', deviceId: null, deviceType: null, loginAt: null, expiresAt: null },
  '111111': { status: 'UNUSED', deviceId: null, deviceType: null, loginAt: null, expiresAt: null },
  '200101': { status: 'UNUSED', deviceId: null, deviceType: null, loginAt: null, expiresAt: null },
  '222222': { status: 'UNUSED', deviceId: null, deviceType: null, loginAt: null, expiresAt: null },
  '242134': { status: 'UNUSED', deviceId: null, deviceType: null, loginAt: null, expiresAt: null },
  '242756': { status: 'UNUSED', deviceId: null, deviceType: null, loginAt: null, expiresAt: null },
  '266721': { status: 'UNUSED', deviceId: null, deviceType: null, loginAt: null, expiresAt: null },
  '471140': { status: 'UNUSED', deviceId: null, deviceType: null, loginAt: null, expiresAt: null }
};

// 📚 មូលដ្ឋានទិន្នន័យជំពូកប្រលោមលោក និងវីដេអូ
let chaptersDatabase = {
  xianni: [
    { ep: 'ភាគ ១០៦', title: 'ភាគ ១០៦ (ឥតគិតថ្លៃ)', url: 'https://ok.ru/videoembed/8982337718990', content: '', isFree: true },
    { ep: 'ភាគ ១១៩', title: 'ភាគ ១១៩', url: 'https://ok.ru/videoembed/8982337718990', content: '', isFree: false }
  ],
  jianlai: [
    { ep: 'ភាគ ១', title: 'ភាគ ១៖ យុវជនក្រុងភក់', url: '', content: 'ខ្លឹមសាររឿងជំពូកទី ១...', isFree: true }
  ],
  bigbrother: [
    { ep: 'ជំពូក ១', title: 'ជំពូក ១៖ ភ្នំព្រះអាទិត្យនិងព្រះច័ន្ទ', url: 'chapter1.html', content: '', isFree: true },
    { ep: 'ជំពូក ២', title: 'ជំពូក ២៖ ការប្រុងប្រយ័ត្នជាចម្បង', url: 'chapter2.html', content: '', isFree: true }
  ]
};

// 🌐 Route ទទួល Webhook ពី Telegram
app.post(`/bot${BOT_TOKEN}`, (req, res) => {
  if (bot) {
    bot.processUpdate(req.body);
  }
  res.sendStatus(200);
});

// 🤖 មុខងារឆ្លើយតបសារ Bot
if (bot) {
  bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text ? msg.text.trim() : '';

    if (text.length === 6 && !isNaN(text)) {
      const customCode = text;
      apvDatabase[customCode] = {
        status: 'UNUSED',
        deviceId: null,
        deviceType: null,
        loginAt: null,
        expiresAt: null
      };
      bot.sendMessage(chatId, `🎉 ការទូទាត់ត្រូវបានអនុម័ត!\n🔑 លេខកូដ APV: ${customCode}\n⏱️ សុពលភាព: ២ នាទី (Test)`);
    } else if (msg.photo) {
      const autoCode = Math.floor(100000 + Math.random() * 900000).toString();
      apvDatabase[autoCode] = {
        status: 'UNUSED',
        deviceId: null,
        deviceType: null,
        loginAt: null,
        expiresAt: null
      };
      bot.sendMessage(chatId, `🎉 ផ្ទៀងផ្ទាត់ជោគជ័យ!\n🔑 លេខកូដ APV: ${autoCode}\n⏱️ សុពលភាព: ២ នាទី (Test)`);
    }
  });
}

// 📡 API សម្រាប់ Frontend ទាញយកបញ្ជីជំពូក
app.get('/api/chapters/:novelId', (req, res) => {
  const { novelId } = req.params;
  const list = chaptersDatabase[novelId] || [];
  res.json({ status: 'SUCCESS', data: list });
});

// 💾 API សម្រាប់ Admin បន្ថែមជំពូកថ្មី
app.post('/api/chapters/add', (req, res) => {
  const { novelId, ep, title, url, content, isFree } = req.body;
  if (!novelId || !ep || !title) {
    return res.status(400).json({ status: 'FAILED', message: 'សូមបំពេញលេខភាគ និងចំណងជើង!' });
  }

  if (!chaptersDatabase[novelId]) {
    chaptersDatabase[novelId] = [];
  }

  chaptersDatabase[novelId].push({
    ep: ep.trim(),
    title: title.trim(),
    url: url ? url.trim() : '',
    content: content ? content.trim() : '',
    isFree: Boolean(isFree)
  });

  res.json({ status: 'SUCCESS', message: `បានបន្ថែម ${ep} ចូលក្នុង ${novelId} ជោគជ័យ!` });
});

// 🗑️ API សម្រាប់ Admin លុបជំពូក
app.post('/api/chapters/delete', (req, res) => {
  const { novelId, index } = req.body;
  if (chaptersDatabase[novelId] && chaptersDatabase[novelId][index] !== undefined) {
    chaptersDatabase[novelId].splice(index, 1);
    return res.json({ status: 'SUCCESS', message: 'បានលុបជំពូកជោគជ័យ!' });
  }
  res.status(400).json({ status: 'FAILED', message: 'មិនអាចលុបជំពូកនេះបានទេ!' });
});

// 📊 API Dashboard APV
app.get('/api/dashboard', (req, res) => {
  const now = Date.now();
  Object.keys(apvDatabase).forEach(code => {
    if (apvDatabase[code].status === 'ACTIVE' && apvDatabase[code].expiresAt && now >= apvDatabase[code].expiresAt) {
      apvDatabase[code].status = 'UNUSED';
      apvDatabase[code].deviceId = null;
      apvDatabase[code].deviceType = null;
      apvDatabase[code].loginAt = null;
      apvDatabase[code].expiresAt = null;
    }
  });
  res.json({ status: 'SUCCESS', data: apvDatabase });
});

// ⚙️ API Admin APV Actions
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
      apvDatabase[c].deviceType = null;
      apvDatabase[c].loginAt = null;
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

// 🔐 API Verify Payment APV
app.post('/api/verify-payment', (req, res) => {
  const { code, deviceId, deviceType } = req.body;

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
    const expiresAt = now + (2 * 60 * 1000);
    apvDatabase[code] = {
      status: 'ACTIVE',
      deviceId: deviceId || 'DEV-UNKNOWN',
      deviceType: deviceType || 'PC',
      loginAt: now,
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

// 🌐 ផ្ទាំងគ្រប់គ្រងទិន្នន័យ APV (/admin/apv-status)
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
    .btn { padding: 8px 16px; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; color: #fff; text-decoration: none; }
    .btn-danger { background: #dc3545; }
    .btn-primary { background: #0088cc; }
    .btn-success { background: #28a745; }
    .card { background: #fff; border-radius: 10px; padding: 20px; margin-bottom: 25px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
    .card-title { font-size: 16px; font-weight: bold; margin-bottom: 15px; display: flex; align-items: center; gap: 8px; }
    table { width: 100%; border-collapse: collapse; margin-top: 10px; }
    th { background: #e8f5e9; color: #2e7d32; text-align: left; padding: 12px; font-size: 13px; }
    td { padding: 12px; border-bottom: 1px solid #eee; font-size: 13px; }
    .badge { padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: bold; }
    .badge-active { background: #e8f5e9; color: #2e7d32; }
    .badge-unused { background: #e3f2fd; color: #1565c0; }
    .badge-locked { background: #ffebee; color: #c62828; }
    .badge-device { background: #f3e5f5; color: #7b1fa2; font-weight: bold; padding: 3px 8px; border-radius: 4px; border: 1px solid #ce93d8; }
    .btn-action { padding: 4px 10px; background: #dc3545; color: #fff; border: none; border-radius: 4px; cursor: pointer; font-size: 12px; }
  </style>
</head>
<body>
  <div class="header">
    <div class="title">📊 ផ្ទាំងគ្រប់គ្រងទិន្នន័យ APV (Online Cloud)</div>
    <div class="btn-group">
      <a href="/admin/manage-chapters" class="btn btn-success">➕ គ្រប់គ្រងជំពូក / Chapters</a>
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
          <th>ឧបករណ៍ (Device)</th>
          <th>ម៉ោង Login</th>
          <th>រយៈពេលនៅសល់</th>
          <th>ផុតកំណត់</th>
          <th>សកម្មភាព</th>
        </tr>
      </thead>
      <tbody id="activeTableBody"><tr><td colspan="7" style="text-align:center; color:#888;">មិនមានអ្នកកំពុងប្រើប្រាស់ឡើយ</td></tr></tbody>
    </table>
  </div>

  <div class="card">
    <div class="card-title" style="color: #2e7d32;">🟢 ទំនេរ / ត្រូវបាន Lock (<span id="idleCount">0</span>)</div>
    <table>
      <thead>
        <tr>
          <th>លេខ APV</th>
          <th>ស្ថានភាព</th>
          <th>ផុតកំណត់ចុងក្រោយ</th>
          <th>សកម្មភាព</th>
        </tr>
      </thead>
      <tbody id="idleTableBody"></tbody>
    </table>
  </div>

  <script>
    let chaptersData = [];
    let currentChapterIndex = 0;
    let currentFontSize = 18;

    // វចនានុក្រមបំប្លែងលេខខ្មែរទៅលេខសកល
    const khmerToLatinMap = { '០':'0', '១':'1', '២':'2', '៣':'3', '៤':'4', '៥':'5', '៦':'6', '៧':'7', '៨':'8', '៩':'9' };

    function getChapterSlug(chapterObj, fallbackIndex) {
      if (!chapterObj) return (fallbackIndex + 1).toString();
      const textToScan = (chapterObj.ep || chapterObj.title || '').toString();
      const normalized = textToScan.replace(/[០-៩]/g, d => khmerToLatinMap[d]);
      const match = normalized.match(/\d+/);
      return match ? match[0] : (fallbackIndex + 1).toString();
    }

    // ១. មុខងារផ្លាស់ប្តូរ Theme
    function setTheme(mode) {
      document.body.classList.remove('light-mode', 'sepia-mode');
      if (mode === 'light') document.body.classList.add('light-mode');
      if (mode === 'sepia') document.body.classList.add('sepia-mode');
      localStorage.setItem('neakan_theme_mode', mode);
    }

    const savedTheme = localStorage.getItem('neakan_theme_mode') || 'dark';
    setTheme(savedTheme);

    // ២. ទាញយកជំពូកពី Server API និងចាប់យក Hash URL
    async function loadDynamicChapters() {
      try {
        const res = await fetch('https://neakan-backend.onrender.com/api/chapters/bigbrother');
        const result = await res.json();
        if (result.status === 'SUCCESS' && result.data && result.data.length > 0) {
          chaptersData = result.data;
          renderSidebarTOC();
          initChapterFromHash();
        } else {
          document.getElementById('topHeaderTitle').innerText = 'គ្មានជំពូក';
          document.getElementById('displayTitle').innerText = 'មិនទាន់មានជំពូកនៅឡើយទេ';
          document.getElementById('displayContent').innerHTML = '<p style="text-align:center;">សូមរង់ចាំការ Update ជំពូកថ្មីៗ...</p>';
        }
      } catch (err) {
        console.error('Failed to load chapters:', err);
        document.getElementById('topHeaderTitle').innerText = 'បរាជ័យ';
        document.getElementById('displayTitle').innerText = 'មិនអាចភ្ជាប់ទៅកាន់ Server បានទេ';
      }
    }

    // ៣. បង្ហាញបញ្ជីមាតិកា TOC
    function renderSidebarTOC() {
      const container = document.getElementById('tocContainer');
      container.innerHTML = '';
      if (!chaptersData || chaptersData.length === 0) return;

      chaptersData.forEach((chap, idx) => {
        const li = document.createElement('li');
        li.innerText = chap.title || chap.ep;
        li.id = 'toc-item-' + idx;
        li.onclick = () => {
          loadChapter(idx, true);
          toggleTOC();
        };
        container.appendChild(li);
      });
    }

    // ៤. បង្ហាញខ្លឹមសារជំពូក និងកែប្រែ Hash URL (#168)
    function loadChapter(index, updateHash = true) {
      if (!chaptersData || index < 0 || index >= chaptersData.length) return;
      currentChapterIndex = index;
      const chapter = chaptersData[index];

      // កំណត់ Hash URL ឧ. #168
      const slug = getChapterSlug(chapter, index);
      if (updateHash) {
        window.history.pushState({ chapterIndex: index }, '', '#' + slug);
      }

      document.getElementById('topHeaderTitle').innerText = chapter.title || chapter.ep;
      document.getElementById('displayVolume').innerText = chapter.ep || '';
      document.getElementById('displayTitle').innerText = chapter.title || '';

      const rawText = chapter.content || chapter.url || 'មិនមានខ្លឹមសារអត្ថបទនៅឡើយទេ';
      const formattedHtml = rawText
        .split('\n\n')
        .filter(p => p.trim() !== '')
        .map(p => `<p style="font-size: ${currentFontSize}px;">${p.trim()}</p>`)
        .join('');

      document.getElementById('displayContent').innerHTML = formattedHtml;

      document.querySelectorAll('#tocContainer li').forEach(li => li.classList.remove('active'));
      const activeLi = document.getElementById('toc-item-' + index);
      if (activeLi) {
        activeLi.classList.add('active');
        activeLi.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // ៥. ពិនិត្យ Hash URL ពេលបើកទំព័រដំបូង
    function initChapterFromHash() {
      const currentHash = window.location.hash.replace('#', '').trim();
      let targetIndex = 0;

      if (currentHash && chaptersData.length > 0) {
        const foundIndex = chaptersData.findIndex((chap, idx) => getChapterSlug(chap, idx) === currentHash);
        if (foundIndex !== -1) {
          targetIndex = foundIndex;
        }
      }

      loadChapter(targetIndex, false);
    }

    function navigateChapter(direction) {
      loadChapter(currentChapterIndex + direction, true);
    }

    function toggleTOC() {
      document.getElementById('tocDrawer').classList.toggle('open');
      document.getElementById('tocOverlay').classList.toggle('active');
    }

    function toggleFontPanel() {
      document.getElementById('fontPanel').classList.toggle('active');
    }

    function filterChapters() {
      const keyword = document.getElementById('searchInput').value.toLowerCase();
      chaptersData.forEach((chap, idx) => {
        const el = document.getElementById('toc-item-' + idx);
        const titleText = (chap.title || chap.ep || '').toLowerCase();
        if (el) el.style.display = titleText.includes(keyword) ? '' : 'none';
      });
    }

    function adjustFont(step) {
      currentFontSize += step;
      if (currentFontSize < 14) currentFontSize = 14;
      if (currentFontSize > 28) currentFontSize = 28;
      document.querySelectorAll('#displayContent p').forEach(p => {
        p.style.fontSize = currentFontSize + 'px';
      });
    }

    // ចាប់យកព្រឹត្តិការណ៍ចុច Back/Forward លើ Browser
    window.onhashchange = initChapterFromHash;
    window.onload = loadDynamicChapters;
  </script>
</body>
</html>
  `);
});

// 🌐 ផ្ទាំងគ្រប់គ្រងជំពូកប្រលោមលោក និងវីដេអូ (/admin/manage-chapters)
app.get('/admin/manage-chapters', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="km">
<head>
  <meta charset="UTF-8">
  <title>គ្រប់គ្រងជំពូកប្រលោមលោក - Neakan CMS</title>
  <link href="https://fonts.googleapis.com/css2?family=Battambang:wght@400;700&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; font-family: 'Battambang', sans-serif; margin: 0; padding: 0; }
    body { background: #121212; color: #fff; padding: 25px 15px; display: flex; flex-direction: column; align-items: center; }
    .header { width: 100%; max-width: 900px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .btn-back { background: #0088cc; color: #fff; padding: 8px 14px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 13px; }
    .cms-container { width: 100%; max-width: 900px; display: grid; grid-template-columns: 1fr; gap: 20px; }
    @media(min-width: 768px) { .cms-container { grid-template-columns: 420px 1fr; } }
    .cms-card { background: #1e1e1e; border: 1px solid #28a745; border-radius: 10px; padding: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.5); }
    h2 { color: #28a745; margin-bottom: 15px; font-size: 16px; }
    .form-group { margin-bottom: 12px; display: flex; flex-direction: column; gap: 4px; }
    label { font-size: 12px; color: #aaa; }
    input, select, textarea { background: #101010; border: 1px solid #444; color: #fff; padding: 8px 10px; border-radius: 6px; font-size: 13px; outline: none; }
    input:focus, select:focus, textarea:focus { border-color: #28a745; }
    .btn-submit { background: #28a745; border: none; color: #fff; padding: 10px; border-radius: 6px; font-weight: bold; cursor: pointer; width: 100%; font-size: 14px; margin-top: 8px; }
    .btn-submit:hover { background: #218838; }
    .alert-msg { margin-top: 10px; text-align: center; font-size: 12px; min-height: 18px; font-weight: bold; }
    .list-item { background: #141414; border: 1px solid #333; padding: 10px; border-radius: 6px; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center; }
    .btn-del { background: #dc3545; color: #fff; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 11px; }
  </style>
</head>
<body>
  <div class="header">
    <h1 style="font-size: 18px; color: #28a745;">📚 Neakan Chapter Management System</h1>
    <a href="/admin/apv-status" class="btn-back">⬅️ ទៅកាន់ផ្ទាំង APV</a>
  </div>

  <div class="cms-container">
    <!-- Form បន្ថែម -->
    <div class="cms-card">
      <h2>➕ បន្ថែមជំពូកថ្មី</h2>
      <div class="form-group">
        <label>ជ្រើសរើសរឿង៖</label>
        <select id="novelId" onchange="loadChaptersList()">
          <option value="xianni">仙逆 - Renegade Immortal (ស៊ាននី)</option>
          <option value="jianlai">剑来 - Sword of Coming (ដាវឈិនភីងអាន)</option>
          <option value="bigbrother">师兄啊师兄 - Big Brother (សិស្សច្បង)</option>
        </select>
      </div>
      <div class="form-group">
        <label>លេខភាគ (ឧ. ភាគ ១២០ ឬ ជំពូក ៣)៖</label>
        <input type="text" id="ep" placeholder="ឧ. ភាគ ១២០">
      </div>
      <div class="form-group">
        <label>ចំណងជើងពេញ៖</label>
        <input type="text" id="title" placeholder="ឧ. ភាគ ១២០៖ សម្រេចជោគជ័យ">
      </div>
      <div class="form-group">
        <label>Link វីដេអូ ឬ Iframe URL (ទុកទំនេរបាន ប្រសិនបើជាអត្ថបទ)៖</label>
        <input type="text" id="url" placeholder="https://...">
      </div>
      <div class="form-group">
        <label>ខ្លឹមសារសាច់រឿង (Story Content / Novel Text)៖</label>
        <textarea id="content" rows="6" placeholder="បិទភ្ជាប់ (Paste) អត្ថបទសាច់រឿងនៅទីនេះ..."></textarea>
      </div>
      <div class="form-group">
        <label>ស្ថានភាពបង់ប្រាក់៖</label>
        <select id="isFree">
          <option value="false">🔒 ជាប់សោរ (Paywall / APV Required)</option>
          <option value="true">🟢 ឥតគិតថ្លៃ (Free)</option>
        </select>
      </div>
      <button class="btn-submit" onclick="submitChapter()">💾 រក្សាទុកជំពូកថ្មី</button>
      <div id="alertMsg" class="alert-msg"></div>
    </div>

    <!-- បញ្ជីជំពូកបច្ចុប្បន្ន -->
    <div class="cms-card">
      <h2>📑 បញ្ជីជំពូកដែលមានស្រាប់</h2>
      <div id="chaptersList">កំពុងទាញយក...</div>
    </div>
  </div>

  <script>
    async function loadChaptersList() {
      const novelId = document.getElementById('novelId').value;
      const listContainer = document.getElementById('chaptersList');
      listContainer.innerHTML = 'កំពុងទាញយក...';

      try {
        const res = await fetch('/api/chapters/' + novelId);
        const result = await res.json();
        if (result.status === 'SUCCESS') {
          if (result.data.length === 0) {
            listContainer.innerHTML = '<div style="color:#888; font-size:13px;">មិនទាន់មានជំពូកនៅឡើយទេ</div>';
            return;
          }
          let html = '';
          result.data.forEach((item, idx) => {
            const badge = item.isFree ? '<span style="color:#28a745; font-size:11px;">(Free)</span>' : '<span style="color:#ffc107; font-size:11px;">(Lock)</span>';
            html += \`
              <div class="list-item">
                <div>
                  <strong>\${item.ep}</strong> \${badge}<br>
                  <span style="font-size:11px; color:#aaa;">\${item.title}</span>
                </div>
                <button class="btn-del" onclick="deleteChapter('\${novelId}', \${idx})">🗑️ លុប</button>
              </div>\`;
          });
          listContainer.innerHTML = html;
        }
      } catch (err) {
        listContainer.innerHTML = 'បរាជ័យក្នុងការទាញយកទិន្នន័យ!';
      }
    }

    async function submitChapter() {
      const msg = document.getElementById('alertMsg');
      const payload = {
        novelId: document.getElementById('novelId').value,
        ep: document.getElementById('ep').value,
        title: document.getElementById('title').value,
        url: document.getElementById('url').value,
        content: document.getElementById('content').value,
        isFree: document.getElementById('isFree').value === 'true'
      };

      if (!payload.ep || !payload.title) {
        msg.style.color = '#dc3545';
        msg.innerText = '❌ សូមបំពេញលេខភាគ និងចំណងជើង!';
        return;
      }

      msg.style.color = '#ffc107';
      msg.innerText = '⏳ កំពុងរក្សាទុក...';

      try {
        const res = await fetch('/api/chapters/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.status === 'SUCCESS') {
          msg.style.color = '#28a745';
          msg.innerText = '✅ ' + data.message;
          document.getElementById('ep').value = '';
          document.getElementById('title').value = '';
          document.getElementById('url').value = '';
          document.getElementById('content').value = '';
          loadChaptersList();
        } else {
          msg.style.color = '#dc3545';
          msg.innerText = '❌ ' + data.message;
        }
      } catch (e) {
        msg.style.color = '#dc3545';
        msg.innerText = '❌ បរាជ័យក្នុងការតភ្ជាប់!';
      }
    }

    async function deleteChapter(novelId, index) {
      if (confirm('តើអ្នកពិតជាចង់លុបជំពូកនេះមែនទេ?')) {
        await fetch('/api/chapters/delete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ novelId, index })
        });
        loadChaptersList();
      }
    }

    window.onload = loadChaptersList;
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
