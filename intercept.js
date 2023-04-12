document.getElementById('interceptForm').addEventListener('submit', event => {
    event.preventDefault();
    const userInput = document.getElementById('userInput').value;
    const duration = parseInt(document.getElementById('duration').value, 10) * 60000; // Convert to milliseconds
    if (userInput) {
        chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
            const tab = tabs[0];
            chrome.storage.sync.get(['requestedUrl'], ({ requestedUrl }) => {
                const hostname = new URL(requestedUrl).hostname;
                const timestamp = new Date().toLocaleString();
                const newEvent = { website: hostname, timestamp, userInput };
                chrome.storage.sync.get('events', ({ events }) => {
                    if (events) {
                        events.push(newEvent);
                    } else {
                        events = [newEvent];
                    }
                    chrome.storage.sync.set({ events }, () => {
                        chrome.storage.sync.get('allowedSites', ({ allowedSites }) => {
                            const allowedSite = { hostname, until: Date.now() + duration };
                            if (allowedSites) {
                                allowedSites.push(allowedSite);
                            } else {
                                allowedSites = [allowedSite];
                            }
                            chrome.storage.sync.set({ allowedSites }, () => {
                                chrome.tabs.update(tab.id, { url: requestedUrl });
                            });
                        });
                    });
                });
            });
        });
    }
});
