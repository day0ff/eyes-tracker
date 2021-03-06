const video = document.getElementById('video');

const eyesCanvas = document.getElementById('eyesCanvas');
const eyesContext = eyesCanvas.getContext('2d');

const maskCanvas = document.getElementById('maskCanvas');
const maskContext = maskCanvas.getContext('2d');

const headCanvas = document.getElementById('headCanvas');
const headContext = headCanvas.getContext('2d');

const middlewareCanvas = document.getElementById('middlewareCanvas');
const middlewareContext = middlewareCanvas.getContext('2d');

const snapShotCanvas = document.getElementById('snapShotCanvas');
const snapShotContext = snapShotCanvas.getContext('2d');

const sampleCanvas = document.getElementById('sampleCanvas');
const sampleContext = sampleCanvas.getContext('2d');

const tensorCanvas = document.getElementById('tensorCanvas');
const tensorContext = tensorCanvas.getContext('2d');

const shift = document.getElementById('shift');
const angel = document.getElementById('angel');
const vertical = document.getElementById('vertical');

const cTracker = new clm.tracker();
let cTrackerInitFlag = false;

function track() {
  cTracker.init();
  cTrackerInitFlag = true;
  cTracker.start(video);
  console.log('cTracker init');
}

function trackingLoop() {
  const currentPosition = cTracker.getCurrentPosition();

  if (currentPosition) {
    maskContext.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
    cTracker.draw(maskCanvas);

    const headRect = getHeadBox(currentPosition);

    headContext.clearRect(0, 0, headCanvas.width, headCanvas.height);
    headContext.strokeStyle = 'deepskyblue';
    headContext.beginPath();
    headContext.moveTo(headRect.nose.top.x, headRect.nose.top.y);
    headContext.lineTo(headRect.nose.bottom.x, headRect.nose.bottom.y);
    headContext.stroke();
    headContext.strokeRect(headRect.left, headRect.top, headRect.width, headRect.height);

    const eyesRect = getEyesBox(currentPosition);
    sample.angel = Math.trunc(eyesRect.angle * 180 / Math.PI);
    sample.shift = Math.trunc(eyesRect.shift);
    sample.vertical = Math.trunc(eyesRect.vertical);

    angel.innerHTML = `&#8736;&nbsp;${sample.angel}&deg;`;
    shift.innerHTML = `&perp;&nbsp;${sample.shift}&Prime;`;
    vertical.innerHTML = `&divide;&nbsp;${sample.vertical}&prime;`;

    sampleAngel.innerHTML = angel.innerHTML;
    sampleShift.innerHTML = shift.innerHTML;
    sampleVertical.innerHTML = vertical.innerHTML;


    eyesContext.clearRect(0, 0, eyesCanvas.width, eyesCanvas.height);
    eyesContext.save();
    eyesContext.strokeStyle = 'purple';
    eyesContext.translate(eyesRect.left, eyesRect.top);
    eyesContext.rotate(eyesRect.angle);
    eyesContext.strokeRect(0, 0, eyesRect.width, eyesRect.height);
    eyesContext.restore();

    middlewareContext.clearRect(0, 0, middlewareCanvas.width, middlewareCanvas.height);
    middlewareContext.save();
    middlewareContext.fillStyleStyle = 'white';
    middlewareContext.translate(eyesRect.left, eyesRect.top);
    middlewareContext.rotate(-eyesRect.angle);
    middlewareContext.drawImage(video, -eyesRect.left, -eyesRect.top);
    middlewareContext.restore();
    middlewareContext.globalCompositeOperation = 'color';
    middlewareContext.fillRect(0, 0, middlewareCanvas.width, middlewareCanvas.height);

    snapShotContext.clearRect(0, 0, snapShotCanvas.width, snapShotCanvas.height);
    snapShotContext.drawImage(middlewareCanvas, eyesRect.left, eyesRect.top, eyesRect.width, eyesRect.height,
      0, 0, snapShotCanvas.width, snapShotCanvas.height);

    const imageData = snapShotContext.getImageData(0, 0, snapShotCanvas.width, snapShotCanvas.height);

    const normalizeImageData = normalizeImage(imageData);
    snapShotContext.putImageData(normalizeImageData, 0, 0);

    sampleContext.clearRect(0, 0, sampleCanvas.width, sampleCanvas.height);
    sampleContext.drawImage(snapShotCanvas, 0, 0, 35, 8);
  }
}

function getEyesRectangle(positions) {
  const eyes = {};
  const a = Math.sqrt(Math.pow(positions[23][0] - positions[28][0], 2)
    + Math.pow(positions[23][1] - positions[28][1], 2));
  const b = Math.sqrt(Math.pow(positions[28][0] - positions[33][0], 2)
    + Math.pow(positions[28][1] - positions[33][1], 2));
  const c = Math.sqrt(Math.pow(positions[23][0] - positions[33][0], 2)
    + Math.pow(positions[23][1] - positions[33][1], 2));
  const p = (a + b + c) / 2;
  eyes.vertical = 2 * Math.sqrt(p * (p - a) * (p - b) * (p - c)) / a;
  eyes.width = Math.sqrt(Math.pow(positions[23][0] - positions[28][0], 2)
    + Math.pow(positions[23][1] - positions[28][1], 2));
  eyes.height = Math.sqrt(Math.pow(positions[24][0] - positions[26][0], 2)
    + Math.pow(positions[24][1] - positions[26][1], 2));
  eyes.angle = Math.atan2(positions[28][1] - positions[23][1], positions[28][0] - positions[23][0]);
  eyes.shift = (Math.sqrt(Math.pow(positions[25][0] - positions[33][0], 2)
    + Math.pow(positions[25][1] - positions[33][1], 2)) -
    Math.sqrt(Math.pow(positions[30][0] - positions[33][0], 2)
      + Math.pow(positions[30][1] - positions[33][1], 2))) * 100 / eyes.width;
  eyes.top = positions[23][1] - eyes.height / 2;
  eyes.left = positions[23][0];
  eyes.vertical = 64 * eyes.vertical / eyes.width;
  return eyes;
}


function getEyesBox(positions) {
  const eyes = getEyesRectangle(positions);
  const eyesBox = {};
  const indent = 10;
  eyesBox.width = eyes.width + indent * 2;
  eyesBox.height = eyes.height + indent * 2;
  eyesBox.angle = eyes.angle;
  eyesBox.shift = eyes.shift;
  eyesBox.vertical = eyes.vertical;
  eyesBox.indent = Math.sqrt(2 * (indent ** 2));
  eyesBox.left = eyes.left + eyesBox.indent * Math.sin(eyesBox.angle - Math.PI / 4);
  eyesBox.top = eyes.top - eyesBox.indent * Math.cos(eyesBox.angle - Math.PI / 4);
  return eyesBox;
}

function getHeadBox(positions) {
  const headBox = {};
  headBox.left =
    Math.min(
      positions[0][0],
      positions[1][0],
      positions[2][0],
      positions[3][0],
      positions[4][0]
    );
  headBox.right =
    Math.max(
      positions[14][0],
      positions[13][0],
      positions[12][0],
      positions[11][0],
      positions[10][0]
    );
  headBox.top =
    Math.min(
      positions[20][1],
      positions[21][1],
      positions[17][1],
      positions[16][1]
    );
  headBox.bottom =
    Math.max(
      positions[5][1],
      positions[6][1],
      positions[7][1],
      positions[8][1],
      positions[9][1]
    );
  headBox.width = headBox.right - headBox.left;
  headBox.height = headBox.bottom - headBox.top;
  headBox.top = headBox.top - headBox.height / 2;
  headBox.height *= 1.5;
  headBox.nose = {top: {x: 0, y: 0}, bottom: {x: 0, y: 0}};
  headBox.nose.top.x = positions[33][0];
  headBox.nose.top.y = positions[33][1];
  headBox.nose.bottom.x = positions[62][0];
  headBox.nose.bottom.y = positions[62][1];
  headBox.center = {left: 0, right: 0};
  headBox.center.left =
    Math.min(
      positions[33][0],
      positions[62][0]
    );
  headBox.center.righ =
    Math.max(
      positions[33][0],
      positions[62][0]
    );
  return headBox;
}
