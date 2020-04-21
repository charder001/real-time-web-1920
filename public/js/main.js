// //tutorial source: https://socket.io/get-started/chat/
var humanInput = document.querySelector("input")
var score = 0
var challengeString
var socket = io();
// document.querySelector('form').addEventListener("submit", function (e) {
//   e.preventDefault(); // prevents page reloading
//   let inputText = document.querySelector("#m").value
//   if (inputText.includes(randomWord)) {
//     socket.emit('chat message', document.querySelector("#m").value);
//     document.getElementById('m').value = "";
//     randomize(words)
//   } else {
//     document.querySelector('#messages').insertAdjacentHTML("beforeend", `<li class="serverMessage">Your sentence must include ${randomWord}!</li>`);
//   }
// });
// socket.on('chat message', function (msg) {
//   console.log(msg)
//   document.querySelector('#messages').insertAdjacentHTML("beforeend", `<li>${msg}</li>`);
// });

socket.on('random word', function (randomWord) {
  console.log(randomWord)
  document.querySelector('#currentWord').innerText = randomWord
  challengeString = randomWord
});


humanInput.addEventListener("input", function (changes) {
    if (changes.target.value == challengeString) {
        score++
        console.log(score)
        socket.emit('Score Up', score);
    }
    else if (changes.target.value && changes.target.value.length !== 0) {
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
