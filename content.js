chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'getHostname') {
        sendResponse({ hostname: window.location.hostname, url: window.location.href });
    }
});
