/**
 * eRTMAC-NWIS | Route Nexus - Offline GIS Map Engine
 * High-Fidelity Geological & Spatial Offset Well Visualizer
 * Fully functional offline using HTML5 Canvas & Vector Graphics
 */

class NexusGISMap {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.options = Object.assign({
      centerLat: 27.28,
      centerLng: 95.32,
      scale: 1800,
      interactive: true,
      showContours: true,
      showOffsetLines: true,
      showBufferRings: true,
      onWellSelect: null
    }, options);

    this.wells = window.NexusData ? window.NexusData.wells : [];
    this.selectedWellId = this.wells[0]?.id || "NST6001";
    this.hoveredWell = null;

    this.zoom = 1;
    this.panX = 0;
    this.panY = 0;
    this.isDragging = false;
    this.dragStartX = 0;
    this.dragStartY = 0;

    this.initCanvas();
    this.bindEvents();
    this.render();
  }

  initCanvas() {
    this.container.innerHTML = '';
    this.container.style.position = 'relative';
    this.container.style.overflow = 'hidden';
    this.container.style.background = '#030816';

    this.canvas = document.createElement('canvas');
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.display = 'block';
    this.container.appendChild(this.canvas);

    this.ctx = this.canvas.getContext('2d');

    // Controls Overlay
    this.controls = document.createElement('div');
    this.controls.className = 'gis-map-controls';
    this.controls.innerHTML = `
      <div style="position: absolute; top: 1rem; right: 1rem; display: flex; flex-direction: column; gap: 0.5rem; z-index: 20;">
        <button class="btn btn-secondary btn-sm" id="map-zoom-in" title="Zoom In" style="padding: 0.5rem; width: 34px; height: 34px;">+</button>
        <button class="btn btn-secondary btn-sm" id="map-zoom-out" title="Zoom Out" style="padding: 0.5rem; width: 34px; height: 34px;">−</button>
        <button class="btn btn-secondary btn-sm" id="map-reset" title="Reset View" style="padding: 0.5rem; width: 34px; height: 34px;">⟲</button>
      </div>
      <div style="position: absolute; bottom: 1rem; left: 1rem; background: rgba(11, 17, 32, 0.85); backdrop-filter: blur(8px); border: 1px solid var(--border-color); border-radius: 8px; padding: 0.6rem 0.9rem; font-size: 0.72rem; color: #94a3b8; z-index: 20; display: flex; align-items: center; gap: 1rem;">
        <div style="display: flex; align-items: center; gap: 0.4rem;"><span style="width: 8px; height: 8px; border-radius: 50%; background: #10b981;"></span> Normal</div>
        <div style="display: flex; align-items: center; gap: 0.4rem;"><span style="width: 8px; height: 8px; border-radius: 50%; background: #f59e0b;"></span> Warning</div>
        <div style="display: flex; align-items: center; gap: 0.4rem;"><span style="width: 8px; height: 8px; border-radius: 50%; background: #f43f5e;"></span> Critical Hazard</div>
        <div style="display: flex; align-items: center; gap: 0.4rem;"><span style="width: 8px; height: 8px; border-radius: 50%; background: #06b6d4;"></span> Target Well</div>
      </div>
    `;
    this.container.appendChild(this.controls);

    // Tooltip Element
    this.tooltip = document.createElement('div');
    this.tooltip.className = 'gis-map-tooltip';
    this.tooltip.style.position = 'absolute';
    this.tooltip.style.display = 'none';
    this.tooltip.style.pointerEvents = 'none';
    this.tooltip.style.background = 'rgba(15, 23, 42, 0.95)';
    this.tooltip.style.border = '1px solid rgba(56, 189, 248, 0.3)';
    this.tooltip.style.borderRadius = '8px';
    this.tooltip.style.padding = '0.6rem 0.8rem';
    this.tooltip.style.fontSize = '0.78rem';
    this.tooltip.style.color = '#f8fafc';
    this.tooltip.style.boxShadow = '0 10px 25px rgba(0,0,0,0.8)';
    this.tooltip.style.zIndex = '30';
    this.container.appendChild(this.tooltip);

    this.resize();
  }

  resize() {
    const rect = this.container.getBoundingClientRect();
    this.width = rect.width || 800;
    this.height = rect.height || 500;
    this.canvas.width = this.width * window.devicePixelRatio;
    this.canvas.height = this.height * window.devicePixelRatio;
    this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }

  latLngToScreen(lat, lng) {
    const dLat = (lat - this.options.centerLat) * this.options.scale * this.zoom;
    const dLng = (lng - this.options.centerLng) * this.options.scale * this.zoom;
    const x = (this.width / 2) + dLng + this.panX;
    const y = (this.height / 2) - dLat + this.panY;
    return { x, y };
  }

  screenToLatLng(x, y) {
    const dLng = (x - (this.width / 2) - this.panX) / (this.options.scale * this.zoom);
    const dLat = ((this.height / 2) + this.panY - y) / (this.options.scale * this.zoom);
    return {
      lat: this.options.centerLat + dLat,
      lng: this.options.centerLng + dLng
    };
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.resize();
      this.render();
    });

    const zoomInBtn = this.container.querySelector('#map-zoom-in');
    const zoomOutBtn = this.container.querySelector('#map-zoom-out');
    const resetBtn = this.container.querySelector('#map-reset');

    if (zoomInBtn) zoomInBtn.addEventListener('click', () => { this.zoom *= 1.25; this.render(); });
    if (zoomOutBtn) zoomOutBtn.addEventListener('click', () => { this.zoom = Math.max(0.6, this.zoom / 1.25); this.render(); });
    if (resetBtn) resetBtn.addEventListener('click', () => { this.zoom = 1; this.panX = 0; this.panY = 0; this.render(); });

    this.canvas.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.dragStartX = e.clientX - this.panX;
      this.dragStartY = e.clientY - this.panY;
    });

    window.addEventListener('mousemove', (e) => {
      if (this.isDragging) {
        this.panX = e.clientX - this.dragStartX;
        this.panY = e.clientY - this.dragStartY;
        this.render();
      } else {
        this.handleHover(e);
      }
    });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

    this.canvas.addEventListener('click', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      let found = null;
      for (const well of this.wells) {
        const pt = this.latLngToScreen(well.lat, well.lng);
        const dist = Math.hypot(pt.x - clickX, pt.y - clickY);
        if (dist <= 14) {
          found = well;
          break;
        }
      }

      if (found) {
        this.selectWell(found.id);
      }
    });
  }

  handleHover(e) {
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (x < 0 || y < 0 || x > this.width || y > this.height) {
      this.tooltip.style.display = 'none';
      return;
    }

    let found = null;
    for (const well of this.wells) {
      const pt = this.latLngToScreen(well.lat, well.lng);
      const dist = Math.hypot(pt.x - x, pt.y - y);
      if (dist <= 14) {
        found = well;
        break;
      }
    }

    if (found) {
      this.hoveredWell = found;
      this.canvas.style.cursor = 'pointer';
      this.tooltip.style.display = 'block';
      this.tooltip.style.left = `${x + 15}px`;
      this.tooltip.style.top = `${y - 15}px`;
      this.tooltip.innerHTML = `
        <div style="font-weight: 700; color: #38bdf8; margin-bottom: 2px;">${found.id} - ${found.name}</div>
        <div style="color: #94a3b8; font-size: 0.72rem; margin-bottom: 4px;">${found.operator} (${found.basin})</div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px 8px; font-size: 0.72rem;">
          <div>Depth: <strong style="color:#f8fafc;">${found.currentDepth}m</strong></div>
          <div>ROP: <strong style="color:#10b981;">${found.rop} m/h</strong></div>
          <div>Formation: <strong style="color:#f8fafc;">${found.formation}</strong></div>
          <div>Risk: <strong style="color:${found.riskColor};">${found.riskLevel}</strong></div>
        </div>
      `;
    } else {
      this.hoveredWell = null;
      this.canvas.style.cursor = 'grab';
      this.tooltip.style.display = 'none';
    }
  }

  selectWell(wellId) {
    this.selectedWellId = wellId;
    const well = window.NexusData.getWellById(wellId);
    if (this.options.onWellSelect) {
      this.options.onWellSelect(well);
    }
    this.render();
  }

  render() {
    if (!this.ctx) return;
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    // 1. Draw Subsurface Seismic Grids & Geological Fault Lines
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.05)';
    ctx.lineWidth = 1;
    const gridSize = 40 * this.zoom;
    const startX = (this.panX % gridSize);
    const startY = (this.panY % gridSize);

    for (let x = startX; x < this.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, this.height);
      ctx.stroke();
    }
    for (let y = startY; y < this.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(this.width, y);
      ctx.stroke();
    }

    // 2. Draw Formation Contours (Simulated Upper Assam Shelf Stratigraphy)
    if (this.options.showContours) {
      ctx.save();
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.12)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);

      // Major Fault Boundary
      const faultP1 = this.latLngToScreen(27.42, 95.12);
      const faultP2 = this.latLngToScreen(27.15, 95.55);
      ctx.beginPath();
      ctx.moveTo(faultP1.x, faultP1.y);
      ctx.bezierCurveTo(faultP1.x + 80, faultP1.y + 40, faultP2.x - 80, faultP2.y - 60, faultP2.x, faultP2.y);
      ctx.stroke();

      // Fault Label
      ctx.fillStyle = 'rgba(148, 163, 184, 0.4)';
      ctx.font = '10px monospace';
      ctx.fillText('Naga Thrust Fault Horizon', faultP1.x + 20, faultP1.y + 30);
      ctx.restore();
    }

    // 3. Find and Draw Active Selected Well Buffer Radii
    const activeWell = window.NexusData.getWellById(this.selectedWellId);
    if (activeWell && this.options.showBufferRings) {
      const center = this.latLngToScreen(activeWell.lat, activeWell.lng);

      // Buffer rings: 1 km, 3 km, 5 km
      const rings = [
        { radiusKm: 1.5, label: '1.5 km Buffer', color: 'rgba(6, 182, 212, 0.3)' },
        { radiusKm: 3.5, label: '3.5 km Offset Zone', color: 'rgba(6, 182, 212, 0.18)' },
        { radiusKm: 6.0, label: '6.0 km Regional Correlation', color: 'rgba(59, 130, 246, 0.1)' }
      ];

      rings.forEach(ring => {
        const pixelRadius = ring.radiusKm * 32 * this.zoom;
        ctx.beginPath();
        ctx.arc(center.x, center.y, pixelRadius, 0, Math.PI * 2);
        ctx.strokeStyle = ring.color;
        ctx.lineWidth = 1.5;
        ctx.setLineDash([6, 6]);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = ring.color;
        ctx.font = '9px monospace';
        ctx.fillText(ring.label, center.x + pixelRadius - 50, center.y - 6);
      });

      // Offset Correlation Rays connecting target well to candidates
      if (this.options.showOffsetLines && activeWell.offsetWells) {
        activeWell.offsetWells.forEach((offsetId, idx) => {
          const offset = window.NexusData.getWellById(offsetId);
          if (offset) {
            const offsetPt = this.latLngToScreen(offset.lat, offset.lng);
            ctx.beginPath();
            ctx.moveTo(center.x, center.y);
            ctx.lineTo(offsetPt.x, offsetPt.y);
            ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
            ctx.lineWidth = 1.8;
            ctx.setLineDash([4, 3]);
            ctx.stroke();
            ctx.setLineDash([]);

            // Midpoint distance badge
            const midX = (center.x + offsetPt.x) / 2;
            const midY = (center.y + offsetPt.y) / 2;
            ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
            ctx.fillRect(midX - 22, midY - 9, 44, 16);
            ctx.strokeStyle = 'rgba(6, 182, 212, 0.3)';
            ctx.strokeRect(midX - 22, midY - 9, 44, 16);
            ctx.fillStyle = '#38bdf8';
            ctx.font = '9px monospace';
            ctx.fillText(`${(1.8 + idx * 1.4).toFixed(1)} km`, midX - 18, midY + 3);
          }
        });
      }
    }

    // 4. Draw All Well Pins
    this.wells.forEach(well => {
      const pt = this.latLngToScreen(well.lat, well.lng);
      const isSelected = well.id === this.selectedWellId;
      const isHovered = this.hoveredWell?.id === well.id;

      // Glow effect for selected or critical wells
      if (isSelected || well.riskLevel === 'Critical') {
        const glowRadius = isSelected ? 16 : 10;
        const glowColor = isSelected ? 'rgba(6, 182, 212, 0.4)' : 'rgba(244, 63, 94, 0.4)';
        const grad = ctx.createRadialGradient(pt.x, pt.y, 2, pt.x, pt.y, glowRadius);
        grad.addColorStop(0, glowColor);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, glowRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Base Circle
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, isSelected ? 8 : (isHovered ? 7 : 5), 0, Math.PI * 2);
      ctx.fillStyle = isSelected ? '#06b6d4' : well.riskColor;
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = isSelected ? 2.5 : 1;
      ctx.stroke();

      // Label
      if (this.zoom > 0.85 || isSelected) {
        ctx.fillStyle = isSelected ? '#38bdf8' : '#94a3b8';
        ctx.font = isSelected ? 'bold 11px Inter, sans-serif' : '9px Inter, sans-serif';
        ctx.fillText(well.id, pt.x + 9, pt.y + 4);
      }
    });
  }
}

window.NexusGISMap = NexusGISMap;
