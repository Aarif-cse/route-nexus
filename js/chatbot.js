/**
 * eRTMAC-NWIS | Route Nexus - Floating AI Drilling Assistant
 * High-Fidelity Assistant for Smart India Hackathon 2026
 */

(function() {
  function initChatbot() {
    // Create widget container if not present
    if (document.getElementById('nexus-chatbot-root')) return;

    const root = document.createElement('div');
    root.id = 'nexus-chatbot-root';
    root.className = 'chatbot-widget';

    root.innerHTML = `
      <div class="chatbot-panel" id="chatbot-panel">
        <div class="chatbot-header">
          <div style="display: flex; align-items: center; gap: 0.6rem;">
            <div style="width: 28px; height: 28px; border-radius: 6px; background: linear-gradient(135deg, #0284c7, #06b6d4); display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: 800; color: white;">
              Ω
            </div>
            <div>
              <div style="font-size: 0.85rem; font-weight: 700; color: #f8fafc;">Nexus AI Assistant</div>
              <div style="font-size: 0.68rem; color: #38bdf8; display: flex; align-items: center; gap: 4px;">
                <span class="pulse-dot emerald" style="width: 6px; height: 6px;"></span> Offset Knowledge Model v4.2
              </div>
            </div>
          </div>
          <button id="chatbot-close-btn" style="background: transparent; border: none; color: #94a3b8; font-size: 1.2rem; cursor: pointer; padding: 4px;">&times;</button>
        </div>

        <div class="chatbot-messages" id="chatbot-messages">
          <div class="chat-bubble bot">
            Hello! I am your <strong>eRTMAC-NWIS Subsurface Intelligence Copilot</strong>. I cross-correlate historical reports (DDRs, EOWRs) and nearby offset well logs across Oil India and ONGC fields. How can I assist your drilling plan today?
          </div>
        </div>

        <div class="chatbot-quick-prompts">
          <button class="quick-prompt-btn" data-query="Analyze NST-6001 offset risks">⚡ NST-6001 Risks</button>
          <button class="quick-prompt-btn" data-query="Mud weight for Kopili Shale">💧 Kopili Mud Weight</button>
          <button class="quick-prompt-btn" data-query="Stuck pipe prevention guidelines">🛑 Stuck Pipe Protocol</button>
          <button class="quick-prompt-btn" data-query="Compare Naharkatiya ROP">📈 Field ROP Benchmark</button>
        </div>

        <div class="chatbot-footer">
          <input type="text" id="chatbot-input" class="input-control" placeholder="Ask offset wells, lithology, risks..." style="font-size: 0.8rem; padding: 0.5rem 0.75rem;">
          <button class="btn btn-primary btn-sm" id="chatbot-send-btn" style="padding: 0.5rem 0.85rem;">Send</button>
        </div>
      </div>

      <div class="chatbot-trigger animate-pulse-cyan" id="chatbot-trigger" title="Open Nexus AI Drilling Copilot">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      </div>
    `;

    document.body.appendChild(root);

    // Audio Cue via Web Audio API
    function playBeep() {
      try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(580, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.08);
      } catch (e) {}
    }

    const trigger = document.getElementById('chatbot-trigger');
    const panel = document.getElementById('chatbot-panel');
    const closeBtn = document.getElementById('chatbot-close-btn');
    const input = document.getElementById('chatbot-input');
    const sendBtn = document.getElementById('chatbot-send-btn');
    const messages = document.getElementById('chatbot-messages');

    trigger.addEventListener('click', () => {
      panel.classList.toggle('active');
      playBeep();
      if (panel.classList.contains('active')) {
        input.focus();
      }
    });

    closeBtn.addEventListener('click', () => {
      panel.classList.remove('active');
    });

    function appendMessage(sender, text) {
      const bubble = document.createElement('div');
      bubble.className = `chat-bubble ${sender}`;
      bubble.innerHTML = text;
      messages.appendChild(bubble);
      messages.scrollTop = messages.scrollHeight;
    }

    function generateResponse(query) {
      const q = query.toLowerCase();
      playBeep();

      if (q.includes('nst') || q.includes('risk') || q.includes('6001')) {
        return `
          <strong>Offset Risk Synthesis for NST-6001:</strong><br>
          • <strong>Primary Hazard:</strong> Differential Sticking in lower <em>Barail Sandstone</em> (3,420m - 3,680m).<br>
          • <strong>Offset Precedent:</strong> Historical well <em>OIL-MOR-04</em> experienced 18 hrs NPT at 3,510m due to mud overbalance (+320 psi).<br>
          • <strong>AI Recommendation:</strong> Limit stationary pipe time to &lt; 3 mins during surveys, maintain 11.4 PPG mud weight, and premix a 30 bbl lubricant pill.
        `;
      } else if (q.includes('kopili') || q.includes('shale') || q.includes('mud')) {
        return `
          <strong>Mud Weight Plan for Kopili Formation:</strong><br>
          • <strong>Formation Type:</strong> Highly reactive, overpressured marine shale.<br>
          • <strong>Optimal EMW Window:</strong> 12.6 – 13.0 PPG (Equivalent Mud Weight).<br>
          • <strong>Fluid Chemistry:</strong> Utilize 7-9% KCl / Glycol inhibition system with low fluid loss (&lt; 4.0 cc/30min) to prevent hydration swelling and tight-hole drag.
        `;
      } else if (q.includes('stuck') || q.includes('protocol')) {
        return `
          <strong>Standard Operating Protocol - Stuck Pipe Mitigation:</strong><br>
          1. <strong>Immediate Action:</strong> Attempt downward jarring if pipe was moving upward; upward jarring if moving downward.<br>
          2. <strong>Flow Check:</strong> Maintain circulation at 350 gpm to avoid pack-off.<br>
          3. <strong>Chemical Pill:</strong> Spot weighted surfactant pipe-freeing agent (density matching active mud: 12.4 PPG).<br>
          4. <strong>eRTMAC Advisory:</strong> Offset data shows 89% release probability within 90 minutes using torque-and-jar cycling.
        `;
      } else if (q.includes('rop') || q.includes('speed') || q.includes('benchmark')) {
        return `
          <strong>Naharkatiya vs Moran ROP Analytics:</strong><br>
          • <strong>Naharkatiya Average:</strong> 23.2 m/hr (optimized using 5-blade 16mm PDC bit).<br>
          • <strong>Moran Baseline:</strong> 18.4 m/hr.<br>
          • <strong>Gain:</strong> +26.1% ROP increase achieved through eRTMAC automated weight-on-bit (18 klbs) and RPM (120) synchronization.
        `;
      } else {
        return `
          Based on <strong>100 indexed wells</strong> and <strong>30 digitized historical drilling reports</strong> in the Upper Assam Shelf:<br>
          • <strong>Correlation Matches:</strong> Found 4 analogous intervals with similar gamma-ray and resistivity signatures.<br>
          • <strong>Confidence Score:</strong> 94.8% probability of smooth drilling progression if current drilling parameters (WOB: 16 klbs, Flow: 620 gpm) are preserved.
        `;
      }
    }

    function handleSend() {
      const text = input.value.trim();
      if (!text) return;

      appendMessage('user', text);
      input.value = '';

      // Simulated typing
      const typing = document.createElement('div');
      typing.className = 'chat-bubble bot';
      typing.id = 'bot-typing-indicator';
      typing.innerHTML = '<em>Consulting offset well digital memory...</em>';
      messages.appendChild(typing);
      messages.scrollTop = messages.scrollHeight;

      setTimeout(() => {
        const ind = document.getElementById('bot-typing-indicator');
        if (ind) ind.remove();
        const resp = generateResponse(text);
        appendMessage('bot', resp);
      }, 600);
    }

    sendBtn.addEventListener('click', handleSend);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleSend();
    });

    root.querySelectorAll('.quick-prompt-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const query = btn.getAttribute('data-query');
        input.value = query;
        handleSend();
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChatbot);
  } else {
    initChatbot();
  }
})();
