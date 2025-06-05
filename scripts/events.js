/* request to toggle slider whenever extension icon clicked
 */
chrome.action.onClicked.addListener(function () {
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
            todo: "toggle"
        });
    })
});

// listener to download the file
chrome.runtime.onMessage.addListener( (msg, sender, sendResponse) => {
    if(msg.type === "downloadProfile") {
        
        const dataURL = "data:application/json;charset=utf-8," + encodeURIComponent(msg.content);

        chrome.downloads.download({
            url: dataURL,
            filename: msg.filename,
            saveAs: true, //this will trigger file picker option
            conflictAction: "uniquify"
        }, downloadId => {
            if (chrome.runtime.lastError) {
                console.error("Download failed", chrome.runtime.lastError.message);
            } else {
                console.log("Download done: ", downloadId);
            }
        });

        return true;
    }
});