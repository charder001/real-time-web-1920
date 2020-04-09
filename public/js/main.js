// //tutorial source: https://socket.io/get-started/chat/
// var socket = io()
// const currentWord = document.querySelector('#current-word');
// const words = ["aardappel", "kaas", "stoomwals", "zeehond", "pasen"]

// // Pick & show random word
// function showWord(words) {
//   // Generate random array index
//   const randIndex = Math.floor(Math.random() * words.length);
//   console.log(words[randIndex])
// }

// var socket = io()
// document.querySelector("form").submit(function(e){
//   e.preventDefault()
//   socket.emit("chat message", document.querySelector("#m").val())
//   document.querySelector("#m").val("")
//   return false
// }) 

// socket.on("chat message", function(msg){
//   document.querySelector("#messages").append(document.querySelector("<li>").text(msg))
// })


  var socket = io();
  document.querySelector('form').addEventListener("submit", function (e) {
    e.preventDefault(); // prevents page reloading
    socket.emit('chat message', document.querySelector("#m").value);
    document.getElementById('#m').value = "";
    // return false;
  });
  socket.on('chat message', function (msg) {
    console.log(msg)
    document.querySelector('#messages').insertAdjacentHTML("afterbegin", msg);
  });

