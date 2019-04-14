chrome.runtime.sendMessage({popup: {message: 'Hello form popup!'}}, (response) => {
  if (response && response.background) console.log(response.background.response);
});


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

    // chrome.tabs.query({currentWindow: true, active: true}, (tabs) => {
    //     chrome.tabs.sendMessage(tabs[0].id, {popup: {message: "stop"}}, (response) => {
    //         if (response && response.content) console.log(response.content.response);
    //     });
    // });
  });

  document.getElementById('track').addEventListener('click', () => {
    const portId = Math.random().toString(36).slice(-10);
    chrome.tabs.query({currentWindow: true, active: true}, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {popup: {portId: portId}}, (response) => {
        if (response && response.content) console.log(response.content.response);
      });
    });

    chrome.runtime.sendMessage({popup: {portId: portId}}, (response) => {
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
