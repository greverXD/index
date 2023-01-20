const buttonStartGame = document.getElementById('buttonStartGame');
const questionsPlace = document.getElementById('questionsPlace');
const numberThemeLength = document.getElementsByClassName('buttonMenu').length;
const numberButtonLength = document.getElementsByClassName('buttonNext').length;
const divGlobalPoints = document.getElementById('globalPoints');
const headerlevelLenght = document.getElementsByClassName('headerLevel').length;
const divResultPoints = document.getElementById('resultPoints');
const divClock = document.getElementById('divClock');
let globalPoints = 0; 
let buttonTheme = []; 
let buttonNext = [];  
let buttonThemeReturn = []; 
let headerLevel = []; 
let count = 0; 
let countCorrectAnswer = 0;
let textCountQ = 0; 
let checkboxCountQ = 0; 
let timerIdMain;                      
let timerId; 
let trueAnswer = []; 

for (let i = 0; i < numberThemeLength; i++)   
    buttonTheme[i] = document.getElementsByClassName('buttonMenu')[i];

for (let i = 0; i < numberButtonLength; i++) {    
    buttonNext[i] = document.getElementsByClassName('buttonNext')[i];
    buttonThemeReturn[i] = document.getElementsByClassName('buttonThemeReturn')[i];
}

for (let i = 0; i < headerlevelLenght; i++)
    headerLevel[i] = document.getElementsByClassName('headerLevel')[i];

let themeProg = {  // Тема и правильные вопросы
    name: "questionProg",
    points: 0,
    pointsCoef: 102 / 100,
    questions: [],
    percent: 0,
    countTheme: 0,
    testAnswer: [1, 1, 3, 4, 1],
    textAnswer: ["дудутки", "ничья", "казимир пусловский", "61", "в могилёвской"],
    checkboxAnswer: [[2, 5], [1, 2, 4], [3], [1], [4]],
}


let theme = [themeProg];

function questionsCheck(theme) // Проверка вопросов в зависимости от уровня сложности
{
    if (count < 5)
        liteQuestions(theme);
    else if (count > 4 && count < 10) 
        middleHardQuestions(theme, 'middle');
    else if (count < 15) 
        middleHardQuestions(theme, 'hard');
     
}

function liteQuestions(theme) 
{
    let correctAnswer = theme.testAnswer[count];
    let answer = theme.questions[count];
    let numberInput = 1;

    for (let node of answer.querySelectorAll('input')) {
        if (node.checked == true && numberInput == correctAnswer) {
            theme.points += 1;
            trueAnswer[countCorrectAnswer] = answer;
            countCorrectAnswer++;
        }
        numberInput++;
    }
    count++;
}

function middleHardQuestions(theme, level) 
{
    let t = 0;
    let c = 0;
    let n = 0;
    let countCheckBox = theme.checkboxAnswer[checkboxCountQ];
    let answer = theme.questions[count];
    let numberInput = 1; 
        
    if (level == "middle") {
        for (let node of answer.querySelectorAll('input')) {
            if (node.type == 'text') {
                node.value = node.value.toLowerCase();
                if (node.value == theme.textAnswer[textCountQ]) {
                    theme.points += 12;
                    trueAnswer[countCorrectAnswer] = answer;
                    countCorrectAnswer++
                }
                t = 1;
            } else if (node.type == 'checkbox') {
                if (node.checked == true && theme.checkboxAnswer[checkboxCountQ].includes(numberInput) == true) {
                    theme.points += 1;
                    n++;
                }
                else if (node.checked == true && theme.checkboxAnswer[checkboxCountQ].includes(numberInput) == false)
                    theme.points -= 0;
                numberInput++;
                c = 1;
            }
        }  
    } else if( level == "hard") {
        for (let node of answer.querySelectorAll('input')) {
            if (node.type == 'text') {
                node.value = node.value.toLowerCase();
                if (node.value == theme.textAnswer[textCountQ]) {
                    theme.points += 20;
                    trueAnswer[countCorrectAnswer] = answer;
                    countCorrectAnswer++;
                }
                t = 1;
            } else if (node.type == 'checkbox') {
                if (node.checked == true && theme.checkboxAnswer[checkboxCountQ].includes(numberInput) == true) {
                    theme.points += 2;
                    n++;
                }
                else if (node.checked == true && theme.checkboxAnswer[checkboxCountQ].includes(numberInput) == false)
                    theme.points -= 2;
                numberInput++;
                c = 1;
            }
        }
    }
    
    if (c != 0)
        checkboxCountQ++;
    if (t != 0)
        textCountQ++;
    if (countCheckBox != undefined) {
        if (n == countCheckBox.length) {
            trueAnswer[countCorrectAnswer] = answer;
            countCorrectAnswer++;
        }
    }

    count++;
}

function flippingQuestions(theme) 
{
    if (count != 15) {
        printHeaderLevel(count);
        if (count > 0)
            theme.questions[count - 1].style.display = 'none';
        theme.questions[count].style.display = 'block';

        clearInterval(timerIdMain);
        if (count > 9 && count < 15) {
            divClock.style.display = 'block';
            timer(theme);
        }

        timerId = setInterval(() => updateCheck(theme, timerId), 100);
        buttonNext[theme.countTheme].style.display = 'none';
    } else
        result(theme);
}

function result(theme)
{
    clearInterval(timerId);
    clearInterval(timerIdMain);
    divClock.style.display = 'none';
    theme.questions[count - 1].style.display = 'none';
    buttonNext[theme.countTheme].style.display = 'none';
    headerLevel[2].style.display = 'none';
    divResultPoints.style.display = 'block';
    let pointsBlock = document.getElementById('points');
    theme.percent = (theme.points / theme.pointsCoef).toFixed(1);
    if (theme.percent < 0)
        theme.percent = 0;

    globalPoints += theme.points;
    divGlobalPoints.querySelector('span').innerHTML = globalPoints;
    
    for (let node of trueAnswer) 
        node.style.display = 'block';

    pointsBlock.innerHTML = theme.percent;
}
function updateCheck(theme, timerId)
{
    let i = 0;
    let answer = theme.questions[count];
    for (let node of answer.querySelectorAll('input')) {
        if (node.checked == true || (node.value != '' && node.type == 'text')) {
            buttonNext[theme.countTheme].style.display = 'block';
            i = 1;
            clearInterval(timerId);
        }
    }
    if (i == 0) 
        buttonNext[theme.countTheme].style.display = 'none';
}

function timer(theme) 
{
    function checkInput(theme) 
    {
        let deadline;
        let input = theme.questions[count];

        if (input.querySelector('input').type == 'text') 
            deadline = new Date(Date.parse(new Date()) + 5 * 60 * 1000);
        else if (input.querySelector('input').type == 'checkbox') 
            deadline = new Date(Date.parse(new Date()) + 1 * 60 * 1000);

        return deadline;
    }

    function getTimeRemaining(endtime) { 
        let time = Date.parse(endtime) - Date.parse(new Date());
        let seconds = Math.floor((time / 1000) % 60);
        let minutes = Math.floor((time / 1000 / 60) % 60);
        return {
            'total': time,
            'minutes': minutes,
            'seconds': seconds
        }
    }
    
    function updateCheck(number) 
    {
        var t = getTimeRemaining(endtime);
        if(number == 1)
            clock.innerHTML = 'Таймер ' + '0' + t.minutes + ' : ' + '0' + t.seconds;
        else
            clock.innerHTML = 'Таймер ' + t.minutes + ' : ' +  t.seconds;
        if (t.total <= 0) {
            clearInterval(timerIdMain);
            questionsCheck(theme);
            flippingQuestions(theme);
        }
    }

    let clock = document.getElementById('clock');
    let endtime = checkInput(theme);
    updateCheck(1);
    timerIdMain = setInterval(updateCheck, 1000);
}

function initialQuestion(questions, themeQuestion)  
{
    for (let i = 0; i < 15; i++)
        questions[i] = document.getElementsByClassName(themeQuestion)[i];
}

function printHeaderLevel(count) 
{
    if (count < 5)
        headerLevel[0].style.display = 'block';
    else if (count > 4 && count < 10) {
        headerLevel[0].style.display = 'none';
        headerLevel[1].style.display = 'block';
    }
    else {
        headerLevel[1].style.display = 'none';
        headerLevel[2].style.display = 'block';
    }
}

function returnTheme(theme) 
{
    clearInterval(timerId);
    clearInterval(timerIdMain);
    let answer;
    document.getElementsByClassName('contentMenu')[0].style.display = 'block';
    document.getElementsByClassName('startWindow')[0].style.display = 'none';
    buttonThemeReturn[theme.countTheme].style.display = 'none';
    buttonNext[theme.countTheme].style.display = 'none';
    divResultPoints.style.display = 'none';
    divClock.style.display = 'none';

    for (let i = 0; i < 15; i ++)
        theme.questions[i].style.display = 'none';

    if (theme.percent > 0)
        buttonTheme[theme.countTheme].querySelector('span').innerHTML = ' (' + theme.percent + '%)';

    for (let i = 0; i < 15; i++) {
        answer = theme.questions[i];  
        for (let node of answer.querySelectorAll('input')) {
            node.value = "";
            node.checked = 0;
        }
    }
    
    for (let i = 0; i < headerlevelLenght; i++)
        headerLevel[i].style.display = 'none';
    theme.points = 0;
    count = 0; 
    checkboxCountQ = 0;
    textCountQ = 0;
    countCorrectAnswer = 0;
    trueAnswer = [];
}

function start()
{
    document.getElementsByClassName('contentMenu')[0].style.display = 'block';
    document.getElementsByClassName('startWindow')[0].style.display = 'none';
    divGlobalPoints.style.display = 'block';
}

function main(theme)
{
    initialQuestion(theme.questions, theme.name);
    document.getElementsByClassName('contentMenu')[0].style.display = 'none';
    buttonThemeReturn[theme.countTheme].style.display = 'block';
    flippingQuestions(theme);
    buttonThemeReturn[theme.countTheme].addEventListener('click', () => returnTheme(theme));
}

buttonStartGame.addEventListener('click', start);

for (let i = 0; i < 5; i++) {
    buttonTheme[i].addEventListener('click', () => main(theme[i]));
    buttonNext[i].addEventListener('click', () => questionsCheck(theme[i])); 
    buttonNext[i].addEventListener('click', () => flippingQuestions(theme[i]));
}