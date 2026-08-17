(() => {
"use strict";

const $ = (id) => document.getElementById(id);
const all = (selector) => document.querySelectorAll(selector);

function showPage(pageId) {
  const page = $(pageId);
  if (!page) return;
  all(".page").forEach(p => p.classList.remove("active"));
  page.classList.add("active");
  all(".nav-btn").forEach(b => b.classList.toggle("active", b.dataset.page === pageId));
  window.scrollTo({top:0, behavior:"smooth"});
}

document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-page]");
  if (button) {
    event.preventDefault();
    showPage(button.dataset.page);
  }
});

const words = [
 ["Resilient","/rɪˈzɪliənt/","Able to recover quickly from difficulty or change.","She remained resilient after facing several challenges.",["strong","adaptable","tough"]],
 ["Curious","/ˈkjʊəriəs/","Eager to learn, know, or discover something.","A curious student asks useful questions.",["inquisitive","interested","eager"]],
 ["Diligent","/ˈdɪlɪdʒənt/","Showing careful and persistent effort.","He is diligent about daily practice.",["hardworking","careful","dedicated"]],
 ["Confident","/ˈkɒnfɪdənt/","Feeling sure about your abilities.","She became confident after regular practice.",["assured","bold","certain"]],
 ["Concise","/kənˈsaɪs/","Giving information clearly in few words.","Please give a concise answer.",["brief","short","clear"]]
];
let wordIndex = 0;

function renderWord() {
  const w = words[wordIndex % words.length];
  $("word").textContent = w[0];
  $("pronunciation").textContent = w[1];
  $("meaning").textContent = w[2];
  $("example").textContent = w[3];
  $("wordCount").textContent = `${(wordIndex % 100)+1} / 100`;
  $("synonyms").innerHTML = w[4].map(s => `<span>${s}</span>`).join("");
}
$("newWord").addEventListener("click", () => { wordIndex++; renderWord(); });
renderWord();

const questions = [
 ["What does “resilient” mean?",["Able to recover from difficulty","Unable to change","Very expensive","Very quiet"],0],
 ["Choose the correct sentence.",["She go to college.","She goes to college.","She going college.","She gone college."],1],
 ["Which word means eager to learn?",["Curious","Ancient","Silent","Brief"],0],
 ["Choose the past tense.",["I study yesterday.","I studied yesterday.","I studying yesterday.","I studies yesterday."],1],
 ["Which word means clear and brief?",["Long","Concise","Difficult","Ancient"],1]
];
let quizIndex=0, score=0, answered=false;

function renderQuiz() {
  const q=questions[quizIndex % questions.length];
  answered=false;
  $("quizProgress").textContent=`Question ${(quizIndex % questions.length)+1} of 20`;
  $("question").textContent=q[0];
  $("quizFeedback").textContent="";
  $("nextQuestion").hidden=true;
  $("answers").innerHTML=q[1].map((a,i)=>`<button type="button" class="answer" data-answer="${i}">${a}</button>`).join("");
}
$("answers").addEventListener("click",(event)=>{
  const b=event.target.closest(".answer");
  if(!b || answered)return;
  answered=true;
  const chosen=Number(b.dataset.answer);
  const correct=questions[quizIndex % questions.length][2];
  all(".answer").forEach((x,i)=>{if(i===correct)x.classList.add("correct");});
  if(chosen===correct){score++;$("score").textContent=score;$("quizFeedback").textContent="Correct! 🎉";}
  else{b.classList.add("wrong");$("quizFeedback").textContent="Good attempt. The highlighted answer is correct.";}
  $("nextQuestion").hidden=false;
});
$("nextQuestion").addEventListener("click",()=>{quizIndex++;renderQuiz();});
renderQuiz();

$("listenBtn").addEventListener("click",()=>{
  if(!("speechSynthesis" in window)){ $("micStatus").textContent="Speech playback is not supported in this browser."; return; }
  speechSynthesis.cancel();
  const u=new SpeechSynthesisUtterance($("targetSentence").textContent);
  u.lang="en-US";u.rate=.9;speechSynthesis.speak(u);
});

let recognition=null;
$("micBtn").addEventListener("click",()=>{
  const SpeechRecognition=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(!SpeechRecognition){$("micStatus").textContent="Microphone recognition is not supported here. You can type your attempt instead.";return;}
  if(recognition){recognition.stop();return;}
  recognition=new SpeechRecognition();
  recognition.lang="en-US";recognition.interimResults=false;recognition.continuous=false;
  recognition.onstart=()=>{$("micStatus").textContent="🎙️ Listening... Speak now.";};
  recognition.onresult=(e)=>{$("spokenText").value=e.results[0][0].transcript;};
  recognition.onerror=()=>{$("micStatus").textContent="Microphone error. Check browser microphone permission.";};
  recognition.onend=()=>{$("micStatus").textContent="";recognition=null;};
  recognition.start();
});

$("checkSpeaking").addEventListener("click",()=>{
  const target=$("targetSentence").textContent.toLowerCase().replace(/[.,!?]/g,"").split(/\s+/);
  const spoken=$("spokenText").value.trim().toLowerCase().replace(/[.,!?]/g,"").split(/\s+/);
  if(!spoken[0]){$("speakingResult").textContent="Please speak or type your sentence first.";return;}
  const matches=target.filter(w=>spoken.includes(w)).length;
  const result=Math.round(matches/target.length*100);
  $("speakingResult").textContent=`Practice score: ${result}/100 — ${result>=80?"Excellent! Keep going. 🌟":"Good attempt. Speak slowly and clearly."}`;
});

all(".grammar-option").forEach(button=>{
  button.addEventListener("click",()=>{
    $("grammarResult").textContent=button.dataset.correct==="true"?"Correct! 🎉":"Not quite. Try the other sentence.";
  });
});

$("apiBtn").addEventListener("click",()=>{$("apiModal").classList.add("show");$("apiKeyInput").value=localStorage.getItem("lumina_gemini_key")||"";});
$("closeModal").addEventListener("click",()=>$("apiModal").classList.remove("show"));
$("apiModal").addEventListener("click",(e)=>{if(e.target===$("apiModal"))$("apiModal").classList.remove("show");});
$("saveApiKey").addEventListener("click",()=>{
  const key=$("apiKeyInput").value.trim();
  if(key)localStorage.setItem("lumina_gemini_key",key);else localStorage.removeItem("lumina_gemini_key");
  $("apiStatus").textContent=key?"API key saved on this device.":"API key removed.";
});

})();