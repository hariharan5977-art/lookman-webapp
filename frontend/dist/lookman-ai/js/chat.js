/**
 * Lookman AI - Conversational UI Client Logic (ChatGPT / Grok / Gemini Experience)
 * Features real-time SSE token streaming, markdown rendering, image analysis, and session storage.
 */

const state = {
  activeSessionId: null,
  sessions: [],
  activeModel: 'lookman-1.0-ultra',
  attachmentBase64: null,
  isGenerating: false
};

document.addEventListener('DOMContentLoaded', () => {
  loadSessions();
  setupEventListeners();
  autoResizeTextarea();
});

function loadSessions() {
  try {
    const raw = localStorage.getItem('lookman_ai_sessions');
    state.sessions = raw ? JSON.parse(raw) : [];
  } catch {
    state.sessions = [];
  }

  if (state.sessions.length > 0) {
    switchSession(state.sessions[0].id);
  } else {
    createNewSession();
  }
  renderHistoryList();
}

function saveSessions() {
  localStorage.setItem('lookman_ai_sessions', JSON.stringify(state.sessions));
  renderHistoryList();
}

function createNewSession() {
  const newId = 'session_' + Date.now();
  const newSession = {
    id: newId,
    title: 'New Security Investigation',
    model: state.activeModel,
    messages: [],
    updatedAt: Date.now()
  };
  state.sessions.unshift(newSession);
  state.activeSessionId = newId;
  saveSessions();
  renderActiveChat();
}

function switchSession(sessionId) {
  state.activeSessionId = sessionId;
  const session = getActiveSession();
  if (session) {
    state.activeModel = session.model || 'lookman-1.0-ultra';
    const modelSelect = document.getElementById('model-select');
    if (modelSelect) modelSelect.value = state.activeModel;
  }
  renderHistoryList();
  renderActiveChat();
}

function deleteSession(sessionId, e) {
  if (e) e.stopPropagation();
  state.sessions = state.sessions.filter(s => s.id !== sessionId);
  if (state.sessions.length === 0) {
    createNewSession();
  } else if (state.activeSessionId === sessionId) {
    switchSession(state.sessions[0].id);
  }
  saveSessions();
  renderActiveChat();
}

function getActiveSession() {
  return state.sessions.find(s => s.id === state.activeSessionId);
}

function renderHistoryList() {
  const container = document.getElementById('chat-history-list');
  if (!container) return;

  container.innerHTML = state.sessions.map(s => `
    <div class="history-item ${s.id === state.activeSessionId ? 'active' : ''}" data-session-id="${escapeHtml(String(s.id))}">
      <span style="overflow:hidden; text-overflow:ellipsis;">💬 ${escapeHtml(s.title)}</span>
      <button type="button" style="background:none; border:none; color:#64748b; cursor:pointer;" title="Delete">✕</button>
    </div>
  `).join('');

  container.onclick = event => {
    const item = event.target.closest('[data-session-id]');
    if (!item) return;

    if (event.target.closest('button')) {
      deleteSession(item.dataset.sessionId, event);
    } else {
      switchSession(item.dataset.sessionId);
    }
  };
}

function renderActiveChat() {
  const session = getActiveSession();
  const container = document.getElementById('messages-container');
  if (!session || !container) return;

  if (session.messages.length === 0) {
    // Show Hero View
    container.innerHTML = `
      <div class="hero-view">
        <div class="hero-logo">🛡️</div>
        <div class="hero-title">Lookman AI</div>
        <div class="hero-desc">
          Your dedicated conversational intelligence for CCTV surveillance systems, video analytics, computer vision pipelines, and physical security architecture.
        </div>
        <div class="prompt-suggestions">
          <div class="prompt-card" onclick="usePrompt('Calculate storage and bandwidth for 32 4MP cameras on H.265 for 30 days retention')">
            <div class="prompt-card-title">📊 CCTV Storage & Bandwidth Sizing</div>
            <div class="prompt-card-sub">Calculates total TB, daily GB, RAID tier, and switch capacity</div>
          </div>
          <div class="prompt-card" onclick="usePrompt('Diagnose RTSP stream dropouts and latency issues across high-definition IP cameras')">
            <div class="prompt-card-title">📡 RTSP & Stream Diagnostics</div>
            <div class="prompt-card-sub">Fix packet loss, TCP vs UDP transport, and GOP intervals</div>
          </div>
          <div class="prompt-card" onclick="usePrompt('Write a Python script using OpenCV and YOLOv8 to detect people in an RTSP feed')">
            <div class="prompt-card-title">🐍 Real-time OpenCV / YOLO Script</div>
            <div class="prompt-card-sub">Multi-threaded video pipeline for low-latency detection</div>
          </div>
          <div class="prompt-card" onclick="usePrompt('Explain DORI standard distances for a 4mm lens on a 1/2.8 sensor')">
            <div class="prompt-card-title">🎯 DORI Lens Distance Analysis</div>
            <div class="prompt-card-sub">Detection, Observation, Recognition, Identification distances</div>
          </div>
        </div>
      </div>
    `;
    return;
  }

  container.innerHTML = session.messages.map(m => renderMessageRow(m)).join('');
  container.scrollTop = container.scrollHeight;
}

function renderMessageRow(msg) {
  const isUser = msg.role === 'user';
  const role = isUser ? 'user' : 'assistant';
  const avatar = isUser ? '<div class="msg-avatar user-av">👤</div>' : '<div class="msg-avatar ai-av">🛡️</div>';
  const imageBase64 = typeof msg.imageBase64 === 'string' && msg.imageBase64.startsWith('data:image/')
    ? escapeHtml(msg.imageBase64)
    : '';
  const imgHtml = imageBase64 ? `
    <div class="image-preview-badge">
      <img src="${imageBase64}" alt="CCTV Snapshot">
      <span>Attached CCTV Frame for Vision Audit</span>
    </div>
  ` : '';

  return `
    <div class="message-row ${role}">
      <div class="message-wrapper">
        ${avatar}
        <div class="msg-content">
          ${imgHtml}
          ${parseMarkdown(msg.content)}
        </div>
      </div>
    </div>
  `;
}

async function sendMessage() {
  if (state.isGenerating) return;

  const inputEl = document.getElementById('chat-input-field');
  const text = inputEl.value.trim();
  const imageBase64 = state.attachmentBase64;

  if (!text && !imageBase64) return;

  const session = getActiveSession();
  if (!session) return;

  // Add User Message
  const userMsg = {
    role: 'user',
    content: text || (imageBase64 ? 'Please analyze this CCTV visual frame for security threats and objects.' : ''),
    imageBase64: imageBase64,
    timestamp: Date.now()
  };
  session.messages.push(userMsg);

  // Update session title if first message
  if (session.messages.length === 1) {
    session.title = (text || 'CCTV Snapshot Audit').slice(0, 32);
  }

  // Clear input
  inputEl.value = '';
  inputEl.style.height = 'auto';
  clearAttachment();
  renderActiveChat();

  state.isGenerating = true;
  document.getElementById('send-btn').disabled = true;

  // Prepare Assistant Placeholder
  const assistantMsg = {
    role: 'assistant',
    content: '',
    timestamp: Date.now()
  };
  session.messages.push(assistantMsg);

  // Render container with empty assistant bubble
  renderActiveChat();
  const container = document.getElementById('messages-container');
  const messageRows = container.querySelectorAll('.message-row.assistant');
  const targetContentEl = messageRows[messageRows.length - 1].querySelector('.msg-content');

  try {
    const payload = {
      messages: session.messages.slice(0, -1),
      model: state.activeModel,
      imageBase64: imageBase64
    };

    const res = await fetch('/api/lookman-ai/chat/stream', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      throw new Error(`Lookman AI returned HTTP ${res.status}`);
    }
    if (!res.body) {
      throw new Error('Lookman AI returned an empty response');
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let accumulatedText = '';
    let pendingLine = '';
    const processLine = line => {
      if (!line.startsWith('data: ')) return;

      const data = JSON.parse(line.slice(6));
      if (data.chunk) {
        accumulatedText += data.chunk;
        assistantMsg.content = accumulatedText;
        targetContentEl.innerHTML = parseMarkdown(accumulatedText);
        container.scrollTop = container.scrollHeight;
      } else if (data.error) {
        throw new Error(data.error);
      }
    };

    while (true) {
      const { done, value } = await reader.read();
      pendingLine += decoder.decode(value || new Uint8Array(), { stream: !done });
      const lines = pendingLine.split(/\r?\n/);
      pendingLine = lines.pop() || '';

      for (const line of lines) {
        processLine(line);
      }

      if (done) {
        if (pendingLine) processLine(pendingLine);
        break;
      }
    }
  } catch (err) {
    assistantMsg.content = '⚠️ Connection Error: Failed to receive response from Lookman AI Core: ' + err.message;
    targetContentEl.innerHTML = parseMarkdown(assistantMsg.content);
  } finally {
    state.isGenerating = false;
    document.getElementById('send-btn').disabled = false;
    saveSessions();
  }
}

function usePrompt(text) {
  const inputEl = document.getElementById('chat-input-field');
  inputEl.value = text;
  sendMessage();
}

function handleImageUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    state.attachmentBase64 = event.target.result;
    const previewEl = document.getElementById('attachment-preview');
    const thumbEl = document.getElementById('attachment-thumb');
    thumbEl.src = state.attachmentBase64;
    previewEl.classList.add('show');

    // Switch model to Vision automatically
    const modelSelect = document.getElementById('model-select');
    if (modelSelect) {
      modelSelect.value = 'lookman-1.0-vision';
      state.activeModel = 'lookman-1.0-vision';
      const session = getActiveSession();
      if (session) {
        session.model = state.activeModel;
        saveSessions();
      }
    }
  };
  reader.readAsDataURL(file);
}

function clearAttachment() {
  state.attachmentBase64 = null;
  const previewEl = document.getElementById('attachment-preview');
  if (previewEl) previewEl.classList.remove('show');
  const fileInput = document.getElementById('image-upload-input');
  if (fileInput) fileInput.value = '';
}

// Markdown Parser Helper
function parseMarkdown(md) {
  if (!md) return '';
  let html = escapeHtml(md);

  // Code blocks: ```lang ... ```
  html = html.replace(/```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g, (match, lang, code) => {
    return `
      <div class="code-block-container">
        <div class="code-header">
          <span>${lang || 'CODE'}</span>
          <button class="copy-btn" onclick="copyToClipboard(this)">Copy</button>
        </div>
        <pre><code>${code.trim()}</code></pre>
      </div>
    `;
  });

  // Inline code: `code`
  html = html.replace(/`([^`]+)`/g, '<code style="background:#1e293b; color:#00f3ff; padding:2px 5px; border-radius:4px; font-family:monospace; font-size:12px;">$1</code>');

  // Headers
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

  // Bold & Italic
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

  // Markdown Tables
  html = html.replace(/\|(.+)\|/g, (match) => {
    const cells = match.split('|').slice(1, -1);
    const isHeaderDelimiter = cells.every(c => c.trim().match(/^:?-+:?$/));
    if (isHeaderDelimiter) return '';
    const tdCells = cells.map(c => `<td>${c.trim()}</td>`).join('');
    return `<tr>${tdCells}</tr>`;
  });
  html = html.replace(/(<tr>.+<\/tr>(\s*<tr>.+<\/tr>)*)/g, '<table>$1</table>');

  // Bullet Lists
  html = html.replace(/^• (.*$)/gim, '<li>$1</li>');
  html = html.replace(/^- (.*$)/gim, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

  // Paragraphs
  html = html.replace(/\n\n/g, '<p></p>');

  return html;
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function copyToClipboard(btn) {
  const code = btn.parentElement.nextElementSibling.innerText;
  navigator.clipboard.writeText(code);
  btn.textContent = 'Copied!';
  setTimeout(() => btn.textContent = 'Copy', 2000);
}

function autoResizeTextarea() {
  const textarea = document.getElementById('chat-input-field');
  if (!textarea) return;

  textarea.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = Math.min(this.scrollHeight, 160) + 'px';
  });
}

function setupEventListeners() {
  const inputEl = document.getElementById('chat-input-field');
  if (inputEl) {
    inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });
  }

  const modelSelect = document.getElementById('model-select');
  if (modelSelect) {
    modelSelect.addEventListener('change', (e) => {
      state.activeModel = e.target.value;
      const session = getActiveSession();
      if (session) {
        session.model = state.activeModel;
        saveSessions();
      }
    });
  }
}

// Modal Dialog Helpers
function openStorageModal() {
  document.getElementById('storage-modal').classList.add('open');
}
function openDoriModal() {
  document.getElementById('dori-modal').classList.add('open');
}
function closeModal(id) {
  document.getElementById(id).classList.remove('open');
}

async function runStorageCalculator() {
  const cameras = parseInt(document.getElementById('calc-cams').value) || 16;
  const days = parseInt(document.getElementById('calc-days').value) || 30;
  const resolution = document.getElementById('calc-res').value;
  const codec = document.getElementById('calc-codec').value;
  const box = document.getElementById('calc-result');
  box.style.display = 'block';
  box.textContent = 'Calculating storage...';

  try {
    const res = await fetch('/api/lookman-ai/tools/calculate-storage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cameras, days, resolution, codec })
    });
    if (!res.ok) {
      throw new Error(`Lookman AI returned HTTP ${res.status}`);
    }
    const data = await res.json();
    const r = data.result;
    box.innerHTML = `
      <strong>Storage Estimation:</strong><br>
      • Total Storage: <span style="color:#00f3ff; font-weight:700;">${r.totalStorageTB} TB</span><br>
      • Daily Ingestion: ${r.dailyStorageGB} GB/day<br>
      • Total Bandwidth: ${r.totalBandwidthMbps} Mbps<br>
      • Recommended Array: ${r.recommendedRAID}
    `;
  } catch (error) {
    box.textContent = `Storage calculation failed: ${error.message}`;
  }
}

Object.assign(window, {
  usePrompt,
  handleImageUpload,
  copyToClipboard,
  openStorageModal,
  openDoriModal,
  closeModal,
  runStorageCalculator
});

