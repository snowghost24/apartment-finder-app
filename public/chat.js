// make connection
var socket = io.connect('http://localhost:8000');
//query the Dom
var message = document.getElementById('message');
var btn = document.querySelector('#send');
var output = document.getElementById('output');
var x = 1;

// ────────────────────────────────────────────────────────────────────────────────

//Here we use this socket to pass the first message from watson 
socket.on('start',function(data){
   output.innerHTML ='<p>' + data.message+ '</p>'
})

// emit event and clear the input
btn.addEventListener('click',function () {
   socket.emit('chat', {
      message:message.value})
      message.value = "";
});

// listen for events
socket.on('chat',function(data){
   output.innerHTML ='<p>' + data.message+ '</p>'
})



