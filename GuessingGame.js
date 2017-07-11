function generateWinningNumber(){
    var randomNumber=Math.floor(Math.random()*100+1);
    if(!randomNumber) {
        return 1;
    } else {
        return randomNumber;
    }
}

function shuffle(array) {
    var m = array.length, t, i;
    while (m) {
    // Pick a remaining element…
        i = Math.floor(Math.random() * m--);
    // And swap it with the current element.
        t = array[m];
        array[m] = array[i];
        array[i] = t;
    }
    return array;
}

function Game(){
    this.playersGuess=null;
    this.pastGuesses=[];
    this.winningNumber=generateWinningNumber();
}

Game.prototype.difference=function(){
    return Math.abs(this.playersGuess-this.winningNumber);
}

Game.prototype.isLower=function(){
    if(this.playersGuess<this.winningNumber){
        return true;
    } else {
        return false;
    }
}

Game.prototype.playersGuessSubmission=function(number){
    if(number < 1 || number >100 || typeof number !== "number") {
        throw "That is an invalid guess."
    }
    this.playersGuess=number;
    return this.checkGuess(number);
}

Game.prototype.checkGuess=function(){
    if (this.playersGuess===this.winningNumber){
        return "You Win!";
    } else if(this.pastGuesses.indexOf(this.playersGuess)!==-1) {
        return 'You have already guessed that number.';
    } else {
        this.pastGuesses.push(this.playersGuess);
        if(this.pastGuesses.length>=5){
            return "You Lose.";
        } else if(this.difference()<10) {
            return "You\'re burning up!";
        } else if (this.difference()<25){
            return "You\'re lukewarm."
        } else if (this.difference()<50){
            return 'You\'re a bit chilly.'
        } else {
            return 'You\'re ice cold!'
        }
    }
}

Game.prototype.provideHint=function(){
    return shuffle([this.winningNumber, generateWinningNumber(), generateWinningNumber()])
}

function newGame(){
    return new Game;
}


function inputAction(game){
    $('#explanation_ln1').text('')
    var value=Number($('#number').val());
    $('#number').val("")
    var output=game.playersGuessSubmission(value);
    $('#explanation_ln1').text(output);
    if(game.isLower()){
        $('#explanation_ln2').text('Try a higher number!');
    } else {
        $('#explanation_ln2').text('Try a lower number!');

    }
    $('#box_'+game.pastGuesses.length).text(game.pastGuesses[game.pastGuesses.length-1]);
    if(output==='You Lose.' || output=="You win!") {
        $('#explanation_ln2').text('Click the RESET button!');
        $('#submit, button_2').prop('disabled', true);
    }
}


$(document).ready(function(){
    var game= new Game();
    $('#submit').on('click', function(e){
        inputAction(game);
    });

    $('#number').on('keypress', function(event){
        if(event.which==13){
            inputAction(game);
        }
    });

    $('#button_1').on('click', function(e){
        game=new Game();
        $('.box').text("-");
        $('#explanation_ln1').text('Step right up!');
        $('#explanation_ln2').text('Guess a number between 1 and 100...');
        $('#submit, #button_2').prop('disabled', false);
    });

    $('#button_2').on('click', function(e){
        var hintsArray=game.provideHint();
        $('#explanation_ln2').text("");
        $('#explanation_ln2').text("The winning number is one of the following: "+hintsArray[0]+", "+hintsArray[1]+", or "+hintsArray[2]);
    });

});

