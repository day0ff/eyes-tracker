document.addEventListener('DOMContentLoaded', () => {

    document.getElementById('open').addEventListener('click', () => {
        chrome.tabs.create({url: "../background/background.html", active: true}, (response) => {
            if (response) document.getElementById('message').innerHTML = JSON.stringify(response);
        });
    });

    document.getElementById('play').addEventListener('click', () => {
        chrome.runtime.sendMessage({popup: {message: 'play'}}, (response) => {
            if (response && response.background) document.getElementById('message').innerHTML = response.background.response;
        });
    });

    document.getElementById('pause').addEventListener('click', () => {
        chrome.runtime.sendMessage({popup: {message: 'pause'}}, (response) => {
            if (response && response.background)
                document.getElementById('message').innerHTML = response.background.response;
        });
    });

    document.getElementById('stop').addEventListener('click', () => {
        chrome.runtime.sendMessage({popup: {message: 'stop'}}, (response) => {
            if (response && response.background)
                document.getElementById('message').innerHTML = response.background.response;
        });
    });

    document.getElementById('show-grid').addEventListener('click', () => {
        chrome.runtime.sendMessage({popup: {message: 'show-grid'}}, (response) => {
            if (response && response.background)
                document.getElementById('message').innerHTML = response.background.response;
        });
    });

    document.getElementById('hide-grid').addEventListener('click', () => {
        chrome.runtime.sendMessage({popup: {message: 'hide-grid'}}, (response) => {
            if (response && response.background)
                document.getElementById('message').innerHTML = response.background.response;
        });
    });

    document.getElementById('show-samples').addEventListener('click', () => {
        chrome.runtime.sendMessage({popup: {message: 'show-samples'}}, (response) => {
            if (response && response.background)
                document.getElementById('message').innerHTML = response.background.response;
        });
    });

    document.getElementById('hide-samples').addEventListener('click', () => {
        chrome.runtime.sendMessage({popup: {message: 'hide-samples'}}, (response) => {
            if (response && response.background)
                document.getElementById('message').innerHTML = response.background.response;
        });
    });

    document.getElementById('save-samples-images').addEventListener('click', () => {
        chrome.runtime.sendMessage({popup: {message: 'save-samples-images'}}, (response) => {
            if (response && response.background)
                document.getElementById('message').innerHTML = response.background.response;
        });
    });

    document.getElementById('save-samples-json').addEventListener('click', () => {
        chrome.runtime.sendMessage({popup: {message: 'save-samples-json'}}, (response) => {
            if (response && response.background)
                document.getElementById('message').innerHTML = response.background.response;
        });
    });
});
