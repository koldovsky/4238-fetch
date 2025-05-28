// Simple chat logic for /chat endpoint
const chatMessages = document.getElementById('chat-messages');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const chatRefresh = document.getElementById('chat-refresh');

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

async function fetchChat() {
  try {
    const res = await fetch('/chat');
    const text = await res.text();
    chatMessages.innerHTML = text
      .split('\n')
      .filter(Boolean)
      .map(line => `<div>${escapeHtml(line)}</div>`)
      .join('');
    chatMessages.scrollTop = chatMessages.scrollHeight;
  } catch {
    chatMessages.innerHTML = '<em>Failed to load chat.</em>';
  }
}

chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const msg = chatInput.value.trim();
  if (!msg) return;
  chatInput.value = '';
  await fetch('/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: msg
  });
  fetchChat();
});

// Poll for new messages every 2 seconds

setInterval(fetchChat, 2000);

if (chatRefresh) {
  chatRefresh.addEventListener('click', fetchChat);
}

// Initial load
fetchChat();
