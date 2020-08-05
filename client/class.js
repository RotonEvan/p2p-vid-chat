// Generate random room name if needed
if (!location.hash) {
    location.hash = Math.floor(Math.random() * 0xFFFFFF).toString(16);
}
const roomHash = location.hash.substring(1);

var localUUID;
var localName;
var isSource = false;
var prevUUID;
var nextUUID;

var peerConnections = {};

var serverConnection;

var localStream;
var localVideo;
var constraints = {};

var hostStream;

function start() {

    //setting localName
    var urlParams = new URLSearchParams(window.location.search);
    localName = urlParams.get('displayName') || prompt('Enter your name', '');

    constraints = {
        video: {
            width: {ideal: 320},
            height: {ideal: 240},
            frameRate: {ideal: 20}
        },
        audio: {
            googEchoCancellation: true,
            googAutoGainControl: true,
            googNoiseSuppression: true,
            googHighpassFilter: true,
            googEchoCancellation2: true,
            googAutoGainControl2: true,
            googNoiseSuppression2: true
        }
    }

    serverConnection = new WebSocket('wss://' + location.host);
    serverConnection.onmessage = receivedMessage;
    serverConnection.onopen = event => {
        serverConnection.send(JSON.stringify({ 'join': true, 'room': roomHash }));
    }
}

function receivedMessage(message) {
    var signal = JSON.parse(message.data);
    
    if (signal.setSource) {
        isSource = true;
        localUUID = signal.id;

        if (navigator.mediaDevices.getUserMedia) {
            console.log("local video");
            navigator.mediaDevices.getUserMedia(constraints)
                .then(stream => {
                    console.log("source stream");
                    localStream = stream;
                    document.getElementById('localVideo').srcObject = stream;
                    localVideo = document.getElementById('localVideo');
                }).catch(errorHandler);
        }
    }
    if (signal.setID) {
        localUUID = signal.id;
        prevUUID = signal.prev;
    }
    if (signal.setNext) {
        nextUUID = signal.next;
        if (isSource) {
            setUpPeer(nextUUID);
            serverConnection.send(JSON.stringify({ 'call': true, 'room': roomHash, 'dest': nextUUID, 'from': localUUID }));
        }
    }
    if (signal.call && signal.dest == localUUID) {
        setUpPeer(signal.from, true);
    }
    else if (signal.sdp) {
        var peer = signal.uuid;
        console.log(`sdp: ${peer}`);
        peerConnections[peer].pc.setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(function () {
            // Only create answers in response to offers
            if (signal.sdp.type == 'offer') {
              peerConnections[peerUuid].pc.createAnswer().then(description => createdDescription(description, peerUuid)).catch(errorHandler);
            }
        }).catch(errorHandler);
    }
    else if (signal.ice) {
        var peer = signal.uuid;
        console.log(`ice: ${peer}`);
        peerConnections[peer].pc.addIceCandidate(new RTCIceCandidate(signal.ice)).catch(errorHandler);
    }
}

function setUpPeer(peerUuid, initCall = false) {
    peerConnections[peerUuid] = { 'id': peerUuid, 'pc': new RTCPeerConnection(peerConnectionConfig) };
    peerConnections[peerUuid].pc.onicecandidate = event => gotIceCandidate(event, peerUuid);
    peerConnections[peerUuid].pc.ontrack = event => gotRemoteStream(event, peerUuid);
    peerConnections[peerUuid].pc.oniceconnectionstatechange = event => checkPeerDisconnect(event, peerUuid);
    if (isSource) {
        localStream.getTracks().forEach(t => {
            peerConnections[peerUuid].pc.addTrack(t, localStream);
        });
        // peerConnections[peerUuid].pc.addStream(localStream);
    }
    else {
        hostStream.getTracks().forEach(t => {
            peerConnections[peerUuid].pc.addTrack(t, hostStream);
        });
    }

    if (initCall) {
      console.log(`call inititated: ${peerUuid} to ${localUuid}`);
      peerConnections[peerUuid].pc.createOffer({iceRestart: true}).then(description => createdDescription(description, peerUuid)).catch(errorHandler);
    }
}

function gotIceCandidate(event, peerUuid) {
    if (event.candidate != null) {
        serverConnection.send(JSON.stringify({ 'ice': event.candidate, 'uuid': localUUID, 'dest': peerUuid }));
    }
}
  
function createdDescription(description, peerUuid) {
    console.log(`got description, peer ${peerUuid}`);
    peerConnections[peerUuid].pc.setLocalDescription(description).then(function () {
        serverConnection.send(JSON.stringify({ 'sdp': peerConnections[peerUuid].pc.localDescription, 'uuid': localUUID, 'dest': peerUuid }));
    }).catch(errorHandler);
}

function gotRemoteStream(event, peerUuid) {
    var videle = document.getElementById('remoteVideo_'+peerUuid);
    if(videle==null)
    {
        console.log(`got remote stream, peer ${peerUuid}`);
        //assign stream to new HTML video element
        var vidElement = document.createElement('video');
        vidElement.setAttribute('autoplay', '');
        vidElement.setAttribute('muted', '');
        vidElement.srcObject = event.streams[0];

        var vidContainer = document.createElement('div');
        vidContainer.setAttribute('id', 'remoteVideo_' + peerUuid);
        vidContainer.setAttribute('class', 'videoContainer');
        vidContainer.appendChild(vidElement);
        // vidContainer.appendChild(makeLabel(peerConnections[peerUuid].displayName));
        // vidContainer.appendChild(makeAudioLabel(peerConnections[peerUuid].isMute));

        document.getElementById('videos').appendChild(vidContainer);

        updateLayout();
    }
}

function checkPeerDisconnect(event, peerUuid) {
    var state = peerConnections[peerUuid].pc.iceConnectionState;
    console.log(`connection with peer ${peerUuid} ${state}`);
    if (state === "failed" || state === "closed") {
        delete peerConnections[peerUuid];
        document.getElementById('videos').removeChild(document.getElementById('remoteVideo_' + peerUuid));
        updateLayout();
    }
}

function updateLayout() {
    // update CSS grid based on number of diplayed videos
    var rowHeight = '98vh';
    var colWidth = '98vw';
  
    var numVideos = Object.keys(peerConnections).length + 1; // add one to include local video
  
    if(numVideos == 1)
    {
      var rowHeight = '92vh';
      var colWidth = '99.7vw';
      var rowHeightMob = '92vh';
      var colWidthMob = '99.7vw';
    }
    else if(numVideos == 2)
    {
      var rowHeight = '92vh';
      var colWidth = '49vw';
      var rowHeightMob = '46vh';
      var colWidthMob = '99.7vw';
    }
    else if(numVideos > 2 && numVideos < 5)
    {
      var rowHeight = '45vh';
      var colWidth = '49vw';
      var rowHeightMob = '45vh';
      var colWidthMob = '49vw';
    }
    else if(numVideos > 4 && numVideos < 7)
    {
      var rowHeight = '45.8vh';
      var colWidth = '33.1vw';
      var rowHeightMob = '30.9vh';
      var colWidthMob = '49vw';
    }
    else if(numVideos > 6 && numVideos < 10)
    {
      var rowHeight = '30.5vh';
      var colWidth = '33.1vw';
      var rowHeightMob = '22.9vh';
      var colWidthMob = '49vw';
    }
    else if(numVideos > 9 && numVideos < 13)
    {
      var rowHeight = '30.5vh';
      var colWidth = '24.79vw';
      var rowHeightMob = '18.5vh';
      var colWidthMob = '49vw';
    }
    else if(numVideos > 12 && numVideos < 17)
    {
      var rowHeight = '22.8vh';
      var colWidth = '24.79vw';
      var rowHeightMob = '18.5vh';
      var colWidthMob = '49vw';
    }
    else if(numVideos > 16 && numVideos < 21)
    {
      var rowHeight = '22.8vh';
      var colWidth = '19.74vw';
      var rowHeightMob = '18.5vh';
      var colWidthMob = '49vw';
    }
    else if(numVideos > 20)
    {
      var rowHeight = '22.8vh';
      var colWidth = '16.46vw';
      var rowHeightMob = '18.5vh';
      var colWidthMob = '49vw';
    }
      document.documentElement.style.setProperty(`--rowHeight`, rowHeight);
      document.documentElement.style.setProperty(`--colWidth`, colWidth);
      document.documentElement.style.setProperty(`--rowHeightMob`, rowHeightMob);
      document.documentElement.style.setProperty(`--colWidthMob`, colWidthMob);
  
}

function errorHandler(error) {
    console.log(error);
}