const express = require('express');
const azure = require('azure-storage');

const app = express();

const port = process.env.PORT;
const STORAGE_ACCOUNT_NAME = process.env.STORAGE_ACCOUNT_NAME;
const STORAGE_ACCESS_KEY = process.env.STORAGE_ACCESS_KEY;

function createBlobService() {
    const blobService = azure.createBlobService(STORAGE_ACCOUNT_NAME, STORAGE_ACCESS_KEY);
    // Uncomment next line for extra debug logging.
    //blobService.logger.level = azure.Logger.LogLevels.DEBUG; 
    return blobService;
}

app.get('/video', (req, res) => {
	const videoPath =  req.query.path;
	console.log(`Streaming video from path ${videoPath}.`);

	const blobService = createBlobService();

	const containerName = 'videos';
	blobService.getBlobProperties(containerName, videoPath, (err, properties) => {
		if (err) {
			//error handling
			console.error('An error occurred: ', err);
			res.sendStatus(500);
			return;
		}

		res.writeHead(200, {
			'Content-Length': properties.contentLength,
			'Content-Type': 'video/mp4',
		});

		blobService.getBlobToStream(containerName, videoPath, res, err => {
			if (err) {
				console.error('An error occurred: ', err);
				res.sendStatus(500);
				return;
			}
		});
	});
});

app.listen(port, () => {
	console.log(`Microservice online`);
});