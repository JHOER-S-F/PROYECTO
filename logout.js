let countdown = 10;
const countdownElement = document.getElementById('countdown');

const interval = setInterval(() => {
    countdown--;
    countdownElement.textContent = countdown;
    if (countdown <= 0) {
        clearInterval(interval);
    }
}, 1000);

setTimeout(() => {
    window.location.href = 'index.html';
}, 10000); // 10000 ms = 10 segundos
