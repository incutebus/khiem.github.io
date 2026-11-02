//Khiem Vo
//CST336
//Professor Lara
//Lab 2

//Event Listeners
document.querySelector("#guessBtn").addEventListener("click", checkGuess);
document.querySelector("#resetBtn").addEventListener("click", initializeGame);

//Global variables
let randomNumber;
let attempts = 0;
let maxAttempts = 7;
let totalWins = 0;
let totalLosses = 0;

initializeGame();

function initializeGame() {
    randomNumber = Math.floor(Math.random() * 99) + 1;
    attempts = 0;

    //hiding the Reset button
    document.querySelector("#resetBtn").style.display = "none";

    //showing the Guess button
    document.querySelector("#guessBtn").style.display = "inline";

    let playerGuess = document.querySelector("#playerGuess");
    playerGuess.focus(); //adding focus to textbox
    playerGuess.value = ""; //clearing the textbox

    let feedback = document.querySelector("#feedback");
    feedback.textContent = ""; //clearing the feedback

    //clearing previous guesses
    document.querySelector("#guesses").textContent = "";

    //resetting attempts left
    document.querySelector("#attemptsLeft").textContent = maxAttempts;
}

function checkGuess() {
    let feedback = document.querySelector("#feedback");
    feedback.textContent = "";
    let guess = document.querySelector("#playerGuess").value;
    console.log("Player guess: " + guess);

    //only accepting whole numbers from 1 to 99
    if (guess < 1 || guess > 99 || guess != Math.floor(guess)) {
        feedback.textContent = "Enter a number between 1 and 99";
        feedback.style.color = "red";
        return;
    }

    attempts++;
    console.log("Attempts: " + attempts);
    feedback.style.color = "orange";

    //displaying the guess and attempts left
    document.querySelector("#guesses").textContent += guess + " ";
    document.querySelector("#attemptsLeft").textContent = maxAttempts - attempts;

    if (guess == randomNumber) {
        feedback.textContent = "You guessed it! You Won! It took you " + attempts + " attempt(s).";
        feedback.style.color = "darkgreen";
        totalWins++;
        document.querySelector("#wins").textContent = totalWins;
        gameOver();
    } else {
        if (attempts == maxAttempts) {
            feedback.textContent = "Sorry, you lost! The number was " + randomNumber + ".";
            feedback.style.color = "red";
            totalLosses++;
            document.querySelector("#losses").textContent = totalLosses;
            gameOver();
        } else if (guess > randomNumber) {
            feedback.textContent = "Guess was high";
        } else {
            feedback.textContent = "Guess was low";
        }
    }
}

function gameOver() {
    let guessBtn = document.querySelector("#guessBtn");
    let resetBtn = document.querySelector("#resetBtn");
    guessBtn.style.display = "none"; //hides Guess button
    resetBtn.style.display = "inline"; //displays Reset button
}
