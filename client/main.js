// Testing peer data connection broadcasts in an isolated environment. 

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
console.log('most updated version');
// Start user
var peer = new Peer({ key: 'lwjd5qra8257b9', debug: 0});

const getMyId = () => new Promise((resolve, reject) => {
  peer.on('open', resolve);
  peer.on('error', reject);
});

var peerId; 

const establishPeerConnection = (sourceId) => new Promise((resolve, reject) => {
  const connect = () => {
    if (sourceId) {
      const conn = peer.connect(sourceid, { reliable: true });

      conn.on('open', () => {
        console.log('RTC data connection established - acting as receiver');
        resolve(conn);
      });

      conn.on('error', (error) => {
        reject(error);
      });
    } else {
      peer.on('connection', (conn) => {
        conn.on('open', () => {
          console.log('RTC data connection established - acting as source');
          resolve(conn);
        });
      });
      peer.on('error', (error) => {
        reject(error);
      });
    }
  };

  if (peer.disconnected) {
    peer.on('open', connect);
    peer.on('error', reject);
  } else {
    connect();
  }
});

peer.on('open', function(){
  $('#mypeerid').append("Your peer id: " + peer.id);
  peerId = peer.id;
});
peer.on('call', function(call){
  console.log("Call received");
  // Answer the call automatically (instead of prompting user) for demo purposes
  call.answer(window.localStream);
  processCall(call);
});
peer.on('error', function(err){
  console.log(err.message);
});
 
 
$(function(){
  $('#call').bind('click', callPeer);
  getLocalVideo();
});
 
// Call/Video Management
function getLocalVideo() {
  navigator.getUserMedia({audio: true, video: true}, function(stream){
    console.log("Local video streaming");
    $('#videos').append("<video id='" + peer.id + "' autoplay></video>");
    $('#' + peer.id).prop('src', URL.createObjectURL(stream));
    window.localStream = stream;
  }, function(){ alert('Cannot connect to webcam. Allow access.') });
}
 
function callPeer() {
  console.log("Calling peer");
  var call = peer.call($('#remotepeerid').val(), window.localStream);
  processCall(call);
}
 
function processCall(call) {
  // Hang up on an existing call if present
  // if (window.existingCall) {
  //   window.existingCall.close();
  // }
 
  // Wait for stream on the call, then set peer video display
  call.on('stream', function(remoteStream){
    console.log("Adding video from " + call.peer);
    $('#videos').append("<video id='" + call.peer + "' autoplay>");
    $('#' + call.peer).prop('src', URL.createObjectURL(remoteStream));
  });
 
  // UI stuff
  window.existingCall = call;
  //document.getElementById('their-id').text(call.peer);
  //call.on('close', prepareDebateScreen);
}
 
function endCall() {
  window.existingCall.close();
  step2();
}
 
function retry() {
  console.log('Retry...');
}