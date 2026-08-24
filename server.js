const express = require('express');
const cors = require('cors');

const app = express();

// អនុញ្ញាត CORS សម្រាប់គ្រប់ឧបករណ៍ (PC, iOS, Android)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Bypass-Tunnel-Reminder', 'bypass-tunnel-reminder']
}));

app.use(express.json());

// កន្លែងផ្ទុកទិន្នន័យបណ្តោះអាសន្នសម្រាប់ APV Codes
// រចនាសម្ព័ន្ធ៖ { '123456': { expiresAt: 1700000000000, deviceId: 'DEV-XXXX' } }
const validApvCodes = {};

// Root Route សម្រាប់តេស្តមើលដំណើរការ Server
app.get('/', (req, res) => {
  res.send('Neakan API Server is running successfully!');
});

// API Endpoint សម្រាប់ផ្ទៀងផ្ទាត់លេខកូដ APV
app.post('/api/verify-payment', (req, res) => {
  const { code, deviceId } = req.body;

  if (!code || code.length !== 6) {
    return res.status(400).json({
      status: 'FAILED',
      message: 'លេខកូដ APV មិនត្រឹមត្រូវ (ត្រូវមាន ៦ ខ្ទង់)!'
    });
  }

  // ពិនិត្យមើលថាតើលេខកូដមានក្នុងប្រព័ន្ធ ឬនៅ
  const record = validApvCodes[code];

  if (!record) {
    // ករណីសាកល្បង៖ ប្រសិនបើជាកូដទើបបង្កើតថ្មី (កំណត់សុពលភាព ២៤ ម៉ោង)
    const expiresAt = Date.now() + (24 * 60 * 60 * 1000);
    validApvCodes[code] = {
      expiresAt: expiresAt,
      deviceId: deviceId || null
    };

    return res.json({
      status: 'SUCCESS',
      message: 'ដោះសោរជោគជ័យ! សុពលភាព ២៤ ម៉ោង។',
      expiresAt: expiresAt
    });
  }

  // ករណីលេខកូដផុតកំណត់
  if (Date.now() > record.expiresAt) {
    delete validApvCodes[code];
    return res.status(400).json({
      status: 'FAILED',
      message: 'លេខកូដ APV នេះបានផុតកំណត់ហើយ!'
    });
  }

  // ករណីលេខកូដជាប់សោរជាមួយឧបករណ៍ផ្សេង
  if (record.deviceId && record.deviceId !== deviceId) {
    return res.status(400).json({
      status: 'FAILED',
      message: 'លេខកូដ APV នេះត្រូវបានប្រើប្រាស់លើឧបករណ៍ផ្សេងរួចហើយ!'
    });
  }

  // ប្រសិនបើត្រឹមត្រូវទាំងអស់
  return res.json({
    status: 'SUCCESS',
    message: 'ការផ្ទៀងផ្ទាត់ជោគជ័យ!',
    expiresAt: record.expiresAt
  });
});

// កំណត់ Port សម្រាប់ Render Cloud និង Localhost
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server កំពុងដំណើរការលើ Port ${PORT}`);
});

// ការពារកុំឱ្យ Server រលត់ពេលមាន Error ផ្សេងៗ
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err.message);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
});
