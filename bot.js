var express = require('express');
var app = express();
var ejs = require('ejs');
var watson = require('watson-developer-cloud');
var prompt = require('prompt-sync')();
var ConversationV1 = require('watson-developer-cloud/conversation/v1');
var socket = require('socket.io');
// ────────────────────────────────────────────────────────────────────────────────
var port = process.env.PORT || 8000;
app.set('port', port);
app.use(express.static(__dirname + '/public'));
// app.set('views', __dirname + '/views');
// app.set('view engine', 'ejs');
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false}));
// app.use(bodyParser.json());


var theInfo = "";
var reRun = false;
var myQuestion = "";
var collectedValues = [];
var passNewMessage;
var sentQuestions = "";
var runLuck;
var runOne = false;
var newData = {}
function setQuestion (sentQuestions1){
  sentQuestions = sentQuestions1;
  // console.log("This is the question" + sentQuestions);
   newData = {message:sentQuestions};
  
}



// app.get('/', function (request, res) {
//   // console.log(sentQuestions);
//   console.log("im working");
//   if (sentQuestions != "" ){ 
//     console.log(sentQuestions);
//     res.render('index',{gathered:sentQuestions}); }else{
//     res.render('index');  }
// });

// app.post('/', function (req, res) {
//   // sends input values over to Watson
//   myQuestion =  req.body.entries;
//   reRun = true;
//   passNewMessage(myQuestion);
//  console.log(sentQuestions);
// });

var server = app.listen(port, function(){
  console.log(`app is running on port ${port}`);
});

//socket seßt up


var io = socket(server);
io.on('connection',function (socket) {
  console.log("socket made connection",socket.id);
// once program starts
  // socket.emit('start',newData)

// socket.on('beginning' ,function() {
//   io.sockets.emit('start',newData)
// })

// communication
socket.on('start',function(data){
console.log(" getting close"+ sentQuestions);
    io.sockets.emit('start',newData);
})


  socket.on('chat',function(data){
    console.log(newData);
    reRun = true;
    passNewMessage(data.message);
    io.sockets.emit('chat',newData);
  });
});



// ──────────────────────────────────────────────────────────────────────────────
// ────────────WATSON CONVO────────────────────────────────────────────────────────────────────
// Example 4: implements app actions.
// Set up Conversation service.

var conversation = new ConversationV1({
   username: 'f55b9412-ae70-4d7f-aa15-65108e3cab1c', // replace with username from service key
   password: 'rNtonaEkcb6b', // replace with password from service key
   path: { workspace_id: '65572c75-f41d-4a25-b257-50ab9aaca64c'}, // replace with workspace ID
   version_date: '2016-07-11'
});

// Start conversation with empty message.
conversation.message({}, processResponse);


// Process the conversation response.
function processResponse(err, response) {
  if (err) {
    console.error(err); // something went wrong
    return;
  }
  var endConversation = false;
  // Check for action flags.
  // if (response.output.action === 'display_time') {
  //   // User asked what time it is, so we output the local system time.
  //   console.log('The current time is ' + new Date().toLocaleTimeString());
  // } else if (response.output.action === 'end_conversation') {
  //   // User said goodbye, so we're done.
  //   var clapback =response.output.text[0] 
  //   console.log(" these are questions"+ clapback);
  //   endConversation = true;
  // } else {
    // Display the output from dialog, if any.
    if (response.output.text.length != 0) {
        console.log(response.output.text[0]);
        sentQuestions = response.output.text[0];
      setQuestion (sentQuestions);
        
        // here I collect all values entered into watson
        if (response.context.location && response.context.rooms && response.context.houseorapp && response.context.currency && response.context.residencetype ){
          collectedValues.push(response.context.location);
          collectedValues.push(response.context.houseorapp);
          collectedValues.push(response.context.residencetype);
          collectedValues.push(response.context.rooms);
          collectedValues.push(response.context.currency);
          console.log(collectedValues);
        }
    }
  // }

 
  // If we're not done, prompt for the next round of input.
   passNewMessage = function (theInfo){
  if ((!endConversation) && reRun) {
    var newMessageFromUser = theInfo;
    // console.log("this is a new message");
    conversation.message({
      input: { text: newMessageFromUser },
      // Send back the context to maintain state.
      context : response.context,
    }, processResponse);
    // reRun = false;
  }
}
}


// ────────────────────────────────────────────────────────────────────────────────



  

