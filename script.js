(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const all = (selector) => [...document.querySelectorAll(selector)];

  const vocab = [
    {word:"Resilient", pronunciation:"/rɪˈzɪliənt/", meaning:"Able to recover quickly from difficulty or change.", example:"She stayed resilient during a difficult semester.", synonyms:"strong • adaptable • tough"},
    {word:"Curious", pronunciation:"/ˈkjʊəriəs/", meaning:"Eager to learn, know, or discover something.", example:"A curious student asks useful questions.", synonyms:"inquisitive • interested • eager"},
    {word:"Diligent", pronunciation:"/ˈdɪlɪdʒənt/", meaning:"Showing careful and persistent effort.", example:"He is diligent about his daily English practice.", synonyms:"hardworking • careful • dedicated"},
    {word:"Concise", pronunciation:"/kənˈsaɪs/", meaning:"Clear and brief, using few words.", example:"Give a concise answer in the interview.", synonyms:"brief • short • compact"},
    {word:"Confident", pronunciation:"/ˈkɒnfɪdənt/", meaning:"Feeling sure about your abilities or decisions.", example:"She became more confident after practising every day.", synonyms:"assured • positive • self-assured"},
    {word:"Improve", pronunciation:"/ɪmˈpruːv/", meaning:"To make something better.", example:"I want to improve my communication skills.", synonyms:"develop • enhance • advance"},
    {word:"Persistent", pronunciation:"/pəˈsɪstənt/", meaning:"Continuing firmly despite difficulty.", example:"Persistent practice produces progress.", synonyms:"determined • steady • tenacious"},
    {word:"Efficient", pronunciation:"/ɪˈfɪʃənt/", meaning:"Working well without wasting time or resources.", example:"A simple study plan can be very efficient.", synonyms:"effective • productive • capable"},
    {word:"Adapt", pronunciation:"/əˈdæpt/", meaning:"To change in order to suit a new situation.", example:"Good learners adapt to new challenges.", synonyms:"adjust • modify • change"},
    {word:"Insight", pronunciation:"/ˈɪnsaɪt/", meaning:"A clear and deep understanding of something.", example:"The lesson gave me useful insight into finance.", synonyms:"understanding • awareness • perception"}
  ];

  const quizzes = [
    {q:"Choose the correct sentence.", options:["She go to college every day.","She goes to college every day.","She going to college every day.","She gone to college every day."], answer:1},
    {q:"What does “resilient” mean?", options:["Unable to change","Able to recover from difficulty","Always angry","Very slow"], answer:1},
    {q:"Choose the past tense.", options:["I study yesterday.","I studies yesterday.","I studied yesterday.","I studying yesterday."], answer:2},
    {q:"Which word means “brief and clear”?", options:["Concise","Curious","Diligent","Resilient"], answer:0},
    {q:"Choose the correct future sentence.", options:["I will practise tomorrow.","I practised tomorrow.","I practise yesterday.","I practising tomorrow."], answer:0},
    {q:"Which is the best speaking habit?", options:["Never listen","Speak once a month","Practise aloud every day","Avoid recording"], answer:2},
    {q:"Choose the correct sentence.", options:["He have a book.","He has a book.","He having a book.","He haves a book."], answer:1},
    {q:"What does “diligent” mean?", options:["Careless","Persistent and hardworking","Confused","Silent"], answer:1},
    {q:"Which sentence is present simple?", options:["I am studying yesterday.","I study English every day.","I will studied tomorrow.","I studied tomorrow."], answer:1},
    {q:"Which action can improve pronunciation?", options:["Speak as fast as possible","Never listen","Listen and repeat clearly","Skip difficult words"], answer:2}
  ];

  let quizIndex = 0;
  let quizScore = 0;
  let answered = false;

  function showPage(pageId) {
    all(".page").forEach(p => p.classList.toggle("active", p.id === pageId));
    all(".nav-btn").forEach(b => b.classList.toggle("active", b.dataset.page === pageId));
    window.scrollTo({top:0, behavior:"smooth"});
    if (window.innerWidth <= 700) $("mainNav").classList.remove("open");
  }

  all("[data-page]").forEach(el => {
    el.addEventListener("click", () => showPage(el.dataset.page));
  });

  $("mobileMenuBtn").addEventListener("click", () => {
    $("mainNav").classList.toggle("open");
  });

  function renderVocab(list = vocab) {
    $("wordGrid").innerHTML = list.map(v => `
      <article class="word-card glass">
        <div class="tag">VOCAB</div>
        <h3>${v.word}</h3>
        <div class="pron">${v.pronunciation}</div>
        <p class="meaning">${v.meaning}</p>
        <div class="example">“${v.example}”</div>
        <p class="synonyms">Synonyms: ${v.synonyms}</p>
      </article>
    `).join("");
  }

  function randomWord() {
    const word = vocab[Math.floor(Math.random() * vocab.length)];
    renderVocab([word, ...vocab.filter(v => v !== word).slice(0, 5)]);
    showPage("vocab");
  }

  $("randomWordBtn").addEventListener("click", randomWord);
  renderVocab();

  function renderQuiz() {
    const item = quizzes[quizIndex];
    $("quizProgress").textContent = `Question ${quizIndex + 1} of ${quizzes.length}`;
    $("quizScore").textContent = `Score: ${quizScore}`;
    $("quizQuestion").innerHTML = `<div class="quiz-question">${item.q}</div>`;
    $("quizOptions").innerHTML = item.options.map((o,i) =>
      `<button type="button" class="quiz-option" data-answer="${i}">${String.fromCharCode(65+i)}. ${o}</button>`
    ).join("");
    $("nextQuestion").disabled = true;
    $("nextQuestion").textContent = quizIndex === quizzes.length - 1 ? "Finish →" : "Next →";
    answered = false;

    all(".quiz-option").forEach(btn => {
      btn.addEventListener("click", () => {
        if (answered) return;
        answered = true;
        const selected = Number(btn.dataset.answer);
        const correct = item.answer;
        all(".quiz-option").forEach((b,i) => {
          if (i === correct) b.classList.add("correct");
          if (i === selected && selected !== correct) b.classList.add("wrong");
          b.disabled = true;
        });
        if (selected === correct) quizScore++;
        $("quizScore").textContent = `Score: ${quizScore}`;
        $("nextQuestion").disabled = false;
      });
    });
  }

  $("nextQuestion").addEventListener("click", () => {
    if (quizIndex < quizzes.length - 1) {
      quizIndex++;
      renderQuiz();
    } else {
      $("quizQuestion").innerHTML = `<div class="quiz-question">🎉 Quiz complete!</div><p class="meaning">Your score is <b>${quizScore}/${quizzes.length}</b>. Keep practising every day.</p>`;
      $("quizOptions").innerHTML = "";
      $("nextQuestion").textContent = "Restart Quiz";
      $("nextQuestion").disabled = false;
      $("nextQuestion").onclick = () => {
        quizIndex = 0;
        quizScore = 0;
        $("nextQuestion").onclick = null;
        renderQuiz();
      };
    }
  });
  renderQuiz();

  const searchData = [
    {keys:["resilient","resilience"], title:"Resilient — Vocabulary", source:"Vocabulary", html:"<p><b>Meaning:</b> Able to recover quickly from difficulty or change.</p><p><b>Example:</b> She stayed resilient during a difficult semester.</p><p><b>Tip:</b> Say “resilient” aloud and make your own sentence."},
    {keys:["curious"], title:"Curious — Vocabulary", source:"Vocabulary", html:"<p><b>Meaning:</b> Eager to learn, know, or discover something.</p><p><b>Example:</b> A curious student asks useful questions.</p>"},
    {keys:["diligent"], title:"Diligent — Vocabulary", source:"Vocabulary", html:"<p><b>Meaning:</b> Showing careful and persistent effort.</p><p><b>Example:</b> He is diligent about daily English practice.</p>"},
    {keys:["concise"], title:"Concise — Vocabulary", source:"Vocabulary", html:"<p><b>Meaning:</b> Clear and brief, using few words.</p><p><b>Example:</b> Give a concise answer in the interview.</p>"},
    {keys:["grammar","present tense","present simple"], title:"Present Simple — Grammar", source:"Grammar Lab", html:"<p>Use the present simple for habits and regular actions.</p><p><b>Example:</b> I study English every day.</p><p>With he/she/it, most verbs take <b>-s/-es</b>: She goes to college every day.</p>"},
    {keys:["past tense","past simple"], title:"Past Simple — Grammar", source:"Grammar Lab", html:"<p>Use the past simple for completed actions.</p><p><b>Example:</b> I studied English yesterday.</p>"},
    {keys:["future tense","future"], title:"Future Simple — Grammar", source:"Grammar Lab", html:"<p>Use “will + base verb” for many future statements.</p><p><b>Example:</b> I will study English tomorrow.</p>"},
    {keys:["speaking","speak","pronunciation"], title:"Speaking Improvement", source:"Speaking Lab", html:"<p>Practise for 10 minutes every day. Listen to a sentence, repeat it slowly, record yourself and compare your pronunciation.</p><p><b>Daily challenge:</b> Speak five sentences about your day without stopping.</p>"},
    {keys:["quiz","test","question"], title:"Quick English Quiz", source:"Quiz Lab", html:"<p><b>Question:</b> Which sentence is correct?</p><p>❌ She go to college every day.</p><p>✅ She goes to college every day.</p><p><b>Rule:</b> With he/she/it in the present simple, the verb usually takes -s/-es.</p>"},
    {keys:["vocabulary","word","meaning"], title:"Vocabulary Learning", source:"Vocabulary Vault", html:"<p>Try searching for a word such as <b>resilient</b>, <b>curious</b>, <b>diligent</b> or <b>concise</b>.</p>"}
  ];

  function escapeHTML(value) {
    return value.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  }

  function getHistory() {
    try { return JSON.parse(localStorage.getItem("lumina_search_history") || "[]"); }
    catch { return []; }
  }

  function saveSearch(query) {
    const clean = query.trim();
    if (!clean) return;
    const history = [clean, ...getHistory().filter(x => x.toLowerCase() !== clean.toLowerCase())].slice(0,8);
    localStorage.setItem("lumina_search_history", JSON.stringify(history));
    renderHistory();
  }

  function renderHistory() {
    const h = getHistory();
    $("searchHistory").innerHTML = h.length ? h.map(q =>
      `<button type="button" class="history-item" data-history="${escapeHTML(q)}">⌕ ${escapeHTML(q)}</button>`
    ).join("") : `<p class="meaning">No searches yet.</p>`;
    all("[data-history]").forEach(b => b.addEventListener("click", () => runSearch(b.dataset.history)));
  }

  function runSearch(query) {
    query = query.trim();
    if (!query) return;
    showPage("search");
    $("pageSearch").value = query;
    $("globalSearch").value = query;
    saveSearch(query);

    const q = query.toLowerCase();
    let result = null;

    for (const item of searchData) {
      if (item.keys.some(k => q.includes(k))) {
        result = item;
        break;
      }
    }

    if (!result) {
      const word = vocab.find(v => q.includes(v.word.toLowerCase()));
      if (word) {
        result = {
          title: `${word.word} — Vocabulary`,
          source: "Vocabulary",
          html: `<p><b>Meaning:</b> ${word.meaning}</p><p><b>Pronunciation:</b> ${word.pronunciation}</p><p><b>Example:</b> ${word.example}</p><p><b>Synonyms:</b> ${word.synonyms}</p>`
        };
      }
    }

    if (!result) {
      result = {
        title: "LuminaAI Learning Assistant",
        source: "AI Learning",
        html: `<p>I can search the learning content in this app for <b>vocabulary, grammar, speaking and quizzes</b>.</p>
               <p>Try: <b>“What does resilient mean?”</b>, <b>“Explain present tense”</b>, or <b>“How can I improve speaking?”</b>.</p>
               <p class="meaning">This version is a static GitHub Pages app, so it does not send your question to a private AI server.</p>`
      };
    }

    $("searchResult").innerHTML = `
      <div class="ai-answer">
        <span class="source-tag">🤖 ${result.source}</span>
        <h3>${result.title}</h3>
        ${result.html}
      </div>`;
  }

  $("globalSearchBtn").addEventListener("click", () => runSearch($("globalSearch").value));
  $("globalSearch").addEventListener("keydown", e => { if (e.key === "Enter") runSearch(e.target.value); });
  $("pageSearchBtn").addEventListener("click", () => runSearch($("pageSearch").value));
  $("pageSearch").addEventListener("keydown", e => { if (e.key === "Enter") runSearch(e.target.value); });
  all(".suggestion").forEach(btn => btn.addEventListener("click", () => runSearch(btn.textContent)));
  $("clearHistory").addEventListener("click", () => {
    localStorage.removeItem("lumina_search_history");
    renderHistory();
  });
  renderHistory();

  const sentences = [
    "I practise English every day to become more confident.",
    "I am learning new vocabulary and improving my communication skills.",
    "I will speak clearly and confidently in my next presentation."
  ];
  let sentenceIndex = 0;

  $("speakSentence").addEventListener("click", () => {
    const text = sentences[sentenceIndex];
    if ("speechSynthesis" in window) {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.85;
      speechSynthesis.speak(utterance);
      $("speechStatus").textContent = "🔊 Playing the example sentence...";
    } else {
      $("speechStatus").textContent = "Your browser does not support speech playback.";
    }
  });

  let recognition = null;
  if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      $("recordBtn").textContent = "⏹ Stop Speaking";
      $("speechStatus").textContent = "🎙 Listening... speak now.";
    };
    recognition.onresult = e => {
      const spoken = e.results[0][0].transcript;
      const target = sentences[sentenceIndex].toLowerCase().replace(/[^\w\s]/g,"");
      const words = spoken.toLowerCase().replace(/[^\w\s]/g,"").split(/\s+/);
      const targetWords = target.split(/\s+/);
      const matches = words.filter(w => targetWords.includes(w)).length;
      const score = Math.min(100, Math.round((matches / targetWords.length) * 100));
      $("speechStatus").innerHTML = `You said: <b>“${escapeHTML(spoken)}”</b><br>Approximate word-match score: <b>${score}%</b>`;
    };
    recognition.onerror = () => {
      $("speechStatus").textContent = "Could not hear you. Check microphone permission and try again.";
    };
    recognition.onend = () => {
      $("recordBtn").textContent = "🎤 Start Speaking";
    };
  }

  $("recordBtn").addEventListener("click", () => {
    if (!recognition) {
      $("speechStatus").textContent = "Speech recognition is not supported in this browser. Try Chrome and allow microphone access.";
      return;
    }
    try { recognition.start(); } catch { recognition.stop(); }
  });

  $("speakingSentence").addEventListener("dblclick", () => {
    sentenceIndex = (sentenceIndex + 1) % sentences.length;
    $("speakingSentence").textContent = sentences[sentenceIndex];
    $("speechStatus").textContent = "New sentence selected. Press Listen or Start Speaking.";
  });

  // Allow direct links such as #vocab or #quiz.
  const hash = location.hash.replace("#","");
  if (document.getElementById(hash)) showPage(hash);
})();
