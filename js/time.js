// licensed under the MIT license https://harakiri.moe/LICENSE.txt
function showOwnerTime() {
    const now = new Date();
    document.getElementById('localtime').textContent = now.toLocaleTimeString('en-UK', {
      timeZone: 'America/Chicago',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

showOwnerTime();
setInterval(showOwnerTime, 1000);