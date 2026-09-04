/**
 * eRTMAC-NWIS | Route Nexus - Charting Engine
 * Powered by Chart.js with Enterprise Dark Mode Styling
 */

window.NexusCharts = {
  // Common Dark Theme Palette
  colors: {
    cyan: '#06b6d4',
    cyanLight: '#38bdf8',
    cyanGlow: 'rgba(6, 182, 212, 0.25)',
    blue: '#3b82f6',
    blueLight: '#60a5fa',
    blueGlow: 'rgba(59, 130, 246, 0.25)',
    emerald: '#10b981',
    amber: '#f59e0b',
    rose: '#f43f5e',
    purple: '#a855f7',
    grid: 'rgba(148, 163, 184, 0.08)',
    text: '#94a3b8'
  },

  initROPComparisonChart(canvasId) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;

    return new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Moran Field', 'Naharkatiya', 'Baghjan Deep', 'Jorajan Hub', 'Dikom Field', 'Kusijan', 'Shalmari'],
        datasets: [
          {
            label: 'Traditional Offset ROP (m/hr)',
            data: [11.2, 14.5, 9.8, 12.3, 15.1, 10.4, 13.0],
            backgroundColor: 'rgba(148, 163, 184, 0.25)',
            borderColor: 'rgba(148, 163, 184, 0.5)',
            borderWidth: 1,
            borderRadius: 4
          },
          {
            label: 'eRTMAC-NWIS Optimized ROP (m/hr)',
            data: [18.4, 23.2, 16.9, 19.8, 24.6, 17.2, 21.5],
            backgroundColor: 'rgba(6, 182, 212, 0.8)',
            borderColor: '#06b6d4',
            borderWidth: 1,
            borderRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: { color: this.colors.text, font: { family: 'Inter', size: 12 } }
          },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            titleColor: '#f8fafc',
            bodyColor: '#38bdf8',
            borderColor: 'rgba(56, 189, 248, 0.2)',
            borderWidth: 1
          }
        },
        scales: {
          x: {
            grid: { color: this.colors.grid },
            ticks: { color: this.colors.text }
          },
          y: {
            grid: { color: this.colors.grid },
            ticks: { color: this.colors.text },
            title: { display: true, text: 'Rate of Penetration (m/hr)', color: this.colors.text }
          }
        }
      }
    });
  },

  initRiskDistributionChart(canvasId) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;

    return new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Differential Sticking', 'Lost Circulation', 'Gas Kick Threat', 'Tight Hole / Shale', 'Bit Premature Wear'],
        datasets: [{
          data: [34, 26, 15, 18, 7],
          backgroundColor: [
            'rgba(244, 63, 94, 0.85)',
            'rgba(245, 158, 11, 0.85)',
            'rgba(239, 68, 68, 0.85)',
            'rgba(59, 130, 246, 0.85)',
            'rgba(168, 85, 247, 0.85)'
          ],
          borderColor: '#0b1120',
          borderWidth: 3,
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: this.colors.text, font: { family: 'Inter', size: 11 }, boxWidth: 12 }
          }
        },
        cutout: '70%'
      }
    });
  },

  initPorePressureDepthChart(canvasId) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;

    const depths = [1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000];

    return new Chart(ctx, {
      type: 'line',
      data: {
        labels: depths.map(d => `${d}m`),
        datasets: [
          {
            label: 'Predicted Pore Pressure (PPG EMW)',
            data: [9.1, 9.4, 9.8, 10.5, 12.1, 13.4, 13.9, 14.5, 15.2],
            borderColor: '#f59e0b',
            backgroundColor: 'rgba(245, 158, 11, 0.15)',
            fill: false,
            tension: 0.35,
            borderWidth: 2,
            pointRadius: 4
          },
          {
            label: 'Planned Mud Weight Window (PPG)',
            data: [9.6, 10.0, 10.5, 11.2, 12.8, 14.1, 14.6, 15.1, 15.8],
            borderColor: '#06b6d4',
            backgroundColor: 'rgba(6, 182, 212, 0.15)',
            fill: '+1',
            tension: 0.35,
            borderWidth: 2.5,
            pointRadius: 4
          },
          {
            label: 'Fracture Gradient Limit (PPG EMW)',
            data: [13.5, 14.2, 14.9, 15.6, 16.3, 16.9, 17.4, 17.8, 18.2],
            borderColor: '#f43f5e',
            backgroundColor: 'transparent',
            borderDash: [5, 5],
            tension: 0.35,
            borderWidth: 2,
            pointRadius: 3
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top', labels: { color: this.colors.text, font: { size: 11 } } },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            titleColor: '#f8fafc',
            bodyColor: '#38bdf8'
          }
        },
        scales: {
          x: { grid: { color: this.colors.grid }, ticks: { color: this.colors.text } },
          y: {
            grid: { color: this.colors.grid },
            ticks: { color: this.colors.text },
            title: { display: true, text: 'Equivalent Mud Weight (PPG)', color: this.colors.text }
          }
        }
      }
    });
  },

  initNPTSavingsChart(canvasId) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;

    return new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['2021', '2022', '2023', '2024', '2025', '2026 (SIH eRTMAC)'],
        datasets: [
          {
            label: 'Historical Non-Productive Time (NPT %)',
            data: [28.4, 25.1, 23.8, 20.2, 16.7, 7.8],
            borderColor: '#f43f5e',
            backgroundColor: 'rgba(244, 63, 94, 0.1)',
            fill: true,
            tension: 0.35,
            borderWidth: 2,
            pointBackgroundColor: '#f43f5e'
          },
          {
            label: 'Operational Drilling Efficiency (%)',
            data: [71.6, 74.9, 76.2, 79.8, 83.3, 92.2],
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            fill: true,
            tension: 0.35,
            borderWidth: 2,
            pointBackgroundColor: '#10b981'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top', labels: { color: this.colors.text, font: { size: 12 } } }
        },
        scales: {
          x: { grid: { color: this.colors.grid }, ticks: { color: this.colors.text } },
          y: { grid: { color: this.colors.grid }, ticks: { color: this.colors.text }, max: 100 }
        }
      }
    });
  },

  initLithologyRadarChart(canvasId) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;

    return new Chart(ctx, {
      type: 'radar',
      data: {
        labels: ['Compressive Strength', 'Abrasiveness', 'Pore Pressure', 'Clay Swelling Tendency', 'Permeability', 'Fracture Density'],
        datasets: [
          {
            label: 'Target Well (Naharkatiya-601)',
            data: [82, 78, 88, 92, 45, 68],
            borderColor: '#06b6d4',
            backgroundColor: 'rgba(6, 182, 212, 0.25)',
            borderWidth: 2,
            pointBackgroundColor: '#06b6d4'
          },
          {
            label: 'Offset Well Benchmark (NST-6001)',
            data: [75, 82, 84, 86, 50, 60],
            borderColor: '#6366f1',
            backgroundColor: 'rgba(99, 102, 241, 0.2)',
            borderWidth: 2,
            pointBackgroundColor: '#6366f1'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top', labels: { color: this.colors.text, font: { size: 11 } } }
        },
        scales: {
          r: {
            grid: { color: this.colors.grid },
            angleLines: { color: this.colors.grid },
            pointLabels: { color: this.colors.text, font: { size: 10 } },
            ticks: { display: false, max: 100 }
          }
        }
      }
    });
  },

  updateTheme(theme) {
    if (theme === 'light') {
      this.colors.text = '#475569';
      this.colors.grid = 'rgba(100, 116, 139, 0.18)';
    } else {
      this.colors.text = '#94a3b8';
      this.colors.grid = 'rgba(148, 163, 184, 0.08)';
    }
  }
};
