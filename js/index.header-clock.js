const clockContainer = document.querySelector('.header__clock-container');

function updateClock() {
  clockContainer.innerText = new Date().toLocaleTimeString('uk');
}

setInterval(updateClock, 1000);