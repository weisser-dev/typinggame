const sentences = [
  "The quick brown fox jumps over the lazy dog",
  "She sells seashells by the seashore",
  "Peter Piper picked a peck of pickled peppers",
  "How much wood would a woodchuck chuck",
  "Red lorry, yellow lorry, red lorry, yellow lorry",
];

let timer;
let timeLeft;
let score = 0;
let currentSentence;
let currentIndex;
let typedLetters = 0;
let timerValue;

function startGame() {
  // Get time limit from slider
  timeLeft = document.getElementById("timeRange").value;
  timerValue = timeLeft;

  // Display time limit
  document.getElementById("time").innerHTML = timeLeft;

  // Clear previous game and result
  document.getElementById("game").innerHTML = "";
  document.getElementById("result").innerHTML = "";

  // Set up game
  score = 0;
  currentIndex = 0;
  currentSentence = getRandomSentence();
  displaySentence();
  timer = setInterval(playGame, 1000);
}

function getRandomSentence() {
  const randomIndex = Math.floor(Math.random() * sentences.length);
  return sentences[randomIndex];
}

function displaySentence() {
  const sentenceDiv = document.getElementById("game");
  sentenceDiv.innerHTML = "";
  for (let i = 0; i < currentSentence.length; i++) {
    const span = document.createElement("span");
    span.innerText = currentSentence[i];
    if (i < currentIndex) {
      span.classList.add("correct");
    } else if (i === currentIndex) {
      span.classList.add("current");
    } else {
      span.classList.add("remaining");
    }
    sentenceDiv.appendChild(span);
  }
  document.addEventListener("keydown", checkInput);
}

function playGame() {
  // Update time left
  timeLeft--;
  document.getElementById("time").innerHTML = timeLeft;

  // End game if time is up
  if (timeLeft === 0) {
    clearInterval(timer);
    endGame();
  }
}

function checkInput(event) {
  const sentenceDiv = document.getElementById("game");
  const currentSpan = sentenceDiv.querySelectorAll("span")[currentIndex];
  const nextSpan = sentenceDiv.querySelectorAll("span")[currentIndex + 1];
  const currentChar = currentSpan.innerText;
  const nextIndex = currentIndex + 1;
  let started = true;

  if (nextIndex < currentSentence.length) {
    nextSpan.classList.add("current");
  }

  currentSpan.classList.remove("current");

  if (event.key === " ") {
    event.preventDefault();
    score += 2;
    currentIndex++;
    typedLetters++;
  } else if (event.key === currentChar) {
    // Correct character
    currentSpan.classList.add("correct");
    score += 2;
    currentIndex++;
    typedLetters++;
  } else if (event.key.toLowerCase() === currentChar.toLowerCase()) {
    // Correct character but wrong case
    currentSpan.classList.add("correct");
    score += 1;
    currentIndex++;
    typedLetters++;
  } else if (event.shiftKey) {
    nextSpan.classList.remove("current");
    currentSpan.classList.add("current");
    started = false;
  } else {
    currentSpan.classList.add("wrong");
    currentIndex++;
    typedLetters++;
  }

  // Check if sentence is complete
  if (currentIndex === currentSentence.length) {
    // Reset sentence
    currentIndex = 0;
    currentSentence = getRandomSentence();
    displaySentence();
  }

  if (started) {
    document.getElementById("result").innerHTML = `Score: ${score}`;
  }
}

function endGame() {
  // Calculate game statistics
  const errors = currentSentence.length - currentIndex;
  const accuracy = ((currentIndex - errors) / currentIndex) * 100;
  const cpm = (typedLetters / timerValue) * 60;

  // Create modal content
  const modalContent = document.createElement("div");
  modalContent.classList.add("modal-content");

  const modalHeader = document.createElement("div");
  modalHeader.classList.add("modal-header");
  modalHeader.innerText = "Game Over";

  const modalBody = document.createElement("div");
  modalBody.classList.add("modal-body");

  const scoreText = document.createElement("p");
  scoreText.innerText = `Score: ${score}`;

  const accuracyText = document.createElement("p");
  accuracyText.innerText = `Accuracy: ${accuracy.toFixed(2)}%`;

  const cpmText = document.createElement("p");
  cpmText.innerText = `Characters per minute: ${cpm}`;

  const modalFooter = document.createElement("div");
  modalFooter.classList.add("modal-footer");

  const restartButton = document.createElement("button");
  restartButton.innerText = "Restart";
  restartButton.addEventListener("click", function () {
    closeModal();
    startGame();
  });

  const closeButton = document.createElement("button");
  closeButton.innerText = "Close";
  closeButton.addEventListener("click", closeModal);

  modalBody.appendChild(scoreText);
  modalBody.appendChild(accuracyText);
  modalBody.appendChild(cpmText);

  modalFooter.appendChild(restartButton);
  modalFooter.appendChild(closeButton);

  modalContent.appendChild(modalHeader);
  modalContent.appendChild(modalBody);
  modalContent.appendChild(modalFooter);

  // Create modal overlay and add modal content
  const modalOverlay = document.createElement("div");
  modalOverlay.classList.add("modal-overlay");
  modalOverlay.appendChild(modalContent);
  document.body.appendChild(modalOverlay);
}

function closeModal() {
  const modalOverlay = document.querySelector(".modal-overlay");
  document.body.removeChild(modalOverlay);
}
