document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.sync.get('blockedSites', ({ blockedSites }) => {
        if (blockedSites) {
            document.getElementById('blockedSites').value = blockedSites.join('\n');
        }
    });
});

document.getElementById('settingsForm').addEventListener('submit', event => {
    event.preventDefault();
    const blockedSitesInput = document.getElementById('blockedSites').value;
    const blockedSites = blockedSitesInput
        .split('\n')
        .map(site => {
            const domainRegex = /(?:https?:\/\/)?(?:www\.)?([^\/]+)/;
            const match = site.match(domainRegex);
            if (match) {
                const hostname = match[1];
                const domain = hostname.split('.').slice(-2).join('.');
                return `*.${domain}`;
            }
            return '';
        })
        .filter(site => site !== '');

    chrome.storage.sync.set({ blockedSites });
    alert('Blocked sites saved: ' + blockedSites.join(', '));
});
