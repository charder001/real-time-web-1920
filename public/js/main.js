// //tutorial source: https://socket.io/get-started/chat/
// const currentWord = document.querySelector('#current-word');
const words = ["kaas", "stoomwals", "roomboter", "Jesse Klaver", "peulvruchten", "otter", "papiersnee"]
let randomWord;
// Pick & show random word

// Generate random array index
randomize(words)

function randomize(words) {
  randomWord = words[Math.floor(Math.random() * words.length)];
  document.querySelector("#currentWord").innerText = randomWord
}


var socket = io();
document.querySelector('form').addEventListener("submit", function (e) {
  e.preventDefault(); // prevents page reloading
  let inputText = document.querySelector("#m").value
  if (inputText.includes(randomWord)) {
    socket.emit('chat message', document.querySelector("#m").value);
    document.getElementById('m').value = "";
    randomize(words)
  } else {
    document.querySelector('#messages').insertAdjacentHTML("beforeend", `<li class="serverMessage">Your sentence must include ${randomWord}!</li>`);
  }
});
socket.on('chat message', function (msg) {
  console.log(msg)
  document.querySelector('#messages').insertAdjacentHTML("beforeend", `<li>${msg}</li>`);
});
