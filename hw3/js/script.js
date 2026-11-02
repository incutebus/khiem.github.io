// Khiem Vo
// CST336
// Professor Lara
// HW2

// Event listener for the Submit Quiz button
document.querySelector("#submitBtn").addEventListener("click", gradeQuiz);

// Global variables
let score = 0;
let attempts = localStorage.getItem("total_attempts");

if (attempts === null) {
    attempts = 0;
} else {
    attempts = Number(attempts);
}

// Show the saved attempt count when the page loads
document.querySelector("#totalAttempts").textContent = "Total Times Quiz Taken: " + attempts;

// Make question 4 appear in a different order each time the page loads
displayQ4Choices();

function isFormValid() {
    let q1Response = document.querySelector("#q1").value.trim();

    if (q1Response === "") {
        document.querySelector("#validationFdbk").textContent = "Please answer question 1 before submitting.";
        return false;
    }

    return true;
}

// Display a checkmark or an X beside a question
function setMarkImage(index, imageName, altText) {
    let markContainer = document.querySelector("#markImg" + index);
    markContainer.textContent = "";

    let img = document.createElement("img");
    img.src = "img/" + imageName;
    img.alt = altText;
    markContainer.appendChild(img);
}

function rightAnswer(index) {
    let feedback = document.querySelector("#q" + index + "Feedback");
    feedback.textContent = "Correct!";
    feedback.className = "feedback bg-success text-white";
    setMarkImage(index, "checkmark.png", "Correct answer");
    score += 10;
}

function wrongAnswer(index) {
    let feedback = document.querySelector("#q" + index + "Feedback");
    feedback.textContent = "Incorrect!";
    feedback.className = "feedback bg-danger text-white";
    setMarkImage(index, "xmark.png", "Incorrect answer");
}

function gradeQuiz() {
    document.querySelector("#validationFdbk").textContent = "";

    if (!isFormValid()) {
        return;
    }

    // Start from zero whenever the student submits the quiz
    score = 0;

    // Question 1: California's capital
    let q1Response = document.querySelector("#q1").value.trim().toLowerCase();
    if (q1Response === "sacramento") {
        rightAnswer(1);
    } else {
        wrongAnswer(1);
    }

    // Question 2: Longest U.S. river
    let q2Response = document.querySelector("#q2").value;
    if (q2Response === "mo") {
        rightAnswer(2);
    } else {
        wrongAnswer(2);
    }

    // Question 3: Mount Rushmore (correct choices from the tutorial)
    if (document.querySelector("#Jefferson").checked &&
        document.querySelector("#Roosevelt").checked &&
        !document.querySelector("#Jackson").checked &&
        !document.querySelector("#Franklin").checked) {
        rightAnswer(3);
    } else {
        wrongAnswer(3);
    }

    // Question 4: Smallest state
    let q4Response = document.querySelector("input[name=q4]:checked");
    if (q4Response !== null && q4Response.value === "Rhode Island") {
        rightAnswer(4);
    } else {
        wrongAnswer(4);
    }

    // Question 5: Sunshine State
    let q5Response = document.querySelector("#q5").value;
    if (q5Response === "Florida") {
        rightAnswer(5);
    } else {
        wrongAnswer(5);
    }

    // Question 6: Largest state by area
    let q6Response = document.querySelector("input[name=q6]:checked");
    if (q6Response !== null && q6Response.value === "Alaska") {
        rightAnswer(6);
    } else {
        wrongAnswer(6);
    }

    // Question 7: Pacific Ocean states in this list
    if (document.querySelector("#q7California").checked &&
        document.querySelector("#q7Oregon").checked &&
        document.querySelector("#q7Washington").checked &&
        !document.querySelector("#q7Nevada").checked) {
        rightAnswer(7);
    } else {
        wrongAnswer(7);
    }

    // Question 8: Grand Canyon river
    let q8Response = document.querySelector("#q8").value;
    if (q8Response === "Colorado") {
        rightAnswer(8);
    } else {
        wrongAnswer(8);
    }

    // Question 9: Number of U.S. states
    let q9Response = document.querySelector("#q9").value;
    if (q9Response === "50") {
        rightAnswer(9);
    } else {
        wrongAnswer(9);
    }

    // Question 10: Texas's capital
    let q10Response = document.querySelector("#q10").value.trim().toLowerCase();
    if (q10Response === "austin") {
        rightAnswer(10);
    } else {
        wrongAnswer(10);
    }

    // Display score out of 100
    let totalScore = document.querySelector("#totalScore");
    totalScore.textContent = "Total Score: " + score + " / 100";

    if (score < 80) {
        totalScore.className = "mt-3 text-danger fw-bold";
    } else {
        totalScore.className = "mt-3 text-success fw-bold";
    }

    // The rubric says the congratulatory message is for scores above 80
    let congrats = document.querySelector("#congrats");
    if (score > 80) {
        congrats.textContent = "Congratulations! You did a great job!";
    } else {
        congrats.textContent = "";
    }

    // Keep track of the number of completed submissions using Web Storage
    attempts++;
    document.querySelector("#totalAttempts").textContent = "Total Times Quiz Taken: " + attempts;
    localStorage.setItem("total_attempts", attempts);
}

// Shuffle an array using the same approach from the guided tutorial
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

function displayQ4Choices() {
    let q4ChoicesArray = ["Maine", "Rhode Island", "Maryland", "Delaware"];
    shuffleArray(q4ChoicesArray);

    let choicesContainer = document.querySelector("#q4Choices");
    choicesContainer.textContent = "";

    for (let i = 0; i < q4ChoicesArray.length; i++) {
        let choice = q4ChoicesArray[i];
        let div = document.createElement("div");
        div.className = "form-check";

        let input = document.createElement("input");
        input.type = "radio";
        input.name = "q4";
        input.id = "q4Choice" + i;
        input.value = choice;
        input.className = "form-check-input";

        let label = document.createElement("label");
        label.htmlFor = input.id;
        label.textContent = choice;
        label.className = "form-check-label";

        div.appendChild(input);
        div.appendChild(label);
        choicesContainer.appendChild(div);
    }
}
