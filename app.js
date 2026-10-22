/**
 * FPDAF Project Showcase Portal — Interactive Application Logic
 * Clinical Decision Support System & Research Demonstration
 * Group G028 | Track: DSDA | Amrita Vishwa Vidyapeetham
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. Initializations (Lucide & KaTeX)
  // ==========================================
  if (window.lucide) {
    window.lucide.createIcons();
  }

  if (window.renderMathInElement) {
    window.renderMathInElement(document.body, {
      delimiters: [
        { left: '$$', right: '$$', display: true },
        { left: '$', right: '$', display: false },
        { left: '\\[', right: '\\]', display: true },
        { left: '\\(', right: '\\)', display: false }
      ],
      throwOnError: false
    });
  }

  // ==========================================
  // 2. Dropdown Mega Panels & Navigation
  // ==========================================
  const navbar = document.getElementById('topNavbar');
  const navItemsWithDropdown = document.querySelectorAll('.nav-item.has-dropdown');
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const mobileDrawer = document.getElementById('mobileNavDrawer');
  const mobileClose = document.getElementById('mobileMenuClose');

  // Dropdown open/close interactions
  navItemsWithDropdown.forEach(item => {
    const toggle = item.querySelector('.dropdown-toggle');
    let timer = null;

    item.addEventListener('mouseenter', () => {
      clearTimeout(timer);
      navItemsWithDropdown.forEach(other => {
        if (other !== item) other.classList.remove('open');
      });
      item.classList.add('open');
      if (toggle) toggle.setAttribute('aria-expanded', 'true');
    });

    item.addEventListener('mouseleave', () => {
      timer = setTimeout(() => {
        item.classList.remove('open');
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
      }, 150);
    });

    if (toggle) {
      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        const isOpen = item.classList.contains('open');
        navItemsWithDropdown.forEach(other => other.classList.remove('open'));
        if (!isOpen) {
          item.classList.add('open');
          toggle.setAttribute('aria-expanded', 'true');
        } else {
          item.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
        }
      });
    }
  });

  // Close dropdowns on outside click or Escape
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-item.has-dropdown')) {
      navItemsWithDropdown.forEach(item => {
        item.classList.remove('open');
        const toggle = item.querySelector('.dropdown-toggle');
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
      });
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      navItemsWithDropdown.forEach(item => item.classList.remove('open'));
      if (mobileDrawer) mobileDrawer.classList.remove('open');
    }
  });

  // Mobile Drawer Toggle
  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      mobileDrawer.classList.add('open');
    });
  }

  if (mobileClose && mobileDrawer) {
    mobileClose.addEventListener('click', () => {
      mobileDrawer.classList.remove('open');
    });
  }

  document.querySelectorAll('.mobile-link, .drop-card, .dropdown-card').forEach(link => {
    link.addEventListener('click', () => {
      if (mobileDrawer) mobileDrawer.classList.remove('open');
      navItemsWithDropdown.forEach(item => item.classList.remove('open'));
    });
  });

  // Sticky Navbar class on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Smooth scroll for nav anchor links with precise header offset
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const targetId = link.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          const navHeight = 85; // Floating navbar offset (14px top + 58px height + 13px breathing room)
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // ScrollSpy for Top Navigation Menu
  const topNavLinks = document.querySelectorAll('.nav-menu .nav-link');
  const allSections = document.querySelectorAll('section[id]');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        topNavLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, {
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  });

  allSections.forEach(sec => sectionObserver.observe(sec));

  // ==========================================
  // 3. Animated Metric Counters on Scroll
  // ==========================================
  const metricCards = document.querySelectorAll('.metric-card');
  let metricsAnimated = false;

  function animateCounters() {
    metricCards.forEach(card => {
      const valEl = card.querySelector('.metric-value');
      if (!valEl) return;

      const target = parseFloat(valEl.dataset.target);
      const prefix = valEl.dataset.prefix || '';
      const suffix = valEl.dataset.suffix || '';
      const decimals = valEl.dataset.decimals ? parseInt(valEl.dataset.decimals, 10) : 2;

      let start = 0;
      const duration = 1800;
      const startTime = performance.now();

      function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const currentVal = start + (target - start) * easeProgress;

        valEl.textContent = `${prefix}${currentVal.toFixed(decimals)}${suffix}`;

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          valEl.textContent = `${prefix}${target.toFixed(decimals)}${suffix}`;
        }
      }

      requestAnimationFrame(updateCounter);
    });
  }

  const metricsObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !metricsAnimated) {
        metricsAnimated = true;
        animateCounters();
        observer.disconnect();
      }
    });
  }, { threshold: 0.25 });

  const metricsGrid = document.querySelector('.metrics-grid');
  if (metricsGrid) {
    metricsObserver.observe(metricsGrid);
  }

  // ==========================================
  // 4. 60fps Native ICU Waveform Canvas Monitor
  // ==========================================
  const canvas = document.getElementById('icuWaveformCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let sweepX = 0;
    const sweepSpeed = 3.2; // pixels per frame

    function resizeCanvas() {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Physiological waveform synthesis functions
    function getECG(t) {
      const cycle = t % 1.0;
      // Baseline
      let y = 0;
      // P wave
      if (cycle > 0.1 && cycle < 0.2) y += 0.15 * Math.sin((cycle - 0.1) * Math.PI / 0.1);
      // Q wave
      if (cycle >= 0.22 && cycle < 0.25) y -= 0.2 * Math.sin((cycle - 0.22) * Math.PI / 0.03);
      // R peak (sharp QRS)
      if (cycle >= 0.25 && cycle < 0.30) y += 1.0 * Math.sin((cycle - 0.25) * Math.PI / 0.05);
      // S wave
      if (cycle >= 0.30 && cycle < 0.34) y -= 0.35 * Math.sin((cycle - 0.30) * Math.PI / 0.04);
      // T wave
      if (cycle > 0.45 && cycle < 0.65) y += 0.25 * Math.sin((cycle - 0.45) * Math.PI / 0.20);
      return y;
    }

    function getABP(t) {
      const cycle = t % 1.0;
      if (cycle < 0.25) {
        // Systolic rapid upstroke
        return Math.sin(cycle / 0.25 * (Math.PI / 2));
      } else if (cycle < 0.40) {
        // Systolic decline to dicrotic notch
        return 1.0 - (cycle - 0.25) / 0.15 * 0.4;
      } else if (cycle < 0.50) {
        // Dicrotic notch bounce
        return 0.6 + 0.1 * Math.sin((cycle - 0.40) / 0.10 * Math.PI);
      } else {
        // Diastolic runoff
        return 0.65 * Math.exp(-(cycle - 0.50) * 3.5);
      }
    }

    function getSpO2(t) {
      const cycle = t % 1.0;
      if (cycle < 0.3) {
        return Math.sin(cycle / 0.3 * (Math.PI / 2));
      } else {
        return Math.cos((cycle - 0.3) / 0.7 * (Math.PI / 2));
      }
    }

    let lastTime = performance.now();
    let simTime = 0;
    let prevEcgY = 24;
    let prevAbpY = 62;
    let prevSpo2Y = 98;

    function renderWaveforms(currentTime) {
      const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;
      simTime += dt * 1.8; // Simulated cardiac rate ~110-120 bpm

      // Clear the sweep slice ahead of cursor (erasing old trace)
      ctx.fillStyle = '#010309';
      ctx.fillRect(sweepX, 0, sweepSpeed * 6, height);

      // Draw faint horizontal grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let y = 20; y < height; y += 20) {
        ctx.moveTo(sweepX, y);
        ctx.lineTo(sweepX + sweepSpeed, y);
      }
      ctx.stroke();

      const prevX = (sweepX - sweepSpeed + width) % width;

      const currentEcgY = 24 - getECG(simTime) * 16;
      const currentAbpY = 62 - getABP(simTime + 0.12) * 20;
      const currentSpo2Y = 98 - getSpO2(simTime + 0.22) * 16;

      if (sweepX > prevX) {
        // 1. ECG Lead II (Green, top band) - Smooth continuous stroke
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 1.8;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(prevX, prevEcgY);
        ctx.lineTo(sweepX, currentEcgY);
        ctx.stroke();

        // 2. Arterial Blood Pressure (Red, middle band) - Smooth continuous stroke
        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 1.6;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(prevX, prevAbpY);
        ctx.lineTo(sweepX, currentAbpY);
        ctx.stroke();

        // 3. SpO2 Plethysmograph (Cyan, bottom band) - Smooth continuous stroke
        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 1.6;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(prevX, prevSpo2Y);
        ctx.lineTo(sweepX, currentSpo2Y);
        ctx.stroke();
      }

      prevEcgY = currentEcgY;
      prevAbpY = currentAbpY;
      prevSpo2Y = currentSpo2Y;

      sweepX = (sweepX + sweepSpeed) % width;
      requestAnimationFrame(renderWaveforms);
    }

    requestAnimationFrame(renderWaveforms);
  }

  // ==========================================
  // 5. Inventions Tab Switching
  // ==========================================
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabTarget = btn.dataset.tab;
      if (!tabTarget) return;

      tabButtons.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPane = document.getElementById(tabTarget);
      if (targetPane) {
        targetPane.classList.add('active');
        if (window.renderMathInElement) {
          window.renderMathInElement(targetPane, {
            delimiters: [
              { left: '$$', right: '$$', display: true },
              { left: '$', right: '$', display: false }
            ],
            throwOnError: false
          });
        }
        if (window.lucide) window.lucide.createIcons();
      }
    });
  });

  // ==========================================
  // 6. Interactive MLOps CLI Terminal Simulator
  // ==========================================
  const terminalOutput = document.getElementById('terminalOutput');
  const btnRunRound1 = document.getElementById('btnRunRound1');
  const btnTriggerDrift = document.getElementById('btnTriggerDrift');
  const btnAdaptCSSP = document.getElementById('btnAdaptCSSP');
  const btnClearTerminal = document.getElementById('btnClearTerminal');

  function appendLog(level, message) {
    if (!terminalOutput) return;
    const now = new Date();
    const timeStr = `[${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}]`;
    
    let levelClass = 'log-info';
    let levelTag = '[INFO]';
    if (level === 'success') { levelClass = 'log-success'; levelTag = '[SUCCESS]'; }
    if (level === 'warn') { levelClass = 'log-warn'; levelTag = '[WARN]'; }
    if (level === 'alert') { levelClass = 'log-alert'; levelTag = '[DRIFT_ALERT]'; }

    const div = document.createElement('div');
    div.className = 'log-line';
    div.innerHTML = `<span class="log-time">${timeStr}</span> <span class="${levelClass}">${levelTag}</span> ${message}`;
    
    // Remove previous cursor
    const cursor = terminalOutput.querySelector('.log-cursor');
    if (cursor) cursor.remove();

    terminalOutput.appendChild(div);

    // Add cursor to end
    const newCursor = document.createElement('span');
    newCursor.className = 'log-cursor';
    terminalOutput.appendChild(newCursor);

    terminalOutput.scrollTop = terminalOutput.scrollHeight;
  }

  if (btnRunRound1) {
    btnRunRound1.addEventListener('click', () => {
      appendLog('info', 'Executing Federated Rounds 1 through 15 across 3 distributed hospitals...');
      setTimeout(() => appendLog('info', 'Round 05/50: Server broadcasting global backbone weights θ_global (Size: 18.2 MB).'), 300);
      setTimeout(() => appendLog('info', 'Client 1 (Community): Loss 0.0812 | Client 2 (Trauma): Loss 0.0784 | Client 3 (Academic): Loss 0.0759'), 700);
      setTimeout(() => appendLog('info', 'Round 12/50: FedAvg Aggregation complete. Consensus Validation AUROC: 0.8842.'), 1100);
      setTimeout(() => appendLog('success', 'Rounds 1–15 complete. AD-CUSUM scores: S_r(Node 1)=0.21, S_r(Node 2)=0.34, S_r(Node 3)=0.18 (All < Threshold 3.0).'), 1500);
    });
  }

  if (btnTriggerDrift) {
    btnTriggerDrift.addEventListener('click', () => {
      appendLog('warn', 'Simulating acute demographic concept drift at Hospital 2 (Trauma Resuscitation Center)...');
      setTimeout(() => appendLog('warn', 'Node 2: Incoming acute hemorrhaging cohort (Mean MAP: 52 mmHg, Lactate > 4.5 mmol/L).'), 400);
      setTimeout(() => appendLog('alert', 'AD-CUSUM Triggered on Node 2! JSD Divergence D_JSD = 0.4812, Error Residual = +0.824, Gradient Damping w_grad = 1.14.'), 800);
      setTimeout(() => appendLog('alert', 'Node 2 Cumulative Drift Accumulator: S_r = 3.42 > Calibrated Threshold H = 3.00!'), 1200);
      setTimeout(() => appendLog('warn', 'Automated Event: Halting local gradient transmission into shared backbone. Requesting CSSP edge adaptation...'), 1600);
    });
  }

  if (btnAdaptCSSP) {
    btnAdaptCSSP.addEventListener('click', () => {
      appendLog('info', 'Applying Client-Side Selective Personalization (CSSP) protocol at Node 2...');
      setTimeout(() => appendLog('info', 'Backbone Frozen: ∇_θ L ← 0. Shared BiLSTM-Attention representation weights locked.'), 400);
      setTimeout(() => appendLog('info', 'Zero-Upload Enforced: Upload(φ^k) = ∅. Parameter privacy 100% preserved under HIPAA/DPDPA.'), 800);
      setTimeout(() => appendLog('info', 'Optimizing DDP-ERP Objective: L_total = L_CE + 0.10*L_distill + 0.05*L_align + 0.01*H(P_local)...'), 1200);
      setTimeout(() => appendLog('success', 'CSSP Adaptation Complete in 4 local epochs! Node 2 AUROC restored to 0.9418. Edge WAN bandwidth payload saved: 38.2% (960 MB).'), 1700);
    });
  }

  if (btnClearTerminal) {
    btnClearTerminal.addEventListener('click', () => {
      if (terminalOutput) {
        terminalOutput.innerHTML = `
          <div class="log-line"><span class="log-time">[${new Date().toLocaleTimeString()}]</span> <span class="log-info">[RESET]</span> Terminal cleared. Awaiting coordinator commands... <span class="log-cursor"></span></div>
        `;
      }
    });
  }


  // ==========================================
  // 8. Interactive Chart.js Visualizations
  // ==========================================
  const rocCtx = document.getElementById('interactiveRocChart');
  if (rocCtx && window.Chart) {
    new Chart(rocCtx, {
      type: 'line',
      data: {
        labels: [0.0, 0.05, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
        datasets: [
          {
            label: 'FPDAF-v2 Proposed (AUROC: 0.9418)',
            data: [0.0, 0.42, 0.74, 0.88, 0.93, 0.96, 0.98, 0.99, 1.0, 1.0, 1.0, 1.0],
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.12)',
            fill: true,
            tension: 0.3,
            borderWidth: 3,
            pointRadius: 4,
            pointBackgroundColor: '#10b981'
          },
          {
            label: 'FPDAF-v1 Baseline (AUROC: 0.8214)',
            data: [0.0, 0.25, 0.50, 0.68, 0.78, 0.84, 0.89, 0.93, 0.96, 0.98, 1.0, 1.0],
            borderColor: '#6366f1',
            tension: 0.3,
            borderWidth: 2,
            pointRadius: 2
          },
          {
            label: 'Centralized BiLSTM Upper Bound (AUROC: 0.8058)',
            data: [0.0, 0.22, 0.46, 0.65, 0.75, 0.82, 0.87, 0.91, 0.95, 0.98, 1.0, 1.0],
            borderColor: '#f59e0b',
            borderDash: [5, 5],
            tension: 0.3,
            borderWidth: 2,
            pointRadius: 0
          },
          {
            label: 'Ditto Personalized FL (AUROC: 0.7989)',
            data: [0.0, 0.20, 0.44, 0.62, 0.73, 0.80, 0.86, 0.90, 0.94, 0.97, 1.0, 1.0],
            borderColor: '#f43f5e',
            tension: 0.3,
            borderWidth: 2,
            pointRadius: 0
          },
          {
            label: 'Standard FedAvg (AUROC: 0.7844)',
            data: [0.0, 0.18, 0.40, 0.58, 0.69, 0.77, 0.83, 0.88, 0.92, 0.96, 1.0, 1.0],
            borderColor: '#64748b',
            borderDash: [3, 3],
            tension: 0.3,
            borderWidth: 2,
            pointRadius: 0
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: '#94a3b8', font: { family: 'Plus Jakarta Sans', size: 11 }, boxWidth: 14 }
          },
          tooltip: {
            backgroundColor: '#050814',
            titleColor: '#fff',
            bodyColor: '#cbd5e1',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: 1,
            callbacks: {
              title: items => `False Positive Rate: ${items[0].label}`,
              label: item => `${item.dataset.label}: TPR = ${(item.raw * 100).toFixed(1)}%`
            }
          }
        },
        scales: {
          x: {
            title: { display: true, text: 'False Positive Rate (1 - Specificity)', color: '#64748b' },
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#94a3b8' }
          },
          y: {
            title: { display: true, text: 'True Positive Rate (Sensitivity / Recall)', color: '#64748b' },
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#94a3b8' },
            min: 0,
            max: 1.05
          }
        }
      }
    });
  }

  const hospCtx = document.getElementById('interactiveHospitalChart');
  if (hospCtx && window.Chart) {
    new Chart(hospCtx, {
      type: 'bar',
      data: {
        labels: ['Community Hospital 1', 'Trauma Center 2', 'Academic Hospital 3'],
        datasets: [
          {
            label: 'Accuracy (%)',
            data: [96.12, 95.84, 97.40],
            backgroundColor: 'rgba(99, 102, 241, 0.8)',
            borderRadius: 6
          },
          {
            label: 'Sensitivity / Recall (%)',
            data: [81.80, 83.20, 82.50],
            backgroundColor: 'rgba(16, 185, 129, 0.8)',
            borderRadius: 6
          },
          {
            label: 'AUROC (x100)',
            data: [93.8, 93.2, 95.5],
            backgroundColor: 'rgba(6, 182, 212, 0.8)',
            borderRadius: 6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: '#94a3b8', font: { family: 'Plus Jakarta Sans', size: 11 }, boxWidth: 14 }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: '#94a3b8' }
          },
          y: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#94a3b8' },
            min: 60,
            max: 100
          }
        }
      }
    });
  }

  // ==========================================
  // 9. Patent Claims Accordion
  // ==========================================
  const claimItems = document.querySelectorAll('.claim-item');
  claimItems.forEach(item => {
    const header = item.querySelector('.claim-header');
    if (header) {
      header.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        item.classList.toggle('active', !isActive);
        const icon = header.querySelector('i');
        if (icon && window.lucide) {
          icon.setAttribute('data-lucide', !isActive ? 'chevron-down' : 'chevron-right');
          window.lucide.createIcons();
        }
      });
    }
  });

  // ==========================================
  // 10. Searchable 40-Biomarker Cohort Data Dictionary
  // ==========================================
  const cohortBiomarkers = [
    { name: 'HR', cat: 'vitals', range: '60–100 bpm', freq: 'Hourly', role: 'SIRS tachycardia marker (>90 bpm)' },
    { name: 'O2Sat', cat: 'vitals', range: '95–100 %', freq: 'Hourly', role: 'Systemic hypoxemia detection (<92%)' },
    { name: 'Temp', cat: 'vitals', range: '36.5–37.5 °C', freq: 'Hourly', role: 'Hyperthermia (>38.3°C) or Hypothermia (<36.0°C)' },
    { name: 'SBP', cat: 'vitals', range: '90–120 mmHg', freq: 'Hourly', role: 'Septic hypotension indicator (<90 mmHg)' },
    { name: 'MAP', cat: 'vitals', range: '70–105 mmHg', freq: 'Hourly', role: 'Primary perfusion target (<65 mmHg defines shock)' },
    { name: 'DBP', cat: 'vitals', range: '60–80 mmHg', freq: 'Hourly', role: 'Vascular tone & systemic vascular resistance' },
    { name: 'Resp', cat: 'vitals', range: '12–20 rpm', freq: 'Hourly', role: 'qSOFA tachypnea criterion (≥22 rpm)' },
    { name: 'EtCO2', cat: 'vitals', range: '35–45 mmHg', freq: 'Continuous', role: 'Ventilatory efficiency and anaerobic metabolism' },
    { name: 'BaseExcess', cat: 'labs', range: '-2 to +2 mEq/L', freq: 'Q4–Q6H', role: 'Metabolic acidosis severity' },
    { name: 'HCO3', cat: 'labs', range: '22–28 mEq/L', freq: 'Daily / Q12H', role: 'Acid-base buffer capacity' },
    { name: 'FiO2', cat: 'labs', range: '0.21–1.00', freq: 'Per Change', role: 'Fraction of inspired oxygen on ventilator' },
    { name: 'pH', cat: 'labs', range: '7.35–7.45', freq: 'Q4–Q6H', role: 'Arterial blood acidemia (<7.30)' },
    { name: 'PaCO2', cat: 'labs', range: '35–45 mmHg', freq: 'Q4–Q6H', role: 'Respiratory component of acid-base status' },
    { name: 'SaO2', cat: 'labs', range: '95–100 %', freq: 'Q4–Q6H', role: 'Arterial oxygen saturation confirmation' },
    { name: 'AST', cat: 'labs', range: '10–40 U/L', freq: 'Daily', role: 'Hepatic hypoperfusion injury marker' },
    { name: 'BUN', cat: 'labs', range: '7–20 mg/dL', freq: 'Daily', role: 'Renal clearance & dehydration' },
    { name: 'Alkalinephos', cat: 'labs', range: '44–147 U/L', freq: 'Daily', role: 'Biliary tree & hepatobiliary sepsis' },
    { name: 'Calcium', cat: 'labs', range: '8.5–10.5 mg/dL', freq: 'Daily', role: 'Hypocalcemia in critical illness' },
    { name: 'Chloride', cat: 'labs', range: '96–106 mEq/L', freq: 'Daily', role: 'Hyperchloremic metabolic acidosis' },
    { name: 'Creatinine', cat: 'labs', range: '0.6–1.2 mg/dL', freq: 'Daily / Q12H', role: 'Acute Kidney Injury (AKI / KDIGO staging)' },
    { name: 'Bilirubin_direct', cat: 'labs', range: '0.0–0.3 mg/dL', freq: 'Daily', role: 'Hepatic dysfunction in multi-organ failure' },
    { name: 'Glucose', cat: 'labs', range: '70–140 mg/dL', freq: 'Q2–Q4H', role: 'Stress hyperglycemia / septic hypoglycemia' },
    { name: 'Lactate', cat: 'labs', range: '0.5–2.0 mmol/L', freq: 'Stat / Q2–Q4H', role: 'Cellular anaerobic glycolysis (>2 defines sepsis, >4 shock)' },
    { name: 'Magnesium', cat: 'labs', range: '1.7–2.2 mg/dL', freq: 'Daily', role: 'Electrolyte balance & neuromuscular stability' },
    { name: 'Phosphate', cat: 'labs', range: '2.5–4.5 mg/dL', freq: 'Daily', role: 'Cellular energy (ATP) depletion in sepsis' },
    { name: 'Potassium', cat: 'labs', range: '3.5–5.0 mEq/L', freq: 'Q4–Q12H', role: 'Fatal arrhythmia risk in hyperkalemia' },
    { name: 'Bilirubin_total', cat: 'labs', range: '0.1–1.2 mg/dL', freq: 'Daily', role: 'SOFA liver score computation' },
    { name: 'TroponinI', cat: 'labs', range: '<0.04 ng/mL', freq: 'Stat / Q6H', role: 'Sepsis-induced myocardial injury / depression' },
    { name: 'Hct', cat: 'labs', range: '36–50 %', freq: 'Daily', role: 'Hematocrit & hemoconcentration / bleeding' },
    { name: 'Hgb', cat: 'labs', range: '12.0–17.5 g/dL', freq: 'Daily', role: 'Oxygen delivery capacity' },
    { name: 'PTT', cat: 'labs', range: '25–35 sec', freq: 'Daily', role: 'Disseminated Intravascular Coagulation (DIC)' },
    { name: 'WBC', cat: 'labs', range: '4.5–11.0 k/μL', freq: 'Daily / Stat', role: 'SIRS marker (>12.0 k/uL or <4.0 k/uL leukopenia)' },
    { name: 'Fibrinogen', cat: 'labs', range: '200–400 mg/dL', freq: 'Stat', role: 'Consumption coagulopathy in septic shock' },
    { name: 'Platelets', cat: 'labs', range: '150–450 k/μL', freq: 'Daily', role: 'SOFA coagulation score (<100 k/uL severe drop)' },
    { name: 'Age', cat: 'demographics', range: '18–90+ years', freq: 'Static', role: 'Geriatric susceptibility factor' },
    { name: 'Gender', cat: 'demographics', range: '0 (Female) / 1 (Male)', freq: 'Static', role: 'Biological sex stratum' },
    { name: 'Unit1', cat: 'demographics', range: '0 or 1', freq: 'Static', role: 'Medical Intensive Care Unit (MICU)' },
    { name: 'Unit2', cat: 'demographics', range: '0 or 1', freq: 'Static', role: 'Surgical Intensive Care Unit (SICU)' },
    { name: 'HospAdmTime', cat: 'demographics', range: 'Hours relative to ICU', freq: 'Static', role: 'Pre-ICU ward deterioration duration' },
    { name: 'ICULOS', cat: 'demographics', range: '1–300+ hours', freq: 'Hourly', role: 'ICU Length of Stay counter' }
  ];

  const cohortTableBody = document.querySelector('#cohortDictionaryTable tbody');
  const dictSearchInput = document.getElementById('dictSearchInput');
  const dictFilterBtns = document.querySelectorAll('.dict-filter-btn');

  let activeCategory = 'all';

  function renderCohortTable() {
    if (!cohortTableBody) return;
    const query = dictSearchInput ? dictSearchInput.value.toLowerCase().trim() : '';

    const filtered = cohortBiomarkers.filter(item => {
      const matchCat = (activeCategory === 'all' || item.cat === activeCategory);
      const matchQuery = (
        item.name.toLowerCase().includes(query) ||
        item.role.toLowerCase().includes(query) ||
        item.range.toLowerCase().includes(query)
      );
      return matchCat && matchQuery;
    });

    cohortTableBody.innerHTML = filtered.map(item => `
      <tr>
        <td><strong>${item.name}</strong></td>
        <td><span class="pill-badge ${item.cat === 'vitals' ? 'pill-purple' : item.cat === 'labs' ? 'pill-cyan' : 'pill-emerald'}">${item.cat.toUpperCase()}</span></td>
        <td><code>${item.range}</code></td>
        <td>${item.freq}</td>
        <td>${item.role}</td>
      </tr>
    `).join('');
  }

  if (dictSearchInput) {
    dictSearchInput.addEventListener('input', renderCohortTable);
  }

  dictFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      dictFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.dataset.category || 'all';
      renderCohortTable();
    });
  });

  renderCohortTable();

  // ==========================================
  // 11. Interactive REST API Console (FastAPI Simulation)
  // ==========================================
  const apiTabBtns = document.querySelectorAll('.api-tab-btn');
  const apiReqPayload = document.getElementById('apiReqPayload');
  const apiResPayload = document.getElementById('apiResPayload');
  const btnExecuteApi = document.getElementById('btnExecuteApi');
  const apiResponseStatus = document.getElementById('apiResponseStatus');

  const apiEndpointsData = {
    predict: {
      req: JSON.stringify({
        patient_id: "ICU-40327",
        hospital_node: "hospital_02_trauma",
        features_24h: {
          MAP: [68, 65, 62, 59, 58],
          HR: [94, 102, 114, 118, 122],
          Lactate: [1.6, 2.1, 2.9, 3.4, 3.8],
          WBC: [10.2, 12.1, 14.5, 15.8, 16.4]
        }
      }, null, 2),
      res: JSON.stringify({
        status: "success",
        sepsis_risk: 0.842,
        alert_level: "CRITICAL",
        lead_time_hours: 5.8,
        ad_cusum_drift_score: 3.42,
        ssc_hour1_bundle_triggered: true,
        recommended_orders: [
          "Stat serum lactate measurement",
          "Draw 2 sets of blood cultures",
          "Empiric IV broad-spectrum antibiotics",
          "30 mL/kg crystalloid bolus for MAP < 65 mmHg"
        ],
        timestamp: new Date().toISOString()
      }, null, 2)
    },
    telemetry: {
      req: JSON.stringify({
        query: "active_nodes",
        federated_round: 50
      }, null, 2),
      res: JSON.stringify({
        global_round: 50,
        consensus_auroc: 0.9418,
        nodes: [
          { node: "Community_01", enc: 12480, val_loss: 0.0418, drift_detected: false, cssp_active: false },
          { node: "Trauma_02", enc: 15124, val_loss: 0.0521, drift_detected: true, cssp_active: true, drift_score: 3.42 },
          { node: "Academic_03", enc: 12723, val_loss: 0.0388, drift_detected: false, cssp_active: false }
        ],
        wan_bandwidth_reduction_pct: 38.2
      }, null, 2)
    },
    recourse: {
      req: JSON.stringify({
        patient_id: "ICU-40327",
        simulated_intervention: "30_ml_kg_crystalloid_bolus",
        target_map: 78.0,
        target_lactate: 1.4
      }, null, 2),
      res: JSON.stringify({
        pre_intervention_risk: 0.842,
        post_intervention_risk: 0.184,
        risk_delta: -0.658,
        hemodynamic_status: "STABILIZED",
        counterfactual_validity: true,
        recommendation: "Proceed with controlled fluid titration under cardiac monitoring."
      }, null, 2)
    }
  };

  let activeApiEndpoint = 'predict';

  function updateApiView() {
    const data = apiEndpointsData[activeApiEndpoint];
    if (data && apiReqPayload && apiResPayload) {
      apiReqPayload.textContent = data.req;
      apiResPayload.textContent = data.res;
    }
  }

  apiTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      apiTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeApiEndpoint = btn.dataset.endpoint || 'predict';
      updateApiView();
    });
  });

  if (btnExecuteApi) {
    btnExecuteApi.addEventListener('click', () => {
      if (apiResponseStatus) {
        apiResponseStatus.textContent = 'Sending request...';
        apiResponseStatus.style.color = '#38bdf8';
      }
      setTimeout(() => {
        updateApiView();
        if (apiResponseStatus) {
          apiResponseStatus.textContent = '200 OK • 18ms';
          apiResponseStatus.style.color = '#10b981';
        }
        showToast(`API Response received: 200 OK (${activeApiEndpoint})`);
      }, 350);
    });
  }

  updateApiView();

  // ==========================================
  // 12. CDSS Portals View Switching
  // ==========================================
  const portalButtons = document.querySelectorAll('.portal-btn');
  const portalViews = document.querySelectorAll('.portal-view');

  portalButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const portalTarget = btn.dataset.portal;
      if (!portalTarget) return;

      portalButtons.forEach(b => b.classList.remove('active'));
      portalViews.forEach(v => v.classList.remove('active'));

      btn.classList.add('active');
      const targetView = document.getElementById(portalTarget);
      if (targetView) targetView.classList.add('active');
    });
  });

  // ==========================================
  // 13. Video Player & Chapter Jumping
  // ==========================================
  const demoVideo = document.getElementById('demoVideo');
  const chapterButtons = document.querySelectorAll('.chap-btn');

  chapterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const time = parseFloat(btn.dataset.time);
      if (!isNaN(time) && demoVideo) {
        demoVideo.currentTime = time;
        demoVideo.play().catch(() => {});
        chapterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        showToast(`Jumped to video chapter: ${btn.textContent.trim()}`);
      }
    });
  });

  if (demoVideo) {
    demoVideo.addEventListener('timeupdate', () => {
      const current = demoVideo.currentTime;
      let activeIndex = 0;
      chapterButtons.forEach((btn, index) => {
        const time = parseFloat(btn.dataset.time);
        if (current >= time) activeIndex = index;
      });
      chapterButtons.forEach((b, i) => {
        b.classList.toggle('active', i === activeIndex);
      });
    });
  }

  // ==========================================
  // 14. In-Browser PDF Document Modal Viewer
  // ==========================================
  const pdfModal = document.getElementById('pdfModal');
  const pdfIframe = document.getElementById('pdfIframe');
  const pdfModalTitle = document.getElementById('pdfModalTitle');
  const pdfDownloadLink = document.getElementById('pdfDownloadLink');
  const pdfCloseBtn = document.getElementById('pdfCloseBtn');
  const pdfBackdrop = document.getElementById('pdfBackdrop');

  window.openPdfViewer = function(pdfUrl, title) {
    if (!pdfModal || !pdfIframe) return;
    pdfIframe.src = pdfUrl;
    if (pdfModalTitle) {
      pdfModalTitle.innerHTML = `<i data-lucide="file-text" class="text-cyan"></i> <span>${title || 'Document Reader'}</span>`;
      if (window.lucide) window.lucide.createIcons();
    }
    if (pdfDownloadLink) {
      pdfDownloadLink.href = pdfUrl;
    }
    pdfModal.classList.add('open');
    showToast(`Opening document: ${title}`);
  };

  function closePdfViewer() {
    if (pdfModal) {
      pdfModal.classList.remove('open');
      if (pdfIframe) pdfIframe.src = '';
    }
  }

  if (pdfCloseBtn) pdfCloseBtn.addEventListener('click', closePdfViewer);
  if (pdfBackdrop) pdfBackdrop.addEventListener('click', closePdfViewer);

  // ==========================================
  // 15. Command Palette (Cmd+K / Ctrl+K)
  // ==========================================
  const cmdModal = document.getElementById('cmdPaletteModal');
  const openCmdBtn = document.getElementById('openCmdPaletteBtn');
  const cmdInput = document.getElementById('cmdInput');
  const cmdResultsList = document.getElementById('cmdResultsList');
  const cmdBackdrop = document.getElementById('cmdBackdrop');

  const cmdItemsData = [
    { label: 'Jump to Overview & Live Waveform Monitor', tag: 'Section', action: () => scrollToSection('#overview') },
    { label: 'Jump to Clinical Urgency & Problem Statement', tag: 'Section', action: () => scrollToSection('#problem') },
    { label: 'Jump to 3 Architectural Inventions (AD-CUSUM, DDP-ERP, CSSP)', tag: 'Section', action: () => scrollToSection('#inventions') },
    { label: 'Jump to Three Pillars of Clinical XAI', tag: 'Section', action: () => scrollToSection('#xai') },
    { label: 'Jump to Benchmark Table & Interactive ROC Explorer', tag: 'Section', action: () => scrollToSection('#benchmarks') },
    { label: 'Jump to Patent Disclosure & 15 Legal Claims', tag: 'Section', action: () => scrollToSection('#patent') },
    { label: 'Jump to 40-Biomarker Cohort Data Dictionary', tag: 'Section', action: () => scrollToSection('#cohort') },
    { label: 'Jump to REST API Developer Console', tag: 'Section', action: () => scrollToSection('#api') },
    { label: 'Jump to Production CDSS Portals', tag: 'Section', action: () => scrollToSection('#portals') },
    { label: 'Jump to Live Video Demonstration Player', tag: 'Section', action: () => scrollToSection('#demo') },
    { label: 'Jump to Scholarly Publications & Downloads', tag: 'Section', action: () => scrollToSection('#publications') },
    { label: 'Jump to Team G028 & Faculty Mentors', tag: 'Section', action: () => scrollToSection('#team') },
    { label: 'Read IEEE J-BHI Draft (14 Pages)', tag: 'PDF', action: () => openPdfViewer('docs/FPDAF_IEEE_Journal_Paper.pdf', 'IEEE J-BHI Journal Draft') },
    { label: 'Read Patent Specification (15 Claims, IPO Form 2)', tag: 'PDF', action: () => openPdfViewer('docs/Patent_Disclosure_Draft_FPDAF.pdf', 'Patent Disclosure Draft') },
    { label: 'Read Elsevier CMPB Draft (15 Pages)', tag: 'PDF', action: () => openPdfViewer('docs/FPDAF_Elsevier_Journal_Paper.pdf', 'Elsevier CMPB Journal Draft') },
    { label: 'Read Project Documentation Dossier', tag: 'PDF', action: () => openPdfViewer('docs/Project_Documentation_Dossier.pdf', 'Project Documentation Dossier') }
  ];

  function openCommandPalette() {
    if (!cmdModal) return;
    cmdModal.classList.add('open');
    if (cmdInput) {
      cmdInput.value = '';
      cmdInput.focus();
    }
    renderCmdResults('');
  }

  function closeCommandPalette() {
    if (cmdModal) cmdModal.classList.remove('open');
  }

  function scrollToSection(selector) {
    const el = document.querySelector(selector);
    if (el) {
      const navHeight = 70; // Account for top navbar height
      window.scrollTo({
        top: el.offsetTop - navHeight,
        behavior: 'smooth'
      });
    }
  }

  function renderCmdResults(filterText) {
    if (!cmdResultsList) return;
    const query = filterText.toLowerCase().trim();
    const results = cmdItemsData.filter(item => item.label.toLowerCase().includes(query) || item.tag.toLowerCase().includes(query));

    cmdResultsList.innerHTML = results.map((item, idx) => `
      <li class="cmd-item ${idx === 0 ? 'selected' : ''}" data-idx="${idx}">
        <span>${item.label}</span>
        <span class="cmd-item-tag">${item.tag}</span>
      </li>
    `).join('');

    cmdResultsList.querySelectorAll('.cmd-item').forEach((li, index) => {
      li.addEventListener('click', () => {
        closeCommandPalette();
        results[index].action();
      });
    });
  }

  if (openCmdBtn) openCmdBtn.addEventListener('click', openCommandPalette);
  if (cmdBackdrop) cmdBackdrop.addEventListener('click', closeCommandPalette);

  if (cmdInput) {
    cmdInput.addEventListener('input', e => renderCmdResults(e.target.value));
  }

  document.addEventListener('keydown', e => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (cmdModal && cmdModal.classList.contains('open')) {
        closeCommandPalette();
      } else {
        openCommandPalette();
      }
    } else if (e.key === 'Escape') {
      closeCommandPalette();
      closePdfViewer();
    }
  });

  // ==========================================
  // 16. BibTeX Citation Copy
  // ==========================================
  const copyBibBtn = document.getElementById('copyBibBtn');
  const bibtexContent = document.getElementById('bibtexContent');

  if (copyBibBtn && bibtexContent) {
    copyBibBtn.addEventListener('click', () => {
      const codeText = bibtexContent.innerText.trim();
      navigator.clipboard.writeText(codeText).then(() => {
        const originalHTML = copyBibBtn.innerHTML;
        copyBibBtn.innerHTML = '<i data-lucide="check"></i> Copied!';
        if (window.lucide) window.lucide.createIcons();
        showToast('BibTeX citation copied to clipboard!');

        setTimeout(() => {
          copyBibBtn.innerHTML = originalHTML;
          if (window.lucide) window.lucide.createIcons();
        }, 2500);
      }).catch(err => {
        console.error('Failed to copy BibTeX:', err);
      });
    });
  }

  // ==========================================
  // 17. Image Lightbox Modal Preview
  // ==========================================
  const lightboxModal = document.getElementById('imageLightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');

  const previewableImages = document.querySelectorAll('.responsive-img, .diagram-img-wrapper img');
  previewableImages.forEach(img => {
    img.classList.add('clickable-image');
    img.addEventListener('click', () => {
      if (!lightboxModal || !lightboxImg) return;
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt || 'FPDAF Architectural Asset';
      if (lightboxCaption) {
        lightboxCaption.textContent = img.alt || '';
      }
      lightboxModal.classList.add('open');
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', () => {
      lightboxModal.classList.remove('open');
    });
  }

  if (lightboxModal) {
    lightboxModal.addEventListener('click', e => {
      if (e.target === lightboxModal || e.target.classList.contains('lightbox-backdrop')) {
        lightboxModal.classList.remove('open');
      }
    });
  }

  // ==========================================
  // 18. Toast Notification Helper
  // ==========================================
  function showToast(message) {
    let toast = document.getElementById('toastNotification');
    if (!toast) return;

    const toastMessage = document.getElementById('toastMessage');
    if (toastMessage) {
      toastMessage.textContent = message;
    }

    toast.classList.add('show');
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  console.log('✓ FPDAF Clinical Intelligence Portal fully initialized.');
});
