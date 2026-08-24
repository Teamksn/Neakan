<!DOCTYPE html>
<html lang="km">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>ប្រឆាំងនឹងអមតៈភាព / Renegade Immortal / Xian Ni សម្រាយរឿង - Neakan</title>
  
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Battambang:wght@400;700;900&display=swap" rel="stylesheet">

  <style>
    * { 
      box-sizing: border-box; 
      margin: 0; 
      padding: 0; 
      font-family: 'Battambang', cursive, sans-serif !important; 
    }
    
    *, *::before, *::after { 
      -webkit-user-select: none !important; 
      user-select: none !important; 
    }

    body { 
      background-color: #121212; 
      color: #e0e0e0; 
      min-height: 100vh; 
      display: flex; 
      flex-direction: column; 
      align-items: center; 
    }

    .top-nav { 
      width: 100%; 
      height: 50px; 
      background-color: #1a1a1a; 
      border-bottom: 1.5px solid #28a745; 
      display: flex; 
      align-items: center; 
      justify-content: space-between; 
      padding: 0 15px; 
      position: sticky; 
      top: 0; 
      z-index: 100; 
    }
    .back-btn { 
      color: #28a745; 
      text-decoration: none; 
      font-size: 24px; 
      font-weight: bold; 
    }
    .nav-title { 
      color: #28a745; 
      font-weight: 700; 
      font-size: 14px; 
      white-space: nowrap; 
      overflow: hidden; 
      text-overflow: ellipsis; 
      max-width: 80%; 
    }

    .container { 
      width: 100%; 
      max-width: 850px; 
      padding: 15px 12px 50px 12px; 
      display: flex; 
      flex-direction: column; 
      gap: 16px; 
    }

    .player-container { 
      width: 100%; 
      min-height: 490px; 
      background-color: #000; 
      border-radius: 10px; 
      overflow: hidden; 
      border: 1px solid #333; 
      position: relative; 
      display: flex;
    }
    .player-container iframe { 
      width: 100%; 
      height: 100%; 
      min-height: 490px; 
      border: none; 
      display: none; 
    }

    .lock-view { 
      width: 100%; 
      min-height: 490px; 
      position: relative; 
      background-color: #1a1a1a; 
      display: flex; 
      flex-direction: column; 
      align-items: center; 
      justify-content: center; 
      padding: 15px; 
      text-align: center; 
    }
    .lock-view img.bg-poster { 
      width: 100%; 
      height: 100%; 
      object-fit: cover; 
      opacity: 0.15; 
      position: absolute; 
      top: 0; 
      left: 0; 
    }
    .lock-card { 
      position: relative; 
      z-index: 2; 
      background: rgba(20, 20, 20, 0.95); 
      border: 1px solid #28a745; 
      border-radius: 12px; 
      padding: 16px 14px; 
      max-width: 380px; 
      width: 100%; 
      box-shadow: 0 8px 30px rgba(0,0,0,0.8); 
      backdrop-filter: blur(6px); 
    }
    .lock-card h3 { 
      font-size: 15px; 
      color: #28a745; 
      margin-bottom: 6px; 
      font-weight: 900; 
    }
    .lock-card p { 
      font-size: 11.5px; 
      color: #bbb; 
      margin-bottom: 10px; 
      line-height: 1.4; 
    }

    .qr-container { 
      margin-bottom: 10px; 
    }
    .qr-image { 
      width: 135px; 
      height: 135px; 
      object-fit: contain; 
      border-radius: 8px; 
      border: 2px solid #28a745; 
      background: #fff; 
      padding: 3px; 
    }

    .telegram-actions { 
      display: flex; 
      gap: 8px; 
      margin-bottom: 10px; 
    }
    .tg-btn { 
      flex: 1; 
      padding: 7px 0; 
      border-radius: 6px; 
      color: #fff; 
      text-decoration: none; 
      font-size: 12px; 
      font-weight: bold; 
      display: block; 
    }
    .tg-bot { background-color: #0088cc; }
    .tg-group { background-color: #229ED9; }

    .apv-input-box { 
      width: 100%; 
      padding: 8px; 
      border-radius: 6px; 
      border: 1px solid #444; 
      background: #121212; 
      color: #fff; 
      font-size: 15px; 
      text-align: center; 
      margin-bottom: 8px; 
      font-weight: bold; 
      letter-spacing: 2px; 
    }
    .unlock-btn { 
      width: 100%; 
      padding: 9px; 
      background-color: #28a745; 
      border: none; 
      border-radius: 6px; 
      color: #fff; 
      font-size: 13px; 
      font-weight: bold; 
      cursor: pointer; 
    }
    .status-alert { 
      margin-top: 6px; 
      font-size: 12px; 
      font-weight: bold; 
      min-height: 16px; 
    }

    .video-details { 
      background-color: #1a1a1a; 
      padding: 14px; 
      border-radius: 8px; 
      border: 1px solid #282828; 
    }
    .video-details h2 { 
      font-size: 15.5px; 
      color: #fff; 
      margin-bottom: 4px; 
      font-weight: 700; 
    }
    .video-details p { 
      font-size: 12px; 
      color: #888; 
    }

    .playlist-section { 
      background-color: #1a1a1a; 
      padding: 14px; 
      border-radius: 8px; 
      border: 1px solid #282828; 
    }
    .playlist-title { 
      font-size: 14px; 
      font-weight: 700; 
      color: #28a745; 
      margin-bottom: 10px; 
    }
    .playlist-grid { 
      display: grid; 
      grid-template-columns: repeat(3, 1fr); 
      gap: 8px; 
    }
    @media (min-width: 600px) {
      .playlist-grid { 
        grid-template-columns: repeat(auto-fill, minmax(110px, 1fr)); 
      }
    }
    .ep-card { 
      background-color: #242424; 
      border: 1px solid #383838; 
      border-radius: 6px; 
      padding: 9px 4px; 
      text-align: center; 
      cursor: pointer; 
      font-size: 12px; 
      font-weight: 700; 
      color: #bbb; 
      transition: all 0.2s; 
    }
    .ep-card:hover { 
      background-color: #2f2f2f; 
      border-color: #28a745; 
      color: #fff; 
    }
    .ep-card.active { 
      background-color: #28a745; 
      border-color: #28a745; 
      color: #fff; 
    }
    .ep-badge-free { 
      font-size: 9.5px; 
      color: #28a745; 
      display: block; 
      margin-top: 2px; 
    }
  </style>
</head>
<body>

  <header class="top-nav">
    <a href="../" class="back-btn">‹</a>
    <div class="nav-title">ប្រឆាំងនឹងអមតៈភាព / Renegade Immortal / Xian Ni សម្រាយរឿង</div>
    <div style="width: 24px;"></div>
  </header>

  <main class="container">
    <div class="player-container">
      <div class="lock-view" id="lockView">
        <img src="../xianni/Cover.jpg" class="bg-poster" alt="Poster Thumbnail" onerror="this.src='https://upload.wikimedia.org/wikipedia/zh/thumb/4/41/Renegade_Immortal_poster.jpg/440px-Renegade_Immortal_poster.jpg'">
        
        <div class="lock-card">
          <h3>🔒 វីដេអូនេះត្រូវបានចាក់សោរ</h3>
          
          <div class="qr-container">
            <img src="../xianni/khqr.jpg" class="qr-image" alt="KHQR Payment" onerror="this.src='../khqr.jpg'">
          </div>

          <p>សូមស្កេន KHQR រួចផ្ញើវិក្កយបត្រ ABA ទៅកាន់ Telegram Bot ឬ Group ដើម្បីទទួលបានលេខ APV ៦ ខ្ទង់ដោះសោរ ២៤ ម៉ោង។</p>

          <div class="telegram-actions">
            <a href="https://t.me/teamksnac_bot" target="_blank" class="tg-btn tg-bot">🤖 ផ្ញើទៅ Bot</a>
            <a href="https://t.me/samnakeo" target="_blank" class="tg-btn tg-group">👥 ចូល Group</a>
          </div>

          <input type="text" id="apvInput" maxlength="6" class="apv-input-box" placeholder="បញ្ចូលលេខ APV ៦ ខ្ទង់...">
          <button class="unlock-btn" onclick="submitApvCode()">🔓 ដោះសោរទស្សនាភ្លាមៗ</button>
          <div id="apvStatusMessage" class="status-alert"></div>
        </div>
      </div>
      
      <iframe id="activeVideoFrame" src="" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
    </div>

    <div class="video-details">
      <h2 id="currentEpTitle">ភាគ ១១៩</h2>
      <p>ប្រឆាំងនឹងអមតៈភាព / Renegade Immortal / Xian Ni សម្រាយរឿង</p>
    </div>

    <div class="playlist-section">
      <div class="playlist-title">🎞️ បញ្ជីភាគទាំងអស់ (Playlist)</div>
      <div class="playlist-grid" id="playlistContainer"></div>
    </div>
  </main>

  <script src="episodes.js"></script>

  <script>
    const API_VERIFY_URL = 'https://understanding-contracts-con-adapted.trycloudflare.com/api/verify-payment';
    let currentSelectedEp = 13; // ចាប់ផ្តើមត្រង់ភាគ ១១៩

    function getOrCreateDeviceId() {
      let devId = localStorage.getItem('device_uuid');
      if (!devId) {
        devId = 'DEV-' + Math.random().toString(36).substring(2, 10).toUpperCase();
        localStorage.setItem('device_uuid', devId);
      }
      return devId;
    }

    function isSubscriptionValid() {
      const expiresAt = localStorage.getItem('apv_expires_at');
      if (!expiresAt) return false;
      return Date.now() < parseInt(expiresAt);
    }

    function renderPlaylist() {
      const container = document.getElementById('playlistContainer');
      container.innerHTML = '';

      if (typeof episodesData === 'undefined' || !episodesData) return;

      episodesData.forEach((item, index) => {
        const btn = document.createElement('div');
        btn.className = `ep-card ${index === currentSelectedEp ? 'active' : ''}`;
        
        let freeBadge = item.isFree ? `<span class="ep-badge-free">ឥតគិតថ្លៃ</span>` : '';
        btn.innerHTML = `${item.ep}${freeBadge}`;
        
        btn.onclick = () => selectEpisode(index);
        container.appendChild(btn);
      });
    }

    function selectEpisode(index) {
      currentSelectedEp = index;
      if (typeof episodesData === 'undefined' || !episodesData[index]) return;
      const target = episodesData[index];

      document.getElementById('currentEpTitle').innerText = target.title;
      renderPlaylist();

      const iframe = document.getElementById('activeVideoFrame');
      const lockView = document.getElementById('lockView');

      // ត្រួតពិនិត្យលក្ខខណ្ឌ៖ បើជាភាគ Free ឬមាន APV សុពលភាព ២៤ ម៉ោង គឺចាក់វីដេអូភ្លាម
      if (target.isFree === true || isSubscriptionValid()) {
        lockView.style.display = 'none';
        if (target.url && target.url.trim() !== '') {
          iframe.src = target.url;
          iframe.style.display = 'block';
        } else {
          iframe.src = '';
          iframe.style.display = 'none';
          alert('⏳ វីដេអូភាគនេះនឹងមកដល់ឆាប់ៗ!');
        }
      } else {
        iframe.src = '';
        iframe.style.display = 'none';
        lockView.style.display = 'flex';
      }
    }

    async function submitApvCode() {
      const code = document.getElementById('apvInput').value.trim();
      const statusMsg = document.getElementById('apvStatusMessage');
      const deviceId = getOrCreateDeviceId();

      if (code.length !== 6 || isNaN(code)) {
        statusMsg.style.color = '#dc3545';
        statusMsg.innerText = '❌ សូមបញ្ចូលលេខ APV ឱ្យបានត្រឹមត្រូវ ៦ ខ្ទង់!';
        return;
      }

      statusMsg.style.color = '#ffc107';
      statusMsg.innerText = '⏳ កំពុងផ្ទៀងផ្ទាត់ទិន្នន័យ...';

      try {
        const res = await fetch(API_VERIFY_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code: code, deviceId: deviceId })
        });

        const data = await res.json();

        if (data.status === 'SUCCESS') {
          statusMsg.style.color = '#28a745';
          statusMsg.innerText = '✅ ' + data.message;
          localStorage.setItem('apv_unlocked_code', code);
          localStorage.setItem('apv_expires_at', data.expiresAt);
          setTimeout(() => selectEpisode(currentSelectedEp), 1200);
        } else {
          statusMsg.style.color = '#dc3545';
          statusMsg.innerText = '❌ ' + data.message;
        }
      } catch (err) {
        statusMsg.style.color = '#dc3545';
        statusMsg.innerText = '❌ មិនអាចភ្ជាប់ទៅកាន់ Server បានទេ!';
      }
    }

    document.addEventListener('contextmenu', e => e.preventDefault(), true);
    window.onload = () => {
      renderPlaylist();
      selectEpisode(13); // ចាក់ភាគ ១១៩ ដោយស្វ័យប្រវត្តិ
    };
  </script>

</body>
</html>
