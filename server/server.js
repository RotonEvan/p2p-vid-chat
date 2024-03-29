const HTTPS_PORT = process.env.PORT || 8443; //default port for https is 443
const HTTP_PORT = 8001; //default port for http is 80

const PORT =5000;
// const INDEX = '/index.html';

// const express = require('express');

const fs = require('fs');
const http = require('http');
const https = require('https');
const WebSocket = require('ws');

// const server = express()
//   .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
//   .listen(PORT, () => console.log(`Listening on ${PORT}`));

// based on examples at https://www.npmjs.com/package/ws 

console.log(`Listening to ${PORT}`);

// app.set('port', HTTPS_PORT);
// app.portnumber = HTTPS_PORT;

// exports = module.exports = {
//   portnumber : port
// }

// Yes, TLS is required
const serverConfig = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem'),
};

// ----------------------------------------------------------------------------------------

// Create a server for the client html page
const handleRequest = function (request, response) {
  // Render the single client html file for any request the HTTP server receives
  console.log('request received: ' + request.url);

 if (request.url === '/webrtc.js') {
    response.writeHead(200, { 'Content-Type': 'application/javascript' });
    response.end(fs.readFileSync('client/webrtc.js'));
  } else if (request.url === '/style.css') {
    response.writeHead(200, { 'Content-Type': 'text/css' });
    response.end(fs.readFileSync('client/style.css'));
  } else {
    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.end(fs.readFileSync('client/index.html'));
  }
};

const httpsServer = http.createServer(serverConfig, handleRequest);
httpsServer.listen(HTTPS_PORT);

const wss = new WebSocket.Server({server: httpsServer});

// ----------------------------------------------------------------------------------------

// Create a server for handling websocket calls
// const wss = new WebSocketServer({ server: httpsServer });

wss.on('connection', function (ws) {
  ws.on('message', function (message) {
    // Broadcast any received message to all clients
    console.log('received: %s', message);
    wss.broadcast(message);
  });

  ws.on('error', () => ws.terminate());
});

wss.broadcast = function (data) {
  this.clients.forEach(function (client) {
    if (client.readyState === WebSocket.OPEN) {
      console.log("sending data");
      client.send(data);
    }
  });
};

console.log('Server running.'
);

// ----------------------------------------------------------------------------------------

// Separate server to redirect from http to https
http.createServer(function (req, res) {
    console.log(req.headers['host']+req.url);
    res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
    res.end();
}).listen(HTTP_PORT);