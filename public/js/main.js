// //tutorial source: https://socket.io/get-started/chat/
// const currentWord = document.querySelector('#current-word');
const words = ["Kaas", "Stoomwals", "Roomboter", "Jesse Klaver"]

// Pick & show random word

  // Generate random array index
  var randomWord = words[Math.floor(Math.random() * words.length)];
  document.querySelector("#currentWord").innerHTML = randomWord


  var socket = io();
  document.querySelector('form').addEventListener("submit", function (e) {
    e.preventDefault(); // prevents page reloading
    let inputText = document.querySelector("#m").value
    if (inputText.includes(randomWord)) {
    socket.emit('chat message', document.querySelector("#m").value);
    document.getElementById('m').value = "";
    } else {
      document.querySelector('#messages').insertAdjacentHTML("beforeend", `Your sentence must include ${randomWord}!`);
    }
  });
  socket.on('chat message', function (msg) {
    console.log(msg)
    document.querySelector('#messages').insertAdjacentHTML("beforeend", `<li>${msg}</li>`);
  });

