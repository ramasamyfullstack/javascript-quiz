const QUESTIONS_URL = './questions.json';

const redirectAfterFinish = null; // e.g. 'https://example.com/thanks'


let questions = [];
let currentIndex = 0;
let score = 0;
let canAnswer = true;


const progressEl = document.getElementById('progress');
const questionBox = document.getElementById('questionBox');
const questionText = document.getElementById('questionText');
const optionsList = document.getElementById('optionsList');
const resultBox = document.getElementById('resultBox');
const resultSummary = document.getElementById('resultSummary');
const restartBtn = document.getElementById('restartBtn');


function loadQuestions(){
fetch(QUESTIONS_URL, {cache: 'no-store'})
.then(res => {
if(!res.ok) throw new Error('Failed to load questions');
return res.json();
})
.then(data => {
questions = data;
if(!Array.isArray(questions) || questions.length === 0) throw new Error('No questions found');
initQuiz();
})
.catch(err => {
progressEl.textContent = 'Error loading quiz: ' + err.message;
});
}


function initQuiz(){
currentIndex = 0; score = 0; canAnswer = true;
progressEl.innerHTML = `Question 1 of ${questions.length}`;
questionBox.classList.remove('hidden');
resultBox.classList.add('hidden');
showQuestion(currentIndex);
}


function showQuestion(i){
const q = questions[i];
questionText.textContent = q.question;
optionsList.innerHTML = '';


q.options.map((opt, idx) => {
const li = document.createElement('li');
li.tabIndex = 0;
li.dataset.index = idx;
li.textContent = opt;
li.addEventListener('click', onOptionClicked);
li.addEventListener('keydown', (e)=>{
if(e.key === 'Enter' || e.key === ' ') onOptionClicked.call(li, e);
});
optionsList.appendChild(li);
});


progressEl.textContent = `Question ${i+1} of ${questions.length}`;
canAnswer = true;
}


function onOptionClicked(e){
if(!canAnswer) return;
canAnswer = false;
const li = e.currentTarget || this;
const chosenText = li.textContent;
const q = questions[currentIndex];


if(chosenText === q.answer){
li.classList.add('correct');
score++;
} else {
li.classList.add('wrong');
const correctLi = Array.from(optionsList.children).find(li => li.textContent === q.answer);
if(correctLi) correctLi.classList.add('correct');
}


setTimeout(()=>{
currentIndex++;
if(currentIndex < questions.length){
showQuestion(currentIndex);
} else {
finishQuiz();
}
}, 700);
}


function finishQuiz(){
questionBox.classList.add('hidden');
resultBox.classList.remove('hidden');
resultSummary.textContent = `You scored ${score} out of ${questions.length}`;


if(redirectAfterFinish){
setTimeout(()=> location.href = redirectAfterFinish, 1500);
}
}


restartBtn.addEventListener('click', initQuiz);

loadQuestions();