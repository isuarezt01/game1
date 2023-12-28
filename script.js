const availableCards = ['A', 'K', 'Q', 'J', '2', '3', '4', '5', '6', '7', '8', '9'];
let cards = [];
let selectedCards = [];
let valuesUsed = [];
let currentMove = 0;
let currentAttempts = 0;
let timerInterval;
let seconds = 0;
let minutes = 0;
let currentLevel = 1;
let selectedImage = null;

let cardTemplate = '<div class="card"><div class="back"></div><div class="face"></div></div>';

function stopTimer() {
    clearInterval(timerInterval);
}

function activate(e) {
    if (!checkGameCompletion()) { // Agrega esta condición para verificar si el juego ya está completado
        if (currentMove < 2) {
            if ((!selectedCards[0] || selectedCards[0] !== e.target) && !e.target.classList.contains('active')) {
                e.target.classList.add('active');
                selectedCards.push(e.target);

                if (++currentMove == 2) {
                    currentAttempts++;
                    document.querySelector('#stats').innerHTML = currentAttempts + ' intentos';

                    if (selectedCards[0].querySelectorAll('.face')[0].innerHTML == selectedCards[1].querySelectorAll('.face')[0].innerHTML) {
                        selectedCards = [];
                        currentMove = 0;
                        checkGameCompletion()
                    } else {
                        setTimeout(() => {
                            selectedCards[0].classList.remove('active');
                            selectedCards[1].classList.remove('active');
                            selectedCards = [];
                            currentMove = 0;
                        }, 600);
                    }
                }
            }
        }
    }
}

function checkGameCompletion() {
    // Verificar si todas las cartas han sido emparejadas
    const remainingCards = document.querySelectorAll('.face:not(.active)').length;

    if (remainingCards === 0) {
        // Detener el temporizador cuando se completa el juego
        stopTimer();
        alert('¡Felicidades! Has completado el juego.');
        return true;
    }

    return false;
}

function randomValue() {
    if (availableCards.length > 0) {
        let rndIndex = Math.floor(Math.random() * availableCards.length);
        let value = availableCards.splice(rndIndex, 1)[0];
        valuesUsed.push(value);
    }
}

function getFaceValue(value) {
    return value;
}

function generateCards() {
    // Limpiar variables antes de generar nuevas cartas
    cards = [];
    selectedCards = [];
    valuesUsed = [];
    currentMove = 0;

    setTotalCardsForLevel(); // Asegurarse de que totalCards se establezca correctamente
    for (let i = 0; i < totalCards; i++) {
        randomValue();
    }

    valuesUsed = valuesUsed.concat(valuesUsed);
    valuesUsed = valuesUsed.sort(() => Math.random() - 0.5);

    // Limpiar el contenedor de cartas antes de agregar nuevas
    document.querySelector('#game').innerHTML = '';

    // Crear un contenedor para las filas
    let rowContainer = document.createElement('div');
    rowContainer.className = 'card-rows';

    const cardsPerRow = 8; // Establecer la cantidad de cartas por fila

    const rowsToShow = (currentLevel === 3) ? 3 : 2; // Determinar el número de filas según el nivel

    for (let row = 0; row < 2; row++) {
        // Crear un contenedor para cada fila
        let rowDiv = document.createElement('div');
        rowDiv.className = 'card-row';

        for (let col = 0; col < totalCards; col++) {
            let i = row * totalCards + col;
            let div = document.createElement('div');
            div.innerHTML = cardTemplate;
            cards.push(div);

            // Agregar la carta al contenedor de fila
            rowDiv.appendChild(cards[i]);

            cards[i].querySelectorAll('.face')[0].innerHTML = getFaceValue(valuesUsed[i]);
            cards[i].querySelectorAll('.card')[0].addEventListener('click', activate);
        }

        // Agregar la fila al contenedor de filas
        rowContainer.appendChild(rowDiv);
    }
    // Añadir el contenedor de filas al contenedor de juego
    document.querySelector('#game').appendChild(rowContainer);
}

document.getElementById('stats').style.display = 'none';

document.getElementById('play-btn').addEventListener('click', function () {
    document.getElementById('timer').style.display = 'block';
    document.getElementById('welcome-screen').style.display = 'none';
    document.getElementById('stats').style.display = 'block';
    document.getElementById('wrapper').style.display = 'block';
    document.getElementById('stats').style.display = '';
    resetStats();
    // Reiniciar el temporizador al comenzar un nuevo juego
    resetTimer();
    // Iniciar el temporizador al comenzar un nuevo juego
    startTimer();
    document.getElementById('shuffle-btn').style.display = 'block';
    generateCards();
    // Añadir el botón de personalizar cartas cuando comienza el juego
    addCustomizeButton();
});

document.getElementById('play-btn').addEventListener('click', function() {
    document.getElementById('stats').classList.add('show-stats');
});

function addCustomizeButton() {
    // Comprobar si el botón ya existe antes de añadirlo nuevamente
    if (!document.getElementById('customize-btn-in-game')) {
        // Crear el botón
        var customizeButton = document.createElement('button');
        customizeButton.textContent = 'Personalizar Cartas';
        customizeButton.id = 'customize-btn-in-game';

        // Asignar el manejador de eventos directamente
        customizeButton.addEventListener('click', customizeCards);

        // Añadir el botón al contenedor de estadísticas
        document.getElementById('stats').appendChild(customizeButton);
    }
}


function createLevelButton(level) {
    const levelButton = document.createElement('button');
    levelButton.className = 'menu-btn';
    levelButton.textContent = 'Nivel ' + level;

    levelButton.onclick = function () {
        startGame(level);
        hideLevels();
    };

    return levelButton;
}

function startGame(level) {
    currentLevel = level;
    setTotalCardsForLevel();
    document.getElementById('play-btn').click();
}

function setTotalCardsForLevel() {
    if (currentLevel === 1) {
        totalCards = 4;
    } else if (currentLevel === 2) {
        totalCards = 8;
    } else if (currentLevel === 3) {
        totalCards = 12;
    }
}

function hideLevels() {
    const levelsContainer = document.getElementById('levels-container');
    levelsContainer.style.display = 'none';
}

function showLevels() {
    document.getElementById('welcome-screen').style.display = 'none';
    document.getElementById('stats').style.display = 'none';
    document.getElementById('wrapper').style.display = 'none';

    const levelsContainer = document.getElementById('levels-container');
 
    levelsContainer.innerHTML = '';
 
    for (let i = 1; i <= 3; i++) {
        const levelButton = createLevelButton(i);
        levelsContainer.appendChild(levelButton);
    }
 
    // Mostrar solo el contenedor de niveles
    levelsContainer.style.display = 'flex';
}

document.getElementById('levels-btn').addEventListener('click', showLevels);

// Función para personalizar las cartas con imágenes
function customizeCards() {
    // Ocultar el welcome-screen al hacer clic en Personalizar Cartas
    var welcomeScreen = document.getElementById('welcome-screen');
    welcomeScreen.style.display = 'none';

    // Ocultar el contenedor de niveles si está visible
    var levelsContainer = document.getElementById('levels-container');
    levelsContainer.style.display = 'none';

    // Obtener el contenedor de cartas
    var gameContainer = document.getElementById('game');

    // Ruta de la carpeta de imágenes
    var imagePath = 'img/';

    // Crear un array de nombres de imágenes (asumo que tienes 8 imágenes)
    var imageNames = ['card1.jpg', 'card2.jpg', 'card3.jpg', 'card4.jpg', 'card5.jpg', 'card6.jpg', 'card7.jpg', 'card8.jpg', 'card9.jpg', 'card10.jpg'];

    // Limpiar el contenido existente del contenedor de cartas
    gameContainer.innerHTML = '';

    imageNames.forEach(function(imageName, index) {
        var card = document.createElement('div');
        card.className = 'card';

        var image = new Image();
        image.src = imagePath + imageName;

        // Asignar un tamaño específico a las imágenes en las cartas
        image.style.width = '100%';
        image.style.height = '100%';

        // Agregar un evento de clic a cada carta para seleccionar la imagen
        card.addEventListener('click', function() {
            // Si la carta ya está seleccionada, deselecciónala
            if (selectedImage === image) {
                selectedImage.style.boxShadow = 'none';
                selectedImage = null;
            } else {
                // Quitar el borde blanco de la foto anteriormente seleccionada
                if (selectedImage) {
                    selectedImage.style.boxShadow = 'none';
                }

                // Mostrar un borde blanco en la imagen de la carta actual
                image.style.boxShadow = '0 0 0 2px white'; // Ajusta el valor 2px según tus preferencias

                // Guardar la carta seleccionada actualmente
                selectedImage = image;

                // Asignar la imagen seleccionada solo si estamos en la sección de juego
                if (selectedImage) {
                    selectedImage.src = image.src;
                    // Aplicar la imagen seleccionada solo a las cartas del juego
                    cards.forEach(function(gameCard) {
                        gameCard.firstChild.src = selectedImage.src;
                    });
                    if (selectedImage && selectedImage.src) {
                        localStorage.setItem('selectedImage', selectedImage.src);
                    } else {
                        console.error('No hay una imagen seleccionada para almacenar en el almacenamiento local.');
                    }
                }
            }
        });
        card.appendChild(image);
        gameContainer.appendChild(card);
        window.location.href = 'index.html';
    });

    console.log("Cartas personalizadas con imágenes");
    // Crear un botón de retorno al juego
    var returnButton = document.createElement('button');
    returnButton.textContent = 'Volver al Juego';

    returnButton.addEventListener('click', function() {
    if (selectedImage && selectedImage.src) {
        localStorage.setItem('selectedImage', selectedImage.src);
    } else {
        console.error('No hay una imagen seleccionada para almacenar en el almacenamiento local.');
    }

    // Redirigir al archivo index.html
    window.location.href = 'index.html';
});

gameContainer.appendChild(returnButton);
}


// Función para volver al inicio (redirige al archivo index.html)
function goHome() {
    window.location.href = 'index.html';
}

// Función para agregar el botón de volver al inicio
function addBackToHomeButton() {
    var body = document.body;

    // Crear el contenedor del botón
    var backButtonContainer = document.createElement('div');
    backButtonContainer.id = 'back-to-home-container';

    // Crear el botón
    var backButton = document.createElement('button');
    backButton.innerHTML = '<i class="fas fa-home"></i> Volver al Inicio';
    backButton.addEventListener('click', goHome);

    // Agregar el botón al contenedor
    backButtonContainer.appendChild(backButton);

    // Agregar el contenedor al final del cuerpo
    body.appendChild(backButtonContainer);
}

// Ejemplo de cómo podrías llamar a addBackToHomeButton después de comenzar el juego
document.getElementById('play-btn').addEventListener('click', function () {
    // Llama a esta función cuando comiences el juego
    addBackToHomeButton();
    // Resto de tu código para comenzar el juego...
});

// Evento para el botón de barajar
document.getElementById('shuffle-btn').addEventListener('click', function () {
    // Reiniciar el temporizador al barajar las cartas
    resetTimer();
    // Iniciar el temporizador al barajar las cartas
    startTimer();
    // Reiniciar los intentos al barajar las cartas
    resetStats();

    // Espera un breve momento antes de ejecutar la lógica de barajado
    setTimeout(function () {
        generateCards();

        // Muestra nuevamente el botón de barajar al completar el barajado
        document.getElementById('shuffle-btn').style.display = 'block';
    }, 300); // Ajusta el tiempo según sea necesario
    
    
});

function resetStats() {
    currentAttempts = 0;
    document.querySelector('#stats').innerHTML = '0 intentos';
}

// Función para iniciar el temporizador
function startTimer() {
    timerInterval = setInterval(function () {
        seconds++;
        if (seconds === 60) {
            seconds = 0;
            minutes++;
        }
        updateTimerDisplay();
    }, 1000);
}

// Función para actualizar la visualización del temporizador
function updateTimerDisplay() {
    const timerDisplay = document.getElementById('timer');
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    const formattedSeconds = seconds < 10 ? '0' + seconds : seconds;
    timerDisplay.textContent = formattedMinutes + ':' + formattedSeconds;
}

// Función para reiniciar el temporizador
function resetTimer() {
    clearInterval(timerInterval);
    seconds = 0;
    minutes = 0;
    updateTimerDisplay();
}




