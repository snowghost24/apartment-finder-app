// make connection
var socket = io.connect('http://localhost:8000');
//query Dom
var message = document.getElementById('message');
var handle = document.getElementById('handle');
var btn = document.getElementById('send');
var output = document.getElementById('output');
var outputer = document.getElementById('outputer');
console.log(message);
console.log(handle);
// initial message
var x = 1;

do {
getData();
}
while (x == 0);

function getData(){
   console.log("I'm trying ");
   socket.emit('start', {
      message:"see if it made it"
   })
}
  


socket.on('start',function(data){
   output.innerHTML ='<p>' + data.message+ '</p>'
})

// ────────────────────────────────────────────────────────────────────────────────

// emit event
btn.addEventListener('click',function () {
   socket.emit('chat', {
      message:message.value
   })
});

// listen for events
socket.on('chat',function(data){
   output.innerHTML ='<p>' + data.message+ '</p>'
})


