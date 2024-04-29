// Get the start game button
const startGameButton = document.getElementById('startgame');
// Get player name input
const playerNameInput = document.getElementById('InputName');
// Get number of cards input
const numberOfCardsInput = document.getElementById('Numberofcards');

startGameButton.addEventListener('click', () => {
  // Check the inputs
  const playerName = playerNameInput.value.trim();
  const numberOfCards = parseInt(numberOfCardsInput.value);

  if (playerName === '' || numberOfCards < 1 || numberOfCards > 30 || isNaN(numberOfCards)) {
    alert('Please enter a valid player name and number of cards between 1 and 30.');
    return;
  }

  // Store player name and number of cards in sessionStorage
  sessionStorage.setItem('playerName', playerName);
  sessionStorage.setItem('numberOfCards', numberOfCards);

  // Redirect to game.html
  window.location.href = 'game.html';
});

// Submit the form when the enter key is pressed in the number of cards input
numberOfCardsInput.addEventListener('keyup', (event) => {
  if (event.keyCode === 13) {
    event.preventDefault();
    startGameButton.click();
  }
});
