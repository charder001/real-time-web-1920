const app = require("express")()
const express = require("express")
const request = require('request');
const fetch = require("node-fetch");
const port = process.env.PORT || 3000
const bodyParser = require('body-parser');
var http = require('http').createServer(app)
var io = require('socket.io')(http)
let score = 0
// const words = ["Be brave, be humble, be yourself"]
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

app.get('/', function (req, res) {
    res.render("rooms")
})

app.post('/game', function (req, res) {
    fetch("https://type.fit/api/quotes")
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            var top30 = data.sort(function (a, b) {
                return a.Variable1 < b.Variable1 ? 1 : -1;
            }).slice(0, 30);
            // for (i = 0; i < top30.length; i++) {
            //     words.push(top30[i].text)
            // }
            var APItext = top30.map(function (top30) {
                return top30.text
            })
            // console.log(APItext)
            // function easy(APItext){
            //     return APItext.length < 5
            // }
            easy = APItext.filter(function (short) {
                return short.length < 60
            })
            console.log(easy)
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
            res.render("game")
        })
});

app.get('/test', function (req, res) {
    res.render("test")
});


io.on('connection', function (socket) {
    socket.on("create", function (category) {
        socket.join(category);
        console.log(category) // Generate random array index
        if (category == "easy") {
            randomize(easy)
        }

        console.log(randomWord)
        io.to(category).emit("gameStatus", playing)
        playerCount++
        io.to(category).emit("playerCountUpdatedPlus", playerCount)
        console.log("there are " + playerCount + " players")
        io.to(category).emit('random word', randomWord)
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
            if (category == "easy") {
                randomize(easy)
            }
            io.to(category).emit('random word', randomWord)
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
