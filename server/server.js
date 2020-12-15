const HTTPS_PORT = process.env.PORT || 8443; //default port for https is 443
const HTTP_PORT = 8001; //default port for http is 80

const fs = require('fs');
const http = require('http');
const https = require('https');
// based on examples at https://www.npmjs.com/package/ws
const WebSocket = require('ws');
const ClientList = require('./ClientList');
const { sign } = require('crypto');

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

 if (request.url === '/class.js') {
    response.writeHead(200, { 'Content-Type': 'application/javascript' });
    response.end(fs.readFileSync('client/class.js'));
  } else if (request.url === '/font-awesome.min.css') {
    response.writeHead(200, { 'Content-Type': 'text/css' });
    response.end(fs.readFileSync('client/font-awesome.min.css'));
  } else if (request.url === '/style.css') {
    response.writeHead(200, { 'Content-Type': 'text/css' });
    response.end(fs.readFileSync('client/style.css'));
  } else if (request.url === '/css/style.css') {
    response.writeHead(200, { 'Content-Type': 'text/css' });
    response.end(fs.readFileSync('client/css/style.css'));
  } else if (request.url === '/css/bootstrap.min.css') {
    response.writeHead(200, { 'Content-Type': 'text/css' });
    response.end(fs.readFileSync('client/css/bootstrap.min.css'));
  } else if (request.url === '/css/animsition.min.css') {
    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.end(fs.readFileSync('client/css/animsition.min.css'));
  } else if (request.url === '/favicon/apple-touch-icon.png') {
    response.writeHead(200, { 'Content-Type': 'image/png' });
    response.end(fs.readFileSync('client/favicon/apple-touch-icon.png'));
  } else if (request.url === '/favicon/favicon-16x16.png') {
    response.writeHead(200, { 'Content-Type': 'image/png' });
    response.end(fs.readFileSync('client/favicon/favicon-16x16.png'));
  } else if (request.url === '/favicon/favicon-32x32.png') {
    response.writeHead(200, { 'Content-Type': 'image/png' });
    response.end(fs.readFileSync('client/favicon/favicon-32x32.png'));
  } else if (request.url === '/favicon/site.html') {
    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.end(fs.readFileSync('client/favicon/site.html'));
  } else if (request.url === '/fonts/butler_extrabold-webfont.eot') {
    response.writeHead(200, { 'Content-Type': 'font/eot' });
    response.end(fs.readFileSync('client/fonts/butler_extrabold-webfont.eot'));
  } else if (request.url === '/fonts/butler_extrabold-webfont.html') {
    response.writeHead(200, { 'Content-Type': 'font/html' });
    response.end(fs.readFileSync('client/fonts/butler_extrabold-webfont.html'));
  } else if (request.url === '/fonts/butler_extrabold-webfont.ttf') {
    response.writeHead(200, { 'Content-Type': 'font/ttf' });
    response.end(fs.readFileSync('client/fonts/butler_extrabold-webfont.ttf'));
  } else if (request.url === '/fonts/butler_extrabold-webfont.woff') {
    response.writeHead(200, { 'Content-Type': 'font/woff' });
    response.end(fs.readFileSync('client/fonts/butler_extrabold-webfont.woff'));
  } else if (request.url === '/fonts/butler_extrabold-webfont41d.eot') {
    response.writeHead(200, { 'Content-Type': 'font/eot' });
    response.end(fs.readFileSync('client/fonts/butler_extrabold-webfont41d.eot'));
  } else if (request.url === '/img/bg-body.png') {
    response.writeHead(200, { 'Content-Type': 'image/png' });
    response.end(fs.readFileSync('client/img/bg-body.png'));
  } else if (request.url === '/img/bg-promo.png') {
    response.writeHead(200, { 'Content-Type': 'image/png' });
    response.end(fs.readFileSync('client/img/bg-promo.png'));
  } else if (request.url === '/js/animation.gsap.min.js') {
    response.writeHead(200, { 'Content-Type': 'application/javascript' });
    response.end(fs.readFileSync('client/js/animation.gsap.min.js'));
  } else if (request.url === '/js/animation.min.js') {
    response.writeHead(200, { 'Content-Type': 'application/javascript' });
    response.end(fs.readFileSync('client/js/animation.min.js'));
  } else if (request.url === '/js/bootstrap.min.js') {
    response.writeHead(200, { 'Content-Type': 'application/javascript' });
    response.end(fs.readFileSync('client/js/bootstrap.min.js'));
  } else if (request.url === '/js/jquery.min.js') {
    response.writeHead(200, { 'Content-Type': 'application/javascript' });
    response.end(fs.readFileSync('client/js/jquery.min.js'));
  } else if (request.url === '/js/popper.min.js') {
    response.writeHead(200, { 'Content-Type': 'application/javascript' });
    response.end(fs.readFileSync('client/js/popper.min.js'));
  } else if (request.url === '/js/script.js') {
    response.writeHead(200, { 'Content-Type': 'application/javascript' });
    response.end(fs.readFileSync('client/js/script.js'));
  } else if (request.url === '/js/ScrollMagic.min.js') {
    response.writeHead(200, { 'Content-Type': 'application/javascript' });
    response.end(fs.readFileSync('client/js/ScrollMagic.min.js'));
  } else if (request.url === '/js/smoothscroll.js') {
    response.writeHead(200, { 'Content-Type': 'application/javascript' });
    response.end(fs.readFileSync('client/js/smoothscroll.js'));
  } else if (request.url === '/js/TweenMax.min.js') {
    response.writeHead(200, { 'Content-Type': 'application/javascript' });
    response.end(fs.readFileSync('client/js/TweenMax.min.js'));
  } else if (request.url === '/room.html') {
    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.end(fs.readFileSync('client/room.html'));
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
rooms = {};

client = {};

wss.on('connection', function (ws, request) {

  var clientID = create_UUID();
  client[clientID] = ws;

  ws.on('message', function (message) {
    console.log(message)
    var signal = JSON.parse(message);
    var room = signal.room;

    if(signal.join) {
      if (!rooms[room]) {
        rooms[room] = { 'source': clientID, 'list': new ClientList(), 'room': room };
        var source = rooms[room].list.append(clientID);
        console.log(source);
        wss.sendToClient(JSON.stringify({'setSource': true, 'id': clientID}), clientID);
      } else {
        var newNode = rooms[room].list.append(clientID);
        console.log(newNode);
        wss.sendToClient(JSON.stringify({ 'setID': true, 'id': clientID, 'prev': newNode.prev.value }), clientID);
        wss.sendToClient(JSON.stringify({ 'setNext': true, 'next': clientID }), newNode.prev.value);
      }
    } else if (signal.call || signal.sdp || signal.ice) {
      wss.sendToClient(message, signal.dest);
    }
    // Broadcast any received message to all clients
    console.log('received: %s', message);
  });

  ws.on('error', () => ws.terminate());
});

wss.sendToClient = function (data, id) {
  if (client[id].readyState === WebSocket.OPEN) {
    console.log("sending data to " + id);
    client[id].send(data);
  }
}

setInterval(() => {
  wss.clients.forEach((client) => {
    client.send(JSON.stringify(new Date().toTimeString()));
  });
}, 1000);

wss.broadcast = function (data) {
  this.clients.forEach(function (client) {
    if (client.readyState === WebSocket.OPEN) {
      console.log("sending data");
      client.send(data);
    }
  });
};

console.log('Server running.');

// ----------------------------------------------------------------------------------------

// Separate server to redirect from http to https
http.createServer(function (req, res) {
    console.log(req.headers['host']+req.url);
    res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
    res.end();
}).listen(HTTP_PORT);

function create_UUID(){
  var dt = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (dt + Math.random()*16)%16 | 0;
      dt = Math.floor(dt/16);
      return (c=='x' ? r :(r&0x3|0x8)).toString(16);
  });
  return uuid;
}
