document.addEventListener('DOMContentLoaded', () => {
    // Retrieve and display events
    chrome.storage.sync.get('events', ({ events }) => {
        if (events) {
            const table = document.querySelector('#eventTable tbody');
            events.forEach(event => {
                const row = table.insertRow();
                row.insertCell().textContent = event.website;
                row.insertCell().textContent = event.timestamp;
                row.insertCell().textContent = event.userInput;
            });
        }
    });
});
