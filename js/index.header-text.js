document.querySelector('.header__title').style.color = 'red';

const greetings = [
    "Hello",
    "Hi",
    "Hey",
    "Greetings",
    "Salutations",
    "Welcome",
    "Good day"
];

const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
document.querySelector('.header__title').innerText = randomGreeting;