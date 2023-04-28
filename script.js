const passwordDisplay = document.querySelector('[data-passwordDisplay]');
const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '!@#$%^&*()_+?><,.';

//assign initial bydefault values
let password = "";
let passwordLength = 10;
let checkCount = 0; //no of boxes included
handleSlider();
setIndicator("#ccc");

//also make color to by default grey of strength vala part

function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = (((passwordLength-min)*100)/(max-min)) +"% 100%";

}

function setIndicator(color){
    indicator.style.backgroundColor = color;
}

function getRndInteger(min,max){
    return Math.floor( Math.random() * (max-min) ) + min;
}

function getRandomNumber(){
    return getRndInteger(0,9);
}

function generateLowerCase(){
    //97-123 are ascii values of lowercse letters
    // String.fromCharcode ascii value se alphabet dedeta h 
    return String.fromCharCode(getRndInteger(97,123)); 
}


function generateUpperCase(){
    //65-91 are ascii values of uppercase letters
    // String.fromCharcode ascii value se alphabet dedeta h 
    return String.fromCharCode(getRndInteger(65,91)); 
}


function generateSymbols(){
    const rndNum = getRndInteger(0,symbols.length);
    return symbols.charAt(rndNum);
}

function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;
  
    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
      setIndicator("#0f0");
    } else if (
      (hasLower || hasUpper) &&
      (hasNum || hasSym) &&
      passwordLength >= 6
    ) {
      setIndicator("#ff0");
    } else {
      setIndicator("#f00");
    }
}

async function copyContent(){
    //ye promise return krega and i wanna wait till it gets fulfilled so await use krunga so for that function bhi async hona chahiye

    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch(error){
        copyMsg.innerText = "Failed";
    }
    
    //to make copy vala span visible
    copyMsg.classList.add('active');

    // thodi derbaad ye ht bhi to jayega
    setTimeout(
        () => {
            copyMsg.classList.remove('active');
        },2000
    );
}

inputSlider.addEventListener('input',
    (e) => {
        passwordLength = e.target.value;
        handleSlider();
    }
)

copyBtn.addEventListener('click',
    () => {
        if(passwordDisplay.value){
            copyContent();
        }
    }
)

function handlecheckboxchange(){
    checkCount = 0;
    allCheckBox.forEach( (checkbox) => 
        {
            if(checkbox.checked){
                checkCount++;
            }
        }
    )

    //special condition
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change',handlecheckboxchange);
})

generateBtn.addEventListener('click',
    () => {
        if(checkCount<=0){
            return;
        }

        //special case
        if(passwordLength<checkCount){
            passwordLength = checkCount;
            handleSlider();
        }

        //let's make new password

        //phle old password ko bhi to empty krna pdega
        password = "";

        // if(uppercaseCheck.checked){
        //     password += generateUpperCase();
        // }
        // if(lowercaseCheck.checked){
        //     password += generateLowerCase();
        // }
        // if(numbersCheck.checked){
        //     password += getRandomNumber();
        // }
        // if(symbols.checked){
        //     password += generateSymbols();
        // }

        let funArr = [];

        if(uppercaseCheck.checked)
            funArr.push(generateUpperCase);
        if(lowercaseCheck.checked)
            funArr.push(generateLowerCase);
        if(symbolsCheck.checked)
            funArr.push(generateSymbols);
        if(numbersCheck.checked)
            funArr.push(getRandomNumber);
            
        //compulsory addition
        for(let i=0;i<funArr.length;i++){
            password += funArr[i]();
        }    

        //remaining addition
        for(let i=0;i<passwordLength-funArr.length;i++){
            let randIndex = getRndInteger(0,funArr.length);
            password += funArr[randIndex]();
        }

        //shuffle the password
        password = shufflePassword(Array.from(password));

        //display in ui
        passwordDisplay.value = password;
        //strength valle to update kro
        calcStrength();
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