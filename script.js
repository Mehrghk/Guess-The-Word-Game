const misplacedCharactersDiv = document.querySelector('.misplaced-characters');
const inputsDiv = document.querySelector('.inputs');
const mistakeSpan = document.querySelector('.mistakes');
let Inputs;

const dots = document.querySelectorAll('.dot');

let currentWord = "";
let scrambledWord = [];
let savedScrambledWord = [];
let tries = 0;
let mistakes = '';

//used a ready made json for speed
async function ApiForWords(){
  const response = await fetch("./words.json");
  const resObj = await response.json();
  currentWord = resObj[Math.floor(Math.random()*resObj.length)].word;
}
function scrambleWord() {
  let randomizedcharacter;
  let rendomizedWord = [];
  for(let i=0; i<currentWord.length; i+=1){
    randomizedcharacter = scrambledWord[Math.floor(Math.random()*scrambledWord.length)];
    let index = scrambledWord.indexOf(randomizedcharacter);
    scrambledWord.splice(index,1, );
    rendomizedWord.push(randomizedcharacter);
  }
  misplacedCharactersDiv.innerHTML = rendomizedWord.join('  ');
}

async function generateRandomWord() {
  // Generate and display scrambled word
  await ApiForWords();
  misplacedCharactersDiv.innerHTML = "";
  scrambledWord = [];
  savedScrambledWord = [];
  for(let i=0; i<currentWord.length; i+=1){
    scrambledWord.push(currentWord[i]);
    savedScrambledWord.push(currentWord[i]);
  }
  scrambleWord();
  createInputFields();
}

function createInputFields() {
  // Create number of input fields according to the number of letters
  for(let i = 0; i < currentWord.length; i+=1){
    const newInput = document.createElement('input');
    newInput.setAttribute("maxlength",1);
    newInput.setAttribute("class","char-box");
    newInput.setAttribute("type","text");
    inputsDiv.appendChild(newInput);
  }
  Inputs = document.querySelectorAll('.char-box');
}

let usersTries;
function handleInput() {
  // Handle input change event
  for (let i = 0; i < Inputs.length; i++) {
    const currentInput = Inputs.item(i);
    if(i === 0){
      currentInput.addEventListener("keydown",function(e){
        if (currentInput.value !== "" && i < Inputs.length - 1) {
          Inputs.item(i + 1).focus();
        }
        if(e.key === "Backspace" && currentInput.value === "" && i > 0){
          Inputs.item(i - 1).focus();
        }
      });
    } else {
      currentInput.addEventListener("input", function(e) {
        if (currentInput.value !== "" && i < Inputs.length - 1) {
          Inputs.item(i + 1).focus();
        }
      });
      
      currentInput.addEventListener("keydown",function(e){
        if(e.key === "Backspace" && currentInput.value === "" && i > 0){
          Inputs.item(i - 1).focus();
          Inputs.item(i).classList.remove("wrongchar");
        }
      });
    }
    
  }

  //for cheking the solution and setting tries and dots and mistakes
  const currentValue = [];
  for(let i = 0; i < Inputs.length; i++){
    currentValue.push(Inputs.item(i).value);
  }

  console.log(currentValue)

  if(currentValue.join("") === currentWord){
    setTimeout(()=>{
      alert(`🎉 Success! The Word was "${currentWord}"`)
      Inputs.forEach((input)=>{
        input.classList.remove("wrongchar");
      })
      document.querySelectorAll('.inputs > input').forEach((input)=> input.remove());
      resetGame();
      generateRandomWord();
    },500);
  }else if(currentValue.join("").length === currentWord.length){
    usersTries = document.querySelector(".userTries");
    usersTries.innerHTML++;
    if(usersTries.innerHTML < 5){
      setTimeout(()=>{
        for(let i = 0; i < usersTries.innerHTML; i++){
          dots.item(i).classList.add("dott");
        }

        for(let i = 0; i < currentWord.length; i++){
          Inputs.item(i).classList.remove("wrongchar")
          if(!currentWord.includes(currentValue[i])){
            Inputs.item(i).classList.add("wrongchar"); 
          }else{
            if(currentValue[i] !== savedScrambledWord[i]){
              if(!mistakes.includes(currentValue[i])){
                mistakes += currentValue[i] + ', ';
              }
            }
          }
        }
        mistakeSpan.innerHTML = mistakes;
      }
        ,500)
      
    } else {
      resetGame();
    }
    
  }
}

function resetGame() {
  // Handle game reset button
  if(usersTries){
    usersTries.innerHTML = 0;
    mistakes = '';
    mistakeSpan.innerHTML = ""; 
  }
  Inputs.forEach((input)=>{
    input.classList.remove("wrongchar");
  })
  dots.forEach((dot)=> dot.classList.remove("dott"));
  Inputs.forEach((input)=> input.value = "")
}

document
  .getElementById("randomButton")
  .addEventListener("click", ()=>{
    document.querySelectorAll('.inputs > input').forEach((input)=> input.remove());
    resetGame();
    generateRandomWord();
  });
document.getElementById("resetButton").addEventListener("click", resetGame);

// Initial load
generateRandomWord();