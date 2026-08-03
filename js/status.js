const USER_ID = "703262482466078794";

// Fallback text configs
const OFFLINE_FALLBACK = "Currently offline.";
const NO_STATUS_FALLBACK = "No custom status set.";

// Helper function to format timestamp to relative time ("X ago")
function timeAgo(timestamp) {
  if (!timestamp) return "";
  
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return "just now";
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

async function getLanyardData() {
  try {
    const res = await fetch(`https://api.lanyard.rest/v1/users/${USER_ID}`);
    const { data, success } = await res.json();

    if (!success) {
      console.warn("Lanyard API error.");
      return;
    }

    const user = data.discord_user;
    const isOffline = data.discord_status === "offline";

    document.getElementById("discord-username").textContent = `@${user.username}`;
    
    const customStatus = data.activities?.find(
      (act) => act.type === 4 || act.id === "custom"
    );

    const statusElem = document.getElementById("discord-custom-status");
    const timeElem = document.getElementById("discord-status-time");

    if (isOffline) {
      statusElem.textContent = OFFLINE_FALLBACK;
      timeElem.textContent = "";
    } else if (customStatus?.state) {
      statusElem.textContent = customStatus.state;
      timeElem.textContent = customStatus.created_at ? timeAgo(customStatus.created_at) : "";
    } else {
      statusElem.textContent = NO_STATUS_FALLBACK;
      timeElem.textContent = "";
    }

  } catch (err) {
    console.error("Failed to fetch Lanyard data:", err);
  }
}

// Fetch on page load
getLanyardData();