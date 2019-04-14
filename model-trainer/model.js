let currentModel;

const documentWidth = 1050;
const documentHeight = 550;

const data = {
    image: [],
    client: []
};

async function getSnappedImage(event) {
    if (event.keyCode == 32) {
        console.log(documentWidth, documentHeight);
        tf.tidy(() => {
            const image = tf.fromPixels(snapShotCanvas, 1);
            const normalizedImage = image.toFloat().div(tf.scalar(255));
            const client = tf.tensor1d([mouse.x, mouse.y]);
            // const normalizedClient = tf.toFloat().div(tf.scalar(255));
            // normalizedImage.print();
            client.print();
            // console.log(normalizedImage.shape);
            data.image.push(tf.keep(normalizedImage));
            data.client.push(tf.keep(client));
        });
        event.preventDefault();
    }
}

function createModel() {
    const model = tf.sequential();

    model.add(tf.layers.conv2d({
        kernelSize: 5,
        filters: 20,
        strides: 1,
        activation: 'relu',
        inputShape: [snapShotCanvas.height, snapShotCanvas.width, 1]
    }));

    model.add(tf.layers.maxPooling2d({
        poolSize: [2, 2],
        strides: [2, 2]
    }));

    model.add(tf.layers.flatten());

    model.add(tf.layers.dropout(0.2));

    model.add(tf.layers.dense({
        units: 2,
        activation: 'sigmoid'
    }));

    return compile(model);
}

function compile(model) {
    const optimizer = tf.train.adam(0.00005);
    const loss = tf.losses.meanSquaredError;

    model.compile({
        optimizer,
        loss
    });
    return model;
}

async function trainModel() {
    console.log('currentModel', !!currentModel);
    currentModel = currentModel || createModel();
    console.log('training samples...');
    const output = tf.stack(data.client);
    output.print();
    // console.log(output.shape);
    const input = tf.stack(data.image);
    // console.log(input.shape);
    // tf.toPixels(data.image[data.image.length - 1], tensorCanvas);
    let batchSize = data.image.length;
    if (batchSize > 64) batchSize = 64;
    await currentModel.fit(input, output, {
        batchSize: batchSize,
        epochs: 20,
        shuffle: true
    }).then((model) => {
        console.log(model.history.loss);
        console.log('trained complete');
    });
    const first = data.image[0].expandDims(0);
    const last = data.image[data.image.length - 1].expandDims(0);
    currentModel.predict(first).print();
    //currentModel.evaluate()
    currentModel.predict(last).print();
}

function prediction() {
    if (!currentModel) return null;
    return tf.tidy(() => {
        const image = tf.fromPixels(snapShotCanvas, 1);
        const normalizedImage = image.toFloat().div(tf.scalar(255));
        const prediction = currentModel.predict(normalizedImage.expandDims(0));
        return [prediction.get(0, 0), prediction.get(0, 1)];
    });
}
