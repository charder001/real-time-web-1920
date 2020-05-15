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

*Limitations* are that you use the API in a non-abusive manner, no spamming requests or commercial use without asking for permission.

*Data* returned by the API comes in the form of JSON containing a text string with the quote and an author string containing the author of the quote.

      https://type.fit/api/quotes

      [
        {
          "text": "Genius is one percent inspiration and ninety-nine percent perspiration.",
          "author": "Thomas Edison"
        },
        {
          "text": "You can observe a lot just by watching.",
          "author": "Yogi Berra"
        },
      ]
      
This data gets sorted to only include the first 30 results, mapped to return only the text string and filtered based on what difficulty is selected.

## Data
The server keeps track of:
* userName
* score
* playerCount
* readyCount
* timer
* roomDifficulty
* APIdata
* gameStatus
* currentString


## Data life cycle
![datamodel](https://user-images.githubusercontent.com/43436118/82027049-f4d24000-9693-11ea-9998-15199d3b0dc9.png)

## Real time events
| Event        | Trigger           | Usage  |
| ------------- |:-------------:| -----:|
| connection   |  socket connects | save category to server, add player to playerCount |
| disconnect      |   socket disconnects    | playerCount decreases and sends message to client |
| playerCount | player connects/disconnects  | updates playerCount and sends message to client  |
| joinRoom | player joins a room    | send message to client  |
| ready | player presses ready button    | adds to readyCount in server |
| gamestatus | players are ready/game ends    | update game status to playing/not playing  |
| random word | game/new round starts  | generate new random string from fetch data  |
| done | player is done typing a string  | player score is increased by 1, message is sent to clients  |
| gameOver | round ends when someone wins  | stop timer, update gameStatus and generate new string  |


## To do
* Perpetual score
* Show other user progression in a more live manner
* Bug fixing



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
