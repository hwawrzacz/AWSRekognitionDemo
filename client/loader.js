const dropZone = document.querySelector('.drop-zone');
const dropZoneLabel = dropZone.querySelector('p');
const results = document.querySelector('.results');
const submitButton = document.querySelector('.submit-button');
let imageBase64;

//#region WebSocket
const socket = new WebSocket('ws://localhost:8080');

const handleMessage = (response) => {
    const message = response.data;

    // if message has a response from Rekognition API
    if (message.includes('detected')) {
        const messageObj = JSON.parse(message);

        console.log(messageObj);
        const labels = messageObj.detected;

        const title = document.createElement('h4');
        title.innerHTML = 'Detected labels:';

        results.innerHTML = '';
        const list = document.createElement('ol');
        labels.forEach(label => {
            console.log(label);
            const listElement = document.createElement('li');
            listElement.innerHTML = `${label.Name}: ${label.Confidence} <br />`;
            list.appendChild(listElement);
        });
        results.appendChild(list);
    } else {
        results.innerHTML = message;
    }
};

socket.addEventListener('message', handleMessage);
//#endregion

//#region Load image
const processImage = (e) => {
    // get full base64 data
    imageBase64 = e.srcElement.result;
    dropZone.style.backgroundImage = `url('${imageBase64}')`;
    // get the essence of base64
    imageBase64 = imageBase64.replace(new RegExp('data:image\/((jpeg)|(png));base64,'), '');
}

const loadFiles = (e) => {
    e.preventDefault();

    const loadedFiles = e.dataTransfer.files;
    const file = loadedFiles[0];
    const fileReader = new FileReader();

    fileReader.addEventListener('load', processImage);
    fileReader.readAsDataURL(file);
}

dropZone.addEventListener('dragover', (e) => { e.preventDefault() })
dropZone.addEventListener('drop', loadFiles);
//#endregion

//#region Send image
const sendImage = () => {
    if (imageBase64 != null) {
        const request = {
            image: imageBase64
        }
        socket.send(JSON.stringify(request));
    }
}

submitButton.addEventListener('click', sendImage);
//#endregion

//#region UI changes
dropZone.addEventListener('drop', () => {
    dropZone.classList.remove('drag-over');
    dropZoneLabel.classList.add('hidden');
});

document.addEventListener('dragover', () => {
    dropZone.classList.add('drag-over');
    dropZoneLabel.classList.remove('hidden');
})

document.addEventListener('dragleave', () => {
    dropZone.classList.remove('drag-over');
});

dropZoneLabel.addEventListener('dragover', (e) => e.preventDefault());
dropZoneLabel.addEventListener('drop', (e) => e.preventDefault());
//#endregion
