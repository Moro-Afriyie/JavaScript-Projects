//challenge 1: Your age in days
let clickMe = document.querySelector(".btn-primary");
let reset = document.querySelector(".btn-danger");

clickMe.addEventListener('click', function(e) {
    let birthYear = prompt('Enter your birth Year');
    let date = new Date();
    //date.getFullYear() gets the current year
    let AgeInDays = (date.getFullYear() - birthYear) * 365;
    var h1 = document.createElement('h1'); // creates a html tag 
    var textAnswer = document.createTextNode("You are " + AgeInDays + " days old"); //creates a text in the h1 tag  created
    h1.setAttribute('id', 'AgeInDays'); //gives it and id="AgeInDays"
    h1.appendChild(textAnswer); //adds the text to the h1
    document.querySelector('.flex-box-result').appendChild(h1); // adds the h1 to the div 
});

reset.addEventListener('click', function(e) {
    //removes the text when the reset button is clicked
    document.getElementById('AgeInDays').remove();

});


/*************challenge 2: Cat Generator *********/
function GenerateCat() {
    var image = document.createElement('img');
    image.src = "https://cdn2.thecatapi.com/images/81b.gif";
    document.querySelector('.flex-box-container-2').appendChild(image);

}

/**************challenge 3: Rock, Paper,  Scissors  */
function RPSGame(option) {
    var humanChoice, botChoice;
    let rps = ['rock', 'paper', 'scissors'];
    botChoice = rps[Math.floor(Math.random() * 3)];
    humanChoice = option.id;
    message = finalMessage(humanChoice, botChoice);
    rpsFrontEnd(option.id, botChoice, message);

}


function finalMessage(humanChoice, botChoice) {
    if (humanChoice === botChoice) {
        return { 'message': "You tied!", 'color': 'yellow' };
    } else if (humanChoice === 'rock' && botChoice == 'scissors') {
        return { 'message': "You won!", 'color': 'green' };
    } else if (humanChoice === 'paper' && botChoice == 'rock') {
        return { 'message': "You won!", 'color': 'green' };
    } else if (humanChoice === 'scissors' && botChoice == 'paper') {
        return { 'message': "You won!", 'color': 'green' };
    } else {
        return { 'message': "You Lost!", 'color': 'red' };
    }
}


function rpsFrontEnd(humanImageChoice, botImageChoice, finalMessage) {
    var imagesDatabase = {
            'rock': document.getElementById('rock').src,
            'paper': document.getElementById('paper').src,
            'scissors': document.getElementById('scissors').src,
        }
        // remove all the images
    document.getElementById('rock').remove();
    document.getElementById('paper').remove();
    document.getElementById('scissors').remove();

    //show only the images that has been clicked on
    //create divs for the respective element
    var humanDiv = document.createElement('div');
    var botDiv = document.createElement('div');
    var messageDiv = document.createElement('div');

    humanDiv.innerHTML = "<img  src='" + imagesDatabase[humanImageChoice] + "' width=20% style='box-shadow: 0px 10px 50px rgba(37, 50, 233, 1);'>";
    document.getElementById('flex-box-rps-div').appendChild(humanDiv);

    messageDiv.innerHTML = "<h1 style='color: " + finalMessage['color'] + "; font-size: 60px; padding: 30px;'>" + finalMessage['message'] + "</h1>";
    document.getElementById('flex-box-rps-div').appendChild(messageDiv);

    botDiv.innerHTML = "<img  src='" + imagesDatabase[botImageChoice] + "' width=20% style='box-shadow: 0px 10px 50px rgba(243, 38, 24, 1);'>";
    document.getElementById('flex-box-rps-div').appendChild(botDiv);


}

/**Challenge 4: Change the Color of All Buttons*/
let all_buttons = document.querySelectorAll('.btn');

let copyAllButtons = [];
for (let i = 0; i < all_buttons.length; i++) {
    copyAllButtons.push(all_buttons[i].classList[1]);
}


function buttonColorChange(buttonColor) {
    if (buttonColor.value === 'red') {
        buttonRed();
    } else if (buttonColor.value === 'green') {
        buttonGreen();
    } else if (buttonColor.value === 'reset') {
        buttonColorReset();
    } else if (buttonColor.value === 'random') {
        randomcolors();
    }
}

function buttonRed() {
    for (let i = 0; i < all_buttons.length; i++) {
        all_buttons[i].classList.remove(all_buttons[i].classList[1]);
        all_buttons[i].classList.add('btn-danger');
    }
}

function buttonGreen() {
    for (let i = 0; i < all_buttons.length; i++) {
        all_buttons[i].classList.remove(all_buttons[i].classList[1]);
        all_buttons[i].classList.add('btn-success');
    }
}

function buttonColorReset() {
    for (let i = 0; i < all_buttons.length; i++) {
        all_buttons[i].classList.remove(all_buttons[i].classList[1]);
        all_buttons[i].classList.add(copyAllButtons[i]);
    }
}

function randomcolors() {
    var choices = ['btn-primary', 'btn-danger', 'btn-success', 'btn-warning'];

    for (let i = 0; i < all_buttons.length; i++) {
        var RandomColor = choices[Math.floor(Math.random() * 4)];
        all_buttons[i].classList.remove(all_buttons[i].classList[1]);
        all_buttons[i].classList.add(RandomColor);
    }
}



/********************Challenge 5: BlackJack Game */

var blackjackGame = {
    'you': { 'scorespan': '#your-blackjack-result', 'div': '.your-box', 'score': 0 },
    'dealer': { 'scorespan': '#dealer-blackjack-result', 'div': '.dealer-box', 'score': 0 },
    'cards': ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'K', 'J', 'Q', 'A'],
    'cardsMap': { '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'K': 10, 'J': 10, 'Q': 10, 'A': [1, 11] },
    'wins': 0,
    'losses': 0,
    'draws': 0,
    'isStand': false, //stand button
    'turnsOver': false, //after both hit and stands over are done and we can now press deal


}

const YOU = blackjackGame['you'];
const DEALER = blackjackGame['dealer'];


//get the audios
const hitSound = new Audio('static/sounds/swish.m4a');
const winSound = new Audio('static/sounds/cash.mp3');
const lossSound = new Audio('static/sounds/aww.mp3');
document.querySelector('#blackjack-hit-button').addEventListener('click', blackJackHit); //event listeners to the respective buttons
document.querySelector('#blackjack-stand-button').addEventListener('click', dealerLogic);
document.querySelector('#blackjack-deal-button').addEventListener('click', blackJackDeal);


function blackJackHit() {
    //check if the stand button isn't pressed
    if (blackjackGame['isStand'] === false) {
        let card = radomCard()
        showCard(YOU, card);
        updateScore(card, YOU);
        showScore(YOU);

    }
}

function showCard(activePlayer, card) {
    if (activePlayer['score'] <= 21) {
        let cardImage = document.createElement('img'); //create an image element
        cardImage.src = "static/images/" + card + ".png"; //add the source
        document.querySelector(activePlayer['div']).appendChild(cardImage); //add it to the div
        hitSound.play();
    }
}

function blackJackDeal() {
    if (blackjackGame['turnsOver'] === true) {

        blackjackGame['isStand'] = false;

        let YourImages = document.querySelector('.your-box').querySelectorAll('img');
        let DealerImages = document.querySelector('.dealer-box').querySelectorAll('img');
        //remove all the images when the user clicks on the deal button
        for (let i = 0; i < YourImages.length; i++) {
            YourImages[i].remove();
        }
        for (let i = 0; i < DealerImages.length; i++) {
            DealerImages[i].remove();
        }
        YOU['score'] = 0;
        DEALER['score'] = 0;
        document.querySelector('#your-blackjack-result').textContent = 0;
        document.querySelector('#dealer-blackjack-result').textContent = 0;

        document.querySelector('#your-blackjack-result').style.color = '#ffffff';
        document.querySelector('#dealer-blackjack-result').style.color = '#ffffff';

        document.querySelector('#blackjack-result').textContent = "Let's play";
        document.querySelector('#blackjack-result').style.color = 'black';
        blackjackGame['turnsOver'] === true;
    }


}

function radomCard() {
    let randomIndex = Math.floor(Math.random() * 13);
    return blackjackGame['cards'][randomIndex];
}

function updateScore(card, activePlayer) {
    //if adding 11 keeps the number below 21, add 11 else add 1;
    if (card === 'A') {
        if (activePlayer['score'] + blackjackGame['cardsMap'][card][1] <= 21) {
            activePlayer['score'] += blackjackGame['cardsMap'][card][1];
        } else {
            activePlayer['score'] += blackjackGame['cardsMap'][card][0];
        }
    } else {
        activePlayer['score'] += blackjackGame['cardsMap'][card];
    }



}

function showScore(activePlayer) {
    if (activePlayer['score'] > 21) {
        document.querySelector(activePlayer['scorespan']).textContent = "BUST!";
        document.querySelector(activePlayer['scorespan']).style.color = 'red';
    } else {
        document.querySelector(activePlayer['scorespan']).textContent = activePlayer['score'];
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));

}
//second player


//async prevents the function from loading sequencially
async function dealerLogic() {
    blackjackGame['isStand'] = true;
    //bot logic
    while (DEALER['score'] < 16 && blackjackGame['isStand'] === true) {
        let card = radomCard();
        showCard(DEALER, card);
        updateScore(card, DEALER);
        showScore(DEALER);
        await sleep(1000);
    }
    blackjackGame['turnsOver'] = true;
    let winner = computeWinner();
    showResultWinner(winner);

    //bot logic
    /* if (DEALER['score'] > 15) {
         blackjackGame['turnsOver'] = true;
         let winner = computeWinner();
         showResultWinner(winner);
     }*/
}


//compute winner and return who just won. update the wins, draw and losses
function computeWinner() {
    let winner;
    if (YOU['score'] <= 21) {
        if (YOU['score'] > DEALER['score'] || DEALER['score'] > 21) {
            blackjackGame['wins']++;
            winner = YOU;


        } else if (YOU['score'] < DEALER['score']) {
            blackjackGame['losses']++;
            winner = DEALER;


        } else if (YOU['score'] === DEALER['score']) {
            blackjackGame['draws']++;

        }
    }
    //user burst and dealer doesn't
    else if (YOU['score'] > 21 && DEALER['score'] <= 21) {
        blackjackGame['losses']++;
        winner = DEALER;

    }
    //You and dealer bust
    else if (YOU['score'] > 21 && DEALER['score'] > 21) {
        blackjackGame['draws']++;

    }

    return winner;
}

function showResultWinner(winner) {
    // if all the buttons have been pressed
    if (blackjackGame['turnsOver'] === true) {


        let message, messageColor;

        if (winner === YOU) {
            message = 'You Won!';
            messageColor = 'green';
            winSound.play();
            document.querySelector('#wins').textContent = blackjackGame['wins'];
        } else if (winner === DEALER) {
            document.querySelector('#losses').textContent = blackjackGame['losses'];
            message = 'You Lost!';
            messageColor = 'red';
            lossSound.play();
        } else {
            document.querySelector('#draws').textContent = blackjackGame['draws'];
            message = 'You drew!';
            messageColor = 'black';
        }
        document.querySelector('#blackjack-result').textContent = message;
        document.querySelector('#blackjack-result').style.color = messageColor;
    }
}