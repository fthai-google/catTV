const express = require('express')
const app = express()
var http = require('http').Server(app)
const io = require('socket.io')(http);
var bodyParser = require('body-parser')
// const PORT = process.env.PORT || 5000;
// //Faye Stuff (websocket)
// var faye = require('faye')
// var http = require('http')
// var faye_server = new faye.NodeAdapter({mount: '/faye', timeout: 45});

// // Handle non-Bayeux requests
// var server = http.createServer(function(request, response) {
//   response.writeHead(200, {'Content-Type': 'text/plain'});
//   response.end('Hello, non-faye request');
// });

// faye_server.attach(server);
// server.listen(process.env.PORT || 8089);
// console.log('Finished firing up faye server')

//Socket.io stuff
// const server = express()
//   .use((req, res) => res.sendFile(INDEX) )
//   .listen(PORT, () => console.log(`Socket listening on ${ PORT }`))
io.on('connection', (socket) => {
  console.log('Client connected');
  socket.on('disconnect', () => console.log('Client disconnected'));
});


// parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json 
app.use(bodyParser.json())
app.use(express.static(__dirname + '/public'));
//Store all HTML files in view folder.
app.use(express.static(__dirname + '/assets'));
//Store all JS and CSS in Scripts folder.
app.get('/',function(req,res){
  res.sendFile('/index.html');
})
app.post('/new-comment', function (req, res) {
  console.log('Adding new comment')
  console.log(req.body)
  io.emit('new-comment', req.body.comment)
  // faye_server.getClient().publish('/new-comment', {comment: req.body.comment})
})
app.post('/play-video', function(req, res) {
	console.log('Attempting to play video...')
	io.emit('play-video', req.body.videoID)
	// faye_server.getClient().publish('/play-video', {videoID: req.body.videoID})
})

http.listen(process.env.PORT || 5000, function() {
	console.log('listening on :3000')
})
// app.listen(process.env.PORT || 5000, function () {
//   console.log('Example app listening on port 5000!')
// })