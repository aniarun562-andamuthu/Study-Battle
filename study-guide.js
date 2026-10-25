/**
 * ==========================================================================
 * STUDY BATTLE - Study Guide Hub Controller (study-guide.js)
 * Displays all subjects, programming languages and their respective topics
 * ==========================================================================
 */

function initStudyGuidePage() {
  const container = document.getElementById('studyGuideSectionsContainer');
  if (!container) return;

  const searchInput = document.getElementById('guideSearchInput');
  const filterPills = document.querySelectorAll('.filter-pill');

  let currentCategory = 'all';
  let searchQuery = '';

  // Check URL query param for pre-filtering (e.g. ?subject=python or ?category=languages)
  const urlParams = new URLSearchParams(window.location.search);
  const targetSubject = urlParams.get('subject');
  const targetCategory = urlParams.get('category');

  if (targetCategory) {
    currentCategory = targetCategory;
    filterPills.forEach(p => {
      if (p.getAttribute('data-category') === targetCategory) {
        filterPills.forEach(pill => pill.classList.remove('active'));
        p.classList.add('active');
      }
    });
  }

  function renderSections() {
    const subjects = DATA_SUBJECTS.filter(sub => {
      const matchesCategory = currentCategory === 'all' || sub.category === currentCategory;
      if (!matchesCategory) return false;

      if (!searchQuery) return true;

      const q = searchQuery.toLowerCase();
      const nameMatch = sub.name.toLowerCase().includes(q);
      const descMatch = sub.description.toLowerCase().includes(q);
      const topicMatch = sub.topics.some(t => t.toLowerCase().includes(q));

      return nameMatch || descMatch || topicMatch;
    });

    if (subjects.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 3rem 1.5rem; background: var(--bg-surface); border-radius: var(--radius-lg); border: 1px dashed var(--border-subtle);">
          <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">🔍</div>
          <h3 style="color: var(--text-white); margin-bottom: 0.35rem;">No study topics found</h3>
          <p style="color: var(--text-secondary); font-size: 0.9rem;">Try adjusting your search terms or category filter.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = subjects.map(subject => {
      const guideData = STUDY_GUIDE_DATA[subject.id];
      const topicsObj = guideData ? guideData.topics : {};

      const topicCardsHtml = subject.topics.map(topicName => {
        const topicDetail = topicsObj[topicName] || {
          difficulty: 'Intermediate',
          readTime: '5 min read',
          summary: 'Review core syntax, principles, and practical examples for this curriculum module.'
        };

        const isMatchingSearch = searchQuery && topicName.toLowerCase().includes(searchQuery.toLowerCase());

        return `
          <div class="study-topic-card ${isMatchingSearch ? 'highlight-match' : ''}">
            <div class="study-topic-card-top">
              <span class="badge ${topicDetail.difficulty === 'Beginner' ? 'badge-green' : 'badge-purple'}">
                ${topicDetail.difficulty}
              </span>
              <span style="font-size: 0.78rem; color: var(--text-muted);">${topicDetail.readTime || '5 min read'}</span>
            </div>

            <h4 class="study-topic-title">${topicName}</h4>
            <p class="study-topic-summary">${topicDetail.summary}</p>

            <div class="study-topic-actions">
              <a href="topic-detail.html?subject=${encodeURIComponent(subject.id)}&topic=${encodeURIComponent(topicName)}" 
                 class="btn btn-primary btn-sm btn-block">
                <span>📖 Read Guide & Examples →</span>
              </a>
              <div style="display: flex; gap: 0.35rem; width: 100%;">
                <button type="button" class="btn btn-outline btn-sm btn-card-quick-notes" data-subject="${subject.id}" data-topic="${encodeURIComponent(topicName)}" style="flex: 1;" title="Open interactive quick notes">
                  <span>📝 Notes</span>
                </button>
                <a href="quiz.html?mode=topic&subject=${encodeURIComponent(subject.id)}&topic=${encodeURIComponent(topicName)}" 
                   class="btn btn-secondary btn-sm" style="flex: 1;" title="Test yourself on this topic">
                  <span>🎯 Battle</span>
                </a>
              </div>
            </div>
          </div>
        `;
      }).join('');

      return `
        <section class="study-subject-section card mb-2" id="subject-sec-${subject.id}">
          <div class="study-subject-header flex-between mb-1" style="flex-wrap: wrap; gap: 1rem; border-bottom: 1px solid var(--border-subtle); padding-bottom: 1rem;">
            <div style="display: flex; align-items: center; gap: 1rem;">
              <div class="subject-icon-box" style="font-size: 2rem; width: 56px; height: 56px;">${subject.icon}</div>
              <div>
                <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
                  <h3 style="font-size: 1.45rem; color: var(--text-white); font-weight: 700;">${subject.name}</h3>
                  <span class="badge badge-purple">${subject.topicsCount} Topics</span>
                  <span class="badge badge-cyan">${subject.difficulty}</span>
                </div>
                <p style="color: var(--text-secondary); font-size: 0.88rem; max-width: 650px;">
                  ${subject.description}
                </p>
              </div>
            </div>

            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: center;">
              <button type="button" class="btn btn-outline btn-sm btn-quick-notes" data-subject="${subject.id}">
                <span>📖 Ready-Made Notes</span>
              </button>
              <a href="quiz.html?mode=subject&subject=${subject.id}" class="btn btn-secondary btn-sm">
                <span>⚔️ Full Subject Battle</span>
              </a>
            </div>
          </div>

          <div class="study-topics-grid mt-1">
            ${topicCardsHtml}
          </div>
        </section>
      `;
    }).join('');

    // Attach click events to quick notes buttons
    container.querySelectorAll('.btn-quick-notes').forEach(btn => {
      btn.addEventListener('click', () => {
        const sid = btn.getAttribute('data-subject');
        if (typeof openStudyResourceModal === 'function') {
          openStudyResourceModal(sid);
        }
      });
    });

    container.querySelectorAll('.btn-card-quick-notes').forEach(btn => {
      btn.addEventListener('click', () => {
        const sid = btn.getAttribute('data-subject');
        const topKey = decodeURIComponent(btn.getAttribute('data-topic') || '');
        if (typeof openStudyResourceModal === 'function') {
          openStudyResourceModal(sid, topKey);
        } else {
          window.location.href = `topic-detail.html?subject=${encodeURIComponent(sid)}&topic=${encodeURIComponent(topKey)}`;
        }
      });
    });

    // If targetSubject was specified in URL, scroll to it smoothly below fixed header
    if (targetSubject) {
      setTimeout(() => {
        const targetEl = document.getElementById(`subject-sec-${targetSubject}`);
        if (targetEl) {
          const headerOffset = 90;
          const elementPosition = targetEl.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
          targetEl.style.boxShadow = '0 0 24px rgba(6, 182, 212, 0.4)';
          targetEl.style.borderColor = 'var(--accent-cyan)';
          setTimeout(() => {
            targetEl.style.boxShadow = '';
            targetEl.style.borderColor = '';
          }, 2500);
        }
      }, 250);
    }
  }

  // Filter Pills Event Handling
  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentCategory = pill.getAttribute('data-category');
      playAudio('click');
      renderSections();
    });
  });

  // Search Input Event Handling
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim();
      renderSections();
    });
  }

  // Initial render
  renderSections();
}

window.initStudyGuidePage = initStudyGuidePage;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initStudyGuidePage);
} else {
  initStudyGuidePage();
}
