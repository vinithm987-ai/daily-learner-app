(() => {
"use strict";
const $=id=>document.getElementById(id);
const pages=["home","search","vocab","quiz","speaking","grammar"];

function showPage(name){if(!pages.includes(name))name="home";document.querySelectorAll(".page").forEach(x=>x.classList.toggle("active",x.id===name));document.querySelectorAll(".nav").forEach(x=>x.classList.toggle("active",x.dataset.page===name));window.scrollTo({top:0,behavior:"smooth"});}
document.addEventListener("click",e=>{const p=e.target.closest("[data-page]");if(p){e.preventDefault();showPage(p.dataset.page)}const q=e.target.closest("[data-query]");if(q){showPage("search");$("mainSearch").value=q.dataset.query;runSearch(q.dataset.query)}});

const knowledge=[
["present tense","Present Simple Tense","<p><b>Use:</b> for habits, routines, facts and repeated actions.</p><ul><li>I study English every day.</li><li>She works in a bank.</li><li>Do you study English?</li></ul><p><b>Tip:</b> use <b>-s/-es</b> with he, she and it.</p>"],
["present simple","Present Simple Tense","<p>The present simple is used for habits, routines, facts and repeated actions.</p><p><b>Example:</b> I read books every day.</p>"],
["past tense","Past Simple Tense","<p><b>Use:</b> for completed actions in the past.</p><p><b>Examples:</b> I studied yesterday. She went to college last week.</p>"],
["past simple","Past Simple Tense","<p>The past simple describes a completed past action. Regular verbs often use <b>-ed</b>; some verbs are irregular, such as go → went.</p>"],
["future tense","Future Simple Tense","<p>Use <b>will + base verb</b> for future actions and predictions.</p><p><b>Example:</b> I will practice English tomorrow.</p>"],
["future simple","Future Simple Tense","<p>Use <b>will + verb</b>: She will study tomorrow.</p>"],
["present perfect","Present Perfect","<p>Form: <b>have/has + past participle</b>. It connects a past action to the present.</p><p><b>Example:</b> I have finished my homework.</p>"],
["resilient","Resilient — Vocabulary","<p><b>Meaning:</b> able to recover quickly from difficulty.</p><p><b>Example:</b> She stayed resilient after many challenges.</p><p><b>Synonyms:</b> strong, adaptable, tough.</p>"],
["speaking","Improve English Speaking","<ol><li>Speak aloud for 10 minutes daily.</li><li>Learn 5 useful words.</li><li>Read a paragraph aloud.</li><li>Record your voice.</li><li>Repeat difficult sentences.</li></ol>"],
["improve speaking","Improve English Speaking","<ol><li>Practice every day.</li><li>Speak short sentences first.</li><li>Listen and repeat native speech.</li><li>Record yourself and correct mistakes.</li></ol>"],
["vocabulary","English Vocabulary","<p>Vocabulary means the words a person knows and uses.</p><p>Learn 5 words per day and make one sentence with each word.</p>"],
["grammar","English Grammar","<p>Grammar is the system of rules used to form correct sentences. It includes tenses, nouns, verbs, adjectives, articles and sentence structure.</p>"],
["compound interest","Compound Interest","<p>Compound interest is interest calculated on the original principal plus previously earned interest.</p><p><b>Example:</b> If ₹10,000 earns 10% annually, the second year's interest is calculated on ₹11,000, not only ₹10,000.</p>"],
["simple interest","Simple Interest","<p>Simple interest is calculated only on the original principal.</p><p><b>Formula:</b> SI = P × R × T / 100.</p>"],
["working capital","Working Capital","<p>Working capital measures a firm's short-term operating liquidity.</p><p><b>Formula:</b> Current Assets − Current Liabilities.</p>"],
["capital budgeting","Capital Budgeting","<p>Capital budgeting is the process of evaluating long-term investment projects. Common methods include NPV, IRR and Payback Period.</p>"],
["financial management","Financial Management","<p>Financial management deals with planning, raising, investing and controlling money in an organisation. Major decisions include investment, financing and dividend decisions.</p>"]
];

function clean(q){return q.toLowerCase().replace(/[?!.,]/g," ").replace(/\s+/g," ").trim();}
function renderAnswer(title,html,source="Lumina learning knowledge"){ $("answerTitle").textContent=title;$("answerBody").innerHTML=html;$("sources").innerHTML=`<div class="source"><span class="muted">Source:</span> ${source}</div>`; }

async function wikipediaSearch(q){
  const url="https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch="+encodeURIComponent(q)+"&format=json&origin=*&utf8=1&srlimit=1";
  const r=await fetch(url);if(!r.ok)throw new Error("Search request failed");
  const d=await r.json();if(!d.query||!d.query.search||!d.query.search.length)throw new Error("No result");
  return d.query.search[0].title;
}
async function wikipediaSummary(title){
  const r=await fetch("https://en.wikipedia.org/api/rest_v1/page/summary/"+encodeURIComponent(title));
  if(!r.ok)throw new Error("Summary unavailable");return await r.json();
}

async function runSearch(raw){
  const q=(raw||"").trim();if(!q){renderAnswer("Type a question","<p>Please type a question or topic, then press <b>Search</b>.</p>");return;}
  showPage("search");$("mainSearch").value=q;$("status").textContent="Searching…";$("sources").innerHTML="";
  const c=clean(q);
  let hit=knowledge.find(x=>c.includes(x[0]));
  if(!hit){
    const stripped=c.replace(/^(please |can you |could you |tell me |explain |what is |what are |who is |define |meaning of |how to )/,"").trim();
    hit=knowledge.find(x=>stripped.includes(x[0])||x[0].includes(stripped));
  }
  if(hit){
    renderAnswer(hit[1],hit[2]);saveRecent(q);$("status").textContent="Answer found ✓";$("answer").scrollIntoView({behavior:"smooth",block:"start"});return;
  }
  try{
    const title=await wikipediaSearch(q);
    const d=await wikipediaSummary(title);
    if(d.extract){
      renderAnswer(d.title,`<p>${escapeHtml(d.extract)}</p><p><b>Learning tip:</b> Ask a follow-up question to understand this topic more deeply.</p>`,d.content_urls?.desktop?.page||"Wikipedia");
      if(d.content_urls?.desktop?.page)$("sources").innerHTML=`<div class="source"><span class="muted">Source:</span> <a href="${d.content_urls.desktop.page}" target="_blank" rel="noopener">Read source</a></div>`;
      $("status").textContent="Web learning result ✓";saveRecent(q);$("answer").scrollIntoView({behavior:"smooth",block:"start"});return;
    }
  }catch(e){}
  renderAnswer("I need a little more detail",`<p>I could not find a ready learning answer for <b>${escapeHtml(q)}</b>.</p><p>Try a more specific question such as:</p><ul><li>What is ${escapeHtml(q)}?</li><li>Explain ${escapeHtml(q)} in simple words.</li><li>Give me an example of ${escapeHtml(q)}.</li></ul>`);
  $("status").textContent="No direct result";saveRecent(q);
}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));}
function doSearch(id){const q=$(id).value;if(q.trim())runSearch(q);}

$("mainAsk").onclick=()=>doSearch("mainSearch");$("heroAsk").onclick=()=>{showPage("search");doSearch("heroSearch")};$("topAsk").onclick=()=>{showPage("search");doSearch("topSearch")};
["mainSearch","heroSearch","topSearch"].forEach(id=>$(id).addEventListener("keydown",e=>{if(e.key==="Enter") {e.preventDefault();if(id==="heroSearch"){showPage("search");doSearch(id)}else if(id==="topSearch"){showPage("search");doSearch(id)}else doSearch(id)}}));

function saveRecent(q){let a=JSON.parse(localStorage.getItem("lumina_recent")||"[]");a=[q,...a.filter(x=>x.toLowerCase()!==q.toLowerCase())].slice(0,10);localStorage.setItem("lumina_recent",JSON.stringify(a));renderRecent();}
function renderRecent(){let a=JSON.parse(localStorage.getItem("lumina_recent")||"[]");$("recentList").innerHTML=a.length?a.map(q=>`<button class="recent-item" data-query="${escapeHtml(q)}">${escapeHtml(q)}</button>`).join(""):"<p class='muted'>No searches yet.</p>";}
$("clearRecent").onclick=()=>{localStorage.removeItem("lumina_recent");renderRecent()};renderRecent();

const words=[["Resilient","/rɪˈzɪliənt/","Able to recover quickly from difficulties.","She remained resilient after many challenges.","strong, adaptable, tough"],["Diligent","/ˈdɪlɪdʒənt/","Showing careful and persistent effort.","He is a diligent student.","hardworking, careful, dedicated"],["Curious","/ˈkjʊəriəs/","Wanting to learn or know more.","She is curious about finance.","inquisitive, interested, eager"],["Confident","/ˈkɒnfɪdənt/","Feeling sure about your ability.","He spoke confidently in class.","assured, bold, self-assured"],["Precise","/prɪˈsaɪs/","Exact and accurate.","Please give a precise answer.","exact, accurate, specific"]];
let wi=0;function word(){let w=words[wi%words.length];$("wordNo").textContent=(wi%100+1)+" / 100";$("word").textContent=w[0];$("pron").textContent=w[1];$("meaning").textContent=w[2];$("example").textContent=w[3];$("synonyms").textContent=w[4];}$("nextWord").onclick=()=>{wi++;word()};word();

const qs=[["What does resilient mean?",["Able to recover from difficulties","Very expensive","Unable to learn"],0],["Choose the correct sentence.",["She study every day.","She studies every day.","She studying every day."],1],["Past tense of go?",["goed","goes","went"],2],["Synonym of diligent?",["lazy","hardworking","careless"],1],["Which is future?",["I studied yesterday.","I am studying now.","I will study tomorrow."],2]];
let qi=0,done=false;function quiz(){let q=qs[qi%qs.length];$("qNo").textContent=qi%20+1;$("qText").textContent=q[0];$("options").innerHTML=q[1].map((x,i)=>`<button class="option" data-i="${i}">${escapeHtml(x)}</button>`).join("");$("feedback").textContent="";$("nextQ").disabled=true;done=false;}$("options").onclick=e=>{let b=e.target.closest(".option");if(!b||done)return;done=true;let n=+b.dataset.i,c=qs[qi%qs.length][2];document.querySelectorAll(".option").forEach((x,i)=>{if(i===c)x.classList.add("correct");if(i===n&&n!==c)x.classList.add("wrong")});$("feedback").textContent=n===c?"✓ Correct!":"✗ Try again next time."; $("nextQ").disabled=false};$("nextQ").onclick=()=>{qi++;quiz()};quiz();

$("speak").onclick=()=>{const R=window.SpeechRecognition||window.webkitSpeechRecognition;if(!R){$("speechText").textContent="Speech recognition is not supported here. Use Google Chrome.";return;}const r=new R();r.lang="en-US";r.onstart=()=>{$("speak").textContent="🎙 Listening…"};r.onresult=e=>{$("speechText").textContent='You said: "'+e.results[0][0].transcript+'"';$("score").textContent="Speech captured ✓"};r.onerror=e=>$("speechText").textContent="Microphone error: "+e.error;r.onend=()=>{$("speak").textContent="🎙 Start Speaking"};r.start();};
})();