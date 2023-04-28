const inputSlider = document.querySelector('[data-lengthSlider]');

const passwordDisplay = document.querySelector('[data-passwordDisplay]');

const copyMsg = document.querySelector('[data-copymsg]');

const copyBtn = document.querySelector("[data-copy]");

const allCheckBox = document.querySelectorAll("input[type=checkbox]");

const generateBtn = document.querySelector(".generateButton");


const passwordLengthDisplay = document.querySelector("[data-lengthNumber]")

const upperCaseCheck = document.querySelector('#uppercase');

const lowerCaseCheck = document.querySelector('#lowercase');

const numbersCheck = document.querySelector('#numbers');
const symbolsCheck = document.querySelector('#symbols');
const symbols = '!@#$%^&*()<>:"?"{}}|';

let passwordLength = "10";
let password = "";
let checkCount = 0;
handleSlider();

function handleSlider(){
    inputSlider.value = passwordLength;
    passwordLengthDisplay.innerText = passwordLength; 
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = (((passwordLength-min)*100)/(max-min)) +"% 100%";

}

function getRndInteger(min,max){
    return Math.floor(Math.random()*(max-min) ) + min;
}

function getRandomNumber(){
    return getRndInteger(0,9);
}

function getUpperCase(){
    return String.fromCharCode(getRndInteger(65,91));
}

function getLowerCase(){
    return String.fromCharCode(getRndInteger(97,123));
}

function getSymbol(){
    let rndindex = getRndInteger(0,symbols.length);
    return symbols.charAt(rndindex);
}

inputSlider.addEventListener('input',
    (e) => {
        passwordLength = e.target.value;
        handleSlider();
    }
);


async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch(e){
        console.log(e);
        copyMsg.innerText = "failed";
    }

    copyMsg.classList.add('active');

    setTimeout(
        () => {
            copyMsg.classList.remove('active');
            
        },2000
    );
}

copyBtn.addEventListener('click',
    () => {
        if(passwordDisplay.value){
            copyContent();
        }
    }
);


function handlecheckboxchange(){
    checkCount = 0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked){
            checkCount++;
        }
    });

    //special case
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach(
    (checkBox) => {
        checkBox.addEventListener('change',handlecheckboxchange);
    });

generateBtn.addEventListener('click',
    () => {
        if(checkCount<=0){
            return;
        }

        if(passwordLength<checkCount){
            passwordLength = checkCount;
            handleSlider();
        }
        password = "";
        let funArr = [];
        if(upperCaseCheck.checked){
            funArr.push(getUpperCase);
        }
        if(lowerCaseCheck.checked){
            funArr.push(getLowerCase);
        }
        if(numbersCheck.checked){
            funArr.push(getRandomNumber);
        }
        if(symbolsCheck.checked){
            funArr.push(getSymbol);
        }
        //compulsory addition
        for(let i=0;i<funArr.length;i++){
            password += funArr[i]();
        }

        //remaining addition
        for(let i=0;i<passwordLength-funArr.length;i++){
            let randIdx = getRndInteger(0,funArr.length);
            password += funArr[randIdx]();
        }

        password = shufflePassword(Array.from(password));

        passwordDisplay.value = password;
    }

);

function shufflePassword(array){
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}