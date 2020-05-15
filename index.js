const app = require("express")()
const express = require("express")
const request = require('request');
const fetch = require("node-fetch");
const port = process.env.PORT || 3000
const bodyParser = require('body-parser');
var http = require('http').createServer(app)
var io = require('socket.io')(http)
let score = 0
let randomWord;
var playerCount = 0
var readyCount = 0
var countdown = 20;
var playing = false;
var difficulty
var easy
var medium
var hard

app.set("view engine", "ejs")
app.set("views", "views")
app.use(express.static("public"))
app.use(bodyParser.urlencoded({
    extended: true
}));

//get home
app.get('/', function (req, res) {
    res.render("rooms")
})

//post from category form to game room
app.post('/game', function (req, res) {
    //fetch quotes from typeFit API
    fetch("https://type.fit/api/quotes")
        .then(function (response) {
            return response.json();
        })
        //get first 30 results
        .then(function (data) {
            var top30 = data.sort(function (a, b) {
                return a.Variable1 < b.Variable1 ? 1 : -1;
            }).slice(0, 30);
            //reduce JSON to text
            var APItext = top30.map(function (top30) {
                return top30.text
            })
            //filter for string length depending on difficulty
            easy = APItext.filter(function (short) {
                return short.length < 50
            })
            medium = APItext.filter(function (med) {
                return med.length < 80
            })
            hard = APItext.filter(function (long) {
                return long.length < 120
            })
        })
        .then(function () {
            res.render('game.ejs', {
                category: req.body.category
            })
        })

});

app.get('/game', function (req, res) {
    fetch("https://type.fit/api/quotes")
        .then(function (response) {
            return response.json();
        })
        .then(function () {
            res.render("rooms")
        })
});

io.on('connection', function (socket) {
    socket.on("create", function (category) {
        socket.join(category);
        io.to(category).emit("gameStatus", playing)
        playerCount++
        io.to(category).emit("playerCountUpdatedPlus", playerCount)
        console.log("there are " + playerCount + " players")
        //send the random string to a user if they join in progress
        if (playing == true) {
            socket.to(category).emit('random word', randomWord)
        }
        socket.on('Score Up', function (score, username) {
            console.log("your score = " + score)
            socket.emit("Done", score)
            socket.to(category).emit("DoneToAll", score, username)
        })
        socket.on('joinRoom', function (username) {
            socket.username = username;
            console.log(`User ` + socket.username + ' connected');
            socket.to(category).emit("user Connected", socket.username)
            socket.emit("you Connected")
        });
        socket.on('disconnect', function () {
            console.log(`User ` + socket.username + ' disconnected');
            io.to(category).emit("user Disconnected", socket.username)
            playerCount--
            io.to(category).emit("playerCountUpdatedMinus", playerCount)
            if (playerCount == 0 && playing == true) {
                console.log("end game")
                playing = false
                io.to(category).emit("gameStatus", playing)
                countdown = 20
                io.sockets.to(category).emit('timer', {
                    countdown: countdown
                });
                io.sockets.to(category).emit("gameToggle")
                io.to(category).emit("readyCountUpdatedMinus", readyCount)
                io.to(category).emit("endGame")
                readyCount = 0
            }
            console.log("there are " + playerCount + " players")
        });
        socket.on('ready', function () {
            readyCount++
            console.log(readyCount, playerCount)
            io.to(category).emit("readyCountUpdatedPlus", readyCount)
            if (readyCount == playerCount) {
                score = 0
                if (category == "easy") {
                    randomize(easy)
                } else if (category == "medium") {
                    randomize(medium)
                } else if (category == "hard") {
                    randomize(hard)
                }
                io.to(category).emit('random word', randomWord)
                playing = true
                io.to(category).emit("gameStatus", playing)
                io.sockets.to(category).emit("gameToggle")
                console.log("game starting")
                var timer = setInterval(myTimer, 1000)

                function myTimer() {
                    if (playing == false) {
                        countdown = 20
                        clearInterval(timer)
                        io.sockets.to(category).emit('timer', {
                            countdown: countdown
                        });
                    } else if (playing == true) {
                        countdown--;
                        io.sockets.emit('timer', {
                            countdown: countdown
                        });
                        if (countdown == 0) {

                            if (category == "easy") {
                                randomize(easy)
                            } else if (category == "medium") {
                                randomize(medium)
                            } else if (category == "hard") {
                                randomize(hard)
                            }
                            io.to(category).emit('random word', randomWord)
                            console.log(randomWord)
                            countdown = 20;
                        }
                    }
                };
            }
        })
        socket.on("gameOver", function (username) {
            console.log("end game")
            playing = false
            io.to(category).emit("gameStatus", playing)
            countdown = 20
            io.sockets.to(category).emit('timer', {
                countdown: countdown
            });
            io.sockets.to(category).emit("gameToggle")
            io.to(category).emit("endGame", username, score)
            score = 0
            readyCount = 0
            io.to(category).emit("readyCountUpdatedMinus", readyCount)
        })
    })


});



// Pick & show random word
function randomize(difficulty) {
    randomWord = difficulty[Math.floor(Math.random() * difficulty.length)];
}

http.listen(port, function () {
    console.log(`Application started on port: ${port}`)
})
