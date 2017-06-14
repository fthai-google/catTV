const express = require('express')
var bodyParser = require('body-parser')

//Faye Stuff (websocket)
var faye = require('faye')
var http = require('http')
var faye_server = new faye.NodeAdapter({mount: '/faye', timeout: 45});

// Handle non-Bayeux requests
var server = http.createServer(function(request, response) {
  response.writeHead(200, {'Content-Type': 'text/plain'});
  response.end('Hello, non-faye request');
});

faye_server.attach(server);
server.listen(process.env.PORT || 8089);
console.log('Finished firing up faye server')
const app = express()

 
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
  faye_server.getClient().publish('/new-comment', {comment: req.body.comment})
})
app.post('/play-video', function(req, res) {
	console.log('Attempting to play video...')
	faye_server.getClient().publish('/play-video', {videoID: req.body.videoID})
})

app.listen(process.env.PORT || 5000, function () {
  console.log('Example app listening on port 5000!')
})