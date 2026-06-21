// licensed under the MIT license https://harakiri.moe/LICENSE.txt

document.addEventListener('DOMContentLoaded', () => {
    fetch('/status.json')
        .then(response => response.json())
        .then(data => {
          document.getElementById('statusHead').textContent = `juniper · ${data.updated}`;
          document.getElementById('statusText').textContent = `${data.status}`;
        })
        .catch(error => {
          console.error(error);
          const statusTextEl = document.getElementById('statusText');
          if (statusTextEl) statusTextEl.textContent = "whoever wrote ts is a real idiot haha";
        });
});