// Seleção de elementos do DOM
const input = document.querySelector('.login__input');
const button = document.querySelector('.login__button');
const form = document.querySelector('.login__form');
const gameSection = document.getElementById('game-section');
const gameBoard = document.getElementById('gameBoard');

// validação do input para habilitar o botão play
input.addEventListener('input', ({ target }) => {

    if (target.value.length > 3) {
        button.removeAttribute('disabled');
    } else {
        button.setAttribute('disabled', '');
    }
});

// lidar com submissao do formulario

form.addEventListener('submit', (event) => {
    event.preventDefault();
    localStorage.setItem('player', input.value);
    form.style.display = 'none'; //Esconde o formulario
    gameSection.style.display = 'block'; // Mostra o tabuleiro
    startGame(); //Inicia o jogo


});

const cardsArray = [
    {
        id: 1,
        name: 'Rick',
        img: './imagens/Rick.png',
        audio: './som/select-sound-.mp3'
    },
    {
        id: 2,
        name: 'Morty',
        img: './imagens/morty.png',
        audio: './som/select-sound-.mp3'
    },
    {
        id: 3,
        name: 'Jessica',
        img: './imagens/jessica.png', audio: './som/select-sound-.mp3'
    },
    {
        id: 4,
        name: 'Beth',
        img: './imagens/beth.png',
        audio: './som/select-sound-.mp3'
    },
    {
        id: 5,
        name: 'Jerry',
        img: './imagens/jerry.png',
        audio: './som/select-sound-.mp3'
    },
    {
        id: 6,
        name: 'Mr. Poopybutthole',
        img: './imagens/Man.jpeg',
        audio: './som/select-sound-.mp3'
    }
];

// Função para iniciar o jogo

function startGame() {
    // Limpar o gameBoard antes de iniciar
    gameBoard.innerHTML = '';
    let shuffledCards = shuffle([...cardsArray, ...cardsArray]); // duplicar cards

    shuffledCards.forEach(card => {
        let cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.dataset.id = card.id;
        cardElement.dataset.audio = card.audio;
        cardElement.innerHTML = `
            
            <div class="front face" style="background-image: url('${card.img}');"></div>
            <div class="back face"></div>
        
            
        `;
        cardElement.addEventListener('click', flipCard);
        gameBoard.appendChild(cardElement);
    });
}

let flippedCardsCount = 0; // Número de cartas viradas
let points = 0;            // Pontos do jogador

// Lógica do jogo

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matchedPairs = 0;

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add('flipped');
    playAudio(this.dataset.audio);
    flippedCardsCount++; // Incrementa o número de cartas viradas

    if (!firstCard) {
        firstCard = this;
        return;
    }

    secondCard = this;
    lockBoard = true;

    checkForMatch();
}


function showWinMessage() {
    const winMessage = document.getElementById('winMessage');
    const winMessageText = document.getElementById('winMessageText');

    // Define a mensagem com a pontuação e número de cartas viradas
    winMessageText.innerHTML = `Pontos: ${points}<br>Cartas viradas: ${flippedCardsCount}`;

    // Mostra a janela de mensagem
    winMessage.classList.remove('hidden');
}

function playAudio(audio) {
    let audioElement = new Audio(audio);
    audioElement.play();
}
function checkForMatch() {
    if (firstCard.dataset.id === secondCard.dataset.id) {
        disableCards();
        matchedPairs++;
        points += 10;

        if (matchedPairs === cardsArray.length) {
            setTimeout(() => showWinMessage(), 500); // Chama a função personalizada
        }
    } else {
        unflipCards();
    }
}
function resetGame() {
    const winMessage = document.getElementById('winMessage');
    winMessage.classList.add('hidden'); // Esconde a janela de mensagem

    matchedPairs = 0;
    points = 0;
    flippedCardsCount = 0;
    gameBoard.innerHTML = '';
    startGame(); // Reinicia o jogo
}
function unflipCards() {
    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');

        resetBoard();
    }, 1000);
}
function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    resetBoard();

}
function resetBoard() {
    [firstCard, secondCard, lockBoard] = [null, null, false];
    // firstCard = null;
    // secondCard = null;
    // lockBoard = false;

}
// Função de embaralhamento
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}



