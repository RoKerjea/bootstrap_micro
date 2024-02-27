const express = require('express');
const http = require("http");

const app = express();


//
// Throws an error if the any required environment variables are missing.
//

if (!process.env.PORT) {
    throw new Error("Please specify the port number for the HTTP server with the environment variable PORT.");
}

if (!process.env.VIDEO_STORAGE_HOST) {
    throw new Error("Please specify the host name for the video storage microservice in variable VIDEO_STORAGE_HOST.");
}

if (!process.env.VIDEO_STORAGE_PORT) {
    throw new Error("Please specify the port number for the video storage microservice in variable VIDEO_STORAGE_PORT.");
}

//
// Extracts environment variables to globals for convenience.
//
const PORT = process.env.PORT;
const VIDEO_STORAGE_HOST = process.env.VIDEO_STORAGE_HOST;
const VIDEO_STORAGE_PORT = parseInt(process.env.VIDEO_STORAGE_PORT);
console.log(`Forwarding video requests to ${VIDEO_STORAGE_HOST}:${VIDEO_STORAGE_PORT}.`);

//
// Registers a HTTP GET route for video streaming.
//

app.get('/', (req, res) => {
	res.send('Hello World!');
});

app.get('/video', (req, res) => {
	const forwardRequest = http.request(
		{
			host: VIDEO_STORAGE_HOST,
			port: VIDEO_STORAGE_PORT,
			path: '/video?path=video_of_a_creepy_animal%20(1080p).mp4',
			method: 'GET',
			headers: req.headers
		},
		(forwardResponse) => {
			res.writeHeader(forwardResponse.statusCode, forwardResponse.headers);
			forwardResponse.pipe(res);
		}
	);

	req.pipe(forwardRequest);
});
//
// Starts the HTTP server.
//
app.listen(PORT, () => {
    console.log(`Microservice online`);
});