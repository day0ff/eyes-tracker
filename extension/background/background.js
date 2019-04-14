window.addEventListener('load', () => {

  const video = document.getElementById('video');
  video.srcObject = null;

  const target = document.getElementById('target');

  const documentWidth = document.documentElement.clientWidth;
  const documentHeight = document.documentElement.clientHeight;

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
    if (receive && receive.popup && receive.popup.portId) {
      sendResponse({background: {response: 'Start tracking page.'}});
    }
    if (receive && receive.popup && receive.popup.message === "save-samples-images") {
      saveSamples();
      sendResponse({background: {response: 'Samples images saved.'}});
    }
    if (receive && receive.popup && receive.popup.message === "save-samples-json") {
      download('samples.json', JSON.stringify(samples));
      sendResponse({background: {response: 'Samples json saved.'}});
    }
  });


  chrome.runtime.onConnect.addListener((port) => {
    port.onMessage.addListener((receive) => {
      if (receive.content.message = "predict") {
        if (cTrackerInitFlag) {
          trackingLoop();
          const predict = prediction();
          if (predict) {
            port.postMessage({background: {prediction: predict}});
          }
        }
        // console.log(receive.content.location);
      }
    });
  });

  document.getElementById('play').addEventListener('click', play);
  document.getElementById('pause').addEventListener('click', pause);
  document.getElementById('stop').addEventListener('click', stop);
  document.getElementById('grid').addEventListener('click', grid);
  document.getElementById('save-samples-local').addEventListener('click', saveLocal);
  document.getElementById('load-samples-local').addEventListener('click', loadLocal);
  document.getElementById('save-samples-file').addEventListener('click', saveFiles);
  document.getElementById('load-samples-file').addEventListener('click', loadFiles);

  function play() {
    navigator.mediaDevices.getUserMedia({video: true})
      .then(stream => {
        video.srcObject = stream;
        video.play();
        track();
        setInterval(() => {
          if (cTrackerInitFlag) {
            trackingLoop();
            const predict = prediction();
            if (predict) {
              target.style.display = 'block';
              target.style.left = predict[0] * documentWidth + 'px';
              target.style.top = predict[1] * documentHeight + 'px';
              // console.log(predict);
            }
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

  function grid() {
    createGrid();
  }

  function saveLocal() {
    currentModel.save(`localstorage://model-eyes-tracker`)
      .then(
        () => console.log('Model saved local.'),
        error => console.log('Can not saved samples local. Error::', error)
      );
  }

  function loadLocal() {
    tf.loadModel(`localstorage://model-eyes-tracker`)
      .then(
        (model) => {
          currentModel = model;
          compile(currentModel);
          console.log('Model loaded local.');
        },
        error => console.log('Can not loaded samples local. Error::', error)
      );
  }

  function saveFiles() {
    console.log(currentModel);
    currentModel.save(`downloads://model-eyes-tracker`)
      .then(
        () => console.log('Model saved to files.'),
        error => console.log('Can not saved samples to files. Error::', error)
      );
  }

  function loadFiles() {
    const filesElement = document.getElementById('files');
    filesElement.click();
    filesElement.onchange = () => {
      const files = filesElement.files;
      tf.loadModel(tf.io.browserFiles([files[0], files[1]]))
        .then(
          (model) => {
            currentModel = model;
            compile(currentModel);
            console.log(currentModel);
            console.log('Model loaded from files.');
          },
          error => console.log('Can not loaded from files. Error::', error)
        );
      // compile(currentModel);
      // console.log('Model loaded from files.');
    };
  }

});

