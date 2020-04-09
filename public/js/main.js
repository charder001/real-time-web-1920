// //tutorial source: https://socket.io/get-started/chat/
// const currentWord = document.querySelector('#current-word');


// Pick & show random word
function showWord(words) {
  // Generate random array index
  const randIndex = Math.floor(Math.random() * words.length);
  console.log(words[randIndex])
}

  var socket = io();
  document.querySelector('form').addEventListener("submit", function (e) {
    e.preventDefault(); // prevents page reloading
    let inputText = document.querySelector("#m").value
    if (inputText.includes("Kaas")) {
    socket.emit('chat message', document.querySelector("#m").value);
    document.getElementById('m').value = "";
    } else {
      console.log("nope!")
    }
  });
  socket.on('chat message', function (msg) {
    console.log(msg)
    document.querySelector('#messages').insertAdjacentHTML("beforeend", `<li>${msg}</li>`);
  });

