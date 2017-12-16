//importing
var inquirer = require('inquirer');
var isLetter = require('is-letter');
var Word = require('./word.js');
var Game = require('./game.js');

require('events').EventEmitter.prototype._maxListeners = 100;


var hangman = {
  wordBank: Game.newWord.wordList,
  guessesRemaining: 10,
  //User guesses
  guessedLetters: [],
  startGame: function() {
    var that = this;
    if(this.guessedLetters.length > 0){
      this.guessedLetters = [];
    }

    inquirer.prompt([{
      name: "play",
      type: "confirm",
      message: "Ready to play?"
    }]).then(function(answer) {
      if(answer.play){
        that.newGame();
      } else{
        console.log("Okay, then! Have a good day!");
      }
    })},
  //Starts Game
  newGame: function() {
    if(this.guessesRemaining === 10) {
      console.log("Let's Start!");
      console.log('------------------');

      var randNum = Math.floor(Math.random()*this.wordBank.length);
      this.currentWord = new Word(this.wordBank[randNum]);
      this.currentWord.getLets();

      console.log(this.currentWord.wordRender());
      this.keepPromptingUser();
    } else{
      this.resetGuessesRemaining();
      this.newGame();
    }
  },
  resetGuessesRemaining: function() {
    this.guessesRemaining = 10;
  },
  keepPromptingUser : function(){
    var that = this;
    //Asks for a Letter
    inquirer.prompt([{
      name: "chosenLtr",
      type: "input",
      message: "Choose a letter:",
      validate: function(value) {
        if(isLetter(value)){
          return true;
        } else{
          return false;
        }
      }
    }]).then(function(ltr) {
      var letterReturned = (ltr.chosenLtr).toUpperCase();
      var guessedAlready = false;
        for(var i = 0; i<that.guessedLetters.length; i++){
          if(letterReturned === that.guessedLetters[i]){
            guessedAlready = true;
          }
        }
        if(guessedAlready === false){
          that.guessedLetters.push(letterReturned);

          var found = that.currentWord.checkIfLetterFound(letterReturned);
          if(found === 0){
            console.log('Nope! Guess Again.');
            that.guessesRemaining--;
            that.display++;
            console.log('Guesses remaining: ' + that.guessesRemaining);

            console.log('\n----------------');
            console.log(that.currentWord.wordRender());
            console.log('\n----------------');

            console.log("Letters guessed: " + that.guessedLetters);
          } else{
            console.log('Yes! You guessed correct!');

              if(that.currentWord.didWeFindTheWord() === true){
                console.log(that.currentWord.wordRender());
                console.log('Congratulations! You win!!!');

              } else{
                console.log('Guesses remaining: ' + that.guessesRemaining);
                console.log(that.currentWord.wordRender());
                console.log('\n----------------');
                console.log("Letters guessed: " + that.guessedLetters);
              }
          }
          if(that.guessesRemaining > 0 && that.currentWord.wordFound === false) {
            that.keepPromptingUser();
          }else if(that.guessesRemaining === 0){
            console.log('Game over!');
            console.log('The word you were guessing was: ' + that.currentWord.word);
          }
        } else{
            console.log("You've guessed that letter already. Try again.")
            that.keepPromptingUser();
          }
    });
  }
}

hangman.startGame();