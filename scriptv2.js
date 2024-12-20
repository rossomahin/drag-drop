// Класс для управления модальным окном
class Modal {
    constructor(modalId) {
        this.modal = document.getElementById(modalId);
    }

    openModal() {
        this.modal.style.display = 'block';
    }

    closeModal() {
        this.modal.style.display = 'none';
    }
}

// Класс для управления корзинами
class Baskets {
    constructor() {
        this.baskets = {
            plastic: document.getElementById('trash-zone-plastic'),
            paper: document.getElementById('trash-zone-paper'),
            waste: document.getElementById('trash-zone-waste'),
        };
    }
}

// Класс для представления элемента мусора
class TrashItem {
    constructor(type, image) {
        this.type = type;
        this.image = image;
    }
}

// Класс для представления достижения
class Achievement {
    constructor(name, condition, duration = 0) {
        this.name = name; // Название достижения
        this.condition = condition; // Условие для получения достижения
        this.achieved = false; // Статус достижения
        this.duration = duration; // Время для достижения (в секундах)
        this.startTime = null; // Время начала отсчета
    }

    checkCondition(value) {
        if (!this.achieved && value >= this.condition) {
            this.achieved = true;
            return true; // Достижение получено
        }
        return false; // Достижение не получено
    }

    startTimer() {
        this.startTime = Date.now(); // Запоминаем время начала
    }

    checkDuration() {
        if (this.startTime && (Date.now() - this.startTime) >= this.duration * 1000) {
            this.achieved = true;
            return true; // Достижение получено по времени
        }
        return false; // Достижение не получено
    }
}

// Класс для управления игрой
class TrashGame {
    constructor() {
        this.items = [
            new TrashItem('plastic', 'assets/plastic.svg'),
            new TrashItem('paper', 'assets/paper-bin.png'),
            new TrashItem('waste', 'assets/android.png'),
        ];
        this.message = document.querySelector('.message');
        this.playground = document.getElementById('playground');
        this.counter = 0;
        this.intervalId = null;
        this.music = document.getElementById('background-music');
        this.timerValue = 0;
        this.timerId = null;
        this.isDragging = false;
        this.baskets = new Baskets();
        this.lives = 3;
        this.livesElements = document.querySelectorAll('.life-system');
        this.isGameOver = false;
        this.mainMenu = document.getElementById('mainMenu');
        this.restartBtn = document.getElementById('restartButton');
        this.resetBtn = document.getElementById('resetButton');

        // Список достижений
        this.achievements = [
            new Achievement('Первый мусор', 1),
            new Achievement('Новобранец', 10),
            new Achievement('Сортировщик', 25),
            new Achievement('Мастер сортировки', 50),
            new Achievement('Поедатель мусора', 100),
        ];

        // Создаем экземпляры модальных окон
        this.startModal = new Modal('modalWindow');
        this.gameOverModal = new Modal('gameOverModal');

        this.loadScore();
        this.initEvents();
    }

    initEvents() {
        window.onload = () =>  {
            this.startModal.openModal();
            this.animation(); 
        }
        document.getElementById('startButton').addEventListener('click', () => {
            this.startModal.closeModal();
            this.startGame();
        });
        document.getElementById('restartButton').addEventListener('click', () => {
            this.resetScore();
            this.saveScore();
            this.gameOverModal.closeModal();
            this.restartGame();
        });
        document.getElementById('mainMenu').addEventListener('click', () => {
            this.resetScore();
            this.saveScore();
            this.gameOverModal.closeModal();
            this.showMainMenu();
        });
        document.getElementById('resetButton').addEventListener('click', () => {
            this.resetMaxScore();
            this.saveScore();
        });

    }

    animation() {
        // Анимация для mainMenu
        this.mainMenu.addEventListener('mouseenter', () => {
            this.mainMenu.style.backgroundColor = '#fff';
            this.mainMenu.style.color = 'black';
            this.mainMenu.style.transform = 'scale(1.05)'; // Увеличение элемента
            this.mainMenu.style.transition = 'background-color 0.2s ease-in-out, color 0.2s ease-in-out, transform 0.2s ease-in-out';
        });
    
        this.mainMenu.addEventListener('mouseleave', () => {
            this.mainMenu.style.backgroundColor = '#000';
            this.mainMenu.style.color = 'white';
            this.mainMenu.style.transform = 'scale(1)'; // Возврат к исходному размеру
        });
    
        const restartBtn = document.getElementById('restartButton');
        const img = restartBtn.querySelector('img');
    
        // Анимация для restartBtn
        restartBtn.addEventListener('mouseenter', () => {
            restartBtn.style.transform = 'scale(1.05)'; // Увеличение кнопки
            restartBtn.style.transition = 'transform 0.2s ease-in-out'; // Исправление transition
            img.style.transform = 'rotate(-720deg)'; // Вращение изображения
            img.style.transition = 'transform 1s ease-in-out'; // Исправление transition
        });
    
        restartBtn.addEventListener('mouseleave', () => {
            restartBtn.style.transform = 'scale(1)'; // Возврат к исходному размеру
            restartBtn.style.transition = 'transform 0.2s ease-in-out'; // Исправление transition
            img.style.transform = 'rotate(0deg)'; // Возврат изображения в исходное состояние
            img.style.transition = 'transform 1s ease-in-out'; // Исправление transition
        });
    
        const resetBtn = document.getElementById('resetButton');
        const resetImg = resetBtn.querySelector('img');
    
        resetBtn.addEventListener('mouseenter', () => {
            resetBtn.style.transform = 'scale(1.05)'; // Увеличение кнопки
            resetBtn.style.transition = 'transform 0.2s ease-in-out'; // Исправление transition
            resetImg.style.transform = 'rotate(-720deg)'; // Вращение изображения
            resetImg.style.transition = 'transform 1s ease-in-out'; // Исправление transition
        });
    
        resetBtn.addEventListener('mouseleave', () => {
            resetBtn.style.transform = 'scale(1)'; // Возврат к исходному размеру
            resetBtn.style.transition = 'transform 0.2s ease-in-out'; // Исправление transition
            resetImg.style.transform = 'rotate(0deg)'; // Возврат изображения в исходное состояние
            resetImg.style.transition = 'transform 1s ease-in-out'; // Исправление transition
        });
    }
        
    
    resetScore() {
        this.counter = 0;
        document.getElementById('counterValue').textContent = this.counter;
    }

    resetMaxScore() {
        const maxScoreElement = 0; // Сбрасываем максимальный счет до 0
        document.getElementById('maxScoreValue').textContent = maxScoreElement; // Обновляем отображение максимального счета
        localStorage.setItem('trashGameMaxScore', maxScoreElement); // Сохраняем новый максимальный счет в localStorage
    }
    
    
    loadScore() {
        const savedScore = localStorage.getItem('trashGameScore');
        const savedMaxScore = localStorage.getItem('trashGameMaxScore'); // Загружаем максимальный счет
        if (savedScore) {
            this.counter = parseInt(savedScore, 10);
            document.getElementById('counterValue').textContent = this.counter;
        }
        if (savedMaxScore) {
            document.getElementById('maxScoreValue').textContent = parseInt(savedMaxScore, 10); // Устанавливаем максимальный счет
        }
    }
    

    saveScore() {
        localStorage.setItem('trashGameScore', this.counter);
        const currentMaxScore = parseInt(document.getElementById('maxScoreValue').textContent, 10);
        localStorage.setItem('trashGameMaxScore', currentMaxScore); // Сохраняем максимальный счет
    }
    

    startGame() {
        this.isGameOver = false;
        this.music.play();
        this.intervalId = setInterval(() => this.createTrash(), 1000);
        this.startTimer();
         // Запускаем таймер для достижений
         this.achievements[0].startTimer(); // Непобедимый
         this.achievements[1].startTimer(); // На грани
    }

    startTimer() {
        this.timerId = setInterval(() => {
            this.timerValue++;
            document.getElementById('timeSession').textContent = this.timerValue;
        }, 1000);
    }

    updateCounter() {
        this.counter++;
        document.getElementById('counterValue').textContent = this.counter;
        this.saveScore();
        // Проверяем достижения
        this.checkAchievements();
    }

    handleTrashDrop(success) {
        if (this.isGameOver) return;
        if (success) {
            this.updateCounter();
        } else {
            this.decreaseLives();
        }
    }

    decreaseLives() {
        this.lives--;
        this.livesElements[this.lives].style.opacity = '0.5';

        // Проверяем достижение "На грани"
        if (this.lives === 1) {
            this.achievements[1].checkDuration(); // Проверяем на грани
        }

        if (this.lives === 0) {
            this.gameOver();
        }
    }

    gameOver() {
        this.isGameOver = true;
        clearInterval(this.intervalId);
        clearInterval(this.timerId);
        this.music.pause();
        this.gameOverModal.openModal();
        document.getElementById('counterValue').textContent = this.counter;
        this.updateMaxScore();
        this.checkAchievement('Все когда-то проигрывают');
        this.counter = 0;

        // Запускаем анимацию падающих картинок
        this.animateFallingImages();
    }

    animateFallingImages() {
        const images = [
            '###', // Замените на ваш путь
        ];

        const playgroundRect = this.playground.getBoundingClientRect();
        const numberOfImages = 10; // Количество падающих картинок

        for (let i = 0; i < numberOfImages; i++) {
            const img = document.createElement('img');
            img.src = images[Math.floor(Math.random() * images.length)];
            img.style.position = 'absolute';
            img.style.width = '50px'; // Установите нужный размер
            img.style.left = Math.random() * (playgroundRect.width - 50) + 'px'; // Случайное положение по горизонтали
            img.style.top = '0px'; // Начальная позиция по вертикали
            img.style.transition = 'transform 1s ease-in-out';

            this.playground.appendChild(img);

            // Запускаем анимацию падения
            setTimeout(() => {
                img.style.transform = `translateY(${playgroundRect.height}px)`;
            }, 100);

            // Удаляем изображение после анимации
            img.addEventListener('transitionend', () => {
                img.remove();
            });
        }
    }

    checkAchievements() {
        this.achievements.forEach(achievement => {
            if (achievement.checkCondition(this.counter)) {
                this.showMessage(`Достижение получено: ${achievement.name}`, '#fff', '2px 2px 3px #000', 'gold', '15px', '1px solid black');
            }
        });
    }
    updateMaxScore() {
        let maxScoreElement = parseInt(document.getElementById('maxScoreValue').textContent, 10);
    
        if (this.counter > maxScoreElement) {
            maxScoreElement = this.counter;
            document.getElementById('maxScoreValue').textContent = maxScoreElement;
            this.saveScore(); // Сохраняем новый максимальный счет
        }
    }
    
    

    showMainMenu() {
        this.counter = 0;
        this.lives = 3;
        this.livesElements.forEach(life => life.style.opacity = '1');
        this.timerValue = 0;
        document.getElementById('timeSession').textContent = this.timerValue;
        this.clearTrash();
        this.startModal.openModal(); // Открываем стартовое модальное окно
    }

    restartGame() {
        this.counter = 0;
        this.lives = 3;
        this.livesElements.forEach(life => life.style.opacity = '1');
        this.timerValue = 0;
        document.getElementById('timeSession').textContent = this.timerValue;
        this.startGame();
    }

    addImageToTrash(trash, imageSrc) {
        const img = document.createElement('img');
        img.src = imageSrc;
        img.style.width = '52px';
        img.style.height = '52px';
        trash.appendChild(img);
    }

    createTrash() {
        let item = this.items[Math.floor(Math.random() * this.items.length)];
        let trash = document.createElement('div');
        trash.className = 'trash';
        this.addImageToTrash(trash, item.image);
        trash.dataset.type = item.type;
        trash.style.position = 'absolute';
        trash.style.left = Math.random() * (this.playground.clientWidth - 100) + 'px';
        trash.style.top = '0px';
        this.playground.appendChild(trash);
        this.fallTrash(trash);
    }

    fallTrash(trash) {
        let position = 0;
        let interval = setInterval(() => {
            position += 5;
            trash.style.transform = `translateY(${position}px)`;
            if (position > this.playground.clientHeight) {
                clearInterval(interval);
                trash.remove();
            }
        }, 100);

        trash.addEventListener('pointerdown', (e) => {
            if (this.isDragging || this.isGameOver) return;
            e.preventDefault();
            this.isDragging = true;
            this.dragTrash(trash, e);
            clearInterval(interval);
        });
    }

    dragTrash(trash, e) {
        trash.ondragstart = () => false;

        const rect = trash.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;

        const moveAt = (pageX, pageY) => {
            trash.style.left = `${pageX - this.playground.offsetLeft - offsetX}px`;
            trash.style.top = `${pageY - this.playground.offsetTop - offsetY}px`;
            trash.style.transform = 'none';
            trash.style.transitionDuration = '0s';
        };

        const onMouseMove = (event) => {
            moveAt(event.clientX, event.clientY);
        };

        document.addEventListener('mousemove', onMouseMove);

        const onMouseUp = (event) => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);

            const basket = document.elementFromPoint(event.clientX, event.clientY);
            if (basket && basket.classList.contains('trash-zone')) {
                if (this.baskets.baskets[trash.dataset.type] === basket) {
                    this.showMessage('RIGHT!', '#fff', '2px 2px 3px #000', 'green', '15px', '1px solid black');
                    this.handleTrashDrop(true);
                } else {
                    this.showMessage('WRONG!', '#fff', '2px 2px 3px #000', 'red', '15px', '1px solid black');
                    this.handleTrashDrop(false);
                }
                trash.remove();
            } else {
                trash.style.position = 'absolute';
            }

            this.isDragging = false;
        };

        moveAt(e.clientX, e.clientY);
        document.addEventListener('mouseup', onMouseUp);
    }

    showMessage(text, color, textShadow, background, padding, border) {
        this.message.textContent = text;
        this.message.style.color = color;
        this.message.style.textShadow = textShadow;
        this.message.style.backgroundColor = background;
        this.message.style.padding = padding;
        this.message.style.border = border;
        this.message.style.margin = '0 auto';
        this.message.style.display = 'block';
        setTimeout(() => {
            this.message.style.display = 'none';
        }, 1500);
    }

    clearTrash() {
        const trashItems = this.playground.querySelectorAll('.trash');
        trashItems.forEach(trash => trash.remove());
    }

}

// Создаем экземпляр игры
const trashGame = new TrashGame();
