// //tutorial source: https://socket.io/get-started/chat/
var humanInput = document.querySelector("input")
var score = 0
var challengeString
var socket = io();
var wordsInSentence
var width = 1;
var username = prompt('Please tell me your name');
socket.emit('username', username)

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

//   socket.on('user Disconnected', function (username) {
//     document.querySelector('#messages').insertAdjacentHTML("beforeend", `<li>${username} has disconnected</li>`);
//   });

socket.on('disconnect', function (username) {
    document.querySelector('#messages').insertAdjacentHTML("beforeend", `<li>${socket.username} has disconnected</li>`);
  });



socket.on('Done', function (score) {
  console.log(score)
  document.querySelector('#messages').insertAdjacentHTML("beforeend", `<li>You are finished</li>`);
  document.querySelector('#messages').insertAdjacentHTML("beforeend", `<li>Your score: ${score}</li>`);
});

socket.on('DoneToAll', function (score, username) {
    console.log(score)
    console.log(username)
    document.querySelector('#messages').insertAdjacentHTML("beforeend", `<li>${username} is finished</li>`);
    document.querySelector('#messages').insertAdjacentHTML("beforeend", `<li>His score: ${score}</li>`);
  });



humanInput.addEventListener("input", function (changes) {
    if (changes.target.value == challengeString) {
        score++
        console.log(score)
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





// function move() {
//     var elem = document.getElementById("myBar");
//     width++;
//     elem.style.width = width + "%";
// }
