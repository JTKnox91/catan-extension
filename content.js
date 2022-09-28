// Must match popup.js
const READ_LOGS_REQUEST = "CatanExtenstionPopupReadLogsRequest";

// From colonist.io DOM. Subject to change.
const GAME_LOG_ID = "game-log-text";

chrome.runtime.onMessage.addListener(
  function(message, sender, sendResponse) {
    if (message !== READ_LOGS_REQUEST) return false;

    const logsContainer = document.getElementById(GAME_LOG_ID);
    if (!!logsContainer) {
      sendResponse({
        success: true,
        data: Array.from(logsContainer.children).map((child) => child.innerText),
      });
    } else {
      sendResponse({
        success: false,
        error: "Could not find logs container",
      });
    }
    // Required for response to be used in callback.
    return true;
  }
);