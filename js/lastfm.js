// this script is under the MIT license (https://max.nekoweb.org/resources/license.txt)
const USERNAME = "zlxkks";
const BASE_URL = `https://lastfm-last-played.biancarosa.com.br/${USERNAME}/latest-song`;

const getTrack = async () => {
    try {
        const request = await fetch(BASE_URL);
        const json = await request.json();
        const container = document.getElementById("lastfm");

        if (!container) return; 

        let isPlaying = json.track['@attr']?.nowplaying || false;

        if (!isPlaying) {
            container.innerHTML = `<p class="not-playing">Not listening to anything right now.</p>`;
            return;
        }

        container.innerHTML = `
            <img src="${json.track.image[1]['#text']}" alt="Album cover">
            <div id="trackInfo">
                <h3 id="trackName">${json.track.name}</h3>
                <p id="artistName">${json.track.artist['#text']}</p>
            </div>
        `;
    } catch (error) {
        console.error("Error fetching Last.fm data:", error);
    }
};

window.addEventListener('DOMContentLoaded', () => {
    getTrack();
    setInterval(getTrack, 10000);
});