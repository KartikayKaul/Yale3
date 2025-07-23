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

    // NEW: Handle DeepScan trigger // deepscan feature
    else if (msg.type === "triggerDeepScan") {
        const { section, sectionHref } = msg;

        // Open the modal link in a background tab
        chrome.tabs.create({ url: sectionHref, active: false }, (tab) => {
            const tabId = tab.id;

            // Wait until the tab is fully loaded
            const listener = (updatedTabId, changeInfo) => {
                if (updatedTabId === tabId && changeInfo.status === "complete") {
                    // Inject content script to scrape modal content
                    chrome.scripting.executeScript({
                        target: { tabId },
                        files: ["scripts/modal_scraper.js"]
                    });

                    // Stop listening for tab updates
                    chrome.tabs.onUpdated.removeListener(listener);
                }
            };

            chrome.tabs.onUpdated.addListener(listener);

            // Optional: timeout set for 10s to close tab after 10s
            setTimeout(() => {
                chrome.tabs.remove(tabId);
            }, 10000);
        });

        return true;
    }

    // deepscan feature
     if (msg.type === "deepscanResult") {
        if (sender && sender.tab && sender.tab.openerTabId) {
            // Send the data back to the original content.js
            chrome.tabs.sendMessage(sender.tab.openerTabId, {
                type: "injectDeepscanData",
                section: msg.section,
                content: msg.content
            });
        } else {
            console.warn("Could not find openerTabId to send DeepScan result back.");
        }
    }


});