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
        e.stopPropagation();
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
          const navHeight = 84; // Floating navbar (58px + 16px top margin + 10px buffer)
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
      const duration = 750;
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
  }, { threshold: 0.1 });

  const metricsGrid = document.querySelector('.metrics-grid');
  if (metricsGrid) {
    metricsObserver.observe(metricsGrid);
    // If already in viewport on load, fire immediately
    const rect = metricsGrid.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0 && !metricsAnimated) {
      metricsAnimated = true;
      animateCounters();
    }
  }

  // ==========================================
  // 4. ICU Multi-Parameter Physiological Vitals Documentation Profile
  // ==========================================
  const canvas = document.getElementById('icuWaveformCanvas');
  if (canvas) {
  let preFillWaveforms = () => {};
  
  // Clinical Bedside Patient Encounter Profiles
  const ICU_PATIENTS = {
    pat1033: {
      name: 'Bed 14: PAT-1033',
      bed: 'BED 14',
      status: 'CRITICAL',
      hr: 122,
      hrBadge: { text: 'HIGH', cls: 'alarm-crit' },
      abpSys: 58,
      abpDia: 38,
      map: 45,
      abpBadge: { text: 'LOW MAP', cls: 'alarm-crit' },
      spo2: 91,
      spo2Badge: { text: 'DESAT', cls: 'alarm-warn' },
      resp: 28,
      respBadge: { text: 'TACHY', cls: 'alarm-warn' },
      temp: '38.9',
      tempBadge: { text: 'FEBRILE', cls: 'alarm-crit' },
      lactate: '4.2',
      lactateBadge: { text: 'ACIDOSIS', cls: 'alarm-crit' },
      cvp: 4,
      co: '3.8',
      cvpBadge: { text: 'MONITORED', cls: 'alarm-norm' },
      risk: '98.5%',
      riskNum: 98.5,
      leadTime: '5.8 Hours Advance',
      cdssBadge: { text: 'SHOCK ALERT', cls: 'alarm-crit' },
      bundleText: '<strong style="color:#f43f5e;">SSC 1-HOUR BUNDLE:</strong> Refractory hypotension (MAP 45 &lt; 65 mmHg) &amp; hyperlactatemia (4.2 mmol/L). Immediate 30 mL/kg IV crystalloid fluid bolus + vasopressor dispatch.',
      alarmMsg: 'BED 14 (PAT-1033): SEVERE SEPSIS CRITICAL ALERT • Persistent Refractory Hypotension (MAP 45 mmHg &lt; 65) &amp; Lactic Acidosis (4.2 mmol/L). Immediate Surviving Sepsis Bundle Dispatch.',
      rateMult: 1.8,
      boxClasses: {
        boxHR: 'box-alert-crit',
        boxABP: 'box-alert-crit',
        boxSpO2: 'box-alert-warn',
        boxResp: 'box-alert-warn',
        boxTemp: 'box-alert-crit',
        boxLactate: 'box-alert-crit'
      }
    },
    pat1000: {
      name: 'Bed 02: PAT-1000',
      bed: 'BED 02',
      status: 'STABLE',
      hr: 72,
      hrBadge: { text: 'NORM', cls: 'alarm-norm' },
      abpSys: 122,
      abpDia: 78,
      map: 88,
      abpBadge: { text: 'NORM', cls: 'alarm-norm' },
      spo2: 99,
      spo2Badge: { text: 'NORM', cls: 'alarm-norm' },
      resp: 14,
      respBadge: { text: 'NORM', cls: 'alarm-norm' },
      temp: '36.8',
      tempBadge: { text: 'NORM', cls: 'alarm-norm' },
      lactate: '1.1',
      lactateBadge: { text: 'NORM', cls: 'alarm-norm' },
      cvp: 8,
      co: '5.6',
      cvpBadge: { text: 'NORMAL', cls: 'alarm-norm' },
      risk: '10.9%',
      riskNum: 10.9,
      leadTime: 'Nominal Baseline',
      cdssBadge: { text: 'LOW RISK', cls: 'alarm-norm' },
      bundleText: '<strong style="color:#10b981;">ROUTINE SURVEILLANCE:</strong> Patient hemodynamically stable. Continue standard post-operative clinical monitoring protocols.',
      alarmMsg: 'BED 02 (PAT-1000): ALL PARAMETERS WITHIN NORMAL ICU OPERATING LIMITS • Routine decentralized continuous surveillance active.',
      rateMult: 1.05,
      boxClasses: {
        boxHR: '',
        boxABP: '',
        boxSpO2: '',
        boxResp: '',
        boxTemp: '',
        boxLactate: ''
      }
    },
    pat1018: {
      name: 'Bed 08: PAT-1018',
      bed: 'BED 08',
      status: 'INTERMEDIATE',
      hr: 98,
      hrBadge: { text: 'ELEVATED', cls: 'alarm-warn' },
      abpSys: 98,
      abpDia: 62,
      map: 72,
      abpBadge: { text: 'ACCEPTABLE', cls: 'alarm-norm' },
      spo2: 94,
      spo2Badge: { text: 'BORDERLINE', cls: 'alarm-warn' },
      resp: 22,
      respBadge: { text: 'ELEVATED', cls: 'alarm-warn' },
      temp: '38.1',
      tempBadge: { text: 'SUBFEBRILE', cls: 'alarm-warn' },
      lactate: '2.3',
      lactateBadge: { text: 'ELEVATED', cls: 'alarm-warn' },
      cvp: 6,
      co: '4.4',
      cvpBadge: { text: 'MONITORED', cls: 'alarm-norm' },
      risk: '42.1%',
      riskNum: 42.1,
      leadTime: '4.2 Hours Advance',
      cdssBadge: { text: 'SIRS ALERT', cls: 'alarm-warn' },
      bundleText: '<strong style="color:#f59e0b;">SECONDARY TRIAGE TRIGGERED:</strong> Borderline oxygenation (94%) and elevated lactate (2.3 mmol/L). Repeat arterial blood gas and serial lactate surveillance q2h.',
      alarmMsg: 'BED 08 (PAT-1018): INTERMEDIATE SIRS ACUITY • Divergence detected in temporal lactate &amp; leukocyte trajectory. Flagged for secondary bedside triage.',
      rateMult: 1.4,
      boxClasses: {
        boxHR: 'box-alert-warn',
        boxABP: '',
        boxSpO2: 'box-alert-warn',
        boxResp: 'box-alert-warn',
        boxTemp: 'box-alert-warn',
        boxLactate: 'box-alert-warn'
      }
    }
  };

  let activePatientKey = 'pat1033';
  let activePatient = { ...ICU_PATIENTS[activePatientKey] };
  let currentRateMult = activePatient.rateMult;
  let isResuscitated = false;
  let isBolusAnimating = false;

  // Web Audio Clinical QRS Beep Generator
  let audioCtx = null;
  let audioBeepEnabled = false;

  function playQrsBeep() {
    if (!audioBeepEnabled) return;
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // Authentic 880 Hz monitor tone
      gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.055);
    } catch (e) {
      // Audio playback blocked or uninitialized
    }
  }

  // DOM Elements for Telemetry Numerics
  const monitorHR = document.getElementById('monitorHR');
  const monitorABP = document.getElementById('monitorABP');
  const monitorMAP = document.getElementById('monitorMAP');
  const monitorSpO2 = document.getElementById('monitorSpO2');
  const monitorResp = document.getElementById('monitorResp');
  const monitorTemp = document.getElementById('monitorTemp');
  const monitorLactate = document.getElementById('monitorLactate');
  const monitorCVP = document.getElementById('monitorCVP');
  const monitorCO = document.getElementById('monitorCO');
  const monitorSepsisRisk = document.getElementById('monitorSepsisRisk');
  const monitorLeadTime = document.getElementById('monitorLeadTime');
  const monitorBundleText = document.getElementById('monitorBundleText');
  const monitorAlarmMsg = document.getElementById('monitorAlarmMsg');
  const monitorAlarmFooter = document.getElementById('monitorAlarmFooter');
  const heartBeatIcon = document.getElementById('heartBeatIcon');

  // Channel Tags
  const tagHRVal = document.getElementById('tagHRVal');
  const tagMAPVal = document.getElementById('tagMAPVal');
  const tagSpO2Val = document.getElementById('tagSpO2Val');
  const tagRespVal = document.getElementById('tagRespVal');

  // Badges
  const badgeHR = document.getElementById('badgeHR');
  const badgeABP = document.getElementById('badgeABP');
  const badgeSpO2 = document.getElementById('badgeSpO2');
  const badgeResp = document.getElementById('badgeResp');
  const badgeTemp = document.getElementById('badgeTemp');
  const badgeLactate = document.getElementById('badgeLactate');
  const badgeCVP = document.getElementById('badgeCVP');
  const badgeCDSS = document.getElementById('badgeCDSS');

  // Boxes
  const boxHR = document.getElementById('boxHR');
  const boxABP = document.getElementById('boxABP');
  const boxSpO2 = document.getElementById('boxSpO2');
  const boxResp = document.getElementById('boxResp');
  const boxTemp = document.getElementById('boxTemp');
  const boxLactate = document.getElementById('boxLactate');
  const boxCDSS = document.getElementById('boxCDSS');

  // Controls Toolbar
  const icuPatientSelect = document.getElementById('icuPatientSelect');
  const icuBolusSimBtn = document.getElementById('icuBolusSimBtn');
  const bolusBtnLabel = document.getElementById('bolusBtnLabel');
  const icuAudioToggle = document.getElementById('icuAudioToggle');
  const icuAudioIcon = document.getElementById('icuAudioIcon');
  const icuAudioText = document.getElementById('icuAudioText');
  const icuAlarmSilenceBtn = document.getElementById('icuAlarmSilenceBtn');
  const silenceBtnLabel = document.getElementById('silenceBtnLabel');

  function applyPatientToDOM(p) {
    if (monitorHR) monitorHR.textContent = p.hr;
    if (monitorABP) monitorABP.textContent = `${p.abpSys}/${p.abpDia}`;
    if (monitorMAP) monitorMAP.textContent = p.map;
    if (monitorSpO2) monitorSpO2.textContent = p.spo2;
    if (monitorResp) monitorResp.textContent = p.resp;
    if (monitorTemp) monitorTemp.textContent = p.temp;
    if (monitorLactate) monitorLactate.textContent = p.lactate;
    if (monitorCVP) monitorCVP.textContent = p.cvp;
    if (monitorCO) monitorCO.textContent = p.co;
    if (monitorSepsisRisk) monitorSepsisRisk.textContent = p.risk;
    if (monitorLeadTime) monitorLeadTime.textContent = p.leadTime;
    if (monitorBundleText) monitorBundleText.innerHTML = p.bundleText;
    if (monitorAlarmMsg) monitorAlarmMsg.textContent = p.alarmMsg;

    if (tagHRVal) tagHRVal.textContent = p.hr;
    if (tagMAPVal) tagMAPVal.textContent = p.map;
    if (tagSpO2Val) tagSpO2Val.textContent = p.spo2;
    if (tagRespVal) tagRespVal.textContent = p.resp;

    if (badgeHR) { badgeHR.textContent = p.hrBadge.text; badgeHR.className = `param-alarm-badge ${p.hrBadge.cls}`; }
    if (badgeABP) { badgeABP.textContent = p.abpBadge.text; badgeABP.className = `param-alarm-badge ${p.abpBadge.cls}`; }
    if (badgeSpO2) { badgeSpO2.textContent = p.spo2Badge.text; badgeSpO2.className = `param-alarm-badge ${p.spo2Badge.cls}`; }
    if (badgeResp) { badgeResp.textContent = p.respBadge.text; badgeResp.className = `param-alarm-badge ${p.respBadge.cls}`; }
    if (badgeTemp && p.tempBadge) { badgeTemp.textContent = p.tempBadge.text; badgeTemp.className = `param-alarm-badge ${p.tempBadge.cls}`; }
    if (badgeLactate && p.lactateBadge) { badgeLactate.textContent = p.lactateBadge.text; badgeLactate.className = `param-alarm-badge ${p.lactateBadge.cls}`; }
    if (badgeCVP) { badgeCVP.textContent = p.cvpBadge.text; badgeCVP.className = `param-alarm-badge ${p.cvpBadge.cls}`; }
    if (badgeCDSS) { badgeCDSS.textContent = p.cdssBadge.text; badgeCDSS.className = `param-alarm-badge ${p.cdssBadge.cls}`; }

    if (boxHR) boxHR.className = `icu-param-box ${p.boxClasses.boxHR || ''}`;
    if (boxABP) boxABP.className = `icu-param-box ${p.boxClasses.boxABP || ''}`;
    if (boxSpO2) boxSpO2.className = `icu-param-box ${p.boxClasses.boxSpO2 || ''}`;
    if (boxResp) boxResp.className = `icu-param-box ${p.boxClasses.boxResp || ''}`;
    if (boxTemp) boxTemp.className = `icu-param-box ${p.boxClasses.boxTemp || ''}`;
    if (boxLactate) boxLactate.className = `icu-param-box ${p.boxClasses.boxLactate || ''}`;

    if (monitorAlarmFooter) {
      if (p.status === 'STABLE') {
        monitorAlarmFooter.style.background = 'rgba(16, 185, 129, 0.12)';
        monitorAlarmFooter.style.borderColor = 'rgba(16, 185, 129, 0.35)';
        monitorAlarmFooter.style.color = '#6ee7b7';
      } else if (p.status === 'INTERMEDIATE') {
        monitorAlarmFooter.style.background = 'rgba(245, 158, 11, 0.12)';
        monitorAlarmFooter.style.borderColor = 'rgba(245, 158, 11, 0.35)';
        monitorAlarmFooter.style.color = '#fde68a';
      } else {
        monitorAlarmFooter.style.background = 'rgba(244, 63, 94, 0.12)';
        monitorAlarmFooter.style.borderColor = 'rgba(244, 63, 94, 0.35)';
        monitorAlarmFooter.style.color = '#fda4af';
      }
    }
  }

  // Patient Select Handler
  if (icuPatientSelect) {
    icuPatientSelect.addEventListener('change', (e) => {
      activePatientKey = e.target.value;
      activePatient = { ...ICU_PATIENTS[activePatientKey] };
      currentRateMult = activePatient.rateMult;
      isResuscitated = false;
      if (bolusBtnLabel) bolusBtnLabel.textContent = 'Simulate 30 mL/kg Bolus';
      if (icuBolusSimBtn) icuBolusSimBtn.classList.remove('active');
      applyPatientToDOM(activePatient);
      preFillWaveforms();
    });
  }

  // Counterfactual 30 mL/kg Fluid Bolus Resuscitation Simulation
  if (icuBolusSimBtn) {
    icuBolusSimBtn.addEventListener('click', () => {
      if (isBolusAnimating) return;

      if (isResuscitated) {
        // Reset to original patient baseline
        activePatient = { ...ICU_PATIENTS[activePatientKey] };
        currentRateMult = activePatient.rateMult;
        isResuscitated = false;
        icuBolusSimBtn.classList.remove('active');
        if (bolusBtnLabel) bolusBtnLabel.textContent = 'Simulate 30 mL/kg Bolus';
        applyPatientToDOM(activePatient);
        preFillWaveforms();
        return;
      }

      isBolusAnimating = true;
      icuBolusSimBtn.classList.add('active');
      if (bolusBtnLabel) bolusBtnLabel.textContent = 'Infusing 30 mL/kg IV Bolus...';

      const startHR = activePatient.hr;
      const targetHR = 82;
      const startMAP = activePatient.map;
      const targetMAP = 78;
      const startSys = activePatient.abpSys;
      const targetSys = 118;
      const startDia = activePatient.abpDia;
      const targetDia = 70;
      const startSpO2 = activePatient.spo2;
      const targetSpO2 = 98;
      const startResp = activePatient.resp;
      const targetResp = 16;
      const startLactate = parseFloat(activePatient.lactate);
      const targetLactate = 2.0;
      const startTemp = parseFloat(activePatient.temp);
      const targetTemp = 37.6;
      const startRisk = activePatient.riskNum;
      const targetRisk = 18.4;
      const startMult = currentRateMult;
      const targetMult = 1.15;

      const duration = 2400; // 2.4 seconds smooth transition
      const startTime = performance.now();

      function animateBolus(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1.0);
        const ease = 0.5 - Math.cos(progress * Math.PI) / 2; // Smooth cosine ease in-out

        activePatient.hr = Math.round(startHR + (targetHR - startHR) * ease);
        activePatient.map = Math.round(startMAP + (targetMAP - startMAP) * ease);
        activePatient.abpSys = Math.round(startSys + (targetSys - startSys) * ease);
        activePatient.abpDia = Math.round(startDia + (targetDia - startDia) * ease);
        activePatient.spo2 = Math.round(startSpO2 + (targetSpO2 - startSpO2) * ease);
        activePatient.resp = Math.round(startResp + (targetResp - startResp) * ease);
        activePatient.lactate = (startLactate + (targetLactate - startLactate) * ease).toFixed(1);
        activePatient.temp = (startTemp + (targetTemp - startTemp) * ease).toFixed(1);
        const curRisk = (startRisk + (targetRisk - startRisk) * ease).toFixed(1);
        activePatient.risk = `${curRisk}%`;
        currentRateMult = startMult + (targetMult - startMult) * ease;

        if (progress >= 0.7) {
          activePatient.hrBadge = { text: 'NORM', cls: 'alarm-norm' };
          activePatient.abpBadge = { text: 'RESTORED', cls: 'alarm-norm' };
          activePatient.spo2Badge = { text: 'OPTIMAL', cls: 'alarm-norm' };
          activePatient.respBadge = { text: 'NORMAL', cls: 'alarm-norm' };
          activePatient.tempBadge = { text: 'NORM', cls: 'alarm-norm' };
          activePatient.lactateBadge = { text: 'CLEARING', cls: 'alarm-norm' };
          activePatient.cdssBadge = { text: 'STABILIZED', cls: 'alarm-norm' };
          activePatient.leadTime = 'Hemodynamic Shock Averted';
          activePatient.bundleText = '<strong style="color:#10b981;">RESUSCITATION TARGET ACHIEVED:</strong> MAP restored &ge;65 mmHg (78 mmHg), lactate clearance initiated (2.0 mmol/L), cardiac output normalized.';
          activePatient.alarmMsg = 'SIMULATION SUCCESS: Bed 14 (PAT-1033) hemodynamically stabilized post-30 mL/kg crystalloid bolus • Refractory shock reversed.';
          activePatient.boxClasses = { boxHR: '', boxABP: '', boxSpO2: '', boxResp: '', boxTemp: '', boxLactate: '' };
        }

        applyPatientToDOM(activePatient);

        if (progress < 1.0) {
          requestAnimationFrame(animateBolus);
        } else {
          isBolusAnimating = false;
          isResuscitated = true;
          if (bolusBtnLabel) bolusBtnLabel.textContent = 'Bolus Active (Click to Reset)';
        }
      }

      requestAnimationFrame(animateBolus);
    });
  }

  // Audio Beep Toggle
  if (icuAudioToggle) {
    icuAudioToggle.addEventListener('click', () => {
      audioBeepEnabled = !audioBeepEnabled;
      if (audioBeepEnabled) {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === 'suspended') audioCtx.resume();
        icuAudioToggle.classList.add('active');
        if (icuAudioText) icuAudioText.textContent = 'QRS Beep: ON';
        if (icuAudioIcon) icuAudioIcon.setAttribute('data-lucide', 'volume-2');
        playQrsBeep();
      } else {
        icuAudioToggle.classList.remove('active');
        if (icuAudioText) icuAudioText.textContent = 'Audio: Muted';
        if (icuAudioIcon) icuAudioIcon.setAttribute('data-lucide', 'volume-x');
      }
      if (window.lucide) window.lucide.createIcons();
    });
  }

  // Alarm Silence Handler
  let silenceTimer = null;
  if (icuAlarmSilenceBtn) {
    icuAlarmSilenceBtn.addEventListener('click', () => {
      icuAlarmSilenceBtn.classList.add('active');
      if (silenceBtnLabel) silenceBtnLabel.textContent = 'Silenced (120s)';
      if (monitorAlarmFooter) monitorAlarmFooter.style.opacity = '0.45';

      if (silenceTimer) clearTimeout(silenceTimer);
      silenceTimer = setTimeout(() => {
        icuAlarmSilenceBtn.classList.remove('active');
        if (silenceBtnLabel) silenceBtnLabel.textContent = 'Silence';
        if (monitorAlarmFooter) monitorAlarmFooter.style.opacity = '1.0';
      }, 120000);
    });
  }

  // 4-Channel Sweeping Waveform Canvas Engine
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let sweepX = 0;
    const sweepSpeed = 3.4; // pixels per frame

    // Physiological Waveform Generators
    function getECG(t) {
      const cycle = t % 1.0;
      let y = 0;
      if (cycle > 0.10 && cycle < 0.20) y += 0.16 * Math.sin((cycle - 0.10) * Math.PI / 0.10);
      if (cycle >= 0.22 && cycle < 0.25) y -= 0.22 * Math.sin((cycle - 0.22) * Math.PI / 0.03);
      if (cycle >= 0.25 && cycle < 0.29) y += 1.05 * Math.sin((cycle - 0.25) * Math.PI / 0.04);
      if (cycle >= 0.29 && cycle < 0.33) y -= 0.35 * Math.sin((cycle - 0.29) * Math.PI / 0.04);
      if (cycle > 0.44 && cycle < 0.66) y += 0.28 * Math.sin((cycle - 0.44) * Math.PI / 0.22);
      return y;
    }

    function getABP(t) {
      const cycle = t % 1.0;
      if (cycle < 0.24) {
        return Math.sin(cycle / 0.24 * (Math.PI / 2));
      } else if (cycle < 0.38) {
        return 1.0 - (cycle - 0.24) / 0.14 * 0.42;
      } else if (cycle < 0.48) {
        return 0.58 + 0.12 * Math.sin((cycle - 0.38) / 0.10 * Math.PI);
      } else {
        return 0.65 * Math.exp(-(cycle - 0.48) * 3.6);
      }
    }

    function getSpO2(t) {
      const cycle = t % 1.0;
      if (cycle < 0.28) {
        return Math.sin(cycle / 0.28 * (Math.PI / 2));
      } else {
        return Math.cos((cycle - 0.28) / 0.72 * (Math.PI / 2));
      }
    }

    function getRESP(t) {
      return Math.sin(t * 0.35 * Math.PI * 2);
    }

    // Pre-populate full canvas screen with continuous waveforms from edge to edge
    preFillWaveforms = function() {
      if (!width || !height) return;
      ctx.fillStyle = '#01040a';
      ctx.fillRect(0, 0, width, height);

      // Faint physiological monitor grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let y = 20; y < height; y += 20) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      const ecgBase = height * 0.13;
      const abpBase = height * 0.38;
      const spo2Base = height * 0.63;
      const respBase = height * 0.87;

      let localSim = 0;
      let localResp = 0;
      const step = 2;

      for (let x = 0; x < width; x += step) {
        const nextX = Math.min(x + step, width);
        const dt = (step / sweepSpeed) * 0.016;
        const nextSim = localSim + dt * currentRateMult;
        const nextResp = localResp + dt * (activePatient.resp / 20);

        // ECG Channel
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        ctx.moveTo(x, ecgBase - getECG(localSim) * (height * 0.08));
        ctx.lineTo(nextX, ecgBase - getECG(nextSim) * (height * 0.08));
        ctx.stroke();

        // ABP Channel
        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(x, abpBase - getABP(localSim + 0.11) * (height * 0.085));
        ctx.lineTo(nextX, abpBase - getABP(nextSim + 0.11) * (height * 0.085));
        ctx.stroke();

        // SpO2 Channel
        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(x, spo2Base - getSpO2(localSim + 0.22) * (height * 0.065));
        ctx.lineTo(nextX, spo2Base - getSpO2(nextSim + 0.22) * (height * 0.065));
        ctx.stroke();

        // RESP Channel
        ctx.strokeStyle = '#eab308';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(x, respBase - getRESP(localResp) * (height * 0.05));
        ctx.lineTo(nextX, respBase - getRESP(nextResp) * (height * 0.05));
        ctx.stroke();

        localSim = nextSim;
        localResp = nextResp;
      }
    };

    function resizeCanvas() {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      preFillWaveforms();
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let lastTime = performance.now();
    let simTime = 0;
    let respSimTime = 0;
    let lastQrsBeatCycle = 0;

    let prevEcgY = height * 0.13;
    let prevAbpY = height * 0.38;
    let prevSpo2Y = height * 0.63;
    let prevRespY = height * 0.87;

    function renderWaveforms(currentTime) {
      const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;
      simTime += dt * currentRateMult;
      respSimTime += dt * (activePatient.resp / 20);

      // Detect QRS R-wave peak for sound & visual pulse
      const currentCycle = simTime % 1.0;
      if (currentCycle >= 0.25 && currentCycle < 0.29 && lastQrsBeatCycle < 0.25) {
        playQrsBeep();
        if (heartBeatIcon) {
          heartBeatIcon.classList.add('beat');
          setTimeout(() => { if (heartBeatIcon) heartBeatIcon.classList.remove('beat'); }, 110);
        }
      }
      lastQrsBeatCycle = currentCycle;

      // 1. Clear erase band ahead of sweep cursor
      ctx.fillStyle = '#01040a';
      ctx.fillRect(sweepX, 0, 24, height);

      // Faint physiological monitor calibration grid dots
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let y = 20; y < height; y += 20) {
        ctx.moveTo(sweepX, y);
        ctx.lineTo(sweepX + sweepSpeed, y);
      }
      ctx.stroke();

      const prevX = (sweepX - sweepSpeed + width) % width;

      // Dynamic channel baseline coordinates distributed across height (~410px)
      const ecgBaseline = height * 0.13;
      const abpBaseline = height * 0.38;
      const spo2Baseline = height * 0.63;
      const respBaseline = height * 0.87;

      const currentEcgY = ecgBaseline - getECG(simTime) * (height * 0.08);
      const currentAbpY = abpBaseline - getABP(simTime + 0.11) * (height * 0.085);
      const currentSpo2Y = spo2Baseline - getSpO2(simTime + 0.22) * (height * 0.065);
      const currentRespY = respBaseline - getRESP(respSimTime) * (height * 0.05);

      if (sweepX > prevX) {
        // Channel 1: ECG Lead II (Vibrant Emerald #10b981)
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2.0;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(prevX, prevEcgY);
        ctx.lineTo(sweepX, currentEcgY);
        ctx.stroke();

        // Channel 2: Arterial Blood Pressure Line (Vibrant Coral/Red #f43f5e)
        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 1.8;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(prevX, prevAbpY);
        ctx.lineTo(sweepX, currentAbpY);
        ctx.stroke();

        // Channel 3: SpO2 Plethysmograph (Cyan #06b6d4)
        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 1.8;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(prevX, prevSpo2Y);
        ctx.lineTo(sweepX, currentSpo2Y);
        ctx.stroke();

        // Channel 4: Thoracic Impedance Respiration (Amber/Yellow #eab308)
        ctx.strokeStyle = '#eab308';
        ctx.lineWidth = 1.6;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(prevX, prevRespY);
        ctx.lineTo(sweepX, currentRespY);
        ctx.stroke();

        // Phosphorescent Sweeping Beam Head (trailing glowing phosphor)
        const beamGrad = ctx.createLinearGradient(sweepX - 10, 0, sweepX, 0);
        beamGrad.addColorStop(0, 'rgba(16, 185, 129, 0)');
        beamGrad.addColorStop(1, 'rgba(52, 211, 153, 0.35)');
        ctx.fillStyle = beamGrad;
        ctx.fillRect(sweepX - 10, 0, 10, height);

        ctx.fillStyle = '#a7f3d0';
        ctx.fillRect(sweepX, 0, 2, height);
      }

      prevEcgY = currentEcgY;
      prevAbpY = currentAbpY;
      prevSpo2Y = currentSpo2Y;
      prevRespY = currentRespY;

      sweepX = (sweepX + sweepSpeed) % width;
      requestAnimationFrame(renderWaveforms);
    }

    requestAnimationFrame(renderWaveforms);
  }
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
      setTimeout(() => appendLog('success', 'CSSP Adaptation Complete in 4 local epochs! Node 2 AUROC restored to 0.7821. Edge WAN bandwidth payload saved: 38.0% (CSSP Freeze).'), 1700);
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
            label: 'FPDAF-v2 Proposed (AUROC: 0.7923 [0.7686–0.8170])',
            data: [0.0, 0.32, 0.52, 0.67, 0.78, 0.85, 0.90, 0.93, 0.96, 0.98, 0.99, 1.0],
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.12)',
            fill: true,
            tension: 0.3,
            borderWidth: 3,
            pointRadius: 4,
            pointBackgroundColor: '#10b981'
          },
          {
            label: 'Centralized BiLSTM (AUROC: 0.8058)',
            data: [0.0, 0.34, 0.54, 0.69, 0.79, 0.86, 0.91, 0.94, 0.96, 0.98, 0.99, 1.0],
            borderColor: '#f59e0b',
            borderDash: [5, 5],
            tension: 0.3,
            borderWidth: 2,
            pointRadius: 0
          },
          {
            label: 'Ditto Personalized FL (AUROC: 0.7989)',
            data: [0.0, 0.31, 0.51, 0.66, 0.77, 0.85, 0.90, 0.93, 0.96, 0.98, 0.99, 1.0],
            borderColor: '#f43f5e',
            tension: 0.3,
            borderWidth: 2,
            pointRadius: 0
          },
          {
            label: 'FedProx Baseline (AUROC: 0.7910)',
            data: [0.0, 0.30, 0.50, 0.65, 0.76, 0.84, 0.89, 0.93, 0.95, 0.97, 0.99, 1.0],
            borderColor: '#a855f7',
            tension: 0.3,
            borderWidth: 2,
            pointRadius: 0
          },
          {
            label: 'Standard FedAvg (AUROC: 0.7883)',
            data: [0.0, 0.29, 0.49, 0.64, 0.75, 0.83, 0.88, 0.92, 0.95, 0.97, 0.99, 1.0],
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
  const dictMatchCount = document.getElementById('dictMatchCount');

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

    if (dictMatchCount) {
      dictMatchCount.textContent = `Showing ${filtered.length} of ${cohortBiomarkers.length} biomarkers`;
    }

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

  // Gallery Category Filtering (14 Screens Portfolio)
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryCards = document.querySelectorAll('.screen-thumb-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      galleryCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Screen Thumb Card Click to Open Full Lightbox
  galleryCards.forEach(card => {
    card.addEventListener('click', (e) => {
      // If the target was already the img itself, its click listener handles it
      if (e.target.tagName.toLowerCase() === 'img') return;
      const img = card.querySelector('img');
      const lightboxModal = document.getElementById('imageLightbox');
      const lightboxImg = document.getElementById('lightboxImg');
      const lightboxCaption = document.getElementById('lightboxCaption');
      if (img && lightboxModal && lightboxImg) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt || 'Medical Center CDSS Workstation';
        if (lightboxCaption) {
          lightboxCaption.textContent = img.alt || '';
        }
        lightboxModal.classList.add('open');
      }
    });
  });



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
    { label: 'Jump to Overview & Physiological Vitals Profile', tag: 'Section', action: () => scrollToSection('#overview') },
    { label: 'Jump to Clinical Urgency & Problem Statement', tag: 'Section', action: () => scrollToSection('#problem') },
    { label: 'Jump to 3 Architectural Inventions (AD-CUSUM Drift, DDP-ERP, CSSP)', tag: 'Section', action: () => scrollToSection('#inventions') },
    { label: 'Jump to Three Pillars of Clinical XAI (Temporal, Attribution, Recourse)', tag: 'Section', action: () => scrollToSection('#xai') },
    { label: 'Jump to 6-Way Benchmark Suite & Empirical Validation Curves', tag: 'Section', action: () => scrollToSection('#benchmarks') },
    { label: 'Jump to Patent Disclosure & 15 Legal Claims (IPO Form 2)', tag: 'Section', action: () => scrollToSection('#patent') },
    { label: 'Jump to 40-Biomarker Cohort Data Dictionary', tag: 'Section', action: () => scrollToSection('#cohort') },
    { label: 'Jump to REST API Developer Console', tag: 'Section', action: () => scrollToSection('#api') },
    { label: 'Jump to Clinical Documentation & Portals Portfolio', tag: 'Section', action: () => scrollToSection('#portals') },
    { label: 'Jump to Scholarly Publications & Deliverables', tag: 'Section', action: () => scrollToSection('#publications') },
    { label: 'Jump to Team G028 & Faculty Mentors', tag: 'Section', action: () => scrollToSection('#team') },
    { label: 'Read JMIR Medical Informatics Paper (Full Manuscript PDF)', tag: 'PDF', action: () => openPdfViewer('docs/FPDAF_JMIR_Journal_Paper.pdf', 'JMIR Medical Informatics Paper') },
    { label: 'Read Patent Specification (15 Claims, IPO Form 2 Draft)', tag: 'PDF', action: () => openPdfViewer('docs/Patent_Disclosure_Draft_FPDAF.pdf', 'Patent Disclosure Draft') },
    { label: 'Read Project Documentation Dossier (100+ Pages)', tag: 'PDF', action: () => openPdfViewer('docs/Project_Documentation_Dossier.pdf', 'Project Documentation Dossier') }
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
      const lb = document.getElementById('imageLightbox');
      if (lb) lb.classList.remove('open');
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
