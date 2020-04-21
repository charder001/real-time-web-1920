const app = require("express")()
const express = require("express")
const port = process.env.PORT || 3000
var http = require('http').createServer(app)
var io = require('socket.io')(http)
let score = 0

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
    console.log('a user connected');
    socket.on('chat message', function (msg) {
        console.log('message: ' + msg);
        io.emit('chat message', msg);
    });
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
    socket.on('Score Up', function(score){
        console.log("your score = " + score )
    })
});

http.listen(port, function () {
    console.log(`Application started on port: ${port}`)
})