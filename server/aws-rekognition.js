var AWS = require('aws-sdk');

const config = new AWS.Config({
    region: 'us-east-1',
    // TODO: replace with your own keys
    accessKeyId: '',
    secretAccessKey: '',
    sessionToken: ''
});
AWS.config.update(config);

const client = new AWS.Rekognition();

const detectLabelsReq = async (buffer) => {
    const params = {
        Image: {
            Bytes: buffer
        },
        MaxLabels: 3
    };
    return client.detectLabels(params).promise();
};

module.exports = detectLabelsReq;