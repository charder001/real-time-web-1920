// //tutorial source: https://socket.io/get-started/chat/
const words = ["You're gonna need a bigger boat", "nice"]
let randomWord;
var humanInput = document.querySelector("input")
var score = 0


// Generate random array index
randomize(words)

// Pick & show random word
function randomize(words) {
  randomWord = words[Math.floor(Math.random() * words.length)];
  document.querySelector("#currentWord").innerText = randomWord
}


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

var challengeString = randomWord
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
