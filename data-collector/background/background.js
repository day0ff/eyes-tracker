window.addEventListener('load', () => {

    const video = document.getElementById('video');
    video.srcObject = null;

    const target = document.getElementById('target');

    chrome.runtime.onMessage.addListener((receive, sender, sendResponse) => {
        if (receive && receive.popup && receive.popup.message === "play") {
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                play();
                sendResponse({background: {response: 'Play video.'}});
            } else {
                sendResponse({background: {response: 'There is no media device.'}});
            }
        }
        if (receive && receive.popup && receive.popup.message === "pause") {
            pause();
            sendResponse({background: {response: 'Pause video.'}});
        }
        if (receive && receive.popup && receive.popup.message === "stop") {
            stop();
            sendResponse({background: {response: 'Stop video.'}});
        }
        if (receive && receive.popup && receive.popup.message === "save-samples-images") {
            saveSamples();
            sendResponse({background: {response: 'Samples images saved.'}});
        }
        if (receive && receive.popup && receive.popup.message === "save-samples-json") {
            download('samples.json', JSON.stringify(samples));
            sendResponse({background: {response: 'Samples json saved.'}});
        }
        if (receive && receive.popup && receive.popup.message === "show-grid") {
            showGrid();
            sendResponse({background: {response: 'Show grid.'}});
        }
        if (receive && receive.popup && receive.popup.message === "hide-grid") {
            hideGrid();
            sendResponse({background: {response: 'Hide grid.'}});
        }
        if (receive && receive.popup && receive.popup.message === "show-samples") {
            showSamples();
            sendResponse({background: {response: 'Show samples.'}});
        }
        if (receive && receive.popup && receive.popup.message === "hide-samples") {
            hideSamples();
            sendResponse({background: {response: 'Hide samples.'}});
        }
    });

    document.getElementById('play').addEventListener('click', play);
    document.getElementById('pause').addEventListener('click', pause);
    document.getElementById('stop').addEventListener('click', stop);
    document.getElementById('show-grid').addEventListener('click', showGrid);
    document.getElementById('show-samples').addEventListener('click', showSamples);

    function play() {
        navigator.mediaDevices.getUserMedia({video: true})
            .then(stream => {
                video.srcObject = stream;
                video.play();
                track();
                setInterval(() => {
                    if (cTrackerInitFlag) {
                        trackingLoop();
                    }
                }, 40);
            });

    }

    function pause() {
        video.pause();
    }

    function stop() {
        const tracks = video.srcObject;
        tracks.getVideoTracks().forEach(track => track.stop());
        video.srcObject = null;
        target.style.display = 'none';
    }

});
