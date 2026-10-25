/**
 * ==========================================================================
 * STUDY BATTLE - Shared Battle & Quiz Engine (quiz.js)
 * Powers Topic Battle, Subject Battle, Random Battle, and Results Screen
 * ==========================================================================
 */

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

class QuizEngine {
  constructor() {
    this.urlParams = new URLSearchParams(window.location.search);
    this.mode = this.urlParams.get('mode') || 'random';
    this.subjectId = this.urlParams.get('subject') || 'python';
    this.topic = this.urlParams.get('topic') || '';

    this.questions = [];
    this.currentIndex = 0;
    this.userAnswers = {};
    this.timePerQuestion = 20;
    this.timeRemaining = 20;
    this.timerInterval = null;
    this.startTime = Date.now();

    this.elHeaderMode = document.getElementById('quizModeLabel');
    this.elHeaderTopic = document.getElementById('quizTopicLabel');
    this.elQuestionCounter = document.getElementById('quizQuestionCounter');
    this.elProgressBar = document.getElementById('quizProgressFill');
    this.elTimerBox = document.getElementById('quizTimerBox');
    this.elTimerDisplay = document.getElementById('quizTimerSeconds');
    this.elCategoryTag = document.getElementById('questionCategory');
    this.elQuestionText = document.getElementById('questionText');
    this.elCodeSnippet = document.getElementById('questionCode');
    this.elOptionsContainer = document.getElementById('optionsContainer');
    this.elPrevBtn = document.getElementById('quizPrevBtn');
    this.elNextBtn = document.getElementById('quizNextBtn');
    this.elSubmitBtn = document.getElementById('quizSubmitBtn');
    this.elValidationMsg = document.getElementById('quizValidationMsg');
  }

  init() {
    this.loadQuestions();

    if (this.questions.length === 0) {
      if (typeof showToast === 'function') showToast('⚠️ No questions available. Loading Random Battle instead.', 'error');
      this.mode = 'random';
      this.loadQuestions();
    }

    this.bindEvents();
    this.renderQuestion();
    this.startTimer();
  }

  loadQuestions() {
    if (typeof DATA_QUESTIONS === 'undefined') return;

    if (this.mode === 'topic') {
      let pool = DATA_QUESTIONS.filter(q => q.subjectId === this.subjectId && q.topic.toLowerCase() === this.topic.toLowerCase());
      if (pool.length === 0) {
        pool = DATA_QUESTIONS.filter(q => q.subjectId === this.subjectId);
      }
      this.questions = pool.slice(0, 5);
    } else if (this.mode === 'subject') {
      const pool = DATA_QUESTIONS.filter(q => q.subjectId === this.subjectId);
      this.questions = shuffleArray(pool).slice(0, 5);
    } else if (this.mode === '1v1') {
      this.questions = shuffleArray(DATA_QUESTIONS).slice(0, 5);
    } else if (this.mode === 'speed') {
      this.questions = shuffleArray(DATA_QUESTIONS).slice(0, 6);
    } else if (this.mode === 'custom') {
      const count = parseInt(this.urlParams.get('count')) || 5;
      const sub = this.urlParams.get('subject');
      let pool = DATA_QUESTIONS;
      if (sub && sub !== 'all') {
        pool = DATA_QUESTIONS.filter(q => q.subjectId === sub);
      }
      this.questions = shuffleArray(pool).slice(0, Math.min(count, pool.length));
    } else {
      this.questions = shuffleArray(DATA_QUESTIONS).slice(0, 6);
    }
  }

  bindEvents() {
    if (this.elPrevBtn) this.elPrevBtn.addEventListener('click', () => this.handlePrevious());
    if (this.elNextBtn) this.elNextBtn.addEventListener('click', () => this.handleNext());
    if (this.elSubmitBtn) this.elSubmitBtn.addEventListener('click', () => this.handleSubmit());

    const quitBtn = document.getElementById('quizQuitBtn');
    if (quitBtn) {
      quitBtn.addEventListener('click', () => {
        if (typeof openModal === 'function') openModal('quitConfirmModal');
      });
    }

    const confirmQuitBtn = document.getElementById('confirmQuitActionBtn');
    if (confirmQuitBtn) {
      confirmQuitBtn.addEventListener('click', () => {
        clearInterval(this.timerInterval);
        window.location.href = 'battle-modes.html';
      });
    }
  }

  renderQuestion() {
    const q = this.questions[this.currentIndex];
    if (!q) return;

    this.hideValidation();

    if (this.elHeaderMode) {
      let modeText = '🎲 Random Battle';
      if (this.mode === 'topic') modeText = `🎯 Topic Battle (${q.subjectId.toUpperCase()})`;
      else if (this.mode === 'subject') modeText = `⚔️ Subject Battle: ${q.subjectId.toUpperCase()}`;
      else if (this.mode === '1v1') modeText = '⚔️ 1v1 Gladiator Duel Arena';
      else if (this.mode === 'speed') modeText = '⚡ 60s Speed Sprint Challenge';
      else if (this.mode === 'custom') modeText = '🛠️ Custom Battle Room';
      this.elHeaderMode.textContent = modeText;
    }

    const specialHud = document.getElementById('arenaSpecialHud');
    if (specialHud) {
      let user = { name: 'Gladiator', avatar: 'default-avatar.svg' };
      if (typeof getUser === 'function') user = getUser();
      
      if (this.mode === '1v1') {
        specialHud.style.display = 'block';
        specialHud.innerHTML = `
          <div class="vs-arena-hud">
            <div class="vs-player-col">
              <div class="avatar-circle" style="width: 44px; height: 44px;">
                <img class="avatar-img" src="${user.avatar}" alt="User">
              </div>
              <div>
                <div style="font-weight: 700; color: #fff;">${user.name}</div>
                <div style="font-size: 0.8rem; color: var(--success);">You (Player)</div>
              </div>
            </div>
            <div class="vs-center-badge">
              <span style="font-size: 0.7rem; letter-spacing: 0.1em; color: var(--text-muted);">1v1 DUEL</span>
              <span>⚔️ VS ⚔️</span>
            </div>
            <div class="vs-player-col" style="flex-direction: row-reverse; text-align: right;">
              <div class="avatar-circle rival-avatar" style="width: 44px; height: 44px; background: linear-gradient(135deg, #ef4444, #f59e0b);">
                <img src="avatar-cyber-ninja.svg" style="width: 32px; height: 32px;" alt="Rival">
              </div>
              <div>
                <div style="font-weight: 700; color: #f87171;">CyberNinja_99</div>
                <div style="font-size: 0.8rem; color: #fca5a5;">Rival Gladiator</div>
              </div>
            </div>
          </div>
        `;
      } else if (this.mode === 'speed') {
        specialHud.style.display = 'block';
        specialHud.innerHTML = `
          <div style="background: linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(245, 158, 11, 0.2)); border: 1px solid rgba(239, 68, 68, 0.4); border-radius: var(--radius-md); padding: 0.75rem 1.25rem; display: flex; align-items: center; justify-content: space-between;">
            <span style="font-weight: 800; color: #f87171; text-transform: uppercase; letter-spacing: 0.05em;">⚡ Rapid Speed Sprint Mode</span>
            <span class="badge badge-gold">High Reflex Bounty</span>
          </div>
        `;
      } else {
        specialHud.style.display = 'none';
      }
    }

    if (this.elHeaderTopic) {
      this.elHeaderTopic.textContent = q.topic;
    }

    const total = this.questions.length;
    const currentNum = this.currentIndex + 1;
    if (this.elQuestionCounter) {
      this.elQuestionCounter.textContent = `Question ${currentNum} of ${total}`;
    }

    if (this.elProgressBar) {
      const percentage = (currentNum / total) * 100;
      this.elProgressBar.style.width = `${percentage}%`;
    }

    if (this.elCategoryTag) {
      this.elCategoryTag.textContent = `${q.topic} • ${q.difficulty}`;
    }
    if (this.elQuestionText) {
      this.elQuestionText.textContent = q.question;
    }

    if (this.elCodeSnippet) {
      if (q.code) {
        this.elCodeSnippet.textContent = q.code;
        this.elCodeSnippet.style.display = 'block';
      } else {
        this.elCodeSnippet.style.display = 'none';
      }
    }

    if (this.elOptionsContainer) {
      const letters = ['A', 'B', 'C', 'D'];
      const selectedIndex = this.userAnswers[q.id];

      this.elOptionsContainer.innerHTML = q.options.map((optionText, idx) => {
        const isSelected = selectedIndex === idx ? 'selected' : '';
        return `
          <button type="button" class="option-btn ${isSelected}" data-index="${idx}">
            <span class="option-letter">${letters[idx]}</span>
            <span style="flex: 1;">${optionText}</span>
          </button>
        `;
      }).join('');

      this.elOptionsContainer.querySelectorAll('.option-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const optIdx = parseInt(btn.getAttribute('data-index'), 10);
          this.selectOption(optIdx);
        });
      });
    }

    if (this.elPrevBtn) {
      this.elPrevBtn.disabled = this.currentIndex === 0;
      this.elPrevBtn.style.opacity = this.currentIndex === 0 ? '0.4' : '1';
    }

    const isLast = this.currentIndex === this.questions.length - 1;
    if (this.elNextBtn) {
      this.elNextBtn.style.display = isLast ? 'none' : 'inline-flex';
    }
    if (this.elSubmitBtn) {
      this.elSubmitBtn.style.display = isLast ? 'inline-flex' : 'none';
    }

    this.resetTimer();
  }

  selectOption(optionIndex) {
    const q = this.questions[this.currentIndex];
    this.userAnswers[q.id] = optionIndex;
    if (typeof playAudio === 'function') playAudio('click');

    if (this.elOptionsContainer) {
      this.elOptionsContainer.querySelectorAll('.option-btn').forEach((btn, idx) => {
        if (idx === optionIndex) {
          btn.classList.add('selected');
        } else {
          btn.classList.remove('selected');
        }
      });
    }

    this.hideValidation();
  }

  handleNext() {
    const q = this.questions[this.currentIndex];
    if (this.userAnswers[q.id] === undefined) {
      this.showValidation('⚠️ Please choose an answer before moving forward!');
      if (typeof playAudio === 'function') playAudio('wrong');
      return;
    }

    if (this.currentIndex < this.questions.length - 1) {
      this.currentIndex++;
      this.renderQuestion();
    }
  }

  handlePrevious() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.renderQuestion();
    }
  }

  handleSubmit() {
    const q = this.questions[this.currentIndex];
    if (this.userAnswers[q.id] === undefined) {
      this.showValidation('⚠️ Please select an answer to finish the battle!');
      if (typeof playAudio === 'function') playAudio('wrong');
      return;
    }

    clearInterval(this.timerInterval);
    this.finishBattle();
  }

  startTimer() {
    let timerMode = 'strict';
    if (typeof getUser === 'function') {
      const user = getUser();
      if (user && user.settings && user.settings.timerMode) {
        timerMode = user.settings.timerMode;
      }
    }
    
    this.timePerQuestion = (timerMode === 'relaxed') ? 40 : 20;
    this.timeRemaining = this.timePerQuestion;

    if (this.timerInterval) clearInterval(this.timerInterval);

    this.timerInterval = setInterval(() => {
      this.timeRemaining--;

      if (this.elTimerDisplay) {
        this.elTimerDisplay.textContent = `${this.timeRemaining}s`;
      }

      if (this.elTimerBox) {
        if (this.timeRemaining <= 5) {
          this.elTimerBox.classList.add('timer-warning');
        } else {
          this.elTimerBox.classList.remove('timer-warning');
        }
      }

      if (this.timeRemaining <= 0) {
        const q = this.questions[this.currentIndex];
        if (this.userAnswers[q.id] === undefined) {
          this.userAnswers[q.id] = -1;
        }

        if (typeof playAudio === 'function') playAudio('wrong');
        if (typeof showToast === 'function') showToast('⏰ Time expired for this question!', 'error', 1800);

        if (this.currentIndex < this.questions.length - 1) {
          this.currentIndex++;
          this.renderQuestion();
        } else {
          clearInterval(this.timerInterval);
          this.finishBattle();
        }
      }
    }, 1000);
  }

  resetTimer() {
    let timerMode = 'strict';
    if (typeof getUser === 'function') {
      const user = getUser();
      if (user && user.settings && user.settings.timerMode) {
        timerMode = user.settings.timerMode;
      }
    }
    this.timePerQuestion = (timerMode === 'relaxed') ? 40 : 20;
    this.timeRemaining = this.timePerQuestion;
    
    if (this.elTimerDisplay) {
      this.elTimerDisplay.textContent = `${this.timeRemaining}s`;
    }
    if (this.elTimerBox) {
      this.elTimerBox.classList.remove('timer-warning');
    }
  }

  showValidation(msg) {
    if (this.elValidationMsg) {
      this.elValidationMsg.textContent = msg;
      this.elValidationMsg.style.display = 'block';
    }
  }

  hideValidation() {
    if (this.elValidationMsg) {
      this.elValidationMsg.textContent = '';
      this.elValidationMsg.style.display = 'none';
    }
  }

  finishBattle() {
    let correctCount = 0;
    const questionReview = [];
    const missedTopics = [];

    this.questions.forEach(q => {
      const userSelected = this.userAnswers[q.id];
      const isCorrect = userSelected === q.correctIndex;
      if (isCorrect) correctCount++;
      else {
        missedTopics.push({ subject: q.subjectId, topic: q.topic, question: q.question });
      }

      questionReview.push({
        id: q.id,
        question: q.question,
        code: q.code || '',
        subject: q.subjectId,
        topic: q.topic,
        options: q.options,
        userIndex: userSelected,
        correctIndex: q.correctIndex,
        isCorrect: isCorrect,
        explanation: q.explanation
      });
    });

    const total = this.questions.length;
    const accuracy = Math.round((correctCount / total) * 100);

    let multiplier = 1.0;
    if (this.mode === 'random') multiplier = 1.25;

    const baseXP = correctCount * 20;
    const xpEarned = Math.round(baseXP * multiplier);

    const timeTakenSeconds = Math.round((Date.now() - this.startTime) / 1000);
    const minutes = Math.floor(timeTakenSeconds / 60);
    const seconds = timeTakenSeconds % 60;
    const formattedTime = `${minutes}m ${seconds}s`;

    const recommendations = [];
    if (missedTopics.length > 0 && typeof DATA_RECOMMENDATIONS !== 'undefined') {
      missedTopics.forEach(item => {
        const subRecs = DATA_RECOMMENDATIONS[item.subject];
        if (subRecs && subRecs[item.topic]) {
          recommendations.push(subRecs[item.topic]);
        } else {
          recommendations.push({
            title: `Review ${item.topic} (${item.subject.toUpperCase()})`,
            advice: `You missed a question on "${item.question}". Strengthen your fundamentals using study guides before retaking.`,
            resource: `${item.subject.toUpperCase()} Core Guide`
          });
        }
      });
    } else {
      recommendations.push({
        title: '🌟 Flawless Mastery Achieved!',
        advice: 'You answered all questions correctly with 100% precision. Challenge yourself in Random Battle or try a higher difficulty subject.',
        resource: 'Advanced Arena Challenges'
      });
    }

    const resultPayload = {
      mode: this.mode,
      subjectId: this.subjectId,
      topic: this.topic,
      score: correctCount,
      total: total,
      accuracy: accuracy,
      xpEarned: xpEarned,
      multiplier: multiplier,
      timeTaken: formattedTime,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      review: questionReview,
      recommendations: recommendations
    };

    localStorage.setItem('sb_last_battle_result', JSON.stringify(resultPayload));

    if (typeof getUser === 'function') {
      const user = getUser();
      const prevBattles = user.battlesCompleted || 0;
      user.battlesCompleted = prevBattles + 1;
      if (prevBattles === 0) {
        user.accuracy = accuracy;
      } else {
        user.accuracy = Math.round(((user.accuracy || 0) * prevBattles + accuracy) / user.battlesCompleted);
      }
      saveUser(user);
    }

    if (typeof awardUserXP === 'function') {
      awardUserXP(xpEarned);
    }

    let modeTitle = 'Random Battle';
    if (this.mode === 'topic') modeTitle = 'Topic Battle';
    else if (this.mode === 'subject') modeTitle = 'Subject Battle';
    else if (this.mode === '1v1') modeTitle = '1v1 Arena Duel';
    else if (this.mode === 'speed') modeTitle = 'Speed Challenge';
    else if (this.mode === 'custom') modeTitle = 'Custom Battle';

    if (typeof addBattleHistory === 'function') {
      addBattleHistory({
        id: 'battle-' + Date.now(),
        date: 'Just now',
        mode: modeTitle,
        subject: (this.mode === 'random' || this.mode === '1v1' || this.mode === 'speed') ? 'Mixed Arena' : this.subjectId.toUpperCase(),
        topic: this.mode === 'topic' ? this.topic : ((this.mode === 'random' || this.mode === '1v1' || this.mode === 'speed') ? 'Cross-Curriculum' : 'Full Curriculum'),
        score: `${correctCount}/${total}`,
        accuracy: accuracy,
        xpEarned: xpEarned
      });
    }

    if (typeof evaluateAchievementsAfterBattle === 'function') {
      evaluateAchievementsAfterBattle({
        mode: this.mode,
        subjectId: this.subjectId,
        topic: this.topic,
        score: correctCount,
        total: total,
        accuracy: accuracy,
        xpEarned: xpEarned,
        timeTakenSeconds: timeTakenSeconds
      });
    }

    window.location.href = 'results.html';
  }
}

// --------------------------------------------------------------------------
// 2. RESULTS PAGE CONTROLLER (results.html)
// --------------------------------------------------------------------------
function initResultsPage() {
  const resultCard = document.getElementById('resultsContainer');
  if (!resultCard) return;

  const rawData = localStorage.getItem('sb_last_battle_result');
  if (!rawData) {
    resultCard.innerHTML = `
      <div class="card text-center" style="padding: 3rem 1.5rem;">
        <div style="font-size: 3rem; margin-bottom: 1rem;">⚔️</div>
        <h2 style="color: var(--text-white); margin-bottom: 0.5rem;">No Battle Record Found</h2>
        <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">Choose a battle mode from the arena to fight and earn XP!</p>
        <a href="battle-modes.html" class="btn btn-primary">Enter Battle Arena</a>
      </div>
    `;
    return;
  }

  const result = JSON.parse(rawData);

  if (typeof playAudio === 'function') playAudio('victory');

  const elScore = document.getElementById('resScore');
  const elAccuracy = document.getElementById('resAccuracy');
  const elXp = document.getElementById('resXp');
  const elTime = document.getElementById('resTime');
  const elTitle = document.getElementById('resTitle');
  const elSubtitle = document.getElementById('resSubtitle');

  if (elScore) elScore.textContent = `${result.score} / ${result.total}`;
  if (elAccuracy) elAccuracy.textContent = `${result.accuracy}%`;
  if (elXp) elXp.textContent = `+${result.xpEarned} XP`;
  if (elTime) elTime.textContent = result.timeTaken;

  if (elTitle) {
    if (result.accuracy >= 80) elTitle.textContent = '🏆 Glorious Victory!';
    else if (result.accuracy >= 50) elTitle.textContent = '⚔️ Battle Completed!';
    else elTitle.textContent = '🛡️ Good Effort, Warrior!';
  }

  if (elSubtitle) {
    let modeLabel = result.mode === 'random' ? 'Random Battle' : (result.mode === 'topic' ? `Topic: ${result.topic}` : `Subject: ${result.subjectId.toUpperCase()}`);
    elSubtitle.textContent = `Completed ${modeLabel} • Earned +${result.xpEarned} XP`;
  }

  const reviewContainer = document.getElementById('resReviewList');
  if (reviewContainer && result.review) {
    reviewContainer.innerHTML = result.review.map((item, idx) => {
      const isCorrect = item.isCorrect;
      const statusClass = isCorrect ? 'correct-review' : 'incorrect-review';
      const statusBadge = isCorrect
        ? `<span class="badge badge-green">✅ Correct</span>`
        : `<span class="badge badge-danger">❌ Incorrect</span>`;

      const userOpt = item.userIndex >= 0 ? item.options[item.userIndex] : 'Time Expired / No Answer';
      const correctOpt = item.options[item.correctIndex];

      return `
        <div class="review-item ${statusClass}">
          <div class="flex-between mb-1">
            <span style="font-size: 0.8rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase;">
              Question ${idx + 1} • ${item.topic}
            </span>
            ${statusBadge}
          </div>

          <h4 style="font-size: 1.05rem; color: var(--text-white); margin-bottom: 0.75rem;">
            ${item.question}
          </h4>

          ${item.code ? `<div class="code-snippet">${item.code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>` : ''}

          <div style="font-size: 0.88rem; margin: 0.75rem 0; display: flex; flex-direction: column; gap: 0.35rem;">
            <div>
              <strong style="color: var(--text-muted);">Your Answer:</strong>
              <span style="color: ${isCorrect ? 'var(--success)' : 'var(--danger)'}; font-weight: 600; margin-left: 0.4rem;">
                ${userOpt}
              </span>
            </div>
            ${!isCorrect ? `
              <div>
                <strong style="color: var(--text-muted);">Correct Answer:</strong>
                <span style="color: var(--success); font-weight: 600; margin-left: 0.4rem;">
                  ${correctOpt}
                </span>
              </div>
            ` : ''}
          </div>

          <div class="review-explanation">
            <strong>💡 Explanation:</strong> ${item.explanation}
          </div>
        </div>
      `;
    }).join('');
  }

  const recContainer = document.getElementById('resRecommendationsList');
  if (recContainer && result.recommendations) {
    recContainer.innerHTML = result.recommendations.map(rec => `
      <div style="background: var(--bg-surface); border: 1px solid var(--border-card); border-radius: var(--radius-md); padding: 1.25rem; margin-bottom: 0.75rem;">
        <div style="display: flex; align-items: center; gap: 0.5rem; color: var(--accent-cyan); font-weight: 600; margin-bottom: 0.35rem;">
          <span>🎯</span> ${rec.title}
        </div>
        <p style="color: var(--text-secondary); font-size: 0.88rem; line-height: 1.5; margin-bottom: 0.5rem;">
          ${rec.advice}
        </p>
        <div style="font-size: 0.78rem; color: var(--accent-purple-light);">
          <strong>Suggested Resource:</strong> ${rec.resource}
        </div>
      </div>
    `).join('');
  }

  const retryBtn = document.getElementById('retryBattleBtn');
  if (retryBtn) {
    retryBtn.href = `quiz.html?mode=${result.mode}&subject=${result.subjectId}&topic=${encodeURIComponent(result.topic || '')}`;
  }
}

// --------------------------------------------------------------------------
// INITIALIZATION
// --------------------------------------------------------------------------
function initQuizModules() {
  if (document.getElementById('quizContainer')) {
    const engine = new QuizEngine();
    engine.init();
  }

  if (document.getElementById('resultsContainer')) {
    initResultsPage();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initQuizModules);
} else {
  initQuizModules();
}