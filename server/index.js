const WebSocket = require('ws');
const awsRekognition = require('./aws-rekognition');

const websocketServer = new WebSocket.Server({ port: 8080 });

websocketServer.on('connection', connection = (ws) => {
    ws.send('Connected');

    ws.on('message', detectImage = async (request) => {
        try {
            ws.send('Processing image');
            const parsedRequest = await JSON.parse(request);
            const buffer = new Buffer.from(parsedRequest.image, 'base64');
            const detected = await awsRekognition(buffer);

            if (detected.Labels) {
                const response = {
                    detected: detected.Labels
                }
                ws.send(JSON.stringify(response));
            }
            else {
                ws.send('Cannot detect labels');
            }
        } catch (exc) {
            ws.send(`Internal error: ${exc}`);
        }
    });
});
console.log('Ready!');