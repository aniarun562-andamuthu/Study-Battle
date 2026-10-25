/**
 * ==========================================================================
 * STUDY BATTLE - Profile & Settings Engine (settings.js)
 * Profile Customization, Custom Photo Upload, Preset Avatars, Bio Editing,
 * UID Isolation Display & Settings Preferences
 * ==========================================================================
 */

function initProfilePage() {
  const profileCard = document.getElementById('profileContainer');
  if (!profileCard) return;

  const user = getUser();
  const history = getBattleHistory();

  // Elements
  const elName = document.getElementById('profileNameDisplay');
  const elEmail = document.getElementById('profileEmailDisplay');
  const elUid = document.getElementById('profileUidDisplay');
  const elLevelTitle = document.getElementById('profileLevelTitleDisplay');
  const elJoinedDate = document.getElementById('profileJoinedDateDisplay');
  const elBio = document.getElementById('profileBioDisplay');
  const elXp = document.getElementById('profileXpDisplay');
  const elStreak = document.getElementById('profileStreakDisplay');
  const elHours = document.getElementById('profileHoursDisplay');
  const elBattles = document.getElementById('profileBattlesDisplay');
  const elAccuracy = document.getElementById('profileAccuracyDisplay');

  // Input Toggles
  const toggleTheme = document.getElementById('settingToggleTheme');
  const toggleSound = document.getElementById('settingToggleSound');
  const toggleNotifications = document.getElementById('settingToggleNotifications');
  const toggleTimer = document.getElementById('settingToggleTimer');

  // Populate Profile Information
  if (elName) elName.textContent = user.name || 'Gladiator';
  if (elEmail) elEmail.textContent = user.email || 'user@studybattle.dev';
  if (elUid) elUid.textContent = `UID: ${user.uid || 'uid_demo_alex_hunter'}`;
  if (elLevelTitle) elLevelTitle.textContent = `Level ${user.level || 1} • ${user.levelTitle || 'Novice Fighter'}`;
  if (elJoinedDate) elJoinedDate.textContent = `Member since ${user.joinedDate || 'Oct 2026'}`;
  if (elBio) elBio.textContent = user.bio || 'Ready to learn and conquer the Study Battle Arena.';

  if (elXp) elXp.textContent = (user.xp || 0).toLocaleString();
  if (elStreak) elStreak.textContent = `${user.streak || 0} Days`;
  if (elHours) elHours.textContent = user.studyHours ? `${user.studyHours} hrs` : `${Math.round(history.length * 0.05 * 10) / 10} hrs`;
  if (elBattles) elBattles.textContent = history.length || user.battlesCompleted || 0;
  if (elAccuracy) elAccuracy.textContent = `${user.accuracy || 0}%`;

  // --------------------------------------------------------------------------
  // 1. CUSTOM PHOTO UPLOAD HANDLER
  // --------------------------------------------------------------------------
  const avatarInput = document.getElementById('avatarFileInput');
  if (avatarInput) {
    avatarInput.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        showToast('⚠️ Please choose an image file (PNG, JPG, SVG, WebP).', 'error');
        return;
      }

      if (file.size > 2.5 * 1024 * 1024) {
        showToast('⚠️ Image file size exceeds 2.5MB. Please choose a smaller file.', 'error');
        return;
      }

      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        const dataUrl = loadEvent.target.result;
        user.avatar = dataUrl;
        saveUser(user);
        renderUserHeaderStats();
        playAudio('correct');
        showToast('📸 Profile avatar updated successfully!', 'success');
      };
      reader.onerror = () => {
        showToast('❌ Error reading uploaded image file.', 'error');
      };
      reader.readAsDataURL(file);
    });
  }

  // --------------------------------------------------------------------------
  // 2. PRESET AVATARS MODAL
  // --------------------------------------------------------------------------
  const openPresetsBtn = document.getElementById('openPresetsBtn');
  const presetsList = document.getElementById('presetAvatarsList');

  if (openPresetsBtn) {
    openPresetsBtn.addEventListener('click', () => {
      if (presetsList && typeof AVATAR_PRESETS !== 'undefined') {
        presetsList.innerHTML = AVATAR_PRESETS.map(preset => {
          const isSelected = user.avatar && (user.avatar === preset.src || user.avatar.endsWith(preset.src) || preset.src.endsWith(user.avatar));
          return `
            <button type="button" class="preset-avatar-btn ${isSelected ? 'selected' : ''}" onclick="selectAvatarPreset('${preset.src}', '${preset.name}')">
              <img src="${preset.src}" alt="${preset.name}" onerror="if(!this.dataset.tried){this.dataset.tried='1';this.src='assets/images/'+'${preset.src}';}">
              <span>${preset.name}</span>
            </button>
          `;
        }).join('');
      }
      openModal('presetAvatarsModal');
    });
  }

  window.selectAvatarPreset = function(src, name) {
    user.avatar = src;
    saveUser(user);
    renderUserHeaderStats();
    closeModal('presetAvatarsModal');
    playAudio('correct');
    showToast(`🎭 Avatar changed to "${name}"!`, 'success');
  };

  // --------------------------------------------------------------------------
  // 3. EDIT NAME & BIO & COPY UID
  // --------------------------------------------------------------------------
  const editNameBtn = document.getElementById('editProfileNameBtn');
  if (editNameBtn) {
    editNameBtn.addEventListener('click', () => {
      const currentName = user.name || 'Gladiator';
      const newName = prompt('Enter your Gladiator Gamer Tag / Name:', currentName);
      if (newName && newName.trim().length > 1) {
        user.name = newName.trim();
        saveUser(user);
        if (elName) elName.textContent = user.name;
        showToast(`✅ Profile name updated to "${user.name}"!`, 'success');
        playAudio('correct');
      }
    });
  }

  const editBioBtn = document.getElementById('editBioBtn');
  if (editBioBtn) {
    editBioBtn.addEventListener('click', () => {
      const currentBio = user.bio || 'Ready to learn and conquer the Study Battle Arena.';
      const newBio = prompt('Enter your fighter bio or study motto:', currentBio);
      if (newBio && newBio.trim().length > 0) {
        user.bio = newBio.trim();
        saveUser(user);
        if (elBio) elBio.textContent = user.bio;
        showToast('✅ Profile bio updated!', 'success');
        playAudio('correct');
      }
    });
  }

  const copyUidBtn = document.getElementById('copyUidBtn');
  if (copyUidBtn) {
    copyUidBtn.addEventListener('click', () => {
      const uidVal = user.uid || 'uid_demo_alex_hunter';
      navigator.clipboard.writeText(uidVal).then(() => {
        showToast(`📋 Copied UID: ${uidVal}`, 'info');
        playAudio('click');
      });
    });
  }

  // --------------------------------------------------------------------------
  // 4. PLATFORM PREFERENCE TOGGLES (Per-User Retention)
  // --------------------------------------------------------------------------
  const settings = user.settings || {};

  if (toggleTheme) {
    toggleTheme.checked = settings.theme === 'high-contrast';
    toggleTheme.addEventListener('change', () => {
      user.settings = user.settings || {};
      user.settings.theme = toggleTheme.checked ? 'high-contrast' : 'default';
      saveUser(user);
      playAudio('click');
      showToast(toggleTheme.checked ? '🎨 High Contrast OLED theme active' : '🎨 Premium Navy theme active', 'info');
    });
  }

  if (toggleSound) {
    toggleSound.checked = settings.soundEnabled !== false;
    toggleSound.addEventListener('change', () => {
      user.settings = user.settings || {};
      user.settings.soundEnabled = toggleSound.checked;
      saveUser(user);
      playAudio('click');
      showToast(toggleSound.checked ? '🔊 Audio effects enabled' : '🔇 Audio effects muted', 'info');
    });
  }

  if (toggleNotifications) {
    toggleNotifications.checked = settings.notificationsEnabled !== false;
    toggleNotifications.addEventListener('change', () => {
      user.settings = user.settings || {};
      user.settings.notificationsEnabled = toggleNotifications.checked;
      saveUser(user);
      playAudio('click');
      showToast(toggleNotifications.checked ? '🔔 Daily streak reminders active' : '🔕 Reminders paused', 'info');
    });
  }

  if (toggleTimer) {
    toggleTimer.checked = settings.timerMode === 'relaxed';
    toggleTimer.addEventListener('change', () => {
      user.settings = user.settings || {};
      user.settings.timerMode = toggleTimer.checked ? 'relaxed' : 'strict';
      saveUser(user);
      playAudio('click');
      showToast(toggleTimer.checked ? '⏱️ Relaxed Timer Mode (40s per question)' : '⚡ Strict Timer Mode (20s per question)', 'info');
    });
  }

  // --------------------------------------------------------------------------
  // 5. DATA RESET HANDLER (Per-User Reset)
  // --------------------------------------------------------------------------
  const resetBtn = document.getElementById('resetDemoDataBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to reset this profile back to starter stats?')) {
        const uid = user.uid || getCurrentUserUid();
        localStorage.removeItem(`sb_user_${uid}_profile`);
        localStorage.removeItem(`sb_user_${uid}_history`);
        localStorage.removeItem(`sb_user_${uid}_achievements`);
        localStorage.removeItem('sb_last_battle_result');

        showToast('🔄 Account stats reset to fresh starter defaults.', 'info');
        playAudio('click');
        setTimeout(() => {
          window.location.reload();
        }, 600);
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initProfilePage();
});
