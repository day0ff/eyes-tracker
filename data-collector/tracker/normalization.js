function normalizeImage(imageData) {

  // ToDo finding normalization curve based on percent constant
  const percent = 0.01;

  const data = imageData.data;
  const filterData = data.filter((value, index) => !(index % 4));
  const histogram = new Array(256).fill(0);
  filterData.forEach(data => histogram[data]++);

  // ToDo finding normalization curve based on percent constant
  const max = Math.max(...histogram);
  const maxIndex = histogram.findIndex(value => value === max);
  const threshold = filterData.length * percent;

  const a = 0;
  const b = 255;

  // ToDo finding normalization curve based on percent constant
  // let c = 0;
  // let d = 255;

  // for (let index = maxIndex; index > 0; index--) {
  //   if (histogram[index] >= threshold) c = index;
  // }

  // for (let index = maxIndex; index < histogram.length; index++) {
  //   if (histogram[index] >= threshold) d = index;
  // }

  // console.log(threshold, c, d);

  const c = maxIndex - 20;
  const d = maxIndex + 20;

  for (let i = 0; i < data.length; i += 4) {
    data[i] = normalizePixel({pixel: data[i], a, b, c, d});// red
    data[i + 1] = normalizePixel({pixel: data[i + 1], a, b, c, d}); // green
    data[i + 2] = normalizePixel({pixel: data[i + 2], a, b, c, d}); // blue
  }
  return imageData;
}

function normalizePixel({pixel, a, b, c, d}) {
  return Math.round((pixel - c) * ((b - a) / (d - c)) + a);
}
