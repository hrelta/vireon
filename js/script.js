const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;
const savedTheme = localStorage.getItem('vireon-theme') || 'light';
html.setAttribute('data-theme', savedTheme);
updateToggleIcon(savedTheme);

themeToggle.addEventListener('click', () => {
  const next = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
  html.setAttribute('data-theme', next);
  localStorage.setItem('vireon-theme', next);
  updateToggleIcon(next);
});

function updateToggleIcon(theme) {
  themeToggle.textContent = theme === 'dark' ? '🌞' : '🌙';
}

const thoughts = {
  social: [
    "You probably just forgot to reply. It happens to everyone.",
    "But wait... it's been a while. Do they think you're ignoring them?",
    "What if they're upset? What if this slowly changes everything between you?",
    "They've seen it. The read receipt is RIGHT THERE. Why aren't they responding?",
    "This is it. One unanswered message and the entire friendship is collapsing in real time."
  ],
  academic: [
    "You still have time. A little studying now will go a long way.",
    "Actually... how much time do you have left? Have you checked recently?",
    "If you fail this, your GPA drops. If your GPA drops, everything changes.",
    "You should have started three weeks ago. Why didn't you start three weeks ago?",
    "One bad exam and your entire future career path disintegrates into dust. Probably."
  ],
  decision: [
    "Both options have pros and cons. This is completely normal to think about.",
    "But what if you pick the wrong one? Have you really thought this through?",
    "Every choice closes a door. What if the door you close was the right one?",
    "You've gone back and forth so long the options don't even mean anything anymore.",
    "At this point, a coin flip would be more decisive than your brain. Just saying."
  ],
  default: [
    "Okay. Let's think about this clearly. It's probably not as bad as it feels.",
    "Although... there are a few things that could go wrong here, aren't there?",
    "What if the worst case scenario actually happens? Have you prepared for that?",
    "Your brain has now looped over this thought approximately 47 times. Still no answer.",
    "Congratulations. You've thought about this so much it has completely lost all meaning."
  ]
};

const finalMessages = [
  { text: "Yeah… that was a lot. You okay?",           emoji: "🫧" },
  { text: "You made it worse. Congrats.",               emoji: "🏆" },
  { text: "Maybe it wasn't that deep after all.",       emoji: "🌊" },
  { text: "Your mind deserves a day off.",              emoji: "🌿" },
  { text: "Plot twist: it was never that serious.",     emoji: "🎭" },
  { text: "You just out-thought yourself. Impressive.", emoji: "🌀" },
  { text: "The answer was probably fine all along.",    emoji: "🕊️" },
  { text: "Next time, try sleeping on it instead.",     emoji: "🌙" }
];

const stages = [
  { label: 'Thinking',        percent: 20,  levelClass: 'level-1' },
  { label: 'Spiraling',       percent: 40,  levelClass: 'level-2' },
  { label: 'Overanalyzing',   percent: 60,  levelClass: 'level-3' },
  { label: 'Catastrophizing', percent: 80,  levelClass: 'level-4' },
  { label: 'Peak',            percent: 100, levelClass: 'level-5' }
];

function detectCategory(input) {
  const text = input.toLowerCase();
  const keywords = {
    social:   ['text', 'message', 'reply', 'read', 'seen', 'friend',
                'chat', 'dm', 'left on', 'ignored', 'respond'],
    academic: ['exam', 'study', 'test', 'grade', 'assignment',
               'deadline', 'class', 'lecture', 'score', 'gpa'],
    decision: ['choose', 'choice', 'decide', 'decision', 'option',
               'pick', 'should i', 'or', 'vs', 'between']
  };
  for (const cat in keywords) {
    if (keywords[cat].some(w => text.includes(w))) return cat;
  }
  return 'default';
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

const startBtn = document.getElementById('startBtn');

if (startBtn) {
  const thoughtInput = document.getElementById('thoughtInput');
  const errorMsg     = document.getElementById('errorMsg');
  const charCount    = document.getElementById('charCount');

  thoughtInput.addEventListener('input', () => {
    const len = thoughtInput.value.length;
    charCount.textContent = `${len} / 300`;
    if (len > 0) errorMsg.classList.remove('visible');
  });

  startBtn.addEventListener('click', () => {
    const thought = thoughtInput.value.trim();
    if (!thought) {
      errorMsg.classList.add('visible');
      thoughtInput.focus();
      return;
    }
    localStorage.setItem('vireon-thought', thought);
    window.location.href = 'simulation.html';
  });
}

const previewText = document.getElementById('previewText');

if (previewText) {
  const savedThought = localStorage.getItem('vireon-thought');
  if (!savedThought) window.location.href = 'index.html';

  previewText.textContent = `"${savedThought}"`;

  const stageLabel   = document.getElementById('stageLabel');
  const stageNumber  = document.getElementById('stageNumber');
  const progressFill = document.getElementById('progressFill');
  const levelBadge   = document.getElementById('levelBadge');
  const thoughtBox   = document.getElementById('thoughtBox');
  const thoughtText  = document.getElementById('thoughtText');
  const finalSection = document.getElementById('finalSection');
  const finalMessage = document.getElementById('finalMessage');
  const finalEmoji   = document.getElementById('finalEmoji');
  const tryAgainBtn  = document.getElementById('tryAgainBtn');
  const resetBtn     = document.getElementById('resetBtn');

  const category = detectCategory(savedThought);
  const sequence  = thoughts[category];

  function showThought(text) {
    thoughtText.classList.remove('visible');
    setTimeout(() => {
      thoughtText.textContent = text;
      thoughtText.classList.add('visible');
    }, 350);
  }

  function updateProgress(i) {
    const stage = stages[i];
    stageLabel.textContent   = stage.label;
    stageNumber.textContent  = `Level ${i + 1} / 5`;
    progressFill.style.width = `${stage.percent}%`;
    levelBadge.textContent   = `Level ${i + 1} — ${stage.label}`;
    thoughtBox.className     = `thought-box ${stage.levelClass}`;

    if (stage.label === 'Peak') {
      thoughtBox.classList.add('shake');
      setTimeout(() => thoughtBox.classList.remove('shake'), 600);
    }

    thoughtBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function showFinal() {
    const pick = finalMessages[Math.floor(Math.random() * finalMessages.length)];
    finalMessage.textContent = pick.text;
    finalEmoji.textContent   = pick.emoji;
    finalSection.style.display = 'flex';
    requestAnimationFrame(() => {
      finalSection.style.opacity = '1';
      finalSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  async function runSimulation() {
    await sleep(600);
    for (let i = 0; i < sequence.length; i++) {
      updateProgress(i);
      showThought(sequence[i]);
      await sleep(2800);
    }
    showFinal();
  }

  tryAgainBtn.addEventListener('click', () => {
    window.location.href = 'simulation.html';
  });

  resetBtn.addEventListener('click', () => {
    localStorage.removeItem('vireon-thought');
    window.location.href = 'index.html';
  });

  runSimulation();
}