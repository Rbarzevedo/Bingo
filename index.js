/// Get the button and input element
const createCardButton = document.querySelector('#createcard button');
const playerNameInput = document.querySelector('#addplayer');
const playButton = document.querySelector('#play button');

// Function to get the number of bingo cards
function getNumberOfBingoCards() {
  const container = document.querySelector('#bingo-cards-container');
  const bingoCards = container.querySelectorAll('.bingo-card');
  return bingoCards.length;
}

// Constants defining the number ranges for each column
const columnRanges = {
  B: { min: 1, max: 15 },
  I: { min: 16, max: 30 },
  N: { min: 31, max: 45 },
  G: { min: 46, max: 60 },
  O: { min: 61, max: 75 },
};

function createBingoCard() {
  // Get the player name entered by the user
  const playerName = playerNameInput.value.trim(); // Trim any leading/trailing whitespace

  if (!playerName) {
    alert('Por favor, insira o nome do jogador.'); // Display alert if the input value is empty
    return;
  }

  // Generate random numbers for each column within the specified ranges
  const numbers = [];
  for (const column in columnRanges) {
    const { min, max } = columnRanges[column];
    const columnNumbers = generateRandomNumbers(5, min, max);
    numbers.push(...columnNumbers);
  }

  // Shuffle the numbers
  shuffleArray(numbers);

  // Insert a free space in the middle of the array
  const middleIndex = Math.floor(numbers.length / 2);
  numbers.splice(middleIndex, 0, 'FREE');

  // Generate the HTML for the Bingo card
  const bingoCardHTML = `
    <div class="bingo-card" data-player="${playerName}">
      <h3>${playerName}</h3>
      <table>
        <tbody>
          <tr>
            <th>B</th>
            <th>I</th>
            <th>N</th>
            <th>G</th>
            <th>O</th>
          </tr>
          ${generateBingoCardRows(numbers)}
        </tbody>
      </table>
    </div>
  `;

  // Append the Bingo card HTML to the "container" div
  const container = document.querySelector('#bingo-cards-container');
  container.insertAdjacentHTML('beforeend', bingoCardHTML);

  // Clear the player name input
  playerNameInput.value = '';
}

function generateRandomNumbers(count, min, max) {
  const numbers = [];

  while (numbers.length < count) {
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;

    if (!numbers.includes(randomNumber)) {
      numbers.push(randomNumber);
    }
  }

  return numbers;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function generateBingoCardRows(numbers) {
  let html = '';

  const columns = ['B', 'I', 'N', 'G', 'O'];
  const drawnNumbers = new Set();

  for (let i = 0; i < 5; i++) {
    html += '<tr>';

    for (let j = 0; j < 5; j++) {
      const index = i * 5 + j;

      if (i === 2 && j === 2) {
        html += '<td class="free-space"></td>';
      } else {
        const column = columns[j];
        const { min, max } = columnRanges[column];
        const validNumbers = numbers.filter(
          num => num >= min && num <= max && !drawnNumbers.has(num)
        );

        if (validNumbers.length === 0) {
          html += '<td>undefined</td>';
        } else {
          const randomNumberIndex = Math.floor(Math.random() * validNumbers.length);
          const randomNumber = validNumbers[randomNumberIndex];
          drawnNumbers.add(randomNumber);

          html += `<td class="busy-space">${randomNumber}</td>`; // Update class here
        }
      }
    }

    html += '</tr>';
  }

  return html;
}

var drawnNumbers = new Set();

function shuffleNumber() {
  if (getNumberOfBingoCards() < 2) {
    clearErrorMessage();
    return;
  }

  var numbers = Array.from({ length: 75 }, (_, i) => i + 1);
  var validNumbers = numbers.filter(num => !drawnNumbers.has(num));

  if (validNumbers.length === 0) {
    clearInterval(shuffleInterval);
    return;
  }

  var randomNumber = validNumbers[Math.floor(Math.random() * validNumbers.length)];

  drawnNumbers.add(randomNumber);

  var table = document.querySelector('#drawnNumbers table');
  var cells = table.getElementsByTagName('td');

  for (var i = 0; i < cells.length; i++) {
    if (parseInt(cells[i].innerText) === randomNumber) {
      cells[i].classList.add('highlight');
      markNumberInBingoCards(randomNumber); // Add this line to mark the number in bingo cards
    }
  }

  if (isBingoCardWinner()) {
    clearInterval(shuffleInterval); // Stop shuffling when a bingo card wins
    createWinningMessage();
  }

  // Hide the error message
  var errorMessage = document.querySelector('#play .messages');
  errorMessage.style.display = 'none';
}

function markNumberInBingoCards(number) {
  var bingoCards = document.querySelectorAll('.bingo-card');
  bingoCards.forEach(card => {
    var cells = card.querySelectorAll('.busy-space');
    cells.forEach(cell => {
      if (parseInt(cell.innerText) === number) {
        cell.classList.add('marked');
      }
    });
  });
}

function isBingoCardWinner() {
  var bingoCards = document.querySelectorAll('.bingo-card');
  for (var i = 0; i < bingoCards.length; i++) {
    var card = bingoCards[i];
    var remainingCells = card.querySelectorAll('.busy-space:not(.marked)');
    if (remainingCells.length === 0) {
      const playerName = card.getAttribute('data-player');
      displayWinnerMessage(playerName);
      return true;
    }
  }
  return false;
}

function displayWinnerMessage(playerName) {
  const playDiv = document.querySelector('#play');
  const winnerMessage = document.createElement('p');
  winnerMessage.textContent = `Parabéns! ${playerName} venceu o Bingo!`;
  playDiv.appendChild(winnerMessage);
}

playButton.addEventListener('click', function() {
  if (getNumberOfBingoCards() >= 2) {
    playButton.style.display = 'none'; // Hide the play button
    document.querySelector('#createcard').style.display = 'none'; // Hide the #createcard div
    shuffleInterval = setInterval(shuffleNumber, 1000);
  } else {
    const errorMessage = document.querySelector('#messages');
    errorMessage.textContent = 'Por favor, crie pelo menos duas cartelas';
  }
});

// Check if there are already two or more bingo cards on page load
if (getNumberOfBingoCards() >= 2) {
  playButton.style.display = 'block';
}

function restartGame() {
  location.reload(); // Reload the page
}