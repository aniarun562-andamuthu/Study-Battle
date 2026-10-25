/**
 * ==========================================================================
 * STUDY BATTLE - Core Application Engine (app.js)
 * Manages Per-User Isolated State, LocalStorage Namespaces, Web Audio SFX,
 * Dynamic Dashboard Synchronization, Real Achievements & Toasts
 * ==========================================================================
 */

// --------------------------------------------------------------------------
// 1. SESSION & ISOLATED PER-USER STORAGE MANAGEMENT
// --------------------------------------------------------------------------

function getCurrentSession() {
  try {
    const raw = localStorage.getItem('sb_auth_session');
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return null;
}

function getCurrentUserUid() {
  const session = getCurrentSession();
  if (session && session.uid) {
    return session.uid;
  }
  if (session && session.email) {
    if (typeof getRegisteredUsers === 'function') {
      const users = getRegisteredUsers();
      const found = users.find(u => u.email && u.email.toLowerCase() === session.email.toLowerCase());
      if (found && found.uid) return found.uid;
    }
    if (session.email.toLowerCase() === 'alex.hunter@studybattle.dev') {
      return 'uid_demo_alex_hunter';
    }
  }
  // Default to isolated sample dummy testing account if no session
  return 'uid_demo_alex_hunter';
}

function getUserStorageKey(subKey, uid = null) {
  const targetUid = uid || getCurrentUserUid();
  return `sb_user_${targetUid}_${subKey}`;
}

/**
 * Retrieves the isolated user profile for the currently logged-in UID
 */
function getUser() {
  const uid = getCurrentUserUid();
  const key = getUserStorageKey('profile', uid);
  try {
    const data = localStorage.getItem(key);
    if (data) {
      const user = JSON.parse(data);
      if (!user.uid) user.uid = uid;
      if (!user.avatar) user.avatar = 'default-avatar.svg';
      return user;
    }

    // Initialize if key is not yet created
    if (uid === 'uid_demo_alex_hunter') {
      const demoUser = {
        ...DEFAULT_USER,
        uid: 'uid_demo_alex_hunter',
        avatar: 'default-avatar.svg',
        studyHours: 14.5,
        bio: 'Competitive coder sharpening Python algorithms and full-stack battle skills.'
      };
      localStorage.setItem(key, JSON.stringify(demoUser));
      return demoUser;
    } else {
      // Lookup from registered users database
      const users = (typeof getRegisteredUsers === 'function') ? getRegisteredUsers() : [];
      const found = users.find(u => u.uid === uid);
      if (found) {
        localStorage.setItem(key, JSON.stringify(found));
        return found;
      }

      // Fresh clean start fallback: all stats 0
      const freshUser = {
        uid: uid,
        name: 'Gladiator',
        email: 'user@studybattle.dev',
        avatar: 'default-avatar.svg',
        level: 1,
        levelTitle: 'Novice Fighter',
        xp: 0,
        xpCurrentLevel: 0,
        xpRequiredLevel: 250,
        streak: 0,
        battlesCompleted: 0,
        accuracy: 0,
        studyHours: 0,
        dailyEarnedXp: 0,
        dailyGoalXp: 200,
        joinedDate: 'Oct 2026',
        bio: 'New gladiator ready to conquer technical concepts.',
        settings: { theme: 'default', soundEnabled: true, notificationsEnabled: true, timerMode: 'strict' }
      };
      localStorage.setItem(key, JSON.stringify(freshUser));
      return freshUser;
    }
  } catch (e) {
    console.error('Error reading user state:', e);
    return JSON.parse(JSON.stringify(DEFAULT_USER));
  }
}

/**
 * Persists the user profile to their isolated key and registered users db
 */
function saveUser(user) {
  if (!user) return;
  const uid = user.uid || getCurrentUserUid();
  user.uid = uid;
  const key = getUserStorageKey('profile', uid);
  try {
    localStorage.setItem(key, JSON.stringify(user));
    if (typeof updateRegisteredUser === 'function') {
      updateRegisteredUser(user);
    }
    renderUserHeaderStats();
    updateDashboardWidgets();
  } catch (e) {
    console.error('Error saving user state:', e);
  }
}

/**
 * Retrieves the isolated battle history for the active UID
 */
function getBattleHistory() {
  const uid = getCurrentUserUid();
  const key = getUserStorageKey('history', uid);
  try {
    const data = localStorage.getItem(key);
    if (data !== null) {
      return JSON.parse(data);
    }
    // If key not created yet
    if (uid === 'uid_demo_alex_hunter') {
      localStorage.setItem(key, JSON.stringify(DEFAULT_BATTLE_HISTORY));
      return JSON.parse(JSON.stringify(DEFAULT_BATTLE_HISTORY));
    } else {
      // Clean fresh start: 0 battles
      localStorage.setItem(key, JSON.stringify([]));
      return [];
    }
  } catch (e) {
    return uid === 'uid_demo_alex_hunter' ? JSON.parse(JSON.stringify(DEFAULT_BATTLE_HISTORY)) : [];
  }
}

/**
 * Saves a new battle record to the user's isolated history
 */
function addBattleHistory(record) {
  const uid = getCurrentUserUid();
  const key = getUserStorageKey('history', uid);
  const history = getBattleHistory();
  history.unshift(record);
  if (history.length > 50) history.pop();
  localStorage.setItem(key, JSON.stringify(history));

  // Increment user's study hours based on battle time
  const user = getUser();
  user.studyHours = Math.round(((user.studyHours || 0) + 0.05) * 10) / 10;
  saveUser(user);
}

/**
 * Retrieves isolated achievements for the active UID
 */
function getAchievements() {
  const uid = getCurrentUserUid();
  const key = getUserStorageKey('achievements', uid);
  try {
    const data = localStorage.getItem(key);
    if (data !== null) {
      return JSON.parse(data);
    }
    if (uid === 'uid_demo_alex_hunter') {
      localStorage.setItem(key, JSON.stringify(DATA_ACHIEVEMENTS));
      return JSON.parse(JSON.stringify(DATA_ACHIEVEMENTS));
    } else {
      // Fresh clean start: all 12 achievements locked with 0 progress
      const freshAchievements = DATA_ACHIEVEMENTS.map(ach => ({
        ...ach,
        unlocked: false,
        progress: 0
      }));
      localStorage.setItem(key, JSON.stringify(freshAchievements));
      return freshAchievements;
    }
  } catch (e) {
    return DATA_ACHIEVEMENTS;
  }
}

/**
 * Persists isolated achievements for the active UID
 */
function saveAchievements(achievements) {
  const uid = getCurrentUserUid();
  const key = getUserStorageKey('achievements', uid);
  localStorage.setItem(key, JSON.stringify(achievements));
}

/**
 * Awards XP, handles Level-ups, and checks daily goal
 */
function awardUserXP(amount) {
  const user = getUser();
  user.xp = (user.xp || 0) + amount;
  user.dailyEarnedXp = (user.dailyEarnedXp || 0) + amount;
  user.xpCurrentLevel = (user.xpCurrentLevel || 0) + amount;

  // Level up calculation: Each level requires level * 200 XP
  let requiredForNext = (user.level || 1) * 200;
  if (user.xpCurrentLevel >= requiredForNext) {
    user.level = (user.level || 1) + 1;
    user.xpCurrentLevel -= requiredForNext;
    user.xpRequiredLevel = user.level * 200;
    
    // Level title assignment
    const titles = ['Novice Fighter', 'Apprentice Coder', 'Script Warrior', 'Code Gladiator', 'Syntax Sorcerer', 'Tech Champion', 'Code Grandmaster'];
    user.levelTitle = titles[Math.min(user.level - 1, titles.length - 1)];

    saveUser(user);
    playAudio('levelup');
    showToast(`🎉 LEVEL UP! You reached Level ${user.level} (${user.levelTitle})!`, 'xp', 6000);
  } else {
    saveUser(user);
  }
}

/**
 * Real Achievements Evaluator: Only unlocks badges when real milestones are met
 */
function evaluateAchievementsAfterBattle(result) {
  const user = getUser();
  const history = getBattleHistory();
  const achievements = getAchievements();
  let newlyUnlocked = [];

  achievements.forEach(ach => {
    if (ach.unlocked) return; // Already unlocked

    let shouldUnlock = false;
    let newProgress = ach.progress || 0;

    switch (ach.id) {
      case 'first_blood':
        // Complete your very first battle
        newProgress = history.length;
        if (newProgress >= 1) shouldUnlock = true;
        break;

      case 'streak_warrior':
        // Maintain 3-day streak
        newProgress = user.streak || 0;
        if (newProgress >= 3) shouldUnlock = true;
        break;

      case 'sharp_shooter':
        // Score 100% in any battle
        if (result.accuracy === 100) {
          newProgress = 1;
          shouldUnlock = true;
        }
        break;

      case 'python_master':
        // Complete 5 battles in Python
        if (result.subjectId === 'python') {
          newProgress = history.filter(b => b.subject && b.subject.toLowerCase().includes('python')).length;
          if (newProgress >= 5) shouldUnlock = true;
        }
        break;

      case 'js_sorcerer':
        // Complete 5 battles in JavaScript
        if (result.subjectId === 'javascript') {
          newProgress = history.filter(b => b.subject && b.subject.toLowerCase().includes('javascript')).length;
          if (newProgress >= 5) shouldUnlock = true;
        }
        break;

      case 'chaos_victor':
        // Win 3 high-intensity Random Battles
        if (result.mode === 'random' && result.accuracy >= 60) {
          newProgress = (ach.progress || 0) + 1;
          if (newProgress >= 3) shouldUnlock = true;
        }
        break;

      case 'polyglot':
        // Battle in at least 4 different subjects
        const uniqueSubjects = new Set(history.map(b => (b.subject || '').toLowerCase())).size;
        newProgress = uniqueSubjects;
        if (newProgress >= 4) shouldUnlock = true;
        break;

      case 'speed_demon':
        // Finish quiz with 80%+ in under 60s
        const seconds = result.timeTakenSeconds || 999;
        if (seconds <= 60 && result.accuracy >= 80) {
          newProgress = 1;
          shouldUnlock = true;
        }
        break;

      case 'centurion':
        // Answer 50 questions correctly across all battles
        let totalCorrect = 0;
        history.forEach(b => {
          const p = (b.score || '0/0').split('/');
          totalCorrect += parseInt(p[0]) || 0;
        });
        newProgress = totalCorrect;
        if (newProgress >= 50) shouldUnlock = true;
        break;

      case 'grandmaster':
        // Reach Student Level 10
        newProgress = user.level || 1;
        if (newProgress >= 10) shouldUnlock = true;
        break;

      case 'pixel_perfect':
        // Score 100% in UI/UX battle
        if (result.subjectId === 'ui-ux' && result.accuracy === 100) {
          newProgress = 1;
          shouldUnlock = true;
        }
        break;

      case 'query_king':
        // Score 100% in DBMS battle
        if (result.subjectId === 'dbms' && result.accuracy === 100) {
          newProgress = 1;
          shouldUnlock = true;
        }
        break;
    }

    ach.progress = Math.min(newProgress, ach.target);
    if (shouldUnlock) {
      ach.unlocked = true;
      ach.unlockedDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      newlyUnlocked.push(ach);
    }
  });

  saveAchievements(achievements);

  // Award XP and show toasts for unlocked achievements
  newlyUnlocked.forEach(ach => {
    awardUserXP(ach.xpReward || 50);
    showToast(`🏆 UNLOCKED ACHIEVEMENT: "${ach.title}" (+${ach.xpReward} XP)!`, 'xp', 6000);
    playAudio('victory');
  });

  return newlyUnlocked;
}

// --------------------------------------------------------------------------
// 2. SYNTHESIZED WEB AUDIO SFX (Zero external mp3 files required)
// Handles browser autoplay restrictions via user-gesture unlock
// --------------------------------------------------------------------------
let audioCtx = null;

function unlockAudioContext() {
  try {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
  } catch (e) {
    console.warn('AudioContext unlock failed:', e);
  }
}

// User-gesture triggers to bypass modern browser autoplay restrictions
if (typeof window !== 'undefined') {
  ['click', 'pointerdown', 'keydown', 'touchstart'].forEach(evt => {
    window.addEventListener(evt, unlockAudioContext, { passive: true, once: false });
  });
}

function getAudioContext() {
  unlockAudioContext();
  return audioCtx;
}

function playAudio(type) {
  const user = getUser();
  if (user && user.settings && user.settings.soundEnabled === false) {
    return;
  }

  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    switch (type) {
      case 'click':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.05);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
        break;

      case 'correct':
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.08);
        osc.frequency.setValueAtTime(783.99, now + 0.16);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
        break;

      case 'wrong':
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(130, now + 0.25);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
        break;

      case 'victory':
        playFanfare(ctx, now);
        break;

      case 'levelup':
        playLevelUpFanfare(ctx, now);
        break;

      default:
        break;
    }
  } catch (err) {}
}

function playFanfare(ctx, now) {
  const notes = [440, 554.37, 659.25, 880];
  notes.forEach((freq, idx) => {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'triangle';
    o.frequency.setValueAtTime(freq, now + idx * 0.09);
    g.gain.setValueAtTime(0.1, now + idx * 0.09);
    g.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.3);
    o.connect(g);
    g.connect(ctx.destination);
    o.start(now + idx * 0.09);
    o.stop(now + idx * 0.09 + 0.3);
  });
}

function playLevelUpFanfare(ctx, now) {
  const notes = [392, 523.25, 659.25, 783.99, 1046.5];
  notes.forEach((freq, idx) => {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(freq, now + idx * 0.08);
    g.gain.setValueAtTime(0.15, now + idx * 0.08);
    g.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.4);
    o.connect(g);
    g.connect(ctx.destination);
    o.start(now + idx * 0.08);
    o.stop(now + idx * 0.08 + 0.4);
  });
}

// --------------------------------------------------------------------------
// 3. TOAST NOTIFICATION SYSTEM
// --------------------------------------------------------------------------
function ensureToastContainer() {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  return container;
}

function showToast(message, type = 'info', duration = 3500) {
  const container = ensureToastContainer();
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  let icon = 'ℹ️';
  if (type === 'success') icon = '✅';
  if (type === 'error') icon = '⚠️';
  if (type === 'xp') icon = '⚡';

  toast.innerHTML = `
    <span style="font-size: 1.2rem;">${icon}</span>
    <span style="flex: 1; font-weight: 500;">${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(50px)';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// --------------------------------------------------------------------------
// 4. MODAL MANAGEMENT
// --------------------------------------------------------------------------
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
    playAudio('click');
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
    playAudio('click');
  }
}

// --------------------------------------------------------------------------
// 5. HEADER & SIDEBAR STATS SYNCHRONIZATION
// --------------------------------------------------------------------------
function renderUserHeaderStats() {
  const user = getUser();
  if (!user) return;

  // Apply Theme preference
  if (user.settings && user.settings.theme === 'high-contrast') {
    document.body.classList.add('theme-high-contrast');
  } else {
    document.body.classList.remove('theme-high-contrast');
  }

  // Header user pills
  const xpEl = document.getElementById('headerUserXp');
  if (xpEl) xpEl.textContent = `${(user.xp || 0).toLocaleString()} XP`;

  const streakEl = document.getElementById('headerUserStreak');
  if (streakEl) streakEl.textContent = `${user.streak || 0} Days`;

  const levelEl = document.getElementById('headerUserLevel');
  if (levelEl) levelEl.textContent = `Lvl ${user.level || 1}`;

  // User display texts across pages
  document.querySelectorAll('.user-display-name').forEach(el => {
    el.textContent = user.name || 'Gladiator';
  });

  document.querySelectorAll('.user-display-level').forEach(el => {
    el.textContent = `Level ${user.level || 1} • ${user.levelTitle || 'Novice Fighter'}`;
  });

  document.querySelectorAll('.user-display-email').forEach(el => {
    el.textContent = user.email || 'user@studybattle.dev';
  });

  // Sidebar footer mini stats
  const sideLvl = document.getElementById('sidebarLevelBadge');
  if (sideLvl) sideLvl.textContent = `⭐ Lvl ${user.level || 1}`;

  const sideXp = document.getElementById('sidebarXpBadge');
  if (sideXp) sideXp.textContent = `${(user.xp || 0).toLocaleString()} XP`;

  // Avatar Synchronization
  const avatarUrl = user.avatar || 'default-avatar.svg';
  document.querySelectorAll('.avatar-circle:not(.testimonial-avatar):not(.rival-avatar)').forEach(el => {
    let img = el.querySelector('img.avatar-img');
    if (!img) {
      el.innerHTML = '';
      img = document.createElement('img');
      img.className = 'avatar-img';
      img.alt = user.name || 'User Avatar';
      el.appendChild(img);
    }
    img.src = avatarUrl;
    img.onerror = () => {
      if (!img.dataset.triedFallback) {
        img.dataset.triedFallback = '1';
        img.src = avatarUrl.includes('assets/images/') ? avatarUrl.replace('assets/images/', '') : 'assets/images/' + avatarUrl;
        return;
      }
      el.textContent = (user.name || 'Gladiator').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    };
  });

  // Sound toggle button in header
  const soundBtn = document.getElementById('headerSoundToggle');
  if (soundBtn) {
    const isSound = user.settings ? user.settings.soundEnabled !== false : true;
    soundBtn.title = isSound ? 'Sound SFX: ON (Click to Mute)' : 'Sound SFX: OFF (Click to Enable)';
    soundBtn.style.opacity = isSound ? '1' : '0.45';
  }
}

// --------------------------------------------------------------------------
// 6. DYNAMIC DASHBOARD SYNCHRONIZATION (Per-User Clean State)
// --------------------------------------------------------------------------
function updateDashboardWidgets() {
  const user = getUser();
  const history = getBattleHistory();

  // Greeting Subtext
  const greetingSub = document.getElementById('dashGreetingSubtext');
  if (greetingSub) {
    if (user.streak > 0) {
      greetingSub.textContent = `You have a ${user.streak}-day battle streak. Complete a battle today to hit your ${user.dailyGoalXp || 200} XP goal!`;
    } else {
      greetingSub.textContent = `Welcome to the Arena! Fight your first battle today to earn XP, maintain streaks, and level up.`;
    }
  }

  // Rank Tier Widget
  const rankVal = document.getElementById('dashRankValue');
  if (rankVal) rankVal.textContent = `Level ${user.level || 1}`;
  const rankSub = document.getElementById('dashRankSubtext');
  if (rankSub) rankSub.textContent = `${user.levelTitle || 'Novice Fighter'} (${user.xpCurrentLevel || 0}/${user.xpRequiredLevel || 250} XP)`;

  // Battle Streak Widget
  const streakVal = document.getElementById('dashStreakValue');
  if (streakVal) streakVal.textContent = `${user.streak || 0} Days`;
  const streakSub = document.getElementById('dashStreakSubtext');
  if (streakSub) streakSub.textContent = user.streak > 0 ? `Personal Best: ${Math.max(user.streak, 3)} Days 🔥` : `Start your streak today 🔥`;

  // Total XP Widget
  const xpVal = document.getElementById('dashXpValue');
  if (xpVal) xpVal.textContent = `${(user.xp || 0).toLocaleString()} XP`;
  const xpSub = document.getElementById('dashXpSubtext');
  if (xpSub) xpSub.textContent = `+${user.dailyEarnedXp || 0} XP earned today`;

  // Battles Fought Widget
  const battlesVal = document.getElementById('dashBattlesValue');
  if (battlesVal) battlesVal.textContent = user.battlesCompleted || history.length || 0;
  const battlesSub = document.getElementById('dashBattlesSubtext');
  if (battlesSub) battlesSub.textContent = `Win Accuracy: ${user.accuracy || 0}%`;

  // Daily Goal Widget
  const goalTarget = user.dailyGoalXp || 200;
  const goalEarned = user.dailyEarnedXp || 0;
  const goalPercent = Math.min(100, Math.round((goalEarned / goalTarget) * 100));

  const goalRatio = document.getElementById('dashGoalRatio');
  if (goalRatio) goalRatio.textContent = `${goalEarned} / ${goalTarget} XP (${goalPercent}%)`;

  const goalBar = document.getElementById('dashGoalBar');
  if (goalBar) goalBar.style.width = `${goalPercent}%`;

  const goalSub = document.getElementById('dashGoalSubtext');
  if (goalSub) {
    if (goalPercent >= 100) {
      goalSub.textContent = `🎉 Daily goal achieved! Streak protected for today!`;
    } else {
      const remaining = goalTarget - goalEarned;
      goalSub.textContent = `You need ${remaining} more XP to lock in today's streak protection!`;
    }
  }

  // Recent Combat History Feed
  const recentFeed = document.getElementById('dashRecentActivityFeed');
  if (recentFeed) {
    if (history.length === 0) {
      recentFeed.innerHTML = `
        <div style="text-align: center; padding: 2rem 1rem; color: var(--text-secondary);">
          <div style="font-size: 2.2rem; margin-bottom: 0.5rem;">⚔️</div>
          <div style="color: var(--text-white); font-weight: 700; font-size: 1rem; margin-bottom: 0.35rem;">No Battles Fought Yet</div>
          <p style="font-size: 0.85rem; max-width: 320px; margin: 0 auto 1.25rem; line-height: 1.4;">
            Your combat log is fresh! Choose a battle arena to start answering questions and level up your rank.
          </p>
          <a href="battle-modes.html" class="btn btn-primary btn-sm">
            <span>Enter Battle Arena Now →</span>
          </a>
        </div>
      `;
    } else {
      recentFeed.innerHTML = history.slice(0, 3).map(b => `
        <div style="display: flex; align-items: center; justify-content: space-between; padding-bottom: 0.75rem; border-bottom: 1px solid var(--border-subtle);">
          <div>
            <div style="color: var(--text-white); font-size: 0.92rem; font-weight: 600;">
              ${b.subject}: ${b.topic} (${b.score})
            </div>
            <span style="color: var(--text-muted); font-size: 0.78rem;">${b.mode} • ${b.date}</span>
          </div>
          <span style="color: var(--xp-gold); font-weight: 700;">+${b.xpEarned} XP</span>
        </div>
      `).join('');
    }
  }
}

// --------------------------------------------------------------------------
// 7. SIDEBAR MOBILE DRAWER TOGGLE & NAVIGATION HIGHLIGHTING
// --------------------------------------------------------------------------
function setupNavigation() {
  const toggleBtn = document.getElementById('mobileMenuToggle');
  const sidebar = document.querySelector('.app-sidebar');
  let backdrop = document.querySelector('.sidebar-backdrop');

  if (!backdrop && sidebar) {
    backdrop = document.createElement('div');
    backdrop.className = 'sidebar-backdrop';
    document.body.appendChild(backdrop);
  }

  if (toggleBtn && sidebar && backdrop) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('mobile-open');
      backdrop.classList.toggle('active');
    });

    backdrop.addEventListener('click', () => {
      sidebar.classList.remove('mobile-open');
      backdrop.classList.remove('active');
    });
  }

  // Highlight active link
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href && (href === currentPath || (currentPath === '' && href === 'index.html'))) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Sound toggle button
  const soundBtn = document.getElementById('headerSoundToggle');
  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      const user = getUser();
      user.settings = user.settings || {};
      user.settings.soundEnabled = !user.settings.soundEnabled;
      saveUser(user);
      playAudio('click');
      showToast(user.settings.soundEnabled ? '🔊 Sound effects enabled' : '🔇 Sound effects muted', 'info');
    });
  }
}

let isStudyNotesModalOpen = false;

function openStudyResourceModal(subjectId = 'python', initialTopic = null) {
  // Normalize subjectId
  let sid = (subjectId || 'python').toLowerCase().trim();
  if (sid.includes('python') || sid === 'py') sid = 'python';
  else if (sid.includes('java') && !sid.includes('script')) sid = 'java';
  else if (sid.includes('script') || sid === 'js') sid = 'javascript';
  else if (sid.includes('html') || sid.includes('css')) sid = 'html-css';
  else if (sid.includes('db') || sid.includes('sql')) sid = 'dbms';
  else if (sid.includes('ui') || sid.includes('ux')) sid = 'ui-ux';
  else sid = 'python';

  // Toggle state
  isStudyNotesModalOpen = true;

  // Retrieve subject guide data
  let guideData = null;
  if (typeof STUDY_GUIDE_DATA !== 'undefined' && STUDY_GUIDE_DATA[sid]) {
    guideData = STUDY_GUIDE_DATA[sid];
  } else {
    // Look up subject in DATA_SUBJECTS
    const subjObj = (typeof DATA_SUBJECTS !== 'undefined') ? DATA_SUBJECTS.find(s => s.id === sid) : null;
    guideData = {
      subjectName: subjObj ? subjObj.name : sid.toUpperCase(),
      icon: subjObj ? subjObj.icon : '📖',
      category: 'Tech Stack',
      difficulty: 'Beginner to Advanced',
      description: subjObj ? subjObj.description : 'Master key concepts, algorithms, and practical application.',
      topics: {}
    };
  }

  // Get topics list
  const topicKeys = Object.keys(guideData.topics || {});

  // Determine active topic key (support initialTopic matching)
  let selectedTopicKey = topicKeys.length > 0 ? topicKeys[0] : null;
  if (initialTopic && topicKeys.length > 0) {
    const query = decodeURIComponent(initialTopic).toLowerCase().trim();
    // 1. Exact match (case-insensitive)
    let found = topicKeys.find(k => k.toLowerCase() === query);
    // 2. Substring match
    if (!found) {
      found = topicKeys.find(k => query.includes(k.toLowerCase()) || k.toLowerCase().includes(query));
    }
    // 3. Keyword intersection match
    if (!found) {
      const words = query.split(/[\s&/+,_-]+/).filter(w => w.length > 2);
      found = topicKeys.find(k => {
        const kWords = k.toLowerCase().split(/[\s&/+,_-]+/);
        return words.some(w => kWords.includes(w) || k.toLowerCase().includes(w));
      });
    }
    if (found) {
      selectedTopicKey = found;
    }
  }

  const activeTopic = selectedTopicKey ? guideData.topics[selectedTopicKey] : null;

  // Check or create modal in DOM
  let modal = document.getElementById('studyNotesModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'studyNotesModal';
    modal.className = 'modal-overlay';
    document.body.appendChild(modal);

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeStudyResourceModal();
      }
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isStudyNotesModalOpen) {
        closeStudyResourceModal();
      }
    });
  }

  const topicTabsHtml = topicKeys.map(tk => `
    <button class="study-notes-tab ${tk === selectedTopicKey ? 'active' : ''}" data-topic-key="${encodeURIComponent(tk)}">
      ${tk}
    </button>
  `).join('');

  modal.innerHTML = `
    <div class="modal-box" style="max-width: 840px;">
      <div class="modal-header" style="background: linear-gradient(135deg, var(--bg-surface-elevated) 0%, var(--bg-surface) 100%);">
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <span style="font-size: 2rem;">${guideData.icon}</span>
          <div>
            <div class="modal-title" style="font-size: 1.25rem;">${guideData.subjectName} Quick Notes & Study Guide</div>
            <div style="font-size: 0.78rem; color: var(--text-secondary);">${guideData.difficulty} • Interactive Study Reference</div>
          </div>
        </div>
        <button class="modal-close-btn" id="closeStudyNotesBtn" aria-label="Close Study Guide">&times;</button>
      </div>

      <div class="study-notes-tabs">
        ${topicTabsHtml || `<button class="study-notes-tab active">Overview</button>`}
      </div>

      <div class="study-notes-content" id="studyNotesBody">
        <!-- Rendered dynamically -->
      </div>

      <div class="modal-footer" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem;">
        <a href="topic-detail.html?subject=${encodeURIComponent(sid)}&topic=${encodeURIComponent(selectedTopicKey || '')}" id="openFullStudyGuideBtn" class="btn btn-outline btn-sm" style="border-color: var(--accent-cyan); color: var(--accent-cyan);">
          <span>📖 Open Full Study Note →</span>
        </a>
        <div style="display: flex; gap: 0.75rem;">
          <button class="btn btn-secondary btn-sm" id="closeStudyNotesFooterBtn">Close</button>
          <a href="quiz.html?mode=subject&subject=${encodeURIComponent(sid)}" class="btn btn-primary btn-sm">
            <span>⚔️ Launch Battle Arena</span>
          </a>
        </div>
      </div>
    </div>
  `;

  function renderTopicContent(topicObj) {
    const container = document.getElementById('studyNotesBody');
    if (!container) return;

    if (!topicObj) {
      container.innerHTML = `
        <div style="padding: 1rem 0;">
          <h3 style="color: var(--text-white); margin-bottom: 0.5rem;">${guideData.subjectName} Fundamentals</h3>
          <p style="color: var(--text-secondary); line-height: 1.6;">${guideData.description}</p>
        </div>
      `;
      return;
    }

    const conceptsHtml = (topicObj.keyConcepts || []).map(c => `
      <div class="notes-concept-card">
        <div class="notes-concept-title">${c.term}</div>
        <div class="notes-concept-body">${c.description}</div>
      </div>
    `).join('');

    const syntaxHtml = topicObj.syntax ? `
      <div style="margin-top: 1rem;">
        <div style="font-size: 0.8rem; font-weight: 700; color: var(--accent-cyan); text-transform: uppercase; margin-bottom: 0.25rem;">
          💻 Syntax Cheat Sheet:
        </div>
        <pre class="notes-code-block"><code>${topicObj.syntax.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>
      </div>
    ` : '';

    container.innerHTML = `
      <div style="margin-bottom: 1rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; flex-wrap: wrap; gap: 0.5rem;">
          <h3 style="color: var(--text-white); font-size: 1.2rem; margin: 0;">${topicObj.title}</h3>
          <span class="badge badge-purple">${topicObj.badge || 'Core Concept'} • ${topicObj.readTime || '3 min'}</span>
        </div>
        <p style="color: var(--text-secondary); font-size: 0.9rem; line-height: 1.55;">
          ${topicObj.summary || topicObj.overview || ''}
        </p>
      </div>

      ${conceptsHtml ? `<div style="font-size: 0.8rem; font-weight: 700; color: var(--accent-purple-light); text-transform: uppercase; margin-top: 1rem;">🔑 Essential Concepts:</div><div class="notes-concept-grid">${conceptsHtml}</div>` : ''}

      ${syntaxHtml}
    `;
    container.scrollTop = 0;
  }

  renderTopicContent(activeTopic);

  const fullNoteBtn = document.getElementById('openFullStudyGuideBtn');

  modal.querySelectorAll('.study-notes-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      modal.querySelectorAll('.study-notes-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const rawKey = decodeURIComponent(tab.getAttribute('data-topic-key'));
      if (guideData.topics && guideData.topics[rawKey]) {
        renderTopicContent(guideData.topics[rawKey]);
        if (fullNoteBtn) {
          fullNoteBtn.href = `topic-detail.html?subject=${encodeURIComponent(sid)}&topic=${encodeURIComponent(rawKey)}`;
        }
      }
      playAudio('click');
    });
  });

  const closeBtn = document.getElementById('closeStudyNotesBtn');
  if (closeBtn) closeBtn.addEventListener('click', closeStudyResourceModal);
  const closeFooterBtn = document.getElementById('closeStudyNotesFooterBtn');
  if (closeFooterBtn) closeFooterBtn.addEventListener('click', closeStudyResourceModal);

  modal.classList.add('active');
  playAudio('click');
}

function closeStudyResourceModal() {
  const modal = document.getElementById('studyNotesModal');
  if (modal) {
    modal.classList.remove('active');
  }
  isStudyNotesModalOpen = false;
  playAudio('click');
}

window.openStudyResourceModal = openStudyResourceModal;
window.closeStudyResourceModal = closeStudyResourceModal;

// --------------------------------------------------------------------------
// 8. INITIALIZE SHARED BEHAVIORS ON PAGE LOAD
// --------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  // Global Event Delegation for Audio SFX and Autoplay Unlock
  document.addEventListener('click', (e) => {
    const interactive = e.target.closest('button, .btn, .nav-link, .stat-pill, .filter-pill, .roadmap-subject-tab, .milestone-node, .preview-opt-btn, .option-card');
    if (interactive) {
      unlockAudioContext();
      playAudio('click');
    }
  }, { capture: false, passive: true });

  renderUserHeaderStats();
  updateDashboardWidgets();
  setupNavigation();

  // Audio click feedback
  document.querySelectorAll('.btn, .nav-link, .stat-pill, .filter-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      playAudio('click');
    });
  });

  // Modals
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('active');
      }
    });
  });

  document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      const modalId = btn.getAttribute('data-close-modal');
      closeModal(modalId);
    });
  });
});
