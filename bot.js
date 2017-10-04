// require needed modules
var express = require('express');
var app = express();
var watson = require('watson-developer-cloud');
var ConversationV1 = require('watson-developer-cloud/conversation/v1');
var socket = require('socket.io');
var bodyParser = require('body-parser')

// ────────────────────────────────────────────────────────────────────────────────
var port = process.env.PORT || 8000;
app.set('port', port);
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
// ────────────────────────────────────────────────────────────────────────────────

//set up global variables
var theInfo = "";
var reRun = false;
var myQuestion = "";
var collectedValues = [];
var passNewMessage;
var sentQuestions = "";
var newData = {}
var runIo;
var io;

// everytime watson sents back a response the question object is updated by this function
function setQuestion(sentQuestions1) {
  sentQuestions = sentQuestions1;
  newData = { message: sentQuestions };
  runIo();
}

// listen to port and promise the server 
var server = app.listen(port, function () {
  console.log(`app is running on port ${port}`);
});


// Set up socket.io
io = socket(server);
io.on('connection', function (socket) {
  console.log("socket made connection", socket.id);
  var x = 1

  // This emit is used only for watson's first message
  socket.on('start', function (data) {
  })
  do { socket.emit('start', newData); } while (x == 2)
  socket.on('chat', function (data) {
    reRun = true;
    passNewMessage(data.message);
  });
});

// this function sends back watson's response through a channel
runIo = function () { io.sockets.emit('chat', newData); }


// ────────────WATSON CONVO────────────────────────────────────────────────────────────────────
// Set up Conversation service.
var conversation = new ConversationV1({
  username: 'f55b9412-ae70-4d7f-aa15-65108e3cab1c', // replace with username from service key
  password: 'rNtonaEkcb6b', // replace with password from service key
  path: { workspace_id: '65572c75-f41d-4a25-b257-50ab9aaca64c' }, // replace with workspace ID
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
  if (response.output.action === 'display_time') {
    // User asked what time it is, so we output the local system time.
    console.log('The current time is ' + new Date().toLocaleTimeString());
  } else if (response.output.action === 'end_conversation') {
    // User said goodbye, so we're done.
    console.log(response.output.text[0]);
    endConversation = true;
  } else {
    // Display the output from dialog, if any.
    if (response.output.text.length != 0) {
      console.log(response.output.text[0]);
      // makes sure values for questions are set
      sentQuestions = response.output.text[0];
      setQuestion(sentQuestions);


      // here I collect all values entered into watson
      if (response.context.location && response.context.rooms && response.context.houseorapp && response.context.currency && response.context.residencetype) {
        collectedValues.push(response.context.location);
        collectedValues.push(response.context.houseorapp);
        collectedValues.push(response.context.residencetype);
        collectedValues.push(response.context.rooms);
        collectedValues.push(response.context.currency);
        console.log(typeof collectedValues);
        console.log("these are collected values "+ collectedValues);
      }
    }
  }


  // If we're not done, prompt for the next round of input.
  passNewMessage = function (theInfo) {
    if ((!endConversation) && reRun) {
      conversation.message({
        input: { text: theInfo },
        // Send back the context to maintain state.
        context: response.context,
      }, processResponse);
    }
  }
}


// ────────────────────────────────────────────────────────────────────────────────





