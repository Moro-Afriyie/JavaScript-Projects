/*
GAME RULES:

- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLBAL score. After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game

*/

var scores, roundScore, activePlayer, gameplaying, winSound, sixChecker;


function init() {
    gameplaying = true;
    scores = [0, 0];
    roundScore = 0;
    activePlayer = 0; // player 1
    winSound = new Audio('cash.mp3');
    sixChecker = 0;

    document.querySelector('.dice').style.display = 'none';
    document.querySelector('.dice2').style.display = 'none';
    document.getElementById('score-0').textContent = '0';
    document.getElementById('score-1').textContent = '0';
    document.getElementById('current-0').textContent = '0';
    document.getElementById('current-1').textContent = '0';
    document.getElementById('name-0').textContent = 'Player 1';
    document.getElementById('name-1').textContent = 'Player 2';
    document.getElementById('winningScore').value = "";
    document.querySelector('.player-0-panel').classList.remove('winner');
    document.querySelector('.player-1-panel').classList.remove('winner');
    document.querySelector('.player-0-panel').classList.remove('active');
    document.querySelector('.player-1-panel').classList.remove('active');

    document.querySelector('.player-0-panel').classList.add('active');
}
init();




document.querySelector('.btn-roll').addEventListener('click', rollDice);
document.querySelector('.btn-hold').addEventListener('click', holdDice);
document.querySelector('.btn-new').addEventListener('click', init);


function rollDice() {
    if (gameplaying) {
        var dice = Math.floor(Math.random() * 6) + 1;
        var dice2 = Math.floor(Math.random() * 6) + 1;
        //console.log(sixChecker);

        //display the result
        let images = document.querySelector('.dice');
        images.src = "dice-" + dice + ".png";
        let images2 = document.querySelector('.dice2');
        images2.src = "dice-" + dice2 + ".png";
        document.querySelector('.dice').style.display = 'block';
        document.querySelector('.dice2').style.display = 'block';


        //update the round score if the rolled number was not a 1
        if (dice !== 1 && dice2 !== 1) {
            roundScore += (dice + dice2);
            document.querySelector('#current-' + activePlayer).textContent = roundScore;
        } else {
            nextPlayer();
        }
        /*
                if (dice !== 1 && dice2 !== 1) {
                    roundScore += (dice + dice2);
                    document.querySelector('#current-' + activePlayer).textContent = roundScore;
                } else if (sixChecker === 6 && dice === 6) {
                    scores[activePlayer] = 0;
                    document.querySelector('#name-' + activePlayer).textContent = '0';
                    nextPlayer();
                } else {
                    nextPlayer();
                }
                sixChecker = dice;*/
    }

}

function holdDice() {
    if (gameplaying) {
        //add current score to global score
        scores[activePlayer] += roundScore;
        document.querySelector('#score-' + activePlayer).textContent = scores[activePlayer];

        var input = document.getElementById('winningScore').value;

        //Undefined, 0, null, or " " are set to false
        if (input) {
            var winningScore = input;
        } else {
            winningScore = 100;
        }

        //check if player won the game
        if (scores[activePlayer] >= winningScore) {
            document.querySelector('#name-' + activePlayer).textContent = 'Winner! ';
            document.querySelector('.dice').style.display = 'none';
            document.querySelector('.dice2').style.display = 'none';
            document.querySelector('.player-' + activePlayer + '-panel').classList.add('winner');
            document.querySelector('.player-' + activePlayer + '-panel').classList.remove('active');
            gameplaying = false;
            winSound.play();
        } else {
            nextPlayer();
        }
    }


}

function nextPlayer() {
    activePlayer === 0 ? activePlayer = 1 : activePlayer = 0;
    roundScore = 0;
    document.querySelector('#current-0').textContent = 0;
    document.querySelector('#current-1').textContent = 0;


    document.querySelector('.player-0-panel').classList.toggle('active');
    document.querySelector('.player-1-panel').classList.toggle('active');

    document.querySelector('.dice').style.display = 'none';
    document.querySelector('.dice2').style.display = 'none';
}