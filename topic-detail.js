/**
 * ==========================================================================
 * STUDY BATTLE - Topic Detail Controller (topic-detail.js)
 * Dedicated separate page for deep topic understanding and examples
 * ==========================================================================
 */

function initTopicDetailPage() {
  const container = document.getElementById('topicArticleContainer');
  if (!container) return;

  const urlParams = new URLSearchParams(window.location.search);
  let subjectId = urlParams.get('subject') || 'python';
  let requestedTopic = urlParams.get('topic');

  // Verify STUDY_GUIDE_DATA and subject exist, gracefully fallback if not
  if (typeof STUDY_GUIDE_DATA === 'undefined' || !STUDY_GUIDE_DATA[subjectId]) {
    subjectId = 'python';
  }

  const subjectData = (typeof STUDY_GUIDE_DATA !== 'undefined' && STUDY_GUIDE_DATA[subjectId]) ? STUDY_GUIDE_DATA[subjectId] : {
    subjectName: 'Unknown Subject',
    icon: '📖',
    topics: {}
  };
  
  // Safely extract topic keys
  const topicKeys = subjectData.topics ? Object.keys(subjectData.topics) : [];

  // If topic is not specified or not found, match intelligently or default to first topic
  let selectedTopicKey = topicKeys.length > 0 ? topicKeys[0] : null;
  if (requestedTopic && topicKeys.length > 0) {
    const q = decodeURIComponent(requestedTopic).toLowerCase().trim();
    // 1. Exact match
    let found = topicKeys.find(k => k.toLowerCase() === q);
    // 2. Substring match
    if (!found) {
      found = topicKeys.find(k => q.includes(k.toLowerCase()) || k.toLowerCase().includes(q));
    }
    // 3. Keyword intersection match
    if (!found) {
      const words = q.split(/[\s&/+,_-]+/).filter(w => w.length > 2);
      found = topicKeys.find(k => {
        const kWords = k.toLowerCase().split(/[\s&/+,_-]+/);
        return words.some(w => kWords.includes(w) || k.toLowerCase().includes(w));
      });
    }
    if (found) {
      selectedTopicKey = found;
    }
  }

  const topicData = (selectedTopicKey && subjectData.topics && subjectData.topics[selectedTopicKey]) ? subjectData.topics[selectedTopicKey] : {
    title: selectedTopicKey || 'Topic Study Guide',
    badge: 'Curriculum Module',
    difficulty: 'Intermediate',
    readTime: '5 min read',
    summary: 'Core concept review and coding examples for this curriculum module.',
    overview: subjectData.description || 'Study guide and key concepts.',
    keyConcepts: [],
    syntax: '',
    examples: [],
    pitfalls: [],
    proTips: [],
    keyTakeaways: []
  };
  
  const topicIndex = topicKeys.indexOf(selectedTopicKey);
  const prevTopicKey = topicIndex > 0 ? topicKeys[topicIndex - 1] : null;
  const nextTopicKey = topicIndex < topicKeys.length - 1 ? topicKeys[topicIndex + 1] : null;

  // 1. Update Breadcrumbs & Page Titles
  document.title = `${topicData.title} – Study Battle Guide`;
  const elBreadcrumbSub = document.getElementById('breadcrumbSubject');
  const elBreadcrumbTop = document.getElementById('breadcrumbTopic');
  const elHeaderTitle = document.getElementById('headerTopicTitle');

  if (elBreadcrumbSub) elBreadcrumbSub.textContent = subjectData.subjectName;
  if (elBreadcrumbTop) elBreadcrumbTop.textContent = selectedTopicKey || 'Overview';
  if (elHeaderTitle) elHeaderTitle.textContent = topicData.title;

  // 2. Populate Topic Sidebar (In this Subject)
  const navSubIcon = document.getElementById('topicNavSubjectIcon');
  const navSubName = document.getElementById('topicNavSubjectName');
  const navList = document.getElementById('topicNavList');
  const sideBattleBtn = document.getElementById('sidebarBattleBtn');

  if (navSubIcon) navSubIcon.textContent = subjectData.icon;
  if (navSubName) navSubName.textContent = subjectData.subjectName;

  if (navList) {
    navList.innerHTML = topicKeys.map(k => {
      const isActive = k === selectedTopicKey;
      return `
        <a href="topic-detail.html?subject=${encodeURIComponent(subjectId)}&topic=${encodeURIComponent(k)}" 
           class="topic-nav-link ${isActive ? 'active' : ''}">
          <span class="topic-dot"></span>
          <span class="topic-name">${k}</span>
        </a>
      `;
    }).join('');
  }

  if (sideBattleBtn && selectedTopicKey) {
    sideBattleBtn.href = `quiz.html?mode=topic&subject=${encodeURIComponent(subjectId)}&topic=${encodeURIComponent(selectedTopicKey)}`;
  }

  // 3. Render Main Article Content
  const keyConceptsHtml = (topicData.keyConcepts || []).map(c => `
    <div class="concept-card">
      <div class="concept-term">${c.term}</div>
      <div class="concept-desc">${c.description}</div>
    </div>
  `).join('');

  const examplesHtml = (topicData.examples || []).map((ex, idx) => `
    <div class="example-card mb-2">
      <div class="example-header">
        <span class="example-tag">Example ${idx + 1}</span>
        <h4 class="example-title">${ex.title || 'Example'}</h4>
      </div>
      <p class="example-explanation">${ex.explanation || ''}</p>
      
      <div class="code-block-wrapper">
        <div class="code-block-header">
          <span>Source Code</span>
          <button class="code-copy-btn" onclick="copyCodeSnippet(this)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            Copy
          </button>
        </div>
        <pre class="code-snippet"><code>${escapeHtml(ex.code)}</code></pre>
      </div>

      ${ex.output ? `
      <div class="code-output-box">
        <div class="output-label">💻 Expected Output / Result:</div>
        <pre class="output-content">${escapeHtml(ex.output)}</pre>
      </div>
      ` : ''}
    </div>
  `).join('');

  const pitfallsHtml = (topicData.pitfalls || []).map(p => `
    <li class="pitfall-item">
      <span class="pitfall-icon">⚠️</span>
      <div>${p}</div>
    </li>
  `).join('');

  const proTipsHtml = (topicData.proTips || []).map(pt => `
    <li class="protip-item">
      <span class="protip-icon">💡</span>
      <div>${pt}</div>
    </li>
  `).join('');

  const takeawaysHtml = (topicData.keyTakeaways || []).map(t => `
    <li class="takeaway-item">
      <span class="takeaway-icon">✅</span>
      <div>${t}</div>
    </li>
  `).join('');

  container.innerHTML = `
    <!-- TOPIC HERO HEADER -->
    <div class="topic-hero-banner card mb-2">
      <div class="flex-between mb-1" style="flex-wrap: wrap; gap: 0.75rem;">
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <span style="font-size: 2rem;">${subjectData.icon}</span>
          <div>
            <span class="badge badge-purple">${subjectData.subjectName}</span>
            <span class="badge badge-cyan">${topicData.badge || 'Curriculum Topic'}</span>
          </div>
        </div>
        <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;">
          <span class="badge badge-gold">Difficulty: ${topicData.difficulty}</span>
          <span class="badge" style="background: rgba(255,255,255,0.08);">${topicData.readTime}</span>
          <button type="button" class="btn btn-outline btn-sm" onclick="downloadTopicReference('${subjectId}', '${selectedTopicKey || 'Topic'}')" style="padding: 0.2rem 0.6rem; font-size: 0.75rem;">
            📥 Download Cheat Sheet
          </button>
        </div>
      </div>

      <h2 class="topic-hero-title">${topicData.title}</h2>
      <p class="topic-hero-summary">${topicData.summary}</p>
    </div>

    <!-- SECTION 1: DETAILED CONCEPT OVERVIEW -->
    <div class="card mb-2">
      <div class="card-header">
        <div class="card-title">
          <span>📖</span> 1. Core Concept & Detailed Explanation
        </div>
      </div>
      <div class="topic-body-text">
        ${formatMarkdownParagraphs(topicData.overview || '')}
      </div>

      ${keyConceptsHtml ? `<div class="concept-grid mt-2">${keyConceptsHtml}</div>` : ''}
    </div>

    <!-- SECTION 1.5: CONCEPT DIAGRAM & VISUAL ARCHITECTURE -->
    <div class="concept-diagram-card mb-2">
      <div class="concept-diagram-header">
        <div style="display: flex; align-items: center; gap: 0.5rem; color: var(--text-white); font-weight: 700;">
          <span style="font-size: 1.3rem;">📊</span>
          <span>Concept Diagram & Mental Model</span>
        </div>
        <span class="badge badge-cyan">Visual Architecture</span>
      </div>
      <p style="color: var(--text-secondary); font-size: 0.85rem; margin-bottom: 1rem;">
        Mental model visual representation for beginner understanding:
      </p>
      <pre class="diagram-graphic-box">${generateTopicDiagram(subjectId, selectedTopicKey || '')}</pre>
    </div>

    <!-- SECTION 2: SYNTAX BLUEPRINT -->
    ${topicData.syntax ? `
    <div class="card mb-2">
      <div class="card-header">
        <div class="card-title">
          <span>⚙️</span> 2. Syntax & Structural Pattern
        </div>
      </div>
      <div class="code-block-wrapper">
        <pre class="code-snippet"><code>${escapeHtml(topicData.syntax)}</code></pre>
      </div>
    </div>
    ` : ''}

    <!-- SECTION 3: PRACTICAL EXAMPLES -->
    ${examplesHtml ? `
    <div class="card mb-2">
      <div class="card-header">
        <div class="card-title">
          <span>🧪</span> 3. Practical Code Examples with Explanations
        </div>
      </div>
      <div class="examples-container">
        ${examplesHtml}
      </div>
    </div>
    ` : ''}

    <!-- SECTION 4: COMMON PITFALLS & PRO TIPS -->
    <div class="grid-2 mb-2">
      <div class="card" style="border-color: rgba(239, 68, 68, 0.3);">
        <div class="card-header">
          <div class="card-title" style="color: #f87171;">
            <span>🚫</span> Common Traps to Avoid
          </div>
        </div>
        <ul class="pitfalls-list">
          ${pitfallsHtml || '<li style="color: var(--text-muted); list-style: none;">No common pitfalls listed.</li>'}
        </ul>
      </div>

      <div class="card" style="border-color: rgba(16, 185, 129, 0.3);">
        <div class="card-header">
          <div class="card-title" style="color: var(--success);">
            <span>⚡</span> Senior Engineer Pro Tips
          </div>
        </div>
        <ul class="protips-list">
          ${proTipsHtml || '<li style="color: var(--text-muted); list-style: none;">No pro tips listed.</li>'}
        </ul>
      </div>
    </div>

    <!-- SECTION 5: KEY TAKEAWAYS -->
    <div class="card mb-2" style="background: linear-gradient(135deg, rgba(26, 35, 71, 0.6) 0%, rgba(18, 25, 51, 0.8) 100%);">
      <div class="card-header">
        <div class="card-title">
          <span>🎯</span> Key Takeaways (Active Recall)
        </div>
      </div>
      <ul class="takeaways-list">
        ${takeawaysHtml || '<li style="color: var(--text-muted); list-style: none;">No key takeaways listed.</li>'}
      </ul>
    </div>

    <!-- BOTTOM ACTION & NAVIGATION CONTROLS -->
    <div class="topic-footer-nav card">
      <div class="flex-between" style="flex-wrap: wrap; gap: 1rem;">
        <div>
          ${prevTopicKey ? `
            <a href="topic-detail.html?subject=${encodeURIComponent(subjectId)}&topic=${encodeURIComponent(prevTopicKey)}" class="btn btn-secondary btn-sm">
              <span>← ${prevTopicKey}</span>
            </a>
          ` : `
            <a href="study-guide.html" class="btn btn-secondary btn-sm">
              <span>← Study Guide Hub</span>
            </a>
          `}
        </div>

        <div style="display: flex; gap: 0.75rem;">
          ${selectedTopicKey ? `
          <a href="quiz.html?mode=topic&subject=${encodeURIComponent(subjectId)}&topic=${encodeURIComponent(selectedTopicKey)}" class="btn btn-primary">
            <span>⚔️ Test Yourself in Topic Battle</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
            </svg>
          </a>
          ` : ''}

          ${nextTopicKey ? `
            <a href="topic-detail.html?subject=${encodeURIComponent(subjectId)}&topic=${encodeURIComponent(nextTopicKey)}" class="btn btn-cyan btn-sm">
              <span>${nextTopicKey} →</span>
            </a>
          ` : `
            <a href="study-guide.html" class="btn btn-cyan btn-sm">
              <span>Explore More Subjects →</span>
            </a>
          `}
        </div>
      </div>
    </div>
  `;
}

// Helper: Escape HTML in code blocks
function escapeHtml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Helper: Format line breaks and bold tags
function formatMarkdownParagraphs(text) {
  if (!text) return '';
  return text
    .split('\n\n')
    .map(p => `<p class="topic-p">${p.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</p>`)
    .join('');
}

// Helper: Copy code button
function copyCodeSnippet(btn) {
  const codeBlock = btn.closest('.code-block-wrapper').querySelector('code');
  if (!codeBlock) return;
  navigator.clipboard.writeText(codeBlock.textContent).then(() => {
    btn.innerHTML = '✅ Copied!';
    if (typeof showToast === 'function') showToast('Code copied to clipboard!', 'info', 2000);
    setTimeout(() => {
      btn.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg> Copy`;
    }, 2000);
  });
}

window.initTopicDetailPage = initTopicDetailPage;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTopicDetailPage);
} else {
  initTopicDetailPage();
}

// Helper: Generates visual ASCII/Structural diagrams for topics
function generateTopicDiagram(subjectId, topicKey) {
  const key = topicKey.toLowerCase();
  if (key.includes('variable') || key.includes('data type') || key.includes('mutab')) {
    return `+-------------------------------------------------------------+
|                 MEMORY STACK & HEAP ARCHITECTURE            |
+-------------------------------------------------------------+
|  STACK (Variable Pointers)     HEAP (Values in Memory)       |
|  [ x ] --------------------->  (int: 42)                    |
|  [ nums ] ------------------>  [1, 2, 3]  (Mutable List)    |
|  [ nums.append(4) ] -------->  [1, 2, 3, 4] (Same Address!) |
|  [ coords ] ---------------->  (10, 20)   (Immutable Tuple) |
|  [ coords[0] = 99 ] -------->  TypeError! Tuple frozen      |
+-------------------------------------------------------------+`;
  }
  if (key.includes('comprehension')) {
    return `+-------------------------------------------------------------+
|              LIST COMPREHENSION EXECUTION PIPELINE          |
+-------------------------------------------------------------+
|  SYNTAX: [ <TRANSFORM>   for <ITEM> in <ITERABLE>   if <COND> ]
|                 ^                ^                     ^    |
|                 |                |                     |    |
|            3. RESULT         1. ITERATE            2. FILTER
|           (item * 2)        (for n in nums)       (if n > 0)
+-------------------------------------------------------------+`;
  }
  if (key.includes('async') || key.includes('promise')) {
    return `+-------------------------------------------------------------+
|              JAVASCRIPT ASYNC & EVENT LOOP PHASES           |
+-------------------------------------------------------------+
|  1. CALL STACK       ==>  Sync functions execute line-by-line|
|  2. WEB APIS / NODE  ==>  fetch(), DOM timers run in bg     |
|  3. MICROTASK QUEUE  ==>  Promises, await callbacks (HIGH)   |
|  4. MACROTASK QUEUE  ==>  setTimeout, setInterval (NORMAL)   |
|  * Rule: Microtasks ALWAYS resolve before next task cycle!   |
+-------------------------------------------------------------+`;
  }
  if (key.includes('join') || key.includes('sql') || key.includes('dbms')) {
    return `+-------------------------------------------------------------+
|                    SQL JOIN RELATIONSHIPS                   |
+-------------------------------------------------------------+
|  INNER JOIN  : [ Table A ] INTERSECT [ Table B ] (Matches)   |
|  LEFT JOIN   : [ FULL Table A ] + matching Table B (or NULL) |
|  RIGHT JOIN  : matching Table A + [ FULL Table B ] (or NULL) |
|  FULL OUTER  : [ FULL Table A ] UNION [ FULL Table B ]       |
+-------------------------------------------------------------+`;
  }
  if (key.includes('flexbox') || key.includes('grid') || key.includes('css')) {
    return `+-------------------------------------------------------------+
|                 CSS LAYOUT BOX HIERARCHY                     |
+-------------------------------------------------------------+
|  MARGIN       [ Outside spacing around container ]          |
|    BORDER     [ Container outline frame ]                   |
|      PADDING  [ Internal buffer spacing ]                   |
|        CONTENT[ Text, Images, Inner flex/grid child items ] |
+-------------------------------------------------------------+`;
  }
  return `+-------------------------------------------------------------+
|                   CONCEPT LOGICAL FLOW                       |
+-------------------------------------------------------------+
|  [ INPUT DATA / SYNTAX ]                                     |
|            |                                                |
|            v                                                |
|  [ ENGINE EVALUATION & EXECUTION RULES ]                     |
|            |                                                |
|            v                                                |
|  [ PREDICTABLE COMPUTED OUTPUT & MEMORY STATE ]             |
+-------------------------------------------------------------+`;
}

// Download Reference & Cheat Sheet text file
window.downloadTopicReference = function(subjectId, topicKey) {
  if (typeof STUDY_GUIDE_DATA === 'undefined') return;
  const guideData = STUDY_GUIDE_DATA[subjectId];
  if (!guideData || !guideData.topics || !guideData.topics[topicKey]) return;
  
  const t = guideData.topics[topicKey];

  let text = `===============================================================
STUDY BATTLE - ${(guideData.subjectName || subjectId).toUpperCase()}: ${(t.title || topicKey).toUpperCase()}
Difficulty: ${t.difficulty || 'N/A'} | Read Time: ${t.readTime || 'N/A'}
===============================================================

1. SUMMARY
${t.summary || ''}

2. OVERVIEW
${t.overview || ''}

3. SYNTAX BLUEPRINT
${t.syntax || ''}

4. KEY CONCEPTS
${(t.keyConcepts || []).map(c => `* ${c.term}: ${c.description.replace(/<[^>]*>/g, '')}`).join('\n')}

5. COMMON TRAPS TO AVOID
${(t.pitfalls || []).map(p => `! ${p}`).join('\n')}

6. SENIOR PRO TIPS
${(t.proTips || []).map(pt => `+ ${pt}`).join('\n')}

7. KEY TAKEAWAYS
${(t.keyTakeaways || []).map(tk => `[OK] ${tk}`).join('\n')}

Generated by Study Battle Arena (https://studybattle.dev)
`;

  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${subjectId}-${topicKey.toLowerCase().replace(/[^a-z0-9]/g, '-')}-cheat-sheet.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  if (typeof showToast === 'function') showToast(`📥 Downloaded "${topicKey}" cheat sheet!`, 'success');
  if (typeof playAudio === 'function') playAudio('click');
};