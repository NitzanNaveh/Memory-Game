$(document).ready(function() { 
  const gameSound = new Audio('sounds/Tame Impala.mp3'); //gameplay music
  gameSound.play();
  // Get the player name and number of cards from sessionStorage
  const playerName = sessionStorage.getItem('playerName');
  const numberOfCards = parseInt(sessionStorage.getItem('numberOfCards'));
  const headline = document.getElementById('headline'); // Get the h1 from game.html
  const timer = document.getElementById('timer'); // Get the timer div from game.html
  const successSound = new Audio('sounds/success.mp3'); //finish music
  headline.textContent = `Welcome, ${playerName}`; // Display player name in the headline
 
  // Array of images for card back
  const cardBackImages = [
    'gallery/arak.jpg',
    'gallery/baileys.jpg',
    'gallery/absolut.jpg',
    'gallery/bacardi.jpg',
    'gallery/beluga.jpg',
    'gallery/blacklabel.jpg',
    'gallery/bombay.jpg',
    'gallery/capatainmorgan.jpg',
    'gallery/capatainmorganwhite.jpg',
    'gallery/hennessy.jpg',
    'gallery/jack-daniels-honey.jpg',
    'gallery/jagermeister.jpg',
    'gallery/jameson.jpg',
    'gallery/macallen.jpg',
    'gallery/remy-martin.jpg',
    'gallery/tanqueray.jpg',
    'gallery/vangogh.jpg',
    'gallery/catalog.jpg',
    'gallery/chivas.jpg',
    'gallery/Coinreau.jpg',
    'gallery/dinjulio.jpg',
    'gallery/disarono.png',
    'gallery/glenfid.jpg',
    'gallery/greygoose.jpg',
    'gallery/hendricks-gin.jpg',
    'gallery/jimbeam.jpg',
    'gallery/limon.jpg',
    'gallery/malibu.jpg',
    'gallery/ouzo.jpg',
    'gallery/patron_silver.png',
    'gallery/quervo.jpg',
  ];

  // Generate the game board
  const gameArea = document.getElementById('game-area');
  let flippedCards = [];
  let matchedCards = 0;
  let moves = 0;
  let gameStarted = false;
  let timerInterval;

  // Generate the card pairs
  const cardPairs = [];
  for (let i = 0; i < numberOfCards; i++) {
    const randomIndex = Math.floor(Math.random() * cardBackImages.length);
    const cardValue = cardBackImages[randomIndex];
    cardPairs.push(cardValue);
    cardPairs.push(cardValue);
    cardBackImages.splice(randomIndex, 1); // Remove the used image from the array
  }

  // Shuffle the card pairs
  shuffleArray(cardPairs);

  // Create the game cards
  cardPairs.forEach((cardValue) => {
    const cardElement = document.createElement('div');
    cardElement.className = 'card';
    cardElement.dataset.value = cardValue;

    const frontElement = document.createElement('div');
    frontElement.className = 'card-front';

    const FrontImage = document.createElement('img');
    FrontImage.src = 'gallery/indexlogo.png';
    frontElement.appendChild(FrontImage);

    const backElement = document.createElement('div');
    backElement.className = 'card-back';

    const randomImage = cardValue;
    // Set the background image for the card back
    backElement.style.backgroundImage = `url(${randomImage})`;

    cardElement.appendChild(frontElement);
    cardElement.appendChild(backElement);

    gameArea.appendChild(cardElement);
  });

// Add a hover effect to the cards
const cards = document.querySelectorAll('.card');
cards.forEach((card) => {
  card.addEventListener('mouseover', () => {
    card.style.transform = 'scale(1.1)';
    card.style.transition = 'transform 0.3s ease';
  });

  card.addEventListener('mouseout', () => {
    card.style.transform = 'scale(1)';
  });
});

  // Add a click event listener to the game area
  gameArea.addEventListener('click', (event) => {
    const clickedCard = event.target.closest('.card');

    if (!gameStarted) {
      gameStarted = true;
      startTimer();
    }

    if (clickedCard && !clickedCard.classList.contains('flipped') && flippedCards.length < 2) {
      // Flip the card
      clickedCard.classList.add('flipped');

      // Add to the flippedCards array
      flippedCards.push(clickedCard);

      // Check if two cards are flipped
      if (flippedCards.length === 2) {
        // Disable clicking on other cards while checking for a match
        gameArea.classList.add('no-click');

        // Increment the move counter
        moves++;
        updateMoveCounter();

        // Check if the two flipped cards match
        const value1 = flippedCards[0].dataset.value;
        const value2 = flippedCards[1].dataset.value;

        if (value1 === value2) {
          // Match found
          setTimeout(() => {
            flippedCards.forEach((card) => {
              card.classList.add('matched');
              const backElement = card.querySelector('.card-back');
              backElement.style.borderColor = 'rgb(98, 192, 98)'; // Change border color of the card back when matched
            });

            flippedCards = [];
            matchedCards += 2;

            // Check if all cards are matched
            if (matchedCards === numberOfCards * 2) {
              setTimeout(() => {
                endGame();
              }, 500);
            } else {
              // Enable clicking on other cards after a short delay
              setTimeout(() => {
                gameArea.classList.remove('no-click');
              }, 500);
            }
          }, 500);
        } else {
          // No match
          setTimeout(() => {
            flippedCards.forEach((card) => {
              card.classList.remove('flipped');
            });

            flippedCards = [];

            // Enable clicking on other cards after a short delay
            setTimeout(() => {
              gameArea.classList.remove('no-click');
            }, 500);
          }, 1000);
        }
      }
    }
  });

  // Function to start the timer
  function startTimer() {
    let seconds = 0;
    clearInterval(timerInterval); // Clear previous timer
    timerInterval = setInterval(() => {
      seconds++;
      timer.textContent = `${formatTime(seconds)}`;
    }, 1000);
  }

  // Function to format the time in MM:SS format
  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;
    return `${formattedMinutes}:${formattedSeconds}`;
  }

  // Function to update the move counter
  function updateMoveCounter() {
    const moveCounter = document.getElementById('move-counter');
    moveCounter.textContent = `Moves: ${moves}`;
  }

  // Function to end the game
  function endGame() {
    clearInterval(timerInterval);
    const gameTime = timer.textContent;
    setTimeout(() => {
      if (matchedCards === numberOfCards * 2) {
        gameSound.pause();
        successSound.play(); // Play success sound
        setTimeout(() => {
          alert(`Congratulations ${playerName} , you've matched all cards!\n\nMoves: ${moves}\nTime: ${gameTime}`);
          window.location.href="index.html";//return to login page after alert
        },200);
      }
    },500);
  }

  // Function to shuffle an array
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  // Restart game button
  const restartButton = document.getElementById('restartgame');
  restartButton.addEventListener('click', restartGame);

  // Function to restart the game
  function restartGame() {
    // Clear the game area
    gameArea.innerHTML = '';

    // Reset game variables
    flippedCards = [];
    matchedCards = 0;
    moves = 0;
    gameStarted = false;

    // Generate the card pairs
    const newCardPairs = [];
    for (let i = 0; i < numberOfCards; i++) {
      const randomIndex = Math.floor(Math.random() * cardBackImages.length);
      const cardValue = cardBackImages[randomIndex];
      newCardPairs.push(cardValue);
      newCardPairs.push(cardValue);
      cardBackImages.splice(randomIndex, 1); // Remove the used image from the array
    }

    // Shuffle the new card pairs
    shuffleArray(newCardPairs);

    // Create the new game cards
    newCardPairs.forEach((cardValue) => {
      const cardElement = document.createElement('div');
      cardElement.className = 'card';
      cardElement.dataset.value = cardValue;

      const frontElement = document.createElement('div');
      frontElement.className = 'card-front';

      const FrontImage = document.createElement('img');
      FrontImage.src = 'gallery/indexlogo.png';
      frontElement.appendChild(FrontImage);

      const backElement = document.createElement('div');
      backElement.className = 'card-back';

      const randomImage = cardValue;
      
      backElement.style.backgroundImage = `url(${randomImage})`;

      cardElement.appendChild(frontElement);
      cardElement.appendChild(backElement);

      gameArea.appendChild(cardElement);
    });

    // Reset the move counter
    updateMoveCounter();

    // Restart the timer
    timer.textContent = '00:00';
    clearInterval(timerInterval);
  }
});
