// Must match content.js
const READ_LOGS_REQUEST = "CatanExtenstionPopupReadLogsRequest";

chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  chrome.tabs.sendMessage(tabs[0].id, READ_LOGS_REQUEST, function(response) {
    if (response.success) {
      document.getElementById("messages").innerText = response.data.join("\n");
    } else {
      document.getElementById("errors").innerText = response.error || "Something Went Wrong";
    }
  });
});


