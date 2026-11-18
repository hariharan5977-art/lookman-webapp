const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function createChatContext() {
  const elements = new Map();
  const modelSelect = {
    value: 'lookman-1.0-ultra',
    addEventListener(event, handler) {
      if (event === 'change') this.onChange = handler;
    }
  };
  elements.set('model-select', modelSelect);
  elements.set('chat-history-list', { innerHTML: '', onclick: null });
  elements.set('messages-container', { innerHTML: '', scrollTop: 0, scrollHeight: 0 });
  elements.set('chat-input-field', { addEventListener() {} });

  const localStorage = {
    data: {},
    setItem(key, value) {
      this.data[key] = value;
    }
  };
  const context = {
    document: {
      addEventListener() {},
      getElementById(id) {
        return elements.get(id) || null;
      }
    },
    localStorage,
    window: null
  };
  context.window = context;
  vm.createContext(context);
  const scriptPath = path.join(__dirname, '../public/lookman-ai/js/chat.js');
  vm.runInContext(fs.readFileSync(scriptPath, 'utf8'), context);

  return {
    context,
    modelSelect,
    localStorage,
    state: vm.runInContext('state', context)
  };
}

test('switching conversations restores their selected AI model', () => {
  const { context, modelSelect, state } = createChatContext();
  state.sessions = [
    { id: 'vision', title: 'Vision chat', model: 'lookman-1.0-vision', messages: [] },
    { id: 'code', title: 'Code chat', model: 'lookman-1.0-code', messages: [] }
  ];

  context.switchSession('code');
  assert.equal(state.activeModel, 'lookman-1.0-code');
  assert.equal(modelSelect.value, 'lookman-1.0-code');

  context.switchSession('vision');
  assert.equal(state.activeModel, 'lookman-1.0-vision');
  assert.equal(modelSelect.value, 'lookman-1.0-vision');
});

test('changing the selected AI model persists it to the active conversation', () => {
  const { context, modelSelect, localStorage, state } = createChatContext();
  state.sessions = [{ id: 'active', title: 'Active chat', model: 'lookman-1.0-ultra', messages: [] }];
  state.activeSessionId = 'active';
  context.setupEventListeners();

  modelSelect.value = 'lookman-1.0-code';
  modelSelect.onChange({ target: modelSelect });

  assert.equal(state.sessions[0].model, 'lookman-1.0-code');
  assert.match(localStorage.data.lookman_ai_sessions, /lookman-1\.0-code/);
});
