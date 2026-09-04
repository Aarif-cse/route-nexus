/**
 * eRTMAC-NWIS | Route Nexus - Global Application Scripts
 * Smart India Hackathon 2026 (SIH26121)
 */

window.NexusApp = {
  soundEnabled: true,

  init() {
    this.initTheme();
    this.initClocks();
    this.initSidebar();
    this.initOtherSections();
    this.initCornerMenu();
    this.initDrawer();
    this.initToasts();
    this.highlightActiveNav();
  },

  // Sound effects generator via Web Audio API
  playSound(type = 'click') {
    if (!this.soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      if (type === 'click') {
        osc.frequency.setValueAtTime(600, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.05);
        gain.gain.setValueAtTime(0.03, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.05);
      } else if (type === 'alert') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(440, audioCtx.currentTime);
        osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.25);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.25);
      } else if (type === 'success') {
        osc.frequency.setValueAtTime(523, audioCtx.currentTime);
        osc.frequency.setValueAtTime(659, audioCtx.currentTime + 0.08);
        osc.frequency.setValueAtTime(783, audioCtx.currentTime + 0.16);
        gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.24);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.24);
      }
      osc.connect(gain);
      gain.connect(audioCtx.destination);
    } catch (e) {}
  },

  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    const btn = document.getElementById('toggle-sound-btn');
    if (btn) {
      btn.textContent = this.soundEnabled ? 'Sound: ON 🔊' : 'Sound: OFF 🔇';
    }
    this.showToast(`Synthesized Audio Feedback: ${this.soundEnabled ? 'ENABLED' : 'DISABLED'}`, 'info');
  },

  /* --------------------------------------------------------------------------
     THEME MANAGEMENT (Light Mode & Dark Mode with Neutral Black/Grey Controls)
     -------------------------------------------------------------------------- */
  initTheme() {
    const savedTheme = localStorage.getItem('nexus_theme') || 'dark';
    this.applyTheme(savedTheme, false);
  },

  applyTheme(theme, showFeedback = true) {
    const validTheme = (theme === 'light') ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', validTheme);
    localStorage.setItem('nexus_theme', validTheme);

    // Sync button active states
    const lightBtns = document.querySelectorAll('#btn-theme-light, .btn-theme-light');
    const darkBtns = document.querySelectorAll('#btn-theme-dark, .btn-theme-dark');

    lightBtns.forEach(btn => {
      if (validTheme === 'light') {
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
      }
    });

    darkBtns.forEach(btn => {
      if (validTheme === 'dark') {
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
      }
    });

    const themeSelect = document.getElementById('theme-mode-select');
    if (themeSelect) {
      themeSelect.value = validTheme;
    }

    if (showFeedback) {
      this.playSound('click');
      this.showToast(`Switched to ${validTheme === 'light' ? 'Light Mode ☀️' : 'Dark Mode 🌙'}`, 'info');
    }

    // Refresh charts if needed
    if (window.NexusCharts && typeof window.NexusCharts.updateTheme === 'function') {
      window.NexusCharts.updateTheme(validTheme);
    }
  },

  setTheme(theme) {
    this.applyTheme(theme, true);
  },

  toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    this.setTheme(current === 'light' ? 'dark' : 'light');
  },

  /* --------------------------------------------------------------------------
     SIDEBAR NAVIGATION & MENU BUTTON CONTROLS
     -------------------------------------------------------------------------- */
  initSidebar() {
    const toggleBtns = document.querySelectorAll('#sidebar-toggle, .sidebar-toggle-btn, .sidebar-menu-btn');
    const sidebar = document.querySelector('.sidebar');
    const appContainer = document.querySelector('.app-container');

    // Create backdrop overlay for mobile if not already in DOM
    let backdrop = document.getElementById('sidebar-backdrop');
    if (!backdrop && sidebar) {
      backdrop = document.createElement('div');
      backdrop.id = 'sidebar-backdrop';
      backdrop.className = 'sidebar-backdrop';
      document.body.appendChild(backdrop);
    }

    const closeSidebar = () => {
      if (sidebar) sidebar.classList.remove('mobile-open');
      if (backdrop) backdrop.classList.remove('active');
    };

    const openSidebar = () => {
      if (sidebar) sidebar.classList.add('mobile-open');
      if (backdrop) backdrop.classList.add('active');
    };

    toggleBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.playSound('click');

        if (window.innerWidth <= 1024) {
          // Mobile / Tablet toggle
          if (sidebar) {
            if (sidebar.classList.contains('mobile-open')) {
              closeSidebar();
            } else {
              openSidebar();
            }
          }
        } else {
          // Desktop toggle: smoothly collapse or expand sidebar
          if (appContainer) {
            appContainer.classList.toggle('sidebar-collapsed');
            const isCollapsed = appContainer.classList.contains('sidebar-collapsed');
            localStorage.setItem('nexus_sidebar_collapsed', isCollapsed ? 'true' : 'false');
          }
        }
      });
    });

    // Close button inside sidebar header
    const closeBtn = document.getElementById('sidebar-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        closeSidebar();
        if (appContainer && window.innerWidth > 1024) {
          appContainer.classList.add('sidebar-collapsed');
        }
        this.playSound('click');
      });
    }

    // Click on mobile backdrop overlay closes the sidebar
    if (backdrop) {
      backdrop.addEventListener('click', () => {
        closeSidebar();
      });
    }

    // Escape key closes sidebar
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeSidebar();
      }
    });

    // Restore desktop collapsed state if user previously minimized it
    if (window.innerWidth > 1024 && localStorage.getItem('nexus_sidebar_collapsed') === 'true') {
      if (appContainer) appContainer.classList.add('sidebar-collapsed');
    }

    // On mobile, auto-close sidebar when clicking a menu link
    document.querySelectorAll('.sidebar-menu .menu-item').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 1024) {
          closeSidebar();
        }
      });
    });
  },

  /* --------------------------------------------------------------------------
     OTHER SECTIONS TOGGLE (Shows ONLY Operations Control by default, others on click)
     -------------------------------------------------------------------------- */
  toggleOtherSections() {
    const container = document.getElementById('sidebar-other-sections');
    const btn = document.getElementById('btn-toggle-other-sections');
    if (!container) return;

    this.playSound('click');
    const isOpen = container.classList.contains('show');
    if (isOpen) {
      container.classList.remove('show');
      if (btn) {
        btn.setAttribute('aria-expanded', 'false');
        const textSpan = btn.querySelector('.other-btn-text');
        if (textSpan) textSpan.textContent = 'Other Sections';
      }
      localStorage.setItem('nexus_other_sections_open', 'false');
    } else {
      container.classList.add('show');
      if (btn) {
        btn.setAttribute('aria-expanded', 'true');
        const textSpan = btn.querySelector('.other-btn-text');
        if (textSpan) textSpan.textContent = 'Collapse Other';
      }
      localStorage.setItem('nexus_other_sections_open', 'true');
    }
  },

  initOtherSections() {
    const container = document.getElementById('sidebar-other-sections');
    const btn = document.getElementById('btn-toggle-other-sections');
    if (!container || !btn) return;

    // Check if the current active page is inside the other-sections container
    const isOtherActive = container.querySelector('.menu-item.active') !== null;
    const savedState = localStorage.getItem('nexus_other_sections_open');

    // If user is currently on an Other page, or explicitly expanded it previously, keep open
    if (isOtherActive || savedState === 'true') {
      container.classList.add('show');
      btn.setAttribute('aria-expanded', 'true');
      const textSpan = btn.querySelector('.other-btn-text');
      if (textSpan) textSpan.textContent = 'Collapse Other';
    } else {
      container.classList.remove('show');
      btn.setAttribute('aria-expanded', 'false');
      const textSpan = btn.querySelector('.other-btn-text');
      if (textSpan) textSpan.textContent = 'Other Sections';
    }
  },

  /* --------------------------------------------------------------------------
     ONE-BUTTON CORNER MENU (Universal Global Access to All System Modules)
     -------------------------------------------------------------------------- */
  toggleCornerMenu() {
    const drawer = document.getElementById('corner-menu-drawer');
    const backdrop = document.getElementById('corner-menu-backdrop');
    if (!drawer) return;

    this.playSound('click');
    const isOpen = drawer.classList.contains('active');
    if (isOpen) {
      drawer.classList.remove('active');
      if (backdrop) backdrop.classList.remove('active');
      document.body.style.overflow = '';
    } else {
      drawer.classList.add('active');
      if (backdrop) backdrop.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  },

  closeCornerMenu() {
    const drawer = document.getElementById('corner-menu-drawer');
    const backdrop = document.getElementById('corner-menu-backdrop');
    if (drawer) drawer.classList.remove('active');
    if (backdrop) backdrop.classList.remove('active');
    document.body.style.overflow = '';
  },

  initCornerMenu() {
    const backdrop = document.getElementById('corner-menu-backdrop');
    if (backdrop) {
      backdrop.addEventListener('click', () => this.closeCornerMenu());
    }
    const closeBtn = document.getElementById('corner-menu-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this.playSound('click');
        this.closeCornerMenu();
      });
    }
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.closeCornerMenu();
    });
  },


  highlightActiveNav() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const menuLinks = document.querySelectorAll('.sidebar-menu .menu-item');
    menuLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href && (href === currentPath || (currentPath === '' && href === 'index.html'))) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  },

  initDrawer() {
    const drawer = document.getElementById('well-detail-drawer');
    const closeBtn = document.getElementById('drawer-close-btn');
    if (drawer && closeBtn) {
      closeBtn.addEventListener('click', () => {
        drawer.classList.remove('open');
        this.playSound('click');
      });
    }
  },

  openWellDetail(wellId) {
    const well = window.NexusData ? window.NexusData.getWellById(wellId) : null;
    if (!well) return;

    this.playSound('click');
    let drawer = document.getElementById('well-detail-drawer');
    if (!drawer) {
      drawer = document.createElement('div');
      drawer.id = 'well-detail-drawer';
      drawer.className = 'detail-drawer';
      drawer.innerHTML = `
        <div class="drawer-header">
          <div>
            <div id="drawer-well-id" style="font-size: 1.1rem; font-weight: 800; color: #38bdf8;"></div>
            <div id="drawer-well-operator" style="font-size: 0.75rem; color: #94a3b8;"></div>
          </div>
          <button id="drawer-close-btn" class="btn btn-secondary btn-sm" style="padding: 0.4rem 0.6rem;">&times;</button>
        </div>
        <div class="drawer-body" id="drawer-body-content"></div>
      `;
      document.body.appendChild(drawer);

      document.getElementById('drawer-close-btn').addEventListener('click', () => {
        drawer.classList.remove('open');
      });
    }

    document.getElementById('drawer-well-id').textContent = `${well.id} - ${well.name}`;
    document.getElementById('drawer-well-operator').textContent = `${well.operator} • ${well.basin}`;

    const body = document.getElementById('drawer-body-content');
    body.innerHTML = `
      <div style="margin-bottom: 1.25rem;">
        <div style="font-size: 0.72rem; text-transform: uppercase; color: #64748b; font-weight: 700; margin-bottom: 0.5rem;">Current Drilling Status</div>
        <div style="display: flex; gap: 0.5rem; margin-bottom: 0.75rem;">
          <span class="badge ${well.status === 'Drilling' ? 'badge-emerald' : 'badge-amber'}">${well.status}</span>
          <span class="badge ${well.riskLevel === 'Critical' ? 'badge-rose' : (well.riskLevel === 'High' ? 'badge-amber' : 'badge-emerald')}">
            Risk: ${well.riskLevel} (${well.riskScore}/100)
          </span>
          <span class="badge badge-cyan">AI Match: ${well.aiConfidence}%</span>
        </div>
      </div>

      <div class="telemetry-grid" style="margin-bottom: 1.5rem;">
        <div class="telemetry-item">
          <div class="telemetry-label">Current Depth</div>
          <div class="telemetry-val">${well.currentDepth} <span class="telemetry-unit">m</span></div>
        </div>
        <div class="telemetry-item">
          <div class="telemetry-label">Target Depth</div>
          <div class="telemetry-val">${well.targetDepth} <span class="telemetry-unit">m</span></div>
        </div>
        <div class="telemetry-item">
          <div class="telemetry-label">Instant ROP</div>
          <div class="telemetry-val" style="color: #10b981;">${well.rop} <span class="telemetry-unit">m/h</span></div>
        </div>
        <div class="telemetry-item">
          <div class="telemetry-label">Mud Weight</div>
          <div class="telemetry-val">${well.mudWeight} <span class="telemetry-unit">PPG</span></div>
        </div>
        <div class="telemetry-item">
          <div class="telemetry-label">WOB</div>
          <div class="telemetry-val">${well.wob} <span class="telemetry-unit">klbs</span></div>
        </div>
        <div class="telemetry-item">
          <div class="telemetry-label">Rotary RPM</div>
          <div class="telemetry-val">${well.rpm} <span class="telemetry-unit">RPM</span></div>
        </div>
      </div>

      <div style="margin-bottom: 1.5rem;">
        <div style="font-size: 0.75rem; font-weight: 700; color: #94a3b8; margin-bottom: 0.5rem; text-transform: uppercase;">Active Subsurface Formation</div>
        <div style="background: rgba(15, 23, 42, 0.6); border: 1px solid var(--border-color); border-radius: 8px; padding: 0.85rem;">
          <div style="font-weight: 700; color: #f8fafc; font-size: 0.95rem;">${well.formation}</div>
          <div style="font-size: 0.78rem; color: #38bdf8; margin-bottom: 0.4rem;">${well.formationType}</div>
          <div style="font-size: 0.75rem; color: #94a3b8;">
            Primary Geomechanical Hazard: <strong style="color:${well.riskColor};">${well.primaryRisk}</strong>
          </div>
        </div>
      </div>

      <div style="margin-bottom: 1.5rem;">
        <div style="font-size: 0.75rem; font-weight: 700; color: #94a3b8; margin-bottom: 0.5rem; text-transform: uppercase;">Correlated Offset Wells</div>
        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
          ${well.offsetWells.map((owId, idx) => `
            <div style="display: flex; align-items: center; justify-content: space-between; background: rgba(30, 41, 59, 0.5); border: 1px solid var(--border-color); border-radius: 6px; padding: 0.6rem 0.85rem; font-size: 0.82rem;">
              <span style="font-weight: 600; color: #38bdf8;">${owId}</span>
              <span style="color: #94a3b8; font-size: 0.75rem;">Offset Dist: ${(1.4 + idx * 1.6).toFixed(1)} km</span>
              <button class="btn btn-outline-cyan btn-sm" onclick="NexusApp.openWellDetail('${owId}')" style="padding: 0.2rem 0.5rem; font-size: 0.7rem;">Inspect</button>
            </div>
          `).join('')}
        </div>
      </div>

      <div style="margin-bottom: 1.5rem;">
        <div style="font-size: 0.75rem; font-weight: 700; color: #94a3b8; margin-bottom: 0.5rem; text-transform: uppercase;">Operations Crew</div>
        <div style="font-size: 0.82rem; color: #cbd5e1;">
          <div>Superintendent: <strong>${well.engineer}</strong></div>
          <div style="font-size: 0.75rem; color: #94a3b8;">Role: ${well.engineerRole}</div>
          <div style="font-size: 0.75rem; color: #94a3b8;">Rig Unit: ${well.rigName}</div>
        </div>
      </div>

      <div style="display: flex; gap: 0.75rem; margin-top: 1rem;">
        <a href="ai-analysis.html?well=${well.id}" class="btn btn-primary btn-sm" style="flex: 1;">Run AI Offset Analysis</a>
        <button class="btn btn-secondary btn-sm" onclick="NexusApp.exportWellData('${well.id}')">Export WITSML</button>
      </div>
    `;

    drawer.classList.add('open');
  },

  initToasts() {
    if (!document.getElementById('toast-container')) {
      const container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
    }
  },

  showToast(message, type = 'info') {
    this.initToasts();
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <div style="font-size: 1rem;">${type === 'success' ? '✓' : (type === 'danger' ? '⚠' : (type === 'warning' ? '⚡' : 'ℹ'))}</div>
      <div style="font-size: 0.82rem; color: #f8fafc; line-height: 1.4;">${message}</div>
    `;
    container.appendChild(toast);
    this.playSound(type === 'danger' ? 'alert' : 'click');

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(50px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  },

  exportWellData(wellId) {
    this.playSound('success');
    this.showToast(`WITSML / LAS log archive generated for ${wellId}. Download initiated.`, 'success');
  },

  exportReportMock(format) {
    this.playSound('success');
    this.showToast(`Historical Offset Well Synthesis exported successfully as ${format.toUpperCase()}.`, 'success');
  }
};

document.addEventListener('DOMContentLoaded', () => {
  window.NexusApp.init();
});
