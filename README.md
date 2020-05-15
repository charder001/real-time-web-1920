# Real-Time Web @cmda-minor-web · 2019-2020
[Assignment 1 in wiki](https://github.com/charder001/real-time-web-1920/wiki)

# Assignment 2 - TypeFast
![rtw2](https://user-images.githubusercontent.com/43436118/82026127-98baec00-9692-11ea-8314-847b3704aed4.PNG)


## Concept
For this project, i will be creating a type-racer esque game where a random string will appear containing a quote from a quote API. Users will have to match this string as fast as possible. The winner will get points assigned to their account.

## Tech
This application is built on
* NodeJS
* Express
* type.fit API
* socket.io

## Installation
1. Open your terminal
2. Change directory to where you want to clone this repository, to the desktop for example

`cd desktop` 

3. Clone this repository

`git clone https://github.com/charder001/real-time-web-1920`

4. Change direction into the newly created file

`cd real-time-web-1920`

5. Install dependencies

`npm install`

6. Run application

`npm run`

## API
The TypeFit api is an api which consist of inspiring quotes. There isn't much in the way of documentation, authentication of guidance, but the API does what it's supposed to and is thus really easy to work with.

## Data model
![dataflow](https://user-images.githubusercontent.com/43436118/79564960-f4a04e00-80af-11ea-890a-73cb2720974a.png)

## Real time events
When a user connects, the player count goes up and the current random string gets sent. When a user disconnects, the player count goes down.

    io.on('connection', function (socket) {
    playerCount ++
    console.log("there are " + playerCount + " players")
    io.emit('random word', randomWord)
    });
    
    
    socket.on('disconnect', function () {
        console.log(`User ` + socket.username + ' disconnected');
        io.emit("user Disconnected", socket.username)
        playerCount --
        console.log("there are " + playerCount + " players")
    });
    
  When the page loads, the server also asks for a username which will be used in the chat.
  
        socket.on('username', function(username) {
        socket.username = username;
        console.log(`User ` + socket.username + ' connected');
        io.emit("user Connected", socket.username)
    });
    
The server also keeps track of scores, when a user gets a point, the server emits a message to the user AND the other clients seperately.

    socket.on('Score Up', function(score, username){
        console.log("your score = " + score )
        socket.emit("Done", score)
        socket.broadcast.emit("DoneToAll", score, username)
    })
    
When players are connected, the game will only start if everyone is in the ready state.

    socket.on('ready', function(){
        readyCount ++
        console.log(readyCount, playerCount)
        io.emit("readyCountUpdatedPlus", readyCount)
        if (readyCount == playerCount){
            playing = true
            console.log("game starting")
            setInterval(myTimer, 1000)
        } 
    })
    
 When the round is over, scores are reset and players have to ready up again.
 
     socket.on("gameOver", function(){
        console.log("end game")
        playing = false
        countdown = 20
        io.sockets.emit('timer', { countdown: countdown });
        io.emit("readyCountUpdatedMinus", readyCount)
        io.emit("endGame")
        score = 0
        readyCount = 0
    })

## To do
* Rooms
* Perpetual score
* Show other user progression in a more live manner
* Login
* Bug fixing
* More feedback



<!-- Add a link to your live demo in Github Pages 🌐-->

<!-- ☝️ replace this description with a description of your own work -->

<!-- replace the code in the /docs folder with your own, so you can showcase your work with GitHub Pages 🌍 -->

<!-- Add a nice image here at the end of the week, showing off your shiny frontend 📸 -->

<!-- Maybe a table of contents here? 📚 -->

<!-- How about a section that describes how to install this project? 🤓 -->

<!-- ...but how does one use this project? What are its features 🤔 -->

<!-- What external data source is featured in your project and what are its properties 🌠 -->

<!-- This would be a good place for your data life cycle ♻️-->

<!-- Maybe a checklist of done stuff and stuff still on your wishlist? ✅ -->

<!-- How about a license here? 📜  -->

[rubric]: https://docs.google.com/spreadsheets/d/e/2PACX-1vSd1I4ma8R5mtVMyrbp6PA2qEInWiOialK9Fr2orD3afUBqOyvTg_JaQZ6-P4YGURI-eA7PoHT8TRge/pubhtml
