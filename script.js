(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);

  const pages = ["home","search","vocab","quiz","speaking","grammar"];

  function showPage(name) {
    if (!pages.includes(name)) name = "home";
    document.querySelectorAll(".page").forEach(p => p.classList.toggle("active", p.id === name));
    document.querySelectorAll(".nav-btn").forEach(b => b.classList.toggle("active", b.dataset.page === name));
    window.scrollTo({top:0, behavior:"smooth"});
  }

  document.addEventListener("click", (e) => {
    const pageButton = e.target.closest("[data-page]");
    if (pageButton) showPage(pageButton.dataset.page);
    const queryButton = e.target.closest("[data-query]");
    if (queryButton) {
      showPage("search");
      $("mainSearch").value = queryButton.dataset.query;
      runSearch(queryButton.dataset.query);
    }
  });

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;" }[c]));
  }

  const answers = [
    {keys:["present tense","present simple"], title:"Present Simple Tense", html:"<p><b>Use:</b> We use the present simple for habits, routines, facts and repeated actions.</p><ul><li><b>Positive:</b> I study English every day.</li><li><b>Negative:</b> I do not study English every day.</li><li><b>Question:</b> Do you study English every day?</li></ul><p><b>Tip:</b> With he, she and it, usually add <b>-s</b>: She works in a bank.</p>"},
    {keys:["past tense","past simple"], title:"Past Simple Tense", html:"<p><b>Use:</b> The past simple describes a completed action in the past.</p><p><b>Example:</b> I studied English yesterday.</p><p>Regular verbs often take <b>-ed</b>. Common irregular verbs include go → went and eat → ate.</p>"},
    {keys:["future tense","future simple"], title:"Future Simple Tense", html:"<p><b>Use:</b> Use <b>will + base verb</b> for future actions, predictions and quick decisions.</p><p><b>Example:</b> I will practice English tomorrow.</p>"},
    {keys:["resilient"], title:"Resilient — Vocabulary", html:"<p><b>Meaning:</b> Able to recover quickly from difficulties.</p><p><b>Example:</b> She stayed resilient after facing many challenges.</p><p><b>Synonyms:</b> strong, adaptable, tough.</p>"},
    {keys:["improve speaking","improve my speaking","speaking"], title:"How to Improve English Speaking", html:"<ol><li>Speak aloud for 10 minutes every day.</li><li>Learn 5 useful words and make your own sentences.</li><li>Read a short paragraph aloud.</li><li>Record your voice and listen for mistakes.</li><li>Try to speak without translating every sentence.</li></ol>"},
    {keys:["vocabulary quiz","vocab quiz","quiz"], title:"Vocabulary Mini Quiz", html:"<p><b>Question:</b> What does “resilient” mean?</p><p>A) Easily defeated<br>B) Able to recover from difficulties<br>C) Very expensive</p><p><b>Answer:</b> B — able to recover from difficulties.</p>"},
    {keys:["grammar"], title:"What Is Grammar?", html:"<p>Grammar is the system of rules that helps us form correct sentences. It includes tenses, nouns, verbs, adjectives, articles and sentence structure.</p>"}
  ];

  function runSearch(raw) {
    const q = (raw || "").trim();
    if (!q) {
      $("answerTitle").textContent = "Please enter a question";
      $("answerBody").innerHTML = "<p>Try: <b>Explain present tense</b> or <b>What does resilient mean?</b></p>";
      return;
    }
    const lower = q.toLowerCase();
    let found = answers.find(a => a.keys.some(k => lower.includes(k)));
    if (!found) {
      found = {
        title:"Learning Guide",
        html:`<p>I can help you learn this topic.</p><p><b>Your question:</b> ${escapeHtml(q)}</p><p>Try asking about <b>grammar, tenses, vocabulary, speaking, pronunciation, quizzes,</b> or a specific English word.</p><p>For example: <b>Explain present perfect tense</b>.</p>`
      };
    }
    $("answerTitle").textContent = found.title;
    $("answerBody").innerHTML = found.html;
    saveRecent(q);
    $("answerCard").scrollIntoView({behavior:"smooth", block:"start"});
  }

  function doTopSearch() {
    const q = $("topSearch").value;
    if (!q.trim()) return;
    showPage("search");
    $("mainSearch").value = q;
    runSearch(q);
  }

  $("topAsk").addEventListener("click", doTopSearch);
  $("topSearch").addEventListener("keydown", e => { if(e.key === "Enter") doTopSearch(); });
  $("mainAsk").addEventListener("click", () => runSearch($("mainSearch").value));
  $("mainSearch").addEventListener("keydown", e => { if(e.key === "Enter") runSearch($("mainSearch").value); });

  function saveRecent(q) {
    let list = JSON.parse(localStorage.getItem("lumina_recent") || "[]");
    list = [q, ...list.filter(x => x.toLowerCase() !== q.toLowerCase())].slice(0,8);
    localStorage.setItem("lumina_recent", JSON.stringify(list));
    renderRecent();
  }
  function renderRecent() {
    const list = JSON.parse(localStorage.getItem("lumina_recent") || "[]");
    $("recentList").innerHTML = list.length ? list.map(q => `<button class="recent-item" data-query="${escapeHtml(q)}">${escapeHtml(q)}</button>`).join("") : "<p>No searches yet.</p>";
  }
  $("clearRecent").addEventListener("click", () => { localStorage.removeItem("lumina_recent"); renderRecent(); });
  renderRecent();

  const vocab = [
    ["Resilient","/rɪˈzɪliənt/","Able to recover quickly from difficulties.","She remained resilient after many challenges.","strong, adaptable, tough"],
    ["Diligent","/ˈdɪlɪdʒənt/","Showing careful and persistent effort.","He is a diligent student.","hardworking, careful, dedicated"],
    ["Curious","/ˈkjʊəriəs/","Wanting to learn or know more.","She is curious about finance.","inquisitive, interested, eager"],
    ["Confident","/ˈkɒnfɪdənt/","Feeling sure about your ability.","He spoke confidently in class.","assured, self-confident, bold"],
    ["Precise","/prɪˈsaɪs/","Exact and accurate.","Please give a precise answer.","exact, accurate, specific"]
  ];
  let wordIndex = 0;
  function renderWord() {
    const w = vocab[wordIndex % vocab.length];
    $("wordNo").textContent = `${(wordIndex % 100)+1} / 100`;
    $("word").textContent = w[0]; $("pronunciation").textContent = w[1];
    $("meaning").textContent = w[2]; $("example").textContent = w[3]; $("synonyms").textContent = w[4];
  }
  $("nextWord").addEventListener("click", () => { wordIndex = (wordIndex + 1) % 100; renderWord(); });
  $("prevWord").addEventListener("click", () => { wordIndex = (wordIndex + 99) % 100; renderWord(); });
  renderWord();

  const quiz = [
    ["What does “resilient” mean?",["Able to recover from difficulties","Very expensive","Unable to learn"],0],
    ["Choose the correct sentence.",["She study every day.","She studies every day.","She studying every day."],1],
    ["Past tense of “go” is:",["goed","goes","went"],2],
    ["Choose the synonym of “diligent”.",["lazy","hardworking","careless"],1],
    ["Which is a future sentence?",["I studied yesterday.","I am studying now.","I will study tomorrow."],2]
  ];
  let qi = 0, answered = false;
  function renderQuiz() {
    const q = quiz[qi % quiz.length];
    $("quizNo").textContent = (qi % 20) + 1;
    $("quizQuestion").textContent = q[0];
    $("quizOptions").innerHTML = q[1].map((x,i)=>`<button class="option" data-option="${i}">${escapeHtml(x)}</button>`).join("");
    $("quizFeedback").textContent = "";
    $("nextQuiz").disabled = true; answered = false;
  }
  $("quizOptions").addEventListener("click", e => {
    const btn = e.target.closest("[data-option]");
    if (!btn || answered) return;
    answered = true;
    const chosen = Number(btn.dataset.option), correct = quiz[qi % quiz.length][2];
    document.querySelectorAll(".option").forEach((b,i)=>{ if(i===correct)b.classList.add("correct"); if(i===chosen && chosen!==correct)b.classList.add("wrong"); });
    $("quizFeedback").textContent = chosen === correct ? "✓ Correct! Great job." : "✗ Not quite. The correct answer is highlighted.";
    $("nextQuiz").disabled = false;
  });
  $("nextQuiz").addEventListener("click", () => { qi = (qi + 1) % 20; renderQuiz(); });
  renderQuiz();

  $("speakBtn").addEventListener("click", () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      $("speakResult").textContent = "Speech recognition is not supported in this browser. Try Google Chrome.";
      return;
    }
    const rec = new SpeechRecognition();
    rec.lang = "en-US"; rec.interimResults = false; rec.maxAlternatives = 1;
    $("speakBtn").textContent = "🎙 Listening...";
    rec.start();
    rec.onresult = e => {
      const text = e.results[0][0].transcript;
      $("speakResult").textContent = `You said: "${text}"`;
      const target = $("speakTarget").textContent.toLowerCase().replace(/[^\w\s]/g,"");
      const spoken = text.toLowerCase().replace(/[^\w\s]/g,"");
      const a = target.split(/\s+/), b = spoken.split(/\s+/);
      const matches = a.filter(w => b.includes(w)).length;
      const score = Math.round(matches / Math.max(a.length,1) * 100);
      $("speakScore").textContent = `Score: ${score}%`;
    };
    rec.onerror = e => { $("speakResult").textContent = "Microphone error: " + e.error; };
    rec.onend = () => { $("speakBtn").textContent = "🎙 Start Speaking"; };
  });
})();