document.addEventListener('DOMContentLoaded', () => {
    // Retrieve and display events
    chrome.storage.sync.get('allowedSites', ({ allowedSites }) => {
        if (allowedSites) {
            const table = document.querySelector('#eventTable tbody');
            allowedSites.forEach(site => {
                const row = table.insertRow();
                row.insertCell().textContent = site.hostname;
                row.insertCell().textContent = new Date(site.until - site.duration * 60 * 1000).toLocaleString();
                row.insertCell().textContent = site.reason;
                row.insertCell().textContent = site.duration;
            });
        }
    });
});
