chrome.storage.sync.get('blockedSites', ({ blockedSites }) => {
    if (!blockedSites) {
        chrome.storage.sync.set({ blockedSites: [] });
    }
});

chrome.webRequest.onBeforeRequest.addListener(
    details => {
        return new Promise(resolve => {
            chrome.storage.sync.get(['blockedSites', 'allowedSites'], ({ blockedSites, allowedSites }) => {
                const currentHostname = new URL(details.url).hostname;
                const isBlocked = blockedSites.some(site => {
                    const domain = site.substring(2);
                    return currentHostname.endsWith(domain);
                });
                const isAllowed = allowedSites && allowedSites.some(site => {
                    if (currentHostname.includes(site.hostname) && Date.now() < site.until) {
                        return true;
                    }
                    return false;
                });

                if (isBlocked && !isAllowed) {
                    chrome.storage.sync.set({ requestedUrl: details.url });
                    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
                        chrome.tabs.update(tab.id, { url: 'intercept.html' });
                    });
                    resolve({ cancel: true });
                } else {
                    resolve({ cancel: false });
                }
            });
        });
    },
    { urls: ['<all_urls>'] },
    ['blocking']
);
