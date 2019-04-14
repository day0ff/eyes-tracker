window.addEventListener('load', () => {

  document.getElementById('train-model').addEventListener('click', trainModel);
  document.getElementById('save-model-local').addEventListener('click', saveLocal);
  document.getElementById('load-model-local').addEventListener('click', loadLocal);
  document.getElementById('save-model-file').addEventListener('click', saveFiles);
  document.getElementById('load-model-file').addEventListener('click', loadFiles);

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
      compile(currentModel);
      console.log('Model loaded from files.');
    };
  }

});

