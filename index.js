const app = require("express")()
const express = require("express")
const request = require('request');
const fetch = require("node-fetch");
const port = process.env.PORT || 3000
var http = require('http').createServer(app)
var io = require('socket.io')(http)
let score = 0
const words = ["Be brave, be humble, be yourself"]
let randomWord;
var playerCount = 0
var readyCount = 0
var countdown = 20;
var playing = false;




app.set("view engine", "ejs")
app.set("views", "views")
app.use(express.static("public"))

app.get('/', function (req, res) {
    fetch("https://type.fit/api/quotes")
  .then(function(response) {
    return response.json();
  })
  .then(function(data) {
    var top10 = data.sort(function(a, b) { return a.Variable1 < b.Variable1 ? 1 : -1; }).slice(0, 10);
    for(i=0; i < top10.length; i++){
    words.push(top10[i].text)
    }
    console.log(words)
  })
  .then(function(){
      console.log(words)
    res.render("home")
  }
)});

app.get('/test', function (req, res) {
    res.render("test")
});


io.on('connection', function (socket) {
    playerCount ++
    console.log("there are " + playerCount + " players")
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
    socket.on('disconnect', function () {
        console.log(`User ` + socket.username + ' disconnected');
        io.emit("user Disconnected", socket.username)
        playerCount --
        console.log("there are " + playerCount + " players")
    });
    socket.on('newRandomString', function(){
        randomize(words)
        io.emit('random word', randomWord)
        console.log(randomWord)
    })
    socket.on('ready', function(){
        readyCount ++
        console.log(readyCount, playerCount)
        io.emit("readyCountUpdatedPlus", readyCount)
        if (readyCount == playerCount){
            playing = true
            console.log("game starting")
            setInterval(myTimer, 1000)
        } 
    })
    // socket.on('unready', function(){
    //     readyCount --
    //     console.log(readyCount, playerCount)
    //     countdown = 10;
    //     io.sockets.emit('timer', { countdown: countdown });
    //     clearInterval(myTimer)
    //     io.emit("readyCountUpdatedMinus", readyCount)
    // })
    socket.on("gameOver", function(){
        console.log("end game")
        playing = false
        countdown = 20
        io.sockets.emit('timer', { countdown: countdown });
        io.emit("readyCountUpdatedMinus", readyCount)
        io.emit("endGame")
        score = 0
        readyCount = 0
    })
});

function myTimer() {
    if (playing == false){
        countdown = 20
        io.sockets.emit('timer', { countdown: countdown });
    }
    else if (playing == true){
    countdown--;
    io.sockets.emit('timer', { countdown: countdown });
    if (countdown == 0) {
        randomize(words)
        io.emit('random word', randomWord)
        console.log(randomWord)
      countdown = 20;
  }
}
};

// Generate random array index
randomize(words)

// Pick & show random word
function randomize(words) {
  randomWord = words[Math.floor(Math.random() * words.length)];
}

http.listen(port, function () {
    console.log(`Application started on port: ${port}`)
})


