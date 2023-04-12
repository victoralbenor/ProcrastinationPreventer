document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('interceptForm');
    form.addEventListener('submit', event => {
        event.preventDefault();
        const reason = document.getElementById('reason').value;
        const duration = parseInt(document.getElementById('duration').value, 10) || 5;

        chrome.storage.sync.get('requestedUrl', ({ requestedUrl }) => {
            const hostname = new URL(requestedUrl).hostname;
            saveAllowedSite(hostname, duration);
        });
    });
});

function _saveAllowedSite(hostname, minutes) {
    chrome.storage.sync.get('allowedSites', ({ allowedSites }) => {
        const newSite = {
            hostname,
            until: Date.now() + minutes * 60 * 1000,
        };

        const updatedAllowedSites = allowedSites ? [...allowedSites, newSite] : [newSite];
        chrome.storage.sync.set({ allowedSites: updatedAllowedSites }, () => {
            chrome.storage.sync.get('requestedUrl', ({ requestedUrl }) => {
                chrome.tabs.update({ url: requestedUrl });
            });
        });
    });
}

function debounce(func, wait) {
    let timeout;

    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };

        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

const saveAllowedSite = debounce(_saveAllowedSite, 1000);
