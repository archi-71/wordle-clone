let la = [];
let ta = [];
let answer = undefined;
let letter = 0;
let word = 0;
let message = undefined;
let state = "playing";

fetch('la.txt')
  .then(response => response.text())
  .then((data) => {
    la = data.split("\n");
    answer = la[Math.floor(Math.random() * la.length)];
})

fetch('ta.txt')
  .then(response => response.text())
  .then((data) => {
    ta = data.split("\n");
})

document.addEventListener('DOMContentLoaded', () => {
    message = document.querySelector('.message');
    message.addEventListener("animationend", () => {
        message.classList.remove("anim-fade");
        message.style.display = "none";
    })
    document.querySelectorAll(".keyboard > div > div").forEach((key) => {
        key.addEventListener("click", () => {
            if (state === "playing"){
                enterKey(key.id);
            }
        })
    })
})

document.addEventListener("keydown", (event) => {
    if (state === "playing"){
        enterKey(event.key);
    }
});

function enterKey(key) {

    if (key === "Backspace") {
        if (letter > 5 * word) {
            letter--;
            let elem = document.getElementById(`${letter}`);
            elem.innerHTML = "";
            elem.classList.remove("full-box");
            elem.classList.remove("anim-grow");
        }
        return false;
    }

    if (key === "Enter") {
        if (letter < ((word+1) * 5)){
            message.innerHTML = "Not enough letters";
            message.style.display = "block";
            message.classList.add("anhim-fade");
            shake();
            return false;
        }

        if (!checkInDictionary()) {
            message.innerHTML = "Not in word list";
            message.style.display = "block";
            message.classList.add("anim-fade");
            shake();
            return false;
        }

        let check = answer.toUpperCase().split("");
        let correct = 0;
        let colours = ["grey", "grey", "grey", "grey", "grey"];
        let boxes = [];
        for (let i = 0; i < 5; i++) {
            boxes.push(document.getElementById(`${letter - 5 + i}`));
        }

        for (let i = 0; i < 5; i++) {
            if (boxes[i].innerHTML === check[i]){
                colours[i] = "green";
                check[i] = "-";
                correct++;
            }
        }
            
        for (let i = 0; i < 5; i++) {
            if (colours[i] !== "green" && check.includes(boxes[i].innerHTML)) {
                colours[i] = "yellow";
                check[check.indexOf(boxes[i].innerHTML)] = "-";
            }
        }

        flip(boxes, colours, 0);
        
        if (correct >= 5) {
            state = "won";
        }
        else if (word >= 5) {
            state = "lost";
        }
        else {
            state = "transitioning";
        }
        return false;
    }

    if (key.length === 1) {
        code = key.charCodeAt(0);
        if ((code > 64 && code < 91) || (code > 96 && code < 123)) {
            if (letter < 5 * (word + 1)) {
                let elem = document.getElementById(`${letter}`);
                elem.innerHTML = key.toUpperCase();
                letter++;
                elem.classList.add("anim-grow");
                elem.classList.add("full-box");
                elem.addEventListener("animationend", () => {
                    elem.classList.remove("anim-grow");
                })
            }
        }
    }

    return false;
}

function checkInDictionary() {
    w = "";
    for (let i = 0; i < 5; i++) {
        let elem = document.getElementById(`${letter - 5 + i}`);
        w += elem.innerHTML.toLowerCase();
    }
    return (la + ta).includes(w);
}

function flip(boxes, colours, num) {
    boxes[num].classList.remove("full-box");
    boxes[num].classList.remove("anim-grow");
    if (colours[num] === "green") {
        boxes[num].classList.add("anim-flipToGreen");
    }
    else if (colours[num] === "yellow") {
        boxes[num].classList.add("anim-flipToYellow");
    }
    else if (colours[num] === "grey") {
        boxes[num].classList.add("anim-flipToGrey");
    }

    if (num >= 4) {
        setTimeout(() => endFlip(boxes, colours), 300);
    }
    else {
        setTimeout(() => flip(boxes, colours, num+1), 300);
    }

    return false;
}

function endFlip(boxes, colours) {

    word++;
    for (let i = 0; i < 5; i++) {
        let key = document.getElementById(boxes[i].innerHTML.toLowerCase());
        if (colours[i] === "grey" && key.className === "none-key") {
            key.className = "grey-key";
        }
        else if (colours[i] === "yellow" && key.className === "none-key") {
            key.className = "yellow-key";
        }
        else if (colours[i] === "green") {
            key.className = "green-key";
        }
    }

    if (state == "won") {
        message.classList.remove("anim-fade");
        message.style.display = "block";
        if (word === 1) {
            message.innerHTML = "Genius";
        }
        else if (word === 2) {
            message.innerHTML = "Magnificent";
        }
        else if (word === 3) {
            message.innerHTML = "Impressive";
        }
        else if (word === 4) {
            message.innerHTML = "Splendid";
        }
        else if (word === 5) {
            message.innerHTML = "Great";
        }
        else {
            message.innerHTML = "Phew";
        }
        bounce(boxes, 0);
    }
    else if (state == "lost") {
        message.innerHTML = answer.toUpperCase();
        message.classList.remove("anim-fade");
        message.style.display = "block";
    }
    else {
        state = "playing";
    }
    return false;
}

function bounce(boxes, num) {
    boxes[num].classList.add("anim-bounce");
    if (num < 4){
        setTimeout(() => bounce(boxes, num+1), 150);
    }
    return false;
}

function shake() {
    for (let i = 5 * word; i < 5 * (word + 1); i++) {
        let elem = document.getElementById(`${i}`);
        elem.classList.add("anim-shake");
        elem.addEventListener("animationend", () => {
            elem.classList.remove("anim-shake");
        })
    }
}