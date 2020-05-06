const app = require("express")()
const express = require("express")
const port = process.env.PORT || 3000
var http = require('http').createServer(app)
var io = require('socket.io')(http)
let score = 0
const words = ["You're gonna need a bigger boat", "How nice of you"]
let randomWord;

app.set("view engine", "ejs")
app.set("views", "views")

app.use(express.static("public"))

app.get('/', function (req, res) {
    res.render("home")
});

app.get('/test', function (req, res) {
    res.render("test")
});


io.on('connection', function (socket) {
    io.emit('random word', randomWord)
    socket.on('chat message', function (msg) {
        console.log('message: ' + msg);
        io.emit('chat message', msg);
    });
    socket.on('Score Up', function(score, username){
        console.log("your score = " + score )
        socket.emit("Done", score)
        socket.broadcast.emit("DoneToAll", score, username)
    })
    socket.on('username', function(username) {
        socket.username = username;
        console.log(`User ` + socket.username + ' connected');
        io.emit("user Connected", socket.username)
    });
    socket.on('disconnect', function (username) {
        socket.username = username;
        console.log(`User ` + socket.username + ' disconnected');
        io.emit("user Disconnected", socket.username)
    });
});



// Generate random array index
randomize(words)

// Pick & show random word
function randomize(words) {
  randomWord = words[Math.floor(Math.random() * words.length)];
}

http.listen(port, function () {
    console.log(`Application started on port: ${port}`)
})