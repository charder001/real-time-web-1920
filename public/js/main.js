// //tutorial source: https://socket.io/get-started/chat/
var humanInput = document.querySelector("input")
var score = 0
var challengeString
var socket = io();
var wordsInSentence
var width = 1;
roomName = document.getElementById("roomName").innerText;
console.log(roomName)
socket.emit('create', roomName)
var username = prompt('Please tell me your name');
if (username == null) {
    username = "Anonymous"
}
var display = document.querySelector('#time');
socket.emit('username', username)
socket.emit("joinRoom", username)

socket.on('random word', function (randomWord) {
    console.log(randomWord)
    document.querySelector('#currentWord').innerText = randomWord
    challengeString = randomWord
    wordsInSentence = challengeString.split(' ').length
    console.log(wordsInSentence)
});

socket.on('user Connected', function (username) {
    console.log(username)
    document.querySelector('#messages').insertAdjacentHTML("beforeend", `<li>${username} has connected</li>`);
});

socket.on('you Connected', function () {
    document.querySelector('#messages').insertAdjacentHTML("beforeend", `<li>You connected</li>`);
});

socket.on('user Disconnected', function (usernamed) {
    document.querySelector('#messages').insertAdjacentHTML("beforeend", `<li>${usernamed} has disconnected</li>`);
});


socket.on('Done', function (score) {
    console.log(score)
    document.querySelector('#messages').insertAdjacentHTML("beforeend", `<li>Your score: ${score}</li>`)
    if (score == 4) {
        socket.emit("gameOver", username, score)

    };
});

socket.on("endGame", function (username, score) {
    document.querySelector('#messages').insertAdjacentHTML("beforeend", `<li>${username} has won!</li>`);
    document.querySelector('#messages').insertAdjacentHTML("beforeend", `<li>Press ready to start the next round</li>`);
    score = 0
    readyButton.style.display = 'block';
})

socket.on('DoneToAll', function (score, username) {
    console.log(score)
    console.log(username)
    document.querySelector('#messages').insertAdjacentHTML("beforeend", `<li>${username} score: ${score}</li>`);
});

var HTMLreadyCount = document.querySelector("#readyCount")
socket.on("readyCountUpdatedPlus", function (readyCount) {
    HTMLreadyCount.innerText = readyCount
})


socket.on("readyCountUpdatedMinus", function (readyCount) {
    HTMLreadyCount.innerText = readyCount
})

var HTMLplayerCount = document.querySelector("#playerCount")
socket.on("playerCountUpdatedPlus", function (playerCount) {
    HTMLplayerCount.innerText = playerCount
})

socket.on("playerCountUpdatedMinus", function (playerCount) {
    HTMLplayerCount.innerText = playerCount
})




//check input
humanInput.addEventListener("input", function (changes) {
    if (changes.target.value == challengeString) {
        score++
        console.log(score)
        document.querySelector("#typeField").reset()
        socket.emit('Score Up', score, username);
    } else if (changes.target.value && changes.target.value.length !== 0) {
        var currentHumanInput = changes.target.value;
        for (var index = 0; index < currentHumanInput.length; index++) {
            if (currentHumanInput[index] !==
                challengeString[index]) {
                humanInput.classList.remove("correct")
                humanInput.classList.add("incorrect")
                console.log(changes.target.value)
                console.log(challengeString)
                console.log("false")
            } else if (currentHumanInput[index] ===
                challengeString[index]) {
                humanInput.classList.remove("incorrect")
                humanInput.classList.add("correct")
                console.log("True")
            }
        }
    }
})


var readyButton = document.querySelector("#readyButton")
readyButton.addEventListener("click", function () {
    console.log(readyButton.innerText)
    if (readyButton.innerText == "ready") {
        socket.emit('ready')
        readyButton.style.display = 'none';
    }
})

socket.on('timer', function (data) {
    document.querySelector('#counter').innerHTML = data.countdown;
});

// socket.on("gameToggle", function(){
//     document.querySelector("#m").toggleAttribute("readonly")
//     document.querySelector().classList.toggle("invisible")
// })

socket.on("gameStatus", function (playing) {
    console.log(playing)
    if (playing == true) {
        document.querySelector("#m").readOnly = false
        document.querySelector("#playerOverview").classList.add("invisible")
    } else if (playing == false) {
        document.querySelector("#m").readOnly = true
        document.querySelector("#playerOverview").classList.remove("invisible")
        score = 0
    }
})