// this script is under the MIT license (https://max.nekoweb.org/resources/license.txt)
const USERNAME = "zlxkks";
const BASE_URL = `https://lastfm-last-played.biancarosa.com.br/${USERNAME}/latest-song`;

const getTrack = async () => {
    try {
        const request = await fetch(BASE_URL);
        const json = await request.json();

        let isPlaying = json.track['@attr']?.nowplaying === "true";

        document.getElementById("lastfm").innerHTML = `
        <img src="${json.track.image[2]['#text']}" alt="Album Art">
        <div id="trackInfo">
            <h4 id="trackName">${json.track.name}</h4>
            <p id="artistName">${json.track.artist['#text']}</p>
        </div>
        `;
    } catch (error) {
        console.error("Error fetching Last.fm data:", error);
    }
};

getTrack();
