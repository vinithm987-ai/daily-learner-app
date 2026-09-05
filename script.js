/* ALVIN AI — complete static GitHub Pages version
   Gemini API key is entered by the user in Settings and stored only in localStorage.
   For a public production application, move Gemini calls to a server-side endpoint.
*/

const KEY="alvin_ai_v2";
const state={
  page:"home",
  day:Number(localStorage.getItem("alvin_day")||1),
  theme:localStorage.getItem("alvin_theme")||"light",
  apiKey:localStorage.getItem("alvin_api_key")||"",
  model:localStorage.getItem("alvin_model")||"gemini-3.7-flash",
  webSearch:localStorage.getItem("alvin_search")==="true",
  mode:localStorage.getItem("alvin_mode")||"deep",
  history:JSON.parse(localStorage.getItem("alvin_history")||"[]"),
  conversations:JSON.parse(localStorage.getItem("alvin_conversations")||"[]"),
  currentConversationId:localStorage.getItem("alvin_current_conversation")||"",
  learned:JSON.parse(localStorage.getItem("alvin_learned")||"[]"),
  quizScore:Number(localStorage.getItem("alvin_quiz_score")||0),
  xp:Number(localStorage.getItem("alvin_xp")||0),
  vocabIndex:Number(localStorage.getItem("alvin_vocab_index")||0)
};

const words=[
"abandon","abundant","accelerate","accessible","accomplish","accurate","adapt","adequate","advocate","allocate",
"ambiguous","anticipate","apparent","appreciate","arbitrary","assess","attain","authentic","beneficial","coherent",
"collaborate","compelling","comprehensive","consecutive","considerable","consistent","constructive","consume","contemporary","contradict",
"crucial","decline","deduce","demonstrate","derive","diverse","dominate","elaborate","efficient","eliminate",
"emerge","empirical","enhance","equivalent","ethical","evaluate","evident","exceed","exclude","explicit",
"facilitate","feasible","flexible","fluctuate","fundamental","generate","implement","imply","incentive","incorporate",
"indicate","inevitable","infer","innovate","integrate","interpret","justify","legitimate","maintain","maximize",
"modify","negotiate","objective","obtain","obvious","persist","perspective","precise","predict","preliminary",
"prioritize","proceed","profound","promote","proportion","rational","recover","refine","relevant","reliable",
"resolve","retain","revenue","significant","strategy","subsequent","sustain","transform","transparent","validate",
"volatile","acquisition","asset","liability","capital","equity","debt","dividend","portfolio","liquidity",
"solvency","profitability","leverage","valuation","yield","interest","inflation","deflation","recession","forecast",
"budget","audit","accounting","balance","cashflow","credit","debtor","creditor","inventory","turnover",
"margin","expense","income","depreciation","amortization","provision","reserve","taxation","invoice","ledger",
"journal","reconciliation","collateral","default","risk","return","hedging","derivative","futures","options",
"premium","discount","maturity","coupon","bond","debenture","security","index","market","broker",
"exchange","regulation","compliance","governance","stakeholder","merger","divestment","synergy","strategy","competitive",
"advantage","benchmark","productivity","efficiency","innovation","entrepreneur","enterprise","management","leadership","motivation",
"communication","negotiation","decision","planning","organizing","controlling","delegation","teamwork","conflict","culture",
"recruitment","training","performance","career","professional","corporate","industry","sector","consumer","demand",
"supply","pricing","marketing","brand","customer","segment","positioning","promotion","distribution","research",
"analysis","data","evidence","methodology","variable","sample","population","correlation","regression","probability",
"hypothesis","reliable","validity","qualitative","quantitative","survey","observation","conclusion","recommendation","insight",
"concept","principle","theory","framework","process","procedure","function","component","structure","factor",
"impact","importance","purpose","objective","feature","benefit","limitation","challenge","solution","approach",
"resource","capacity","capability","technology","digital","automation","artificial","intelligence","algorithm","database",
"software","hardware","network","security","privacy","platform","interface","application","website","development",
"debug","syntax","functionality","responsive","browser","server","client","storage","authentication","authorization",
"encryption","backup","update","version","repository","deployment","domain","hosting","search","prompt",
"explain","clarify","compare","summarize","translate","correct","pronounce","practice","confidence","fluency",
"grammar","sentence","paragraph","argument","discussion","presentation","interview","answer","question","example",
"definition","meaning","context","synonym","antonym","phrase","expression","formal","informal","natural",
"academic","professional","casual","persuasive","critical","creative","logical","analytical","practical","theoretical",
"knowledge","learning","memory","revision","focus","habit","discipline","progress","achievement","consistent",
"daily","weekly","monthly","annual","target","goal","milestone","feedback","improvement","growth",
"responsibility","integrity","accountability","transparency","sustainable","environmental","social","economic","governance","ethical",
"diversity","inclusion","community","development","impactful","responsible","investment","investor","shareholder","fund",
"mutual","insurance","pension","banking","fintech","blockchain","digitalization","transaction","payment","interest-rate",
"principal","installment","mortgage","saving","wealth","finance","financial","economy","economic","monetary",
"fiscal","policy","central","government","currency","foreign","trade","export","import","balance-of-payments",
"strategy","tactic","vision","mission","value","quality","service","operations","logistics","procurement",
"production","manufacturing","supply-chain","warehouse","distribution","forecasting","capacity","quality-control","product","process",
"risk-management","internal-control","audit","fraud","misstatement","materiality","disclosure","reporting","statement","ratio",
"current","quick","gross","net","return-on-investment","earnings","share","price","market-capitalization","cash",
"working-capital","capital-budgeting","payback","discounted","cash-flow","net-present-value","internal-rate","cost-of-capital","weighted","average",
"capital-structure","financial-decision","investment-decision","financing","dividend-policy","agency","signaling","pecking-order","trade-off","modigliani",
"miller","arbitrage","systematic","unsystematic","diversification","beta","alpha","risk-free","market-return","security-market",
"portfolio-management","asset-allocation","fundamental-analysis","technical-analysis","value-investing","growth-investing","behavioral","preserver","follower",
"independent","accumulator","bias","overconfidence","anchoring","herding","loss-aversion","prospect","rationality","decision-making"
];

const themes=[
  ["English Foundations","communication and vocabulary"],
  ["MBA Finance","financial management and business"],
  ["Accounting & Tally","accounting concepts and records"],
  ["Business Management","management and leadership"],
  ["Data & Research","analysis and decision-making"],
  ["Technology","digital skills and AI"],
  ["Speaking Skills","English speaking confidence"],
  ["Career Preparation","resume, interviews and workplace skills"]
];

const meanings={
  abandon:"to leave something or someone completely",
  abundant:"available in large quantities",
  accelerate:"to make something happen faster",
  accessible:"easy to reach, use, understand, or obtain",
  accomplish:"to successfully complete something",
  accurate:"correct and free from mistakes",
  adapt:"to change so that something works in a new situation",
  adequate:"enough for a particular purpose",
  advocate:"to publicly support an idea or cause",
  allocate:"to distribute a resource for a particular purpose",
  ambiguous:"having more than one possible meaning",
  anticipate:"to expect something before it happens",
  apparent:"easy to see or understand",
  appreciate:"to recognize the value or importance of something",
  arbitrary:"based on personal choice rather than a clear reason",
  assess:"to evaluate or judge something",
  attain:"to achieve or reach something",
  authentic:"real, genuine, or trustworthy",
  beneficial:"producing a useful or positive result",
  coherent:"clear, logical, and connected",
  collaborate:"to work together toward a shared goal",
  compelling:"very convincing or persuasive",
  comprehensive:"including all or nearly all important details",
  consistent:"remaining the same or behaving reliably",
  constructive:"helpful in improving something",
  crucial:"extremely important",
  decline:"to decrease or become less",
  deduce:"to reach a conclusion from available facts",
  demonstrate:"to show clearly how something works or is true",
  derive:"to obtain something from a source",
  diverse:"including many different types or groups",
  dominate:"to have control or the strongest influence",
  elaborate:"to explain or develop something in more detail",
  efficient:"working well without wasting time or resources",
  eliminate:"to remove something completely",
  emerge:"to appear or become known",
  empirical:"based on observation or evidence",
  enhance:"to improve the quality or value of something",
  equivalent:"equal in value, meaning, or effect",
  ethical:"following accepted principles of right and fair behavior",
  evaluate:"to carefully judge the quality, value, or importance",
  evident:"clear and easy to notice",
  exceed:"to be greater than a limit or expectation",
  explicit:"stated clearly and directly",
  facilitate:"to make an activity or process easier",
  feasible:"possible and practical to achieve",
  flexible:"able to change or adapt easily",
  fluctuate:"to rise and fall irregularly",
  fundamental:"basic and essential",
  generate:"to produce or create",
  implement:"to put a plan or decision into action",
  imply:"to suggest something without saying it directly",
  incentive:"something that encourages a person to act",
  incorporate:"to include something as part of a whole",
  indicate:"to show or point to something",
  inevitable:"certain to happen",
  infer:"to form a conclusion from evidence",
  innovate:"to introduce a new idea, method, or product",
  integrate:"to combine parts into a whole",
  interpret:"to explain the meaning of something",
  justify:"to give a good reason for an action or decision",
  legitimate:"lawful, valid, or reasonable",
  maintain:"to keep something in a particular condition",
  maximize:"to make something as large, useful, or effective as possible",
  modify:"to change something slightly",
  negotiate:"to discuss in order to reach an agreement",
  objective:"a specific goal or unbiased",
  obtain:"to get or acquire something",
  obvious:"easy to understand or notice",
  persist:"to continue despite difficulty",
  perspective:"a particular way of viewing something",
  precise:"exact and accurate",
  predict:"to say what is likely to happen",
  prioritize:"to decide what is most important first",
  profound:"very deep or having a strong effect",
  promote:"to support, encourage, or help something develop",
  rational:"based on reason and logic",
  recover:"to return to a normal or healthy state",
  refine:"to improve something by making small changes",
  relevant:"closely connected to the topic",
  reliable:"able to be trusted or depended on",
  resolve:"to solve a problem or reach a decision",
  retain:"to keep or continue to have something",
  revenue:"money a business receives from its activities",
  significant:"important or large enough to matter",
  strategy:"a planned approach for achieving a goal",
  sustain:"to continue or maintain over time",
  transform:"to change something significantly",
  transparent:"open, clear, and easy to understand",
  validate:"to confirm that something is correct or acceptable",
  volatile:"likely to change rapidly and unpredictably"
};

function persist(){
  localStorage.setItem("alvin_day",String(state.day));
  localStorage.setItem("alvin_theme",state.theme);
  localStorage.setItem("alvin_api_key",state.apiKey);
  localStorage.setItem("alvin_model",state.model);
  localStorage.setItem("alvin_search",String(state.webSearch));
  localStorage.setItem("alvin_mode",state.mode);
  localStorage.setItem("alvin_history",JSON.stringify(state.history.slice(-40)));
  localStorage.setItem("alvin_conversations",JSON.stringify(state.conversations.slice(-30)));
  localStorage.setItem("alvin_current_conversation",state.currentConversationId||"");
  localStorage.setItem("alvin_learned",JSON.stringify(state.learned));
  localStorage.setItem("alvin_quiz_score",String(state.quizScore));
  localStorage.setItem("alvin_xp",String(state.xp));
  localStorage.setItem("alvin_vocab_index",String(state.vocabIndex));
}

function esc(s){
  return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}

function toast(msg){
  const el=document.getElementById("toast");
  el.textContent=msg;el.classList.add("show");
  clearTimeout(window.__toast);window.__toast=setTimeout(()=>el.classList.remove("show"),2300);
}

function setTheme(){
  document.body.classList.toggle("dark",state.theme==="dark");
}

function layout(content,active="home"){
  return `<div class="app-shell">
    <header class="topbar">
      <div class="brand"><div class="logo">✦</div><div><strong>ALVIN AI</strong><small>Daily Learning</small></div></div>
      <nav class="nav">
        ${["home","days","lessons","vocabulary","speaking","quiz","ai","progress"].map(p=>`<button data-page="${p}" class="${active===p?"active":""}">${({home:"Home",days:"365 Days",lessons:"Lessons",vocabulary:"Vocabulary",speaking:"Speaking",quiz:"Quiz",ai:"AI Tutor",progress:"Progress"})[p]}</button>`).join("")}
      </nav>
      <div class="top-actions"><button class="top-action" id="themeBtn" title="Theme">${state.theme==="dark"?"☀️":"🌙"}</button><button class="top-action" id="settingsBtn" title="Gemini settings">⚙</button></div>
    </header>
    <main class="main">${content}</main>
  </div>`;
}

function homePage(){
  const pct=Math.round(((state.day-1)/365)*100);
  return layout(`<div class="container">
    <section class="hero">
      <div class="hero-main">
        <span class="eyebrow">YOUR PERSONAL AI LEARNING SPACE</span>
        <h1>Learn every day with ALVIN AI.</h1>
        <p>Study English, Finance, MBA subjects, interview skills, coding and more. Ask Gemini questions in a ChatGPT-style tutor and follow a complete 365-day learning journey.</p>
        <div class="row"><button class="btn primary" data-page="days">Continue Day ${state.day} →</button><button class="btn secondary" data-page="ai">Ask AI Tutor</button></div>
      </div>
      <div class="hero-card">
        <span class="muted">365-day course</span>
        <div class="big">${pct}%</div>
        <div class="progress"><i style="width:${pct}%"></i></div>
        <p class="muted">Day ${state.day} of 365 • ${state.xp} XP</p>
      </div>
    </section>
    <div class="stats">
      <div class="stat">📅 Day<strong>${state.day}/365</strong><span class="muted">Today's lesson</span></div>
      <div class="stat">🧠 Vocabulary<strong>${state.learned.length}</strong><span class="muted">Words learned</span></div>
      <div class="stat">🏆 XP<strong>${state.xp}</strong><span class="muted">Learning points</span></div>
      <div class="stat">💬 AI chats<strong>${state.history.filter(x=>x.role==="user").length}</strong><span class="muted">Questions asked</span></div>
    </div>
    <section class="section"><h2>Learn with ALVIN</h2><p class="muted">Everything is inside this website.</p>
      <div class="grid">
        ${feature("🤖","AI Tutor","Ask any question and get a deep, structured answer.","ai")}
        ${feature("📅","365 Days","One different learning word and topic every day.","days")}
        ${feature("📚","Lessons","Study English, finance, business and career topics.","lessons")}
        ${feature("🧠","Vocabulary","Learn meaning, pronunciation and examples.","vocabulary")}
        ${feature("🗣️","Speaking","Practise sentences with your microphone and voice.","speaking")}
        ${feature("❓","Quiz","Test yourself and build your score.","quiz")}
      </div>
    </section>
  </div>`,"home");
}

function feature(icon,title,desc,page){
  return `<button class="feature" data-page="${page}"><div class="ico">${icon}</div><h3>${title}</h3><p class="muted">${desc}</p></button>`;
}

function currentWord(){
  const w=words[(state.day-1)%words.length];
  const m=meanings[w]||genericMeaning(w);
  const ex=`The team used ${w} to improve its performance and make a better decision.`;
  return {word:w,meaning:m,example:ex,theme:themes[(state.day-1)%themes.length][0]};
}
function genericMeaning(w){
  return `A useful English word to learn. Ask ALVIN AI for a detailed definition, pronunciation, synonyms, antonyms and examples of “${w}”.`;
}

function daysPage(){
  const x=currentWord();
  return layout(`<div class="container">
    <div class="row" style="justify-content:space-between"><div><span class="eyebrow">365-DAY COURSE</span><h1>Day ${state.day} of 365</h1><p class="muted">${x.theme}</p></div><button class="btn primary" data-page="ai" data-ai-query="Teach me Day ${state.day} of my 365-day course. Topic: ${x.theme}. Word: ${x.word}. Give a deep lesson, simple explanation, examples, practical use, mistakes, speaking practice, exam/interview use and 5 questions.">Ask AI to teach today's day ✦</button></div>
    <div class="lesson-grid">
      <article class="card word-card">
        <span class="eyebrow">TODAY'S WORD</span><div class="word">${esc(x.word)}</div>
        <div class="phonetic">Pronunciation: /${esc(x.word)}/</div>
        <h3>Meaning</h3><p>${esc(x.meaning)}</p>
        <div class="example"><strong>Example:</strong> ${esc(x.example)}</div>
        <div class="row">
          <button class="btn secondary" data-action="speak" data-text="${esc(x.word)}. ${esc(x.meaning)}">🔊 Hear</button>
          <button class="btn primary" data-action="learnDay">✓ Complete Day ${state.day}</button>
        </div>
      </article>
      <aside class="card"><h3>Today's checklist</h3><p>☑ Learn the word</p><p>☑ Ask AI for the full lesson</p><p>☑ Practise speaking</p><p>☑ Take the quiz</p><hr><p class="muted">Completing a day gives +20 XP and unlocks the next day.</p></aside>
    </div>
    <section class="section"><div class="card"><h3>Choose a day</h3><p class="muted">Days are unlocked sequentially.</p><div class="day-grid">${Array.from({length:365},(_,i)=>{const n=i+1;const unlocked=n<=state.day;const done=n<state.day;return `<button class="day ${n===state.day?"active":""} ${done?"done":""}" ${unlocked?"":"disabled"} data-day="${n}">${done?"✓ ":""}${n}</button>`}).join("")}</div></div></section>
  </div>`,"days");
}

function lessonsPage(){
  const x=currentWord();
  return layout(`<div class="container"><div class="card">
    <span class="eyebrow">LESSON FOR DAY ${state.day}</span><h1>${x.theme}</h1>
    <p>This lesson is designed to be expanded by Gemini whenever you want a deeper explanation.</p>
    <div class="example"><strong>Today's learning word:</strong> ${esc(x.word)} — ${esc(x.meaning)}</div>
    <div class="row"><button class="btn primary" data-page="ai" data-ai-query="Teach me today's Day ${state.day} lesson about ${x.theme}. Start from beginner level and explain deeply with meaning, key concepts, examples, practical application, common mistakes, exam answer, interview answer, quick revision and 5 questions. Today's word is ${x.word}.">Open complete AI lesson ✦</button><button class="btn secondary" data-page="days">Back to 365 Days</button></div>
  </div></div>`,"lessons");
}

function vocabularyPage(){
  const idx=state.vocabIndex%words.length,w=words[idx],m=meanings[w]||genericMeaning(w);
  return layout(`<div class="container"><div class="card word-card">
    <span class="eyebrow">VOCABULARY VAULT • ${idx+1}/365+</span><div class="word">${esc(w)}</div><div class="phonetic">Pronunciation: /${esc(w)}/</div>
    <h3>Meaning</h3><p>${esc(m)}</p><div class="example"><strong>Example:</strong> The manager used the word <b>${esc(w)}</b> while explaining the business situation.</div>
    <div class="row"><button class="btn secondary" data-action="speak" data-text="${esc(w)}. ${esc(m)}">🔊 Listen</button><button class="btn primary" data-action="knowWord">✓ I know this</button><button class="btn secondary" data-action="nextWord">Next word →</button><button class="btn ghost" data-page="ai" data-ai-query="Teach me the English word ${esc(w)} in depth. Give meaning, pronunciation, part of speech, CEFR level, synonyms, antonyms, collocations, 5 examples, common mistakes, speaking practice and a mini quiz.">Ask AI about this word</button></div>
  </div></div>`,"vocabulary");
}

function speakingPage(){
  const sentences=[
    "I am studying MBA in Finance and improving my communication skills.",
    "I practise English every day because I want to speak clearly and confidently.",
    "I enjoy solving financial problems and learning new concepts.",
    "My goal is to build a strong career in the corporate sector.",
    "I never give up when I face a difficult topic."
  ];
  const i=Number(localStorage.getItem("alvin_sentence")||0);
  return layout(`<div class="container"><div class="card">
    <span class="eyebrow">10-MINUTE SPEAKING PRACTICE</span><h1>Speak with confidence.</h1>
    <p class="muted">Read the sentence aloud, use the microphone, then ask AI to correct your English.</p>
    <div class="example"><strong>Practice sentence:</strong><br><span id="speakSentence">${esc(sentences[i])}</span></div>
    <div class="row"><button class="btn secondary" data-action="speakSentence">🔊 Listen</button><button class="btn primary" data-action="voice">🎙 Speak</button><button class="btn secondary" data-action="nextSentence">Next sentence →</button></div>
    <div id="voiceResult" class="card" style="margin-top:15px;background:var(--panel2)"><span class="muted">Your spoken sentence will appear here.</span></div>
    <button class="btn primary" style="margin-top:12px" data-page="ai" data-ai-query="Act as my English speaking coach. Correct my spoken English, explain every important mistake, give a natural version, pronunciation tips and three practice sentences.">Open English AI Coach ✦</button>
  </div></div>`,"speaking");
}

const quizBank=[
  ["What does “accurate” mean?",["Correct and free from mistakes","Very expensive","Difficult to understand","Temporary"],0,"Accurate means correct and free from mistakes."],
  ["Which decision is mainly about choosing long-term assets?",["Investment decision","Dividend decision","Recruitment decision","Marketing decision"],0,"Investment decisions involve selecting assets or projects."],
  ["What is liquidity?",["Ability to meet short-term obligations","Total sales","Employee motivation","Long-term growth"],0,"Liquidity is the ability to meet short-term financial obligations."],
  ["What is revenue?",["Money received from business activities","Only profit after tax","A business loan","An employee benefit"],0,"Revenue is income generated from normal business activities."],
  ["What is a strategy?",["A planned approach for achieving a goal","A random action","A financial statement","A tax"],0,"Strategy is a planned approach used to achieve an objective."]
];
function quizPage(){
  const i=state.day%quizBank.length,q=quizBank[i];
  return layout(`<div class="container"><div class="card">
    <span class="eyebrow">DAILY QUIZ</span><h1>${esc(q[0])}</h1><div class="quiz-options">${q[1].map((o,j)=>`<button class="quiz-option" data-answer="${j}">${esc(o)}</button>`).join("")}</div>
    <p id="quizFeedback" class="muted">Choose one answer.</p><p><strong>Score:</strong> ${state.quizScore}</p>
  </div></div>`,"quiz");
}

function progressPage(){
  const pct=Math.round(((state.day-1)/365)*100);
  return layout(`<div class="container"><div class="stats">
    <div class="stat">📅 Course<strong>${pct}%</strong><span class="muted">365-day progress</span></div>
    <div class="stat">⭐ XP<strong>${state.xp}</strong><span class="muted">Learning points</span></div>
    <div class="stat">🧠 Words<strong>${state.learned.length}</strong><span class="muted">Learned</span></div>
    <div class="stat">🏆 Quiz<strong>${state.quizScore}</strong><span class="muted">Correct answers</span></div>
  </div><div class="card"><h2>Keep going</h2><p class="muted">Your next target is Day ${Math.min(365,state.day+1)}. Small daily progress is the goal.</p><div class="progress"><i style="width:${pct}%"></i></div></div></div>`,"progress");
}

function conversationTitle(){
  const first=state.history.find(m=>m.role==="user");
  if(!first)return "New conversation";
  return first.text.replace(/\s+/g," ").trim().slice(0,55)+(first.text.trim().length>55?"…":"");
}
function saveCurrentConversation(){
  if(!state.history.some(m=>m.role==="user"))return;
  const now=Date.now();
  const id=state.currentConversationId||String(now);
  state.currentConversationId=id;
  const item={id,title:conversationTitle(),messages:state.history.slice(-40),updatedAt:now};
  const idx=state.conversations.findIndex(x=>x.id===id);
  if(idx>=0)state.conversations[idx]=item;else state.conversations.unshift(item);
  state.conversations.sort((a,b)=>b.updatedAt-a.updatedAt);
  persist();
}
function historyListHTML(){
  if(!state.conversations.length)return `<div class="history-empty">No saved AI conversations yet.</div>`;
  return state.conversations.slice(0,15).map(c=>`<button class="history-item ${c.id===state.currentConversationId?"active":""}" data-history-id="${esc(c.id)}"><span>💬</span><span class="history-title">${esc(c.title)}</span></button>`).join("");
}
function loadConversation(id){
  const c=state.conversations.find(x=>x.id===id);
  if(!c)return;
  state.currentConversationId=c.id;
  state.history=c.messages||[];
  persist();renderAIOnly();
}
function deleteConversation(id){
  state.conversations=state.conversations.filter(x=>x.id!==id);
  if(state.currentConversationId===id){state.currentConversationId="";state.history=[];}
  persist();renderAIOnly();
}

function aiPage(){
  const connected=Boolean(state.apiKey);
  const starter=[
    ["💰","Financial Management","Explain financial management in depth with examples, formulas, advantages, limitations, an MBA exam answer and interview questions."],
    ["📊","Capital Structure","Explain capital structure deeply, including theories, formulas, numerical example, advantages, limitations and practical business example."],
    ["🗣️","English Speaking","Start a 10-minute English speaking session with vocabulary, grammar, dialogue, corrections and a mini quiz."],
    ["📅",`Day ${state.day} of 365`,`Teach me Day ${state.day} of my 365-day course in depth with today's word, lesson, examples, speaking practice and quiz.`]
  ];
  const msgs=state.history.length?state.history.map(m=>messageHTML(m)).join(""):`<div class="empty"><div class="logo">✦</div><h1>What are you learning today?</h1><p class="muted">Ask anything. ALVIN AI can teach topics deeply, correct English, solve finance problems, prepare interviews and guide your 365-day course.</p><div class="starters">${starter.map(s=>`<button class="starter" data-ai-query="${esc(s[2])}"><strong>${s[0]} ${esc(s[1])}</strong><span class="muted">${esc(s[2])}</span></button>`).join("")}</div></div>`;
  return `<div class="ai-layout">
    <aside class="ai-side">
      <button class="btn primary" style="width:100%" data-action="newChat">＋ New conversation</button>
      <div class="side-label">LEARN WITH AI</div>
      ${["deep","simple","exam","interview","english","finance"].map(m=>`<button class="side-btn ${state.mode===m?"active":""}" data-mode="${m}">${modeName(m)}</button>`).join("")}
      <div class="side-label history-heading">AI HISTORY <span>${state.conversations.length}</span></div>
      <div class="history-list">${historyListHTML()}</div>
      <button class="side-btn" id="clearHistory">🗑 Clear AI history</button>
      <div class="side-label">COURSE</div>
      <button class="side-btn" data-page="days">📅 Day ${state.day} of 365</button>
      <button class="side-btn" id="sideSettings">⚙ Gemini settings</button>
      <p class="status ${connected?"online":""}">${connected?"● Gemini connected":"○ Gemini not connected"}</p>
    </aside>
    <section class="ai-main">
      <header class="ai-head"><div><h1>ALVIN AI Tutor ✦</h1><span class="status">${esc(state.model)}</span></div><button class="top-action" id="aiSettingsTop">⚙</button></header>
      <div class="chat" id="chat">${msgs}</div>
      <div class="composer-wrap">
        <div class="mode-row">${["deep","simple","exam","interview","english","finance"].map(m=>`<button class="mode ${state.mode===m?"active":""}" data-mode="${m}">${modeName(m)}</button>`).join("")}</div>
        <div class="composer">
          <button class="circle" id="attachBtn" title="Attach text file">＋</button>
          <textarea id="aiInput" placeholder="Message ALVIN AI..." rows="1"></textarea>
          <button class="circle" id="micBtn" title="Voice input">🎙</button>
          <button class="circle send" id="sendBtn" title="Send">➤</button>
        </div>
        <input id="fileInput" class="attach" type="file" accept=".txt,.md,.csv,.json,.html">
        <div class="note">Enter to send • Shift+Enter for a new line • Your chat is stored in this browser.</div>
      </div>
    </section>
  </div>`;
}

function modeName(m){
  return {deep:"🧠 Deep",simple:"💡 Simple",exam:"📝 Exam",interview:"🎤 Interview",english:"🗣️ English",finance:"💰 Finance"}[m]||m;
}

function messageHTML(m){
  return `<div class="message ${m.role==="user"?"user":"ai"}"><div class="avatar">${m.role==="user"?"You":"✦"}</div><div class="bubble">${m.role==="user"?esc(m.text):formatAI(m.text)}</div></div>`;
}

function formatAI(text){
  let s=esc(text);
  s=s.replace(/```([\s\S]*?)```/g,(_,x)=>`<pre>${x}</pre>`);
  s=s.replace(/^### (.*)$/gm,"<h3>$1</h3>").replace(/^## (.*)$/gm,"<h2>$1</h2>").replace(/^# (.*)$/gm,"<h2>$1</h2>");
  s=s.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>").replace(/\*(.*?)\*/g,"<em>$1</em>");
  s=s.replace(/^\s*[-•]\s+(.*)$/gm,"<li>$1</li>");
  s=s.replace(/(<li>.*<\/li>)/gs,"<ul>$1</ul>");
  return s.split("\n\n").map(p=>p.includes("<h")||p.includes("<ul>")||p.includes("<pre>")?p:`<p>${p.replace(/\n/g,"<br>")}</p>`).join("");
}

function aiPrompt(q){
  const modes={
    simple:"Explain in very simple English for a beginner. Use short sentences and easy examples. If a technical word is necessary, define it immediately.",
    deep:"Teach like an expert tutor. Start from basics and go to advanced understanding. Give structured sections, examples, practical application, common mistakes and revision.",
    exam:"Prepare an MBA/exam-ready answer. Include introduction, definition, meaning, objectives, key points, types, process, example, advantages, limitations, conclusion, a short 5-mark answer and likely exam questions.",
    interview:"First teach the concept clearly. Then give a confident interview answer, likely follow-up questions and model answers.",
    english:"Act as an English speaking coach. Correct the user's English, explain important mistakes, give a natural version, pronunciation help, useful vocabulary and speaking practice.",
    finance:"Act as an MBA Finance tutor. Explain concepts clearly with formulas when relevant, define variables, show a small numerical example, practical business use, advantages, limitations, exam answer and interview answer."
  };
  return `You are ALVIN AI, a high-quality personal learning tutor.
Current mode: ${modes[state.mode]||modes.deep}

User question:
${q}

Rules:
- Answer the exact question; do not give a canned unrelated answer.
- Give enough depth for the user to actually understand the topic.
- Use clear headings and examples.
- For finance/accounting, include formulas and calculations when useful.
- For English, correct errors and explain why.
- For coding, provide complete working code when requested.
- For comparisons, use a clear table.
- If the user asks for a definition only, keep it direct but offer useful context.
- Never claim to have performed an action you did not perform.
- End longer lessons with "Quick revision" and 3 practice questions.`;
}

async function callGemini(question){
  if(!state.apiKey) throw new Error("Please open Gemini Settings and add your Gemini API key first.");
  const history=state.history.slice(-12).map(m=>({role:m.role==="model"?"model":"user",parts:[{text:m.text}]}));
  const body={
    contents:[...history,{role:"user",parts:[{text:aiPrompt(question)}]}],
    generationConfig:{temperature:0.45,maxOutputTokens:12000}
  };
  if(state.webSearch) body.tools=[{google_search:{}}];

  const url=`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(state.model)}:generateContent`;
  const response=await fetch(url,{
    method:"POST",
    headers:{"Content-Type":"application/json","x-goog-api-key":state.apiKey},
    body:JSON.stringify(body)
  });
  const data=await response.json();
  if(!response.ok){
    throw new Error(data?.error?.message||"Gemini request failed. Check your API key, model and quota.");
  }
  const text=(data?.candidates?.[0]?.content?.parts||[]).map(p=>p.text||"").join("").trim();
  if(!text) throw new Error("Gemini returned an empty answer.");
  return text;
}

async function askAI(question){
  const q=(question||document.getElementById("aiInput")?.value||"").trim();
  if(!q)return;
  if(!state.apiKey){openSettings();toast("Add your Gemini API key first.");return;}
  if(!state.currentConversationId)state.currentConversationId=String(Date.now());
  state.history.push({role:"user",text:q});
  state.history.push({role:"model",text:"__LOADING__"});
  saveCurrentConversation();
  renderAIOnly();
  try{
    const answer=await callGemini(q);
    state.history[state.history.length-1]={role:"model",text:answer};
    state.xp+=2;saveCurrentConversation();persist();renderAIOnly();
  }catch(err){
    state.history[state.history.length-1]={role:"model",text:`⚠️ ${err.message}`};
    saveCurrentConversation();persist();renderAIOnly();
  }
}

function renderAIOnly(){
  document.getElementById("app").innerHTML=aiPage();
  bind();
  const chat=document.getElementById("chat");
  if(chat)chat.scrollTop=chat.scrollHeight;
}

function openSettings(){
  const modal=document.getElementById("settingsModal");
  modal.classList.remove("hidden");
  document.getElementById("apiKey").value=state.apiKey;
  document.getElementById("modelSelect").value=state.model;
  document.getElementById("webSearch").checked=state.webSearch;
  document.getElementById("settingsStatus").textContent="";
}

async function saveSettings(){
  const key=document.getElementById("apiKey").value.trim();
  state.apiKey=key;
  state.model=document.getElementById("modelSelect").value;
  state.webSearch=document.getElementById("webSearch").checked;
  persist();
  const status=document.getElementById("settingsStatus");
  if(!key){status.textContent="No API key entered.";return;}
  status.textContent="Testing Gemini connection…";
  try{
    const old=state.history;
    state.history=[];
    const answer=await callGemini("Reply with exactly: ALVIN AI connection successful.");
    state.history=old;
    status.textContent="✓ Gemini connection successful.";
    toast("Gemini connected ✓");
    setTimeout(()=>{document.getElementById("settingsModal").classList.add("hidden");render();},700);
  }catch(e){
    state.history=JSON.parse(localStorage.getItem("alvin_history")||"[]");
    status.textContent="Connection failed: "+e.message;
  }
}

function speak(text){
  if(!("speechSynthesis" in window)){toast("Text-to-speech is not supported.");return;}
  speechSynthesis.cancel();
  speechSynthesis.speak(new SpeechSynthesisUtterance(text));
}

function voiceInput(){
  const SpeechRecognition=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(!SpeechRecognition){toast("Voice input is not supported in this browser.");return;}
  const r=new SpeechRecognition();
  r.lang="en-IN";r.interimResults=false;r.maxAlternatives=1;
  toast("Listening…");
  r.onresult=e=>{const input=document.getElementById("aiInput");if(input){input.value=e.results[0][0].transcript;input.focus();}};
  r.onerror=()=>toast("Microphone permission or voice recognition failed.");
  r.start();
}

function render(){
  setTheme();
  const pages={home:homePage,days:daysPage,lessons:lessonsPage,vocabulary:vocabularyPage,speaking:speakingPage,quiz:quizPage,ai:aiPage,progress:progressPage};
  document.getElementById("app").innerHTML=(pages[state.page]||homePage)();
  bind();
}

function bind(){
  document.querySelectorAll("[data-page]").forEach(b=>b.onclick=()=>{
    state.page=b.dataset.page;
    if(b.dataset.aiQuery){state.page="ai";render();setTimeout(()=>askAI(b.dataset.aiQuery),50);}
    else render();
  });
  document.querySelectorAll("[data-ai-query]").forEach(b=>b.onclick=()=>{
    state.page="ai";render();setTimeout(()=>askAI(b.dataset.aiQuery),50);
  });
  document.querySelectorAll("[data-mode]").forEach(b=>b.onclick=()=>{
    state.mode=b.dataset.mode;persist();
    if(state.page==="ai")renderAIOnly();else render();
  });
  document.querySelectorAll("[data-day]").forEach(b=>b.onclick=()=>{
    const n=Number(b.dataset.day);
    if(n<=state.day){state.day=n;persist();render();}
  });
  document.querySelectorAll("[data-answer]").forEach(b=>b.onclick=()=>{
    const q=quizBank[state.day%quizBank.length];
    const chosen=Number(b.dataset.answer);
    document.querySelectorAll("[data-answer]").forEach(x=>x.disabled=true);
    b.classList.add(chosen===q[2]?"correct":"wrong");
    if(chosen===q[2]){state.quizScore++;state.xp+=5;toast("+5 XP — Correct!");}
    else document.querySelector(`[data-answer="${q[2]}"]`)?.classList.add("correct");
    document.getElementById("quizFeedback").textContent=q[3];persist();
  });
  document.querySelectorAll("[data-history-id]").forEach(b=>b.onclick=()=>loadConversation(b.dataset.historyId));
  document.getElementById("clearHistory")?.addEventListener("click",()=>{
    if(!confirm("Delete all saved AI history? This cannot be undone."))return;
    state.conversations=[];state.history=[];state.currentConversationId="";persist();renderAIOnly();
  });
  document.getElementById("themeBtn")?.addEventListener("click",()=>{state.theme=state.theme==="dark"?"light":"dark";persist();render();});
  document.getElementById("settingsBtn")?.addEventListener("click",openSettings);
  document.getElementById("aiSettingsTop")?.addEventListener("click",openSettings);
  document.getElementById("sideSettings")?.addEventListener("click",openSettings);
  document.getElementById("sendBtn")?.addEventListener("click",()=>askAI());
  document.getElementById("micBtn")?.addEventListener("click",voiceInput);
  document.getElementById("attachBtn")?.addEventListener("click",()=>document.getElementById("fileInput")?.click());
  document.getElementById("fileInput")?.addEventListener("change",async e=>{
    const f=e.target.files?.[0];if(!f)return;
    const text=await f.text();
    const input=document.getElementById("aiInput");
    if(input){input.value=`Teach me the following file content in depth. File: ${f.name}\n\n${text.slice(0,30000)}`;input.focus();}
  });
  const input=document.getElementById("aiInput");
  if(input){
    input.addEventListener("keydown",e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();askAI();}});
    input.addEventListener("input",()=>{input.style.height="auto";input.style.height=Math.min(input.scrollHeight,150)+"px";});
  }
  document.querySelectorAll("[data-action]").forEach(b=>b.onclick=()=>{
    const a=b.dataset.action;
    if(a==="speak")speak(b.dataset.text||"");
    if(a==="learnDay"){if(state.day<365)state.day++;state.xp+=20;persist();toast("Day completed! +20 XP 🎉");render();}
    if(a==="knowWord"){const w=words[state.vocabIndex%words.length];if(!state.learned.includes(w))state.learned.push(w);state.xp+=5;persist();toast("+5 XP — Word learned!");render();}
    if(a==="nextWord"){state.vocabIndex=(state.vocabIndex+1)%words.length;persist();render();}
    if(a==="speakSentence"){speak(document.getElementById("speakSentence")?.textContent||"");}
    if(a==="nextSentence"){let i=Number(localStorage.getItem("alvin_sentence")||0);i=(i+1)%5;localStorage.setItem("alvin_sentence",String(i));render();}
    if(a==="voice")voiceInput();
    if(a==="newChat"){saveCurrentConversation();state.history=[];state.currentConversationId="";persist();renderAIOnly();}
  });
}

document.getElementById("closeSettings").onclick=()=>document.getElementById("settingsModal").classList.add("hidden");
document.getElementById("saveSettings").onclick=saveSettings;
document.getElementById("removeKey").onclick=()=>{
  state.apiKey="";persist();document.getElementById("apiKey").value="";document.getElementById("settingsStatus").textContent="API key removed from this browser.";
};
document.getElementById("toggleKey").onclick=()=>{
  const i=document.getElementById("apiKey");i.type=i.type==="password"?"text":"password";
  document.getElementById("toggleKey").textContent=i.type==="password"?"Show":"Hide";
};
document.getElementById("settingsModal").addEventListener("click",e=>{
  if(e.target.id==="settingsModal")e.currentTarget.classList.add("hidden");
});

render();
