/* ============================================================
   AI POWERED CODE ASSISTANT — script.js
   Shared JavaScript for all pages
   ============================================================ */

/* ============================================================
   GLOBAL THEME TOGGLE — shared across all pages
   ============================================================ */
function toggleTheme() {
  document.body.classList.toggle('light-mode');
  const isLight = document.body.classList.contains('light-mode');
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
  // Apply matching Monaco theme
  if (typeof monaco !== 'undefined')
    monaco.editor.setTheme(isLight ? 'vs' : 'vs-dark');
}

// Apply saved theme immediately on every page load
(function () {
  if (localStorage.getItem('theme') === 'light')
    document.body.classList.add('light-mode');
})();


/* ============================================================
   INDEX PAGE — Login Modal
   ============================================================ */
function openModal(tab) {
  document.getElementById('loginModal').classList.add('active');
  switchTab(tab || 'login');
}

function closeModal() {
  document.getElementById('loginModal')?.classList.remove('active');
}

function handleOverlayClick(e) {
  if (e.target === document.getElementById('loginModal')) closeModal();
}

// Close modal on Escape key
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

function switchTab(tab) {
  const panelLogin  = document.getElementById('panel-login');
  const panelSignup = document.getElementById('panel-signup');
  const tabLogin    = document.getElementById('tab-login');
  const tabSignup   = document.getElementById('tab-signup');
  const indicator   = document.getElementById('tab-indicator');
  if (!panelLogin) return;

  // Clear errors on tab switch
  showError('login-error', '');
  showError('signup-error', '');

  const isSignup = tab === 'signup';
  panelLogin.style.display  = isSignup ? 'none'  : 'block';
  panelSignup.style.display = isSignup ? 'block' : 'none';
  tabLogin.classList.toggle('active', !isSignup);
  tabSignup.classList.toggle('active', isSignup);
  indicator?.classList.toggle('right', isSignup);
}

function showError(id, msg) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = msg;
  el.classList.toggle('show', !!msg);
}

function togglePassword(inputId, btn) {
  const input = document.getElementById(inputId);
  if (!input) return;
  const isHidden    = input.type === 'password';
  input.type        = isHidden ? 'text' : 'password';
  btn.style.opacity = isHidden ? '0.9' : '0.4';
}

function handleLogin() {
  const email    = document.getElementById('login-email')?.value.trim();
  const password = document.getElementById('login-password')?.value;
  if (!email)                       return showError('login-error', '⚠ Please enter your email.');
  if (!/\S+@\S+\.\S+/.test(email)) return showError('login-error', '⚠ Enter a valid email address.');
  if (!password)                    return showError('login-error', '⚠ Please enter your password.');
  showError('login-error', '');
  // 🔌 Connect Firebase auth here
  alert(`Logged in as ${email}\n\n(Connect Firebase to enable real auth.)`);
  closeModal();
}

function handleSignup() {
  const name     = document.getElementById('signup-name')?.value.trim();
  const email    = document.getElementById('signup-email')?.value.trim();
  const password = document.getElementById('signup-password')?.value;
  const confirm  = document.getElementById('signup-confirm')?.value;
  if (!name)                        return showError('signup-error', '⚠ Please enter your full name.');
  if (!email)                       return showError('signup-error', '⚠ Please enter your email.');
  if (!/\S+@\S+\.\S+/.test(email)) return showError('signup-error', '⚠ Enter a valid email address.');
  if (!password)                    return showError('signup-error', '⚠ Please create a password.');
  if (password.length < 6)          return showError('signup-error', '⚠ Password must be at least 6 characters.');
  if (password !== confirm)         return showError('signup-error', '⚠ Passwords do not match.');
  showError('signup-error', '');
  // 🔌 Connect Firebase auth here
  alert(`Account created for ${name}!\n\n(Connect Firebase to enable real auth.)`);
  closeModal();
}

// Shared Google SVG — avoids duplicating the same markup in loginWithGoogle
const GOOGLE_SVG = `<svg width="18" height="18" viewBox="0 0 18 18">
  <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
  <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.909-2.259c-.806.54-1.836.86-3.047.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
  <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
  <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
</svg>`;

function loginWithGoogle() {
  const btns = document.querySelectorAll('.btn-google');
  btns.forEach(btn => { btn.textContent = '⏳ Redirecting…'; btn.disabled = true; });
  // 🔌 Connect Firebase Google OAuth here
  setTimeout(() => {
    btns.forEach(btn => { btn.disabled = false; });
    btns[0].innerHTML = `${GOOGLE_SVG} Continue with Google`;
    btns[1].innerHTML = `${GOOGLE_SVG} Sign up with Google`;
    alert('Connect your Firebase or Google OAuth credentials to activate this.');
  }, 1400);
}

// Password strength meter
document.addEventListener('DOMContentLoaded', () => {
  const pwInput = document.getElementById('signup-password');
  if (!pwInput) return;
  pwInput.addEventListener('input', () => {
    const val   = pwInput.value;
    const fill  = document.getElementById('strength-fill');
    const label = document.getElementById('strength-label');
    if (!fill || !label) return;

    // Score based on length, uppercase, numbers, symbols
    let score = 0;
    if (val.length >= 6)           score++;
    if (val.length >= 10)          score++;
    if (/[A-Z]/.test(val))         score++;
    if (/[0-9]/.test(val))         score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;

    const levels = [
      { w:'0%',   c:'transparent', t:'' },
      { w:'25%',  c:'#f87171',     t:'Weak' },
      { w:'50%',  c:'#fb923c',     t:'Fair' },
      { w:'75%',  c:'#facc15',     t:'Good' },
      { w:'100%', c:'#10b981',     t:'Strong' },
    ];
    const lvl = levels[Math.min(score, 4)];
    fill.style.width      = val ? lvl.w : '0%';
    fill.style.background = lvl.c;
    label.textContent     = val ? lvl.t : '';
    label.style.color     = lvl.c;
  });
});


/* ============================================================
   CODE GENERATOR PAGE
   ============================================================ */
let cg_editor = null;
let cg_lang   = 'javascript';
let cg_ready  = false;

// File extension map for download filenames
const CG_EXT = {
  javascript:'js', python:'py', typescript:'ts', java:'java',
  cpp:'cpp', csharp:'cs', go:'go', rust:'rs',
  html:'html', css:'css', sql:'sql', php:'php'
};

function cg_initMonaco() {
  if (!document.getElementById('monaco-editor-codegen')) return;
  require.config({ paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs' } });
  require(['vs/editor/editor.main'], function () {
    const cgTheme = document.body.classList.contains('light-mode') ? 'vs' : 'vs-dark';
    cg_editor = monaco.editor.create(document.getElementById('monaco-editor-codegen'), {
      value: '', language: 'javascript', theme: cgTheme,
      fontSize: 14, fontFamily: "'Space Mono', monospace",
      minimap: { enabled: false }, scrollBeyondLastLine: false,
      automaticLayout: true, lineNumbers: 'on',
      padding: { top: 14, bottom: 14 }, smoothScrolling: true, cursorBlinking: 'smooth',
    });
    cg_ready = true;
    // Update footer counters on content change
    cg_editor.onDidChangeModelContent(() => {
      const v = cg_editor.getValue();
      const l = document.getElementById('cg-footer-lines');
      const c = document.getElementById('cg-footer-chars');
      if (l) l.textContent = v.split('\n').length;
      if (c) c.textContent = v.length;
    });
  });
}

function cg_changeLang() {
  const sel = document.getElementById('cgLangSelect');
  if (!sel) return;
  cg_lang = sel.value;
  const tab = document.getElementById('cg-file-tab');
  const fl  = document.getElementById('cg-footer-lang');
  if (tab) tab.textContent = `generated.${CG_EXT[cg_lang] || cg_lang}`;
  if (fl)  fl.textContent  = sel.options[sel.selectedIndex].text;
  if (cg_editor) monaco.editor.setModelLanguage(cg_editor.getModel(), cg_lang);
}

// Send on Enter, new line on Shift+Enter
function cg_handleKey(e) {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); cg_sendMessage(); }
}

function cg_autoResize(el) {
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 120) + 'px';
}

function cg_addMsg(role, text) {
  const box = document.getElementById('cg-messages');
  if (!box) return;
  const d = document.createElement('div');
  d.className = `msg ${role}`;
  d.innerHTML = `
    <div class="msg-label">${role === 'user' ? 'YOU' : 'AI ASSISTANT'}</div>
    <div class="msg-bubble">${text.replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,'<br>')}</div>`;
  box.appendChild(d);
  box.scrollTop = box.scrollHeight;
}

function cg_showTyping() {
  const box = document.getElementById('cg-messages');
  if (!box) return;
  const d = document.createElement('div');
  d.id = 'cg-typing'; d.className = 'msg ai';
  d.innerHTML = `<div class="msg-label">AI ASSISTANT</div>
    <div class="typing-indicator"><span></span><span></span><span></span></div>`;
  box.appendChild(d); box.scrollTop = box.scrollHeight;
}

function cg_hideTyping() { document.getElementById('cg-typing')?.remove(); }

function cg_showEditor() {
  // Hide placeholder, show Monaco editor
  document.getElementById('cg-empty').style.display = 'none';
  document.getElementById('monaco-editor-codegen').style.display = 'block';
}

// Extract code block from AI response (strips triple backticks)
function cg_extractCode(text) {
  const m = text.match(/```(?:\w+)?\n?([\s\S]*?)```/);
  return m ? m[1].trim() : text.trim();
}

async function cg_sendMessage() {
  const inp  = document.getElementById('cg-input');
  if (!inp) return;
  const text = inp.value.trim();
  if (!text) return;

  cg_addMsg('user', text);
  inp.value = ''; inp.style.height = 'auto';
  cg_showTyping();

  const sel    = document.getElementById('cgLangSelect');
  const lang   = sel ? sel.options[sel.selectedIndex].text : 'JavaScript';
  const prompt = `You are an expert ${lang} developer. The user wants: "${text}".
Write clean, well-commented ${lang} code.
Wrap the code in a single code block using triple backticks.
After the code block, write a brief 1–2 sentence explanation.`;

  try {
    const res  = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }] })
    });
    const data  = await res.json();
    const reply = data.content?.[0]?.text || 'Sorry, could not generate code.';
    cg_hideTyping();
    cg_addMsg('ai', reply);
    // Inject generated code into Monaco editor
    if (cg_ready) { cg_showEditor(); cg_editor.setValue(cg_extractCode(reply)); }
  } catch {
    cg_hideTyping();
    cg_addMsg('ai', '❌ Error connecting to AI. Please try again.');
  }
}

function cg_copyCode() {
  if (!cg_editor) return;
  navigator.clipboard.writeText(cg_editor.getValue());
  const btn = event.target;
  btn.textContent = '✓ Copied!';
  setTimeout(() => btn.textContent = '⎘ Copy', 2000);
}

function cg_clearEditor() {
  if (cg_editor) cg_editor.setValue('');
  // Show empty placeholder, hide editor
  document.getElementById('cg-empty').style.display = 'grid';
  document.getElementById('monaco-editor-codegen').style.display = 'none';
}

function cg_download() {
  if (!cg_editor) return;
  const a = Object.assign(document.createElement('a'), {
    href: URL.createObjectURL(new Blob([cg_editor.getValue()], { type: 'text/plain' })),
    download: `generated.${CG_EXT[cg_lang] || 'txt'}`
  }); a.click();
}


/* ============================================================
   ASSISTANT PAGE
   ============================================================ */
let as_editor  = null;
let as_results = 0;

function as_initMonaco() {
  if (!document.getElementById('monaco-editor-assistant')) return;
  require.config({ paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs' } });
  require(['vs/editor/editor.main'], function () {
    const asTheme = document.body.classList.contains('light-mode') ? 'vs' : 'vs-dark';
    as_editor = monaco.editor.create(document.getElementById('monaco-editor-assistant'), {
      value: '// Paste or type your code here\n',
      language: 'javascript', theme: asTheme,
      fontSize: 13, fontFamily: "'Space Mono', monospace",
      minimap: { enabled: false }, scrollBeyondLastLine: false,
      automaticLayout: true, lineNumbers: 'on',
      padding: { top: 14, bottom: 14 }, smoothScrolling: true,
    });
    // Update footer counters on content change
    as_editor.onDidChangeModelContent(() => {
      const v = as_editor.getValue();
      const l = document.getElementById('as-footer-lines');
      const c = document.getElementById('as-footer-chars');
      if (l) l.textContent = v.split('\n').length;
      if (c) c.textContent = v.length;
    });
  });
}

function as_changeLang() {
  const sel = document.getElementById('asLangSelect');
  if (!sel || !as_editor) return;
  const lbl = document.getElementById('as-footer-lang');
  if (lbl) lbl.textContent = sel.options[sel.selectedIndex].text;
  monaco.editor.setModelLanguage(as_editor.getModel(), sel.value);
}

function as_clearEditor() {
  if (as_editor) as_editor.setValue('// Paste or type your code here\n');
}

async function as_pasteCode() {
  try {
    const t = await navigator.clipboard.readText();
    if (as_editor) as_editor.setValue(t);
  } catch {}
}

function as_clearOutput() {
  const area = document.getElementById('as-output');
  if (!area) return;
  area.innerHTML = `<div class="output-placeholder">
    <div class="op-icon">🛠</div>
    <p>Paste your code on the left,<br/>then click a tool button above.</p>
  </div>`;
  as_results = 0;
  const rc = document.getElementById('as-result-count');
  const la = document.getElementById('as-last-action');
  const af = document.getElementById('as-active-feature');
  if (rc) rc.textContent = '0';
  if (la) la.textContent = '—';
  if (af) af.textContent = 'Waiting…';
}

// Each feature has a label, CSS class, icon, and AI prompt template
const AS_FEATURES = {
  runner: {
    label: '▶ RUN', cls: 'runner', icon: '▶',
    prompt: (code, lang) =>
      `You are a ${lang} code runner simulator. Simulate running this code and show the terminal output exactly. If errors exist, show the error.\n\nCode:\n\`\`\`${lang}\n${code}\n\`\`\`\n\nShow ONLY the terminal output.`
  },
  explainer: {
    label: '💡 EXPLAIN', cls: 'explainer', icon: '💡',
    prompt: (code, lang) =>
      `You are an expert ${lang} teacher. Explain this code clearly for a beginner to intermediate programmer.\n\nCode:\n\`\`\`${lang}\n${code}\n\`\`\`\n\nProvide a clear, structured explanation.`
  },
  error: {
    label: '🔧 ERRORS', cls: 'error', icon: '🔧',
    prompt: (code, lang) =>
      `You are an expert ${lang} debugger. Find bugs/errors. List each problem and fix.\n\nCode:\n\`\`\`${lang}\n${code}\n\`\`\`\n\nFormat: ISSUE → EXPLANATION → FIX`
  },
  summarizer: {
    label: '📋 SUMMARY', cls: 'summarizer', icon: '📋',
    prompt: (code, lang) =>
      `Senior ${lang} developer. Summarize:\n1. What it does\n2. Key functions\n3. Input/Output\n4. Complexity\n5. Dependencies\n\nCode:\n\`\`\`${lang}\n${code}\n\`\`\`\n\nBe concise.`
  }
};

async function as_runFeature(type) {
  if (!as_editor) return;
  const code = as_editor.getValue().trim();
  if (!code || code === '// Paste or type your code here') {
    alert('Please paste or type some code first!'); return;
  }

  const sel  = document.getElementById('asLangSelect');
  const lang = sel ? sel.options[sel.selectedIndex].text : 'JavaScript';
  const cfg  = AS_FEATURES[type];
  const area = document.getElementById('as-output');
  const af   = document.getElementById('as-active-feature');
  const bar  = document.getElementById('as-loading-bar');
  if (!area) return;

  // Remove placeholder if present
  area.querySelector('.output-placeholder')?.remove();

  if (af) af.textContent = `${cfg.icon} ${cfg.label}…`;
  // Animate loading bar
  if (bar) { bar.style.width = '60%'; setTimeout(() => bar.style.width = '85%', 600); }

  // Show a loading block while waiting for AI response
  const loadBlock = document.createElement('div');
  loadBlock.className = 'output-block'; loadBlock.id = 'as-loading-block';
  loadBlock.innerHTML = `<div class="ob-header ${cfg.cls}">${cfg.icon} ${cfg.label} — Processing…</div>
    <div class="ob-body" style="color:var(--muted);">⏳ Analyzing…</div>`;
  area.appendChild(loadBlock); area.scrollTop = area.scrollHeight;

  try {
    const res  = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 1000,
        messages: [{ role: 'user', content: cfg.prompt(code, lang) }] })
    });
    const data  = await res.json();
    const reply = data.content?.[0]?.text || 'No response.';

    loadBlock.remove();
    if (bar) { bar.style.width = '100%'; setTimeout(() => bar.style.width = '0', 500); }
    as_results++;

    // Render the AI response as an output block
    const block = document.createElement('div');
    block.className = 'output-block';
    block.innerHTML = `<div class="ob-header ${cfg.cls}">${cfg.icon} ${cfg.label} — ${lang} · ${new Date().toLocaleTimeString()}</div>
      <div class="ob-body">${reply.replace(/</g,'&lt;').replace(/>/g,'&gt;')}</div>`;
    area.appendChild(block); area.scrollTop = area.scrollHeight;

    const rc = document.getElementById('as-result-count');
    const la = document.getElementById('as-last-action');
    if (rc) rc.textContent = as_results;
    if (la) la.textContent = `Last: ${cfg.label}`;
    if (af) af.textContent = `✓ ${cfg.label} done`;
  } catch {
    loadBlock.remove();
    if (bar) { bar.style.width = '100%'; setTimeout(() => bar.style.width = '0', 500); }
    const block = document.createElement('div');
    block.className = 'output-block';
    block.innerHTML = `<div class="ob-header error">❌ ERROR</div>
      <div class="ob-body">Failed to connect to AI. Please try again.</div>`;
    area.appendChild(block); area.scrollTop = area.scrollHeight;
  }
}


/* ============================================================
   HISTORY PAGE
   ============================================================ */

// Sample sessions shown on first load (before user creates real sessions)
const HIST_SAMPLE = [
  { id:'h1', type:'gen', label:'Generator', lang:'Python', title:'Fibonacci sequence generator', time:'2h ago',
    messages:[
      { role:'user', text:'Write a Python function to generate Fibonacci sequence up to n terms.' },
      { role:'ai',   text:'Here\'s a clean Python implementation:\n\n```python\ndef fibonacci(n):\n    a, b = 0, 1\n    result = []\n    for _ in range(n):\n        result.append(a)\n        a, b = b, a + b\n    return result\nprint(fibonacci(10))\n```\n\nThis uses an iterative approach for efficiency.' }
    ]},
  { id:'h2', type:'runner', label:'Runner', lang:'JavaScript', title:'Bubble sort simulation', time:'5h ago',
    messages:[
      { role:'user', text:'Run this bubble sort and show output.' },
      { role:'output', feat:'runner', featLabel:'▶ RUN', featCls:'runner',
        text:'$ node sort.js\n[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]\nSorted in 0.002ms\nProcess exited with code 0' }
    ]},
  { id:'h3', type:'explainer', label:'Explainer', lang:'JavaScript', title:'Async/await deep dive', time:'Yesterday',
    messages:[
      { role:'user', text:'Explain this async JavaScript code to me.' },
      { role:'output', feat:'explainer', featLabel:'💡 EXPLAIN', featCls:'explainer',
        text:'1. async marks the function as asynchronous\n2. await pauses until the Promise resolves\n3. try/catch handles errors\n4. fetch() returns a Promise resolving to a Response' }
    ]},
  { id:'h4', type:'error', label:'Error Solver', lang:'Python', title:'TypeError: NoneType fix', time:'Yesterday',
    messages:[
      { role:'user', text:'This Python code throws a TypeError. Fix it.' },
      { role:'output', feat:'error', featLabel:'🔧 ERRORS', featCls:'error',
        text:'ISSUE → Line 12: .upper() on None\nEXPLANATION → get_name() can return None\nFIX →\nif name := get_name():\n    print(name.upper())\nelse:\n    print("Not found")' }
    ]},
  { id:'h5', type:'summarizer', label:'Summarizer', lang:'TypeScript', title:'Auth middleware summary', time:'2 days ago',
    messages:[
      { role:'user', text:'Summarize this Express auth middleware.' },
      { role:'output', feat:'summarizer', featLabel:'📋 SUMMARY', featCls:'summarizer',
        text:'1. Purpose: JWT authentication middleware\n2. Functions: verifyToken(), extractBearer()\n3. Input: Authorization header | Output: next() or 401\n4. Complexity: O(1)\n5. Deps: jsonwebtoken, express' }
    ]},
  { id:'h6', type:'gen', label:'Generator', lang:'SQL', title:'Multi-table JOIN query', time:'3 days ago',
    messages:[
      { role:'user', text:'Write SQL to join users, orders, and products.' },
      { role:'ai',   text:'```sql\nSELECT u.name, o.order_id, p.product_name, p.price\nFROM users u\nINNER JOIN orders o ON u.id = o.user_id\nINNER JOIN order_items oi ON o.order_id = oi.order_id\nINNER JOIN products p ON oi.product_id = p.id\nWHERE o.status = \'completed\'\nORDER BY o.created_at DESC;\n```' }
    ]}
];

// Load from localStorage if available, otherwise use sample data
let hist_sessions     = JSON.parse(localStorage.getItem('aipca_hist') || 'null') || HIST_SAMPLE;
let hist_activeFilter = 'all';
let hist_active       = null;

// Save current sessions to localStorage
function hist_save() { localStorage.setItem('aipca_hist', JSON.stringify(hist_sessions)); }

function hist_init() {
  if (!document.getElementById('hist-sessions-list')) return;
  hist_render();
  // Update total stats counters
  const sc = document.getElementById('hist-stats-count');
  const sm = document.getElementById('hist-stats-msgs');
  if (sc) sc.textContent = hist_sessions.length;
  if (sm) sm.textContent = hist_sessions.reduce((a, s) => a + s.messages.length, 0);
}

function hist_render() {
  const list = document.getElementById('hist-sessions-list');
  if (!list) return;
  const search = (document.getElementById('hist-search')?.value || '').toLowerCase();

  // Filter by active chip and search term
  const filtered = hist_sessions.filter(s => {
    const mf = hist_activeFilter === 'all' || s.type === hist_activeFilter;
    const ms = !search || s.title.toLowerCase().includes(search) || s.lang.toLowerCase().includes(search);
    return mf && ms;
  });

  const tc = document.getElementById('hist-total-count');
  if (tc) tc.textContent = filtered.length;

  if (!filtered.length) {
    list.innerHTML = '<div class="no-sessions">No sessions found</div>'; return;
  }

  list.innerHTML = filtered.map(s => `
    <div class="session-item ${hist_active?.id === s.id ? 'active' : ''}" onclick="hist_open('${s.id}')">
      <div class="session-top">
        <span class="s-tag ${s.type}">${s.label}</span>
        <span class="s-time">${s.time}</span>
      </div>
      <div class="s-title">${s.title}</div>
      <div class="s-preview">${s.lang} · ${s.messages.length} msg${s.messages.length !== 1 ? 's' : ''}</div>
      <button class="del-btn" onclick="hist_delete(event,'${s.id}')">✕</button>
    </div>`).join('');
}

function hist_open(id) {
  hist_active = hist_sessions.find(s => s.id === id);
  if (!hist_active) return;

  // Show content panel, hide empty state
  document.getElementById('hist-empty')?.setAttribute('style', 'display:none');
  const cv = document.getElementById('hist-chat-view');
  const ha = document.getElementById('hist-content-actions');
  const ht = document.getElementById('hist-content-title');
  if (cv) cv.style.display = 'flex';
  if (ha) ha.style.display = 'flex';
  if (ht) ht.innerHTML = `<span class="s-tag ${hist_active.type}">${hist_active.label}</span> ${hist_active.title}`;

  // Render messages — output blocks get a special layout vs chat bubbles
  if (cv) {
    cv.innerHTML = hist_active.messages.map(m => {
      if (m.role === 'output') return `
        <div class="feat-out-block">
          <div class="feat-out-header s-tag ${m.featCls}">${m.featLabel} · ${hist_active.lang}</div>
          <div class="feat-out-body">${m.text.replace(/</g,'&lt;').replace(/>/g,'&gt;')}</div>
        </div>`;
      return `
        <div class="hm ${m.role}">
          <div class="hm-label">${m.role === 'user' ? 'YOU' : 'AI ASSISTANT'}</div>
          <div class="hm-bubble">${m.text.replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,'<br>')}</div>
        </div>`;
    }).join('');
  }

  const sd = document.getElementById('hist-stats-date');
  if (sd) sd.textContent = `Session: ${hist_active.time}`;
  hist_render();
}

function hist_setFilter(el) {
  // Update active chip and re-render list
  document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  hist_activeFilter = el.dataset.filter;
  hist_render();
}

function hist_search() { hist_render(); }

function hist_delete(e, id) {
  e.stopPropagation();
  if (!confirm('Delete this session?')) return;
  hist_sessions = hist_sessions.filter(s => s.id !== id);
  if (hist_active?.id === id) hist_resetContent();
  hist_save(); hist_render();
}

function hist_deleteActive() {
  if (!hist_active || !confirm('Delete this session?')) return;
  hist_sessions = hist_sessions.filter(s => s.id !== hist_active.id);
  hist_resetContent(); hist_save(); hist_render();
}

function hist_resetContent() {
  // Reset content panel back to empty state
  hist_active = null;
  document.getElementById('hist-empty')?.removeAttribute('style');
  const cv = document.getElementById('hist-chat-view');
  const ha = document.getElementById('hist-content-actions');
  const ht = document.getElementById('hist-content-title');
  if (cv) cv.style.display = 'none';
  if (ha) ha.style.display = 'none';
  if (ht) ht.innerHTML = '<span>📂</span> Select a session to view';
}

function hist_clearAll() {
  if (!confirm('Clear ALL history? Cannot be undone.')) return;
  hist_sessions = []; hist_resetContent(); hist_save(); hist_render();
}

function hist_exportSession() {
  if (!hist_active) return;
  const text = `# ${hist_active.title}\nType: ${hist_active.label} | Lang: ${hist_active.lang} | ${hist_active.time}\n\n` +
    hist_active.messages.map(m => `[${m.role.toUpperCase()}]\n${m.text}`).join('\n\n---\n\n');
  const a = Object.assign(document.createElement('a'), {
    href: URL.createObjectURL(new Blob([text], { type: 'text/plain' })),
    download: `${hist_active.title.replace(/\s+/g, '-')}.txt`
  }); a.click();
}

function hist_exportAll() {
  const text = hist_sessions.map(s =>
    `# ${s.title}\nType: ${s.label} | Lang: ${s.lang} | ${s.time}\n\n` +
    s.messages.map(m => `[${m.role.toUpperCase()}]\n${m.text}`).join('\n\n---\n\n')
  ).join('\n\n==========\n\n');
  const a = Object.assign(document.createElement('a'), {
    href: URL.createObjectURL(new Blob([text], { type: 'text/plain' })),
    download: 'aipca-history.txt'
  }); a.click();
}

/* ── Auto-init on page load ── */
window.addEventListener('DOMContentLoaded', () => {
  cg_initMonaco();
  as_initMonaco();
  hist_init();
});