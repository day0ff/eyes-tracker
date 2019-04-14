const target = createTarget();

const documentWidth = document.documentElement.clientWidth;
const documentHeight = document.documentElement.clientHeight;

let timerId = null;

chrome.runtime.onMessage.addListener((receive, sender, sendResponse) => {
    if (receive && receive.popup && receive.popup.portId) {
        let port = chrome.runtime.connect({name: receive.popup.portId});
        if (!timerId) timerId = timer(port, 100);
        port.onMessage.addListener(receive => {
            const predict = receive.background.prediction;
            target.style.display = 'block';
            target.style.left = predict[0] * documentWidth + 'px';
            target.style.top = predict[1] * documentHeight + 'px';
            // console.log(predict);
        });
        sendResponse({content: {response: "Track page."}});
    }
    // if (receive && receive.popup && receive.popup.message === "stop") {
    //     stop();
    // }
});

function createTarget() {
    const target = document.createElement('div');
    target.id = "target";
    document.body.appendChild(target);
    return target;
}

function timer(port, interval) {
    return setInterval(() => port.postMessage({
        content: {
            message: "predict",
            location: window.location.href
        }
    }), interval);
}

function stop() {
    target.style.display = 'none';
    clearInterval(timerId);
}
