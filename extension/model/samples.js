const overLair = document.getElementById('over-lair');
const overLairSamples = document.getElementById('over-lair-samples');
const sampleShift = document.getElementById('sample-shift');
const sampleAngel = document.getElementById('sample-angel');
const sampleVertical = document.getElementById('sample-vertical');
const samplePosition = document.getElementById('sample-position');
const sample = {
  id: 0,
  angel: 0,
  shift: 0,
  vertical: 0,
  x: 0,
  y: 0
};
let samples = [];

document.body.addEventListener('keydown', getSample);

overLair.addEventListener('click', removeImage);

function createGrid() {
  overLair.style.display = 'block';
  samplePosition.innerHTML = [sample.x, sample.y].toString();
}


function getSample(event) {
  console.log(event.keyCode);
  // space
  if (event.keyCode === 32) {
    console.log('space', documentWidth, documentHeight);
    createImage();
    event.preventDefault();
  }
  // left
  if (event.keyCode === 37) {
    console.log('left', documentWidth, documentHeight);
    event.preventDefault();
  }
  // up
  if (event.keyCode === 38) {
    console.log('up', documentWidth, documentHeight);
    event.preventDefault();
  }
  // right
  if (event.keyCode === 39) {
    console.log('right', documentWidth, documentHeight);
    event.preventDefault();
  }
  // down
  if (event.keyCode === 40) {
    console.log('down', documentWidth, documentHeight);
    event.preventDefault();
  }

}

function createImage() {
  sample.id = samples.length + 1;
  samples.push({...sample});
  console.log(samples);
  const div = document.createElement("div");
  div.classList.add('box');
  div.id = sample.id;
  const src = sampleCanvas.toDataURL("image/png");
  const number = ('000' + sample.id).slice(-4);
  div.innerHTML = `<a href="${src}" class="samples-eyes" download="eyes_${number}.png">
                        <img src="${src}" width="50" height="12"/>
                    </a>
                    <span class="info">&perp;&nbsp;${sample.shift}&Prime;</span>
                    <span class="info">&divide;&nbsp;${sample.vertical}&prime;</span>
                    <span class="info">&#8736;&nbsp;${sample.angel}&deg;</span>
                    <span class="info">(${sample.x},&nbsp;${sample.y})</span>
                    <span class="info">id&nbsp;${sample.id}</span>
                    <span class="info">x</span>`;
  overLairSamples.appendChild(div);
}

function removeImage(event) {
  if (event.target.textContent === 'x') {
    event.target.parentElement.remove();
    samples = samples.filter(sample => sample.id !== +event.target.parentElement.id);
    console.log(samples);
  }
}

function saveSamples() {
  Array.from(document.querySelectorAll('.samples-eyes')).slice(0, 9).forEach(element => {
    element.click();
    element.parentElement.remove();
  });
}

function download(filename, text) {
  const a = document.createElement('a');
  a.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  a.setAttribute('download', filename);
  a.click();
}
