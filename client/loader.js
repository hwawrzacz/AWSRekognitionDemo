const dropZone = document.querySelector('.drop-zone');
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

        results.innerHTML = '';
        labels.forEach(label => {
            results.innerHTML = results.innerHTML + `${label.Name}: ${label.Confidence} <br />`;
        });
    }
    else {
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
