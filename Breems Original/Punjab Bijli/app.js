/**
 * PUNJAB BIJLI - Official Figma Master Interactive Engine
 * Handles all 5 flows, 28 screens, UPI PIN keypad, Live Chat, Complaint Stepper, and Gallery Canvas
 */

const AppState = {
  currentScreen: 'home',
  presentationMode: 'single', // 'single' (Interactive Phone) or 'gallery' (Figma Canvas Board)
  lang: 'en',
  theme: 'light',
  upiPin: '',
  consumerCA: '3004928174',
  billAmount: 1965,
  selectedProvider: 'Punjab State Power Corp Ltd (PSPCL)',
  selectedPaymentMode: 'upi',
  chatMessages: [
    { sender: 'assistant', text: 'Sat Sri Akal! Welcome to Punjab Bijli 24x7 Helpdesk. How can I assist you today?' },
    { sender: 'user', text: 'My bill for this month is ₹1,965. Why did I not get the 300-unit subsidy waiver?' },
    { sender: 'assistant', text: 'According to PSPCL AMI Smart Meter records, your consumption was 348 units (exceeding the 300-unit threshold by 48 units). As per Punjab Govt policy, full tariff applies when consumption exceeds 300 units/mo.' }
  ]
};

// ==========================================
// 1. Audio Synthesizer
// ==========================================
const AudioFX = {
  ctx: null,
  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
  },
  playClick() {
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.04);
    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.04);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.04);
  },
  playSuccess() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, now + i * 0.07);
      gain.gain.linearRampToValueAtTime(0.14, now + i * 0.07 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.3);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + i * 0.07);
      osc.stop(now + i * 0.07 + 0.3);
    });
  }
};

// ==========================================
// 2. Toast Notifications
// ==========================================
function showToast(msg, icon = '⚡') {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const t = document.createElement('div');
  t.className = 'toast';
  t.innerHTML = `<span style="font-size:1.1rem;">${icon}</span><span>${msg}</span>`;
  container.appendChild(t);
  setTimeout(() => {
    t.style.opacity = '0';
    t.style.transform = 'translateY(10px)';
    setTimeout(() => t.remove(), 300);
  }, 3200);
}

// ==========================================
// 3. Screen Switching System
// ==========================================
function navigateTo(screenId) {
  AudioFX.playClick();
  AppState.currentScreen = screenId;

  // Deactivate all screen views in phone mockup
  document.querySelectorAll('.screen-view').forEach(el => {
    el.classList.remove('active');
  });

  const target = document.getElementById(`screen-${screenId}`);
  if (target) {
    target.classList.add('active');
  }

  // Update Bottom Nav active state
  document.querySelectorAll('.nav-item-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.nav === screenId);
  });

  // Update top dropdown if matching
  const selector = document.getElementById('flowScreenSelector');
  if (selector) selector.value = screenId;

  // Scroll to top of phone
  const screenContainer = document.querySelector('.phone-screen');
  if (screenContainer) screenContainer.scrollTop = 0;
}

// ==========================================
// 4. Mode Switching (Phone Simulator vs Figma Board)
// ==========================================
function setPresentationMode(mode) {
  AudioFX.playClick();
  AppState.presentationMode = mode;

  const phone = document.getElementById('phoneWrapperContainer');
  const board = document.getElementById('figmaBoardContainer');
  const btnSingle = document.getElementById('btnSinglePhone');
  const btnBoard = document.getElementById('btnFigmaBoard');

  if (mode === 'board') {
    if (phone) phone.style.display = 'none';
    if (board) board.classList.add('active');
    if (btnSingle) btnSingle.classList.remove('active');
    if (btnBoard) btnBoard.classList.add('active');
    showToast("Figma Canvas: All 5 Rows and 20+ Screens displayed", "🖼️");
  } else {
    if (phone) phone.style.display = 'block';
    if (board) board.classList.remove('active');
    if (btnSingle) btnSingle.classList.add('active');
    if (btnBoard) btnBoard.classList.remove('active');
    showToast("Interactive Phone Simulator Active", "📱");
  }
}

// ==========================================
// 5. UPI PIN Numeric Keypad Simulation
// ==========================================
function pressPinKey(digit) {
  AudioFX.playClick();
  if (AppState.upiPin.length < 6) {
    AppState.upiPin += digit;
    updatePinDots();
  }
  if (AppState.upiPin.length === 6) {
    setTimeout(() => {
      submitUpiPayment();
    }, 300);
  }
}

function deletePinKey() {
  AudioFX.playClick();
  if (AppState.upiPin.length > 0) {
    AppState.upiPin = AppState.upiPin.slice(0, -1);
    updatePinDots();
  }
}

function updatePinDots() {
  const dots = document.querySelectorAll('.pin-dot');
  dots.forEach((dot, index) => {
    dot.classList.toggle('filled', index < AppState.upiPin.length);
  });
}

function submitUpiPayment() {
  AppState.upiPin = '';
  updatePinDots();
  navigateTo('payment-processing');

  setTimeout(() => {
    navigateTo('payment-success');
    AudioFX.playSuccess();
    triggerConfetti();
  }, 2200);
}

// ==========================================
// 6. Support Live Chat Interaction
// ==========================================
function sendSupportMessage() {
  const input = document.getElementById('chatInput');
  if (!input || !input.value.trim()) return;

  const text = input.value.trim();
  input.value = '';
  AudioFX.playClick();

  AppState.chatMessages.push({ sender: 'user', text });
  renderChatMessages();

  // Simulated AI response
  setTimeout(() => {
    AppState.chatMessages.push({
      sender: 'assistant',
      text: "I have registered grievance ticket #PB-98214 for your connection. Lineman Surjit Singh (Mohali Div) has been scheduled to inspect your meter calibration within 2 hours."
    });
    renderChatMessages();
    AudioFX.playClick();
  }, 1000);
}

function renderChatMessages() {
  const container = document.getElementById('chatContainer');
  if (!container) return;

  container.innerHTML = AppState.chatMessages.map(msg => `
    <div class="chat-bubble ${msg.sender}">
      ${msg.text}
    </div>
  `).join('');

  container.scrollTop = container.scrollHeight;
}

// ==========================================
// 7. Confetti Particle Explosion
// ==========================================
function triggerConfetti() {
  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '9999';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const colors = ['#1a56db', '#10b981', '#f59e0b', '#3b82f6', '#ffffff', '#8b5cf6'];

  for (let i = 0; i < 80; i++) {
    particles.push({
      x: canvas.width / 2,
      y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 16,
      vy: (Math.random() - 0.5) * 16 - 3,
      size: Math.random() * 8 + 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 8,
      opacity: 1
    });
  }

  let animationFrame;
  function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.3;
      p.rotation += p.rotSpeed;
      p.opacity -= 0.015;

      if (p.opacity > 0) {
        alive = true;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      }
    });

    if (alive) {
      animationFrame = requestAnimationFrame(update);
    } else {
      cancelAnimationFrame(animationFrame);
      canvas.remove();
    }
  }
  update();
}

// ==========================================
// 8. Language Switcher (English & Punjabi)
// ==========================================
function toggleLanguage() {
  AudioFX.playClick();
  AppState.lang = AppState.lang === 'en' ? 'pa' : 'en';
  document.body.classList.toggle('lang-pa', AppState.lang === 'pa');
  
  const btn = document.getElementById('langToggleBtn');
  if (btn) btn.innerHTML = `<span>🌐</span> ${AppState.lang === 'en' ? 'ਪੰਜਾਬੀ' : 'English'}`;

  showToast(`Language switched to ${AppState.lang === 'en' ? 'English' : 'ਪੰਜਾਬੀ (Punjabi)'}`, "🌐");
}

// ==========================================
// 9. URL Query Parameter Support (for Board Iframes)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const targetScreen = urlParams.get('screen');
  if (targetScreen) {
    navigateTo(targetScreen);
    const header = document.querySelector('.figma-toolbar');
    if (header) header.style.display = 'none';
    const ws = document.querySelector('.figma-workspace');
    if (ws) ws.style.padding = '0';
  }
  renderChatMessages();
});
