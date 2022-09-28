// Must match content.js
const READ_LOGS_REQUEST = "CatanExtenstionPopupReadLogsRequest";

chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  chrome.tabs.sendMessage(tabs[0].id, READ_LOGS_REQUEST, function(response) {
    if (response.success) {
      const playerResourceCounts = new Map();
      response.data.forEach((action) => {
        if (!playerResourceCounts.has(action.player)) {
          playerResourceCounts.set(action.player, new Map());
        }
        const player = playerResourceCounts.get(action.player);
        Object.keys(action.resources).forEach((resourceKey) => {
          const resourceDelta = action.resources[resourceKey];
          if (player.has(resourceKey)) {
            player.set(resourceKey, 0);
          }
          player.set(resourceKey, player.get(resourceKey) + resourceDelta);
        });
      });

      const template = document.createElement('template');
      playerResourceCounts.forEach((resourceCounts, player) => {
        let playerHtmlString = `<div><h2>${player}</h2><ul>`;
        resourceCounts.forEach((amount, resourceKey) => {
          playerHtmlString += `<li>${resourceKey}: ${amount}</li>`
        });
        playerHtmlString += `</ul></div>`
        template.innerHTML += playerHtmlString;
      });

      document.getElementById("messages").replaceChildren(...Array.from(template.content.childNodes));
    } else {
      document.getElementById("errors").innerText = response.error || "Something Went Wrong";
    }
  });
});


