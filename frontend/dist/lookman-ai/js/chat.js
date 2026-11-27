/**
 * Lookman AI - Frontend Conversational Controller (Hosted Lookman Web App)
 * Handles SSE streaming, mobile drawer UX, session persistence, markdown rendering,
 * multimodal snapshot uploads, and CCTV calculators.
 */

const API_BASE = '/api/lookman-ai';

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
  syncHealthStatus();
});

/* ==========================================================================
   MOBILE SIDEBAR DRAWER & STATUS SYNC
   ========================================================================== */
function openSidebar() {
  const sidebar = document.getElementById('sidebar');
  const backdrop = document.getElementById('sidebar-backdrop');
  const menuBtn = document.getElementById('mobile-menu-btn');
  if (sidebar && sidebar.classList) sidebar.classList.add('open');
  if (backdrop && backdrop.classList) backdrop.classList.add('visible');
  if (menuBtn && typeof menuBtn.setAttribute === 'function') menuBtn.setAttribute('aria-expanded', 'true');
}

function closeSidebar() {
  const sidebar = document.getElementById('sidebar');
  const backdrop = document.getElementById('sidebar-backdrop');
  const menuBtn = document.getElementById('mobile-menu-btn');
  if (sidebar && sidebar.classList) sidebar.classList.remove('open');
  if (backdrop && backdrop.classList) backdrop.classList.remove('visible');
  if (menuBtn && typeof menuBtn.setAttribute === 'function') menuBtn.setAttribute('aria-expanded', 'false');
}

function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  if (sidebar && sidebar.classList && sidebar.classList.contains('open')) {
    closeSidebar();
  } else {
    openSidebar();
  }
}

async function syncHealthStatus() {
  if (typeof fetch !== 'function') return;
  try {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) return;
    const data = await res.json();
    const badge = document.getElementById('status-badge');
    const badgeText = typeof document.querySelector === 'function'
      ? document.querySelector('#status-badge .status-text')
      : null;
    if (badgeText) {
      badgeText.textContent = data.mode === 'CLOUD_NEURAL_ACTIVE' ? 'CLOUD NEURAL' : 'AI CORE ONLINE';
    }
    if (badge) {
      badge.title = `${data.system || 'Lookman AI'} (v${data.version || '1.0'})`;
    }
  } catch {
    // Keep default online indicator
  }
}

/* ==========================================================================
   SESSION MANAGEMENT (LOCAL STORAGE)
   ========================================================================== */
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
  closeSidebar();
}

function deleteSession(sessionId, e) {
  if (e) e.stopPropagation();
  state.sessions = state.sessions.filter((s) => s.id !== sessionId);
  if (state.sessions.length === 0) {
    createNewSession();
  } else if (state.activeSessionId === sessionId) {
    switchSession(state.sessions[0].id);
  }
  saveSessions();
  renderActiveChat();
}

function getActiveSession() {
  return state.sessions.find((s) => s.id === state.activeSessionId);
}

function renderHistoryList() {
  const container = document.getElementById('chat-history-list');
  if (!container) return;

  container.innerHTML = state.sessions
    .map(
      (s) => `
    <div class="history-item ${s.id === state.activeSessionId ? 'active' : ''}" data-session-id="${escapeHtml(String(s.id))}">
      <span class="history-item-title">💬 ${escapeHtml(s.title)}</span>
      <button type="button" class="history-delete-btn" title="Delete conversation" aria-label="Delete conversation">✕</button>
    </div>
  `
    )
    .join('');

  container.onclick = (event) => {
    const item = event.target.closest('[data-session-id]');
    if (!item) return;

    if (event.target.closest('button')) {
      deleteSession(item.dataset.sessionId, event);
    } else {
      switchSession(item.dataset.sessionId);
    }
  };
}

/* ==========================================================================
   CHAT RENDERING & SSE STREAMING
   ========================================================================== */
function renderActiveChat() {
  const session = getActiveSession();
  const container = document.getElementById('messages-container');
  if (!session || !container) return;

  if (session.messages.length === 0) {
    container.innerHTML = `
      <div class="hero-view">
        <div class="hero-logo">🛡️</div>
        <div class="hero-title">Lookman AI</div>
        <div class="hero-desc">
          Your dedicated conversational intelligence for CCTV surveillance systems, video analytics, computer vision pipelines, and physical security architecture.
        </div>
        <div class="prompt-suggestions">
          <div class="prompt-card" onclick="usePrompt('Calculate storage and bandwidth for 32 4MP cameras on H.265 for 30 days retention')">
            <div class="prompt-card-title">📊 CCTV Storage &amp; Bandwidth Sizing</div>
            <div class="prompt-card-sub">Calculates total TB, daily GB, RAID tier, and switch capacity</div>
          </div>
          <div class="prompt-card" onclick="usePrompt('Diagnose RTSP stream dropouts and latency issues across high-definition IP cameras')">
            <div class="prompt-card-title">📡 RTSP &amp; Stream Diagnostics</div>
            <div class="prompt-card-sub">Fix packet loss, TCP vs UDP transport, and GOP intervals</div>
          </div>
          <div class="prompt-card" onclick="usePrompt('Write a Python script using OpenCV and YOLOv8 to detect people in an RTSP feed')">
            <div class="prompt-card-title">🐍 Real-time OpenCV / YOLO Script</div>
            <div class="prompt-card-sub">Multi-threaded video pipeline for low-latency detection</div>
          </div>
          <div class="prompt-card" onclick="usePrompt('Explain DORI standard distances for a 4mm lens on a 1/2.8 4MP sensor')">
            <div class="prompt-card-title">🎯 DORI Lens Distance Analysis</div>
            <div class="prompt-card-sub">Detection, Observation, Recognition, Identification distances</div>
          </div>
        </div>
      </div>
    `;
    return;
  }

  container.innerHTML = session.messages.map((m) => renderMessageRow(m)).join('');
  container.scrollTop = container.scrollHeight;
}

function renderMessageRow(msg) {
  const isUser = msg.role === 'user';
  const role = isUser ? 'user' : 'assistant';
  const avatar = isUser
    ? '<div class="msg-avatar user-av">👤</div>'
    : '<div class="msg-avatar ai-av">🛡️</div>';
  const imageBase64 =
    typeof msg.imageBase64 === 'string' && msg.imageBase64.startsWith('data:image/')
      ? escapeHtml(msg.imageBase64)
      : '';
  const imgHtml = imageBase64
    ? `
    <div class="image-preview-badge">
      <img src="${imageBase64}" alt="CCTV Snapshot">
      <span>Attached CCTV Frame for Vision Audit</span>
    </div>
  `
    : '';

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

  const userMsg = {
    role: 'user',
    content:
      text ||
      (imageBase64
        ? 'Please analyze this CCTV visual frame for security threats and objects.'
        : ''),
    imageBase64,
    timestamp: Date.now()
  };
  session.messages.push(userMsg);

  if (session.messages.length === 1) {
    session.title = (text || 'CCTV Snapshot Audit').slice(0, 34);
  }

  inputEl.value = '';
  inputEl.style.height = 'auto';
  clearAttachment();
  renderActiveChat();

  state.isGenerating = true;
  const sendBtn = document.getElementById('send-btn');
  if (sendBtn) sendBtn.disabled = true;

  const assistantMsg = {
    role: 'assistant',
    content: '',
    timestamp: Date.now()
  };
  session.messages.push(assistantMsg);

  renderActiveChat();
  const container = document.getElementById('messages-container');
  const messageRows = container.querySelectorAll('.message-row.assistant');
  const targetContentEl = messageRows[messageRows.length - 1].querySelector('.msg-content');
  targetContentEl.innerHTML = '<span class="streaming-cursor"></span>';

  try {
    const payload = {
      messages: session.messages.slice(0, -1).map(({ role, content }) => ({ role, content })),
      model: state.activeModel,
      imageBase64
    };

    const res = await fetch(`${API_BASE}/chat/stream`, {
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

    const processLine = (line) => {
      if (!line.startsWith('data: ')) return;
      const data = JSON.parse(line.slice(6));
      if (data.chunk) {
        accumulatedText += data.chunk;
        assistantMsg.content = accumulatedText;
        targetContentEl.innerHTML =
          parseMarkdown(accumulatedText) + '<span class="streaming-cursor"></span>';
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

    targetContentEl.innerHTML = parseMarkdown(accumulatedText);
  } catch (err) {
    assistantMsg.content =
      '⚠️ Connection Error: Failed to receive response from Lookman AI Core: ' + err.message;
    targetContentEl.innerHTML = parseMarkdown(assistantMsg.content);
  } finally {
    state.isGenerating = false;
    if (sendBtn) sendBtn.disabled = false;
    saveSessions();
  }
}

function usePrompt(text) {
  const inputEl = document.getElementById('chat-input-field');
  if (!inputEl) return;
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
    if (thumbEl) thumbEl.src = state.attachmentBase64;
    if (previewEl && previewEl.classList) previewEl.classList.add('show');

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
  if (previewEl && previewEl.classList) previewEl.classList.remove('show');
  const fileInput = document.getElementById('image-upload-input');
  if (fileInput) fileInput.value = '';
}

/* ==========================================================================
   ROBUST MARKDOWN RENDERER (MOBILE-SAFE TABLES & CODE BLOCKS)
   ========================================================================== */
function formatInline(text) {
  let out = escapeHtml(text);
  out = out.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');
  out = out.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  out = out.replace(/\*(.+?)\*/g, '<em>$1</em>');
  return out;
}

function parseMarkdown(md) {
  if (!md) return '';

  const codeBlocks = [];
  const tokenized = String(md).replace(/```([a-zA-Z0-9_-]*)\r?\n([\s\S]*?)```/g, (match, lang, code) => {
    const token = `@@CODEBLOCK_${codeBlocks.length}@@`;
    codeBlocks.push(`
      <div class="code-block-container">
        <div class="code-header">
          <span>${escapeHtml(lang || 'code')}</span>
          <button type="button" class="copy-btn" onclick="copyToClipboard(this)">Copy</button>
        </div>
        <pre><code>${escapeHtml(code.trim())}</code></pre>
      </div>
    `);
    return `\n${token}\n`;
  });

  const lines = tokenized.split(/\r?\n/);
  const htmlParts = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i].trim();

    if (!line) {
      i++;
      continue;
    }

    const codeMatch = line.match(/^@@CODEBLOCK_(\d+)@@$/);
    if (codeMatch) {
      htmlParts.push(codeBlocks[Number(codeMatch[1])]);
      i++;
      continue;
    }

    if (line.startsWith('#### ')) {
      htmlParts.push(`<h4>${formatInline(line.slice(5))}</h4>`);
      i++;
      continue;
    }
    if (line.startsWith('### ')) {
      htmlParts.push(`<h3>${formatInline(line.slice(4))}</h3>`);
      i++;
      continue;
    }
    if (line.startsWith('## ')) {
      htmlParts.push(`<h2>${formatInline(line.slice(3))}</h2>`);
      i++;
      continue;
    }
    if (line.startsWith('# ')) {
      htmlParts.push(`<h1>${formatInline(line.slice(2))}</h1>`);
      i++;
      continue;
    }

    if (line.startsWith('|') && line.endsWith('|')) {
      const tableLines = [];
      while (i < lines.length && lines[i].trim().startsWith('|') && lines[i].trim().endsWith('|')) {
        tableLines.push(lines[i].trim());
        i++;
      }

      let thead = '';
      const tbodyRows = [];

      tableLines.forEach((tLine, idx) => {
        const cells = tLine
          .split('|')
          .slice(1, -1)
          .map((c) => c.trim());
        const isDelimiter = cells.every((c) => /^:?-+:?$/.test(c));
        if (isDelimiter) return;

        if (idx === 0 && tableLines.length > 1) {
          thead = `<thead><tr>${cells.map((c) => `<th>${formatInline(c)}</th>`).join('')}</tr></thead>`;
        } else {
          tbodyRows.push(`<tr>${cells.map((c) => `<td>${formatInline(c)}</td>`).join('')}</tr>`);
        }
      });

      htmlParts.push(
        `<div class="table-wrapper"><table>${thead}<tbody>${tbodyRows.join('')}</tbody></table></div>`
      );
      continue;
    }

    if (/^[-*•]\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^[-*•]\s+/.test(lines[i].trim())) {
        items.push(`<li>${formatInline(lines[i].trim().replace(/^[-*•]\s+/, ''))}</li>`);
        i++;
      }
      htmlParts.push(`<ul>${items.join('')}</ul>`);
      continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
        items.push(`<li>${formatInline(lines[i].trim().replace(/^\d+\.\s+/, ''))}</li>`);
        i++;
      }
      htmlParts.push(`<ol>${items.join('')}</ol>`);
      continue;
    }

    const paraLines = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].trim().startsWith('#') &&
      !lines[i].trim().startsWith('|') &&
      !/^[-*•]\s+/.test(lines[i].trim()) &&
      !/^\d+\.\s+/.test(lines[i].trim()) &&
      !/^@@CODEBLOCK_(\d+)@@$/.test(lines[i].trim())
    ) {
      paraLines.push(formatInline(lines[i].trim()));
      i++;
    }
    htmlParts.push(`<p>${paraLines.join('<br>')}</p>`);
  }

  return htmlParts.join('\n');
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function copyToClipboard(btn) {
  const code = btn.parentElement.nextElementSibling.innerText;
  navigator.clipboard.writeText(code);
  btn.textContent = 'Copied!';
  setTimeout(() => {
    btn.textContent = 'Copy';
  }, 1800);
}

/* ==========================================================================
   INPUT & KEYBOARD LISTENERS
   ========================================================================== */
function autoResizeTextarea() {
  const textarea = document.getElementById('chat-input-field');
  if (!textarea) return;

  textarea.addEventListener('input', function () {
    this.style.height = 'auto';
    this.style.height = Math.min(this.scrollHeight, 150) + 'px';
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

  if (typeof document.querySelectorAll === 'function') {
    document.querySelectorAll('.modal-overlay').forEach((overlay) => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          overlay.classList.remove('open');
        }
      });
    });
  }

  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      createNewSession();
      closeSidebar();
    } else if (e.key === 'Escape') {
      closeSidebar();
      if (typeof document.querySelectorAll === 'function') {
        document.querySelectorAll('.modal-overlay.open').forEach((m) => m.classList.remove('open'));
      }
    }
  });
}

/* ==========================================================================
   CCTV CALCULATOR MODALS (STORAGE & DORI)
   ========================================================================== */
function openStorageModal() {
  const el = document.getElementById('storage-modal');
  if (el && el.classList) el.classList.add('open');
}

function openDoriModal() {
  const el = document.getElementById('dori-modal');
  if (el && el.classList) el.classList.add('open');
}

function closeModal(id) {
  const el = document.getElementById(id);
  if (el && el.classList) el.classList.remove('open');
}

async function runStorageCalculator() {
  const cameras = parseInt(document.getElementById('calc-cams').value, 10) || 16;
  const days = parseInt(document.getElementById('calc-days').value, 10) || 30;
  const resolution = document.getElementById('calc-res').value;
  const codec = document.getElementById('calc-codec').value;
  const fpsEl = document.getElementById('calc-fps');
  const fps = fpsEl ? parseInt(fpsEl.value, 10) || 25 : 25;
  const box = document.getElementById('calc-result');
  box.style.display = 'block';
  box.textContent = 'Calculating storage...';

  try {
    const res = await fetch(`${API_BASE}/tools/calculate-storage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cameras, days, resolution, codec, fps })
    });
    if (!res.ok) {
      throw new Error(`Lookman AI returned HTTP ${res.status}`);
    }
    const data = await res.json();
    const r = data.result;
    box.innerHTML = `
      <strong>Storage &amp; Bandwidth Estimate:</strong><br>
      • Total Storage (${r.days} days): <span style="color:#00f3ff; font-weight:700;">${r.totalStorageTB} TB</span><br>
      • Daily Ingestion: ${r.dailyStorageGB} GB/day<br>
      • Total Bandwidth: ${r.totalBandwidthMbps} Mbps (${r.perCameraBitrateMbps} Mbps/cam)<br>
      • Recommended RAID: ${r.recommendedRAID}
    `;
  } catch (error) {
    box.textContent = `Storage calculation failed: ${error.message}`;
  }
}

async function runDoriCalculator() {
  const focalLengthMm = parseFloat(document.getElementById('dori-focal').value) || 4.0;
  const sensorType = document.getElementById('dori-sensor').value;
  const resolutionWidth = parseInt(document.getElementById('dori-width').value, 10) || 2560;
  const box = document.getElementById('dori-result');
  box.style.display = 'block';
  box.textContent = 'Calculating DORI distances...';

  try {
    const res = await fetch(`${API_BASE}/tools/calculate-dori`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ focalLengthMm, sensorType, resolutionWidth })
    });
    if (!res.ok) {
      throw new Error(`Lookman AI returned HTTP ${res.status}`);
    }
    const data = await res.json();
    const d = data.result.distances || data.result;
    box.innerHTML = `
      <strong>EN 62676-4 DORI Distances (${focalLengthMm}mm, ${escapeHtml(sensorType)}"):</strong><br>
      • <strong>Detection (25 PPM):</strong> <span style="color:#00f3ff;">${d.Detection.distanceMeters} m</span> (${d.Detection.distanceFeet} ft)<br>
      • <strong>Observation (62 PPM):</strong> <span style="color:#00f3ff;">${d.Observation.distanceMeters} m</span> (${d.Observation.distanceFeet} ft)<br>
      • <strong>Recognition (125 PPM):</strong> <span style="color:#00f3ff;">${d.Recognition.distanceMeters} m</span> (${d.Recognition.distanceFeet} ft)<br>
      • <strong>Identification (250 PPM):</strong> <span style="color:#00f3ff;">${d.Identification.distanceMeters} m</span> (${d.Identification.distanceFeet} ft)
    `;
  } catch (error) {
    box.textContent = `DORI calculation failed: ${error.message}`;
  }
}

function askDoriInChat() {
  const focal = document.getElementById('dori-focal').value || '4.0';
  const sensor = document.getElementById('dori-sensor').value || '1/2.8';
  const widthVal = document.getElementById('dori-width').value || '2560';
  const resName = widthVal === '3840' ? '4K' : widthVal === '2560' ? '4MP' : '1080p';
  closeModal('dori-modal');
  usePrompt(`Calculate exact DORI distances for a ${focal}mm lens on a ${sensor} ${resName} sensor`);
}

Object.assign(window, {
  openSidebar,
  closeSidebar,
  toggleSidebar,
  createNewSession,
  switchSession,
  deleteSession,
  sendMessage,
  clearAttachment,
  usePrompt,
  handleImageUpload,
  copyToClipboard,
  openStorageModal,
  openDoriModal,
  closeModal,
  runStorageCalculator,
  runDoriCalculator,
  askDoriInChat
});
