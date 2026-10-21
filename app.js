/**
 * FPDAF Project Showcase Portal — Interactive Application Logic
 * Clinical Decision Support System & Research Demonstration
 * Group G028 | Track: DSDA | Amrita Vishwa Vidyapeetham
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // 2. Configure & Trigger KaTeX Auto-Render for Inline & Block Math
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

  // 3. Sticky Navbar & Active Scrollspy
  const navbar = document.getElementById('topNavbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    // Add glass background depth on scroll
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Scrollspy section highlighting
    let currentSectionId = '';
    const scrollPos = window.scrollY + 160;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentSectionId = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (currentSectionId && link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });

  // Smooth scroll for nav anchor links
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const targetId = link.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          const navHeight = navbar ? navbar.offsetHeight : 70;
          const targetPosition = targetElement.offsetTop - navHeight + 10;
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // 4. Animated Metric Counters on Scroll
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
      const duration = 1800; // ms
      const startTime = performance.now();

      function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease-out cubic
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
  }, { threshold: 0.3 });

  const metricsGrid = document.querySelector('.metrics-grid');
  if (metricsGrid) {
    metricsObserver.observe(metricsGrid);
  }

  // 5. Inventions Tab Switching
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
        // Re-render math inside active tab if KaTeX loaded
        if (window.renderMathInElement) {
          window.renderMathInElement(targetPane, {
            delimiters: [
              { left: '$$', right: '$$', display: true },
              { left: '$', right: '$', display: false }
            ],
            throwOnError: false
          });
        }
        if (window.lucide) {
          window.lucide.createIcons();
        }
      }
    });
  });

  // 6. CDSS Portals View Switching
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
      if (targetView) {
        targetView.classList.add('active');
      }
    });
  });

  // 7. Interactive Bedside Counterfactual Recourse Simulator
  const sliderMAP = document.getElementById('sliderMAP');
  const sliderHR = document.getElementById('sliderHR');
  const sliderLactate = document.getElementById('sliderLactate');
  const sliderWBC = document.getElementById('sliderWBC');

  const valMAP = document.getElementById('valMAP');
  const valHR = document.getElementById('valHR');
  const valLactate = document.getElementById('valLactate');
  const valWBC = document.getElementById('valWBC');

  const gaugePath = document.getElementById('gaugePath');
  const gaugePercentage = document.getElementById('gaugePercentage');
  const gaugeStatus = document.getElementById('gaugeStatus');
  const sscAlertBox = document.getElementById('sscAlertBox');

  const presetDeterioration = document.getElementById('presetDeterioration');
  const presetResuscitation = document.getElementById('presetResuscitation');

  // Grounded clinical scoring model (calibrated to MIMIC/PhysioNet cohort behavior)
  function computeSepsisRisk(map, hr, lactate, wbc) {
    let z = -3.4;

    // MAP: Normal 70-105 mmHg. Drop below 65 is acute septic shock threshold
    if (map < 65) {
      z += (65 - map) * 0.088;
    } else if (map < 72) {
      z += (72 - map) * 0.035;
    }

    // HR: Normal 60-90 bpm. SIRS tachycardia > 90 bpm
    if (hr > 90) {
      z += (hr - 90) * 0.046;
    }

    // Serum Lactate: Normal 0.5-1.8 mmol/L. Severe tissue hypoperfusion > 2.0, shock > 4.0
    if (lactate > 1.8) {
      z += (lactate - 1.8) * 0.98;
    }

    // WBC: Normal 4.5-11.0. SIRS leukocytosis > 12.0 k/uL or leukopenia < 4.0 k/uL
    if (wbc > 11.5) {
      z += (wbc - 11.5) * 0.078;
    } else if (wbc < 4.0) {
      z += (4.0 - wbc) * 0.16;
    }

    const probability = 1 / (1 + Math.exp(-z));
    // Bound risk percentage between 5% and 99%
    return Math.min(99.0, Math.max(5.0, probability * 100));
  }

  function updateSimulator() {
    if (!sliderMAP || !sliderHR || !sliderLactate || !sliderWBC) return;

    const map = parseFloat(sliderMAP.value);
    const hr = parseFloat(sliderHR.value);
    const lactate = parseFloat(sliderLactate.value);
    const wbc = parseFloat(sliderWBC.value);

    // Update label displays
    if (valMAP) valMAP.textContent = `${map.toFixed(0)} mmHg`;
    if (valHR) valHR.textContent = `${hr.toFixed(0)} bpm`;
    if (valLactate) valLactate.textContent = `${lactate.toFixed(1)} mmol/L`;
    if (valWBC) valWBC.textContent = `${wbc.toFixed(1)} k/μL`;

    const risk = computeSepsisRisk(map, hr, lactate, wbc);

    // Update SVG semi-circle gauge (circumference of arc is 251.2)
    if (gaugePath) {
      const arcLength = 251.2;
      const offset = arcLength * (1 - (risk / 100));
      gaugePath.style.strokeDashoffset = offset.toFixed(1);
    }

    if (gaugePercentage) {
      gaugePercentage.textContent = `${Math.round(risk)}%`;
    }

    // Update risk badge & colors
    if (gaugeStatus) {
      gaugeStatus.classList.remove('badge-critical', 'badge-warning', 'badge-stable');
      if (risk >= 65) {
        gaugeStatus.textContent = 'CRITICAL RISK';
        gaugeStatus.classList.add('badge-critical');
      } else if (risk >= 32) {
        gaugeStatus.textContent = 'MODERATE RISK';
        gaugeStatus.classList.add('badge-warning');
      } else {
        gaugeStatus.textContent = 'STABLE / LOW RISK';
        gaugeStatus.classList.add('badge-stable');
      }
    }

    // Update Surviving Sepsis Campaign (SSC) Alert visibility
    if (sscAlertBox) {
      if (risk >= 55 || map < 65 || lactate > 2.0) {
        sscAlertBox.style.display = 'block';
      } else {
        sscAlertBox.style.display = 'none';
      }
    }
  }

  // Attach input listeners
  [sliderMAP, sliderHR, sliderLactate, sliderWBC].forEach(slider => {
    if (slider) {
      slider.addEventListener('input', updateSimulator);
    }
  });

  // Preset Button 1: Septic Crisis
  if (presetDeterioration) {
    presetDeterioration.addEventListener('click', () => {
      animateSliderTo(sliderMAP, 54);
      animateSliderTo(sliderHR, 128);
      animateSliderTo(sliderLactate, 4.2);
      animateSliderTo(sliderWBC, 18.2);
      showToast('Simulating Acute Septic Shock Crisis (MAP: 54, HR: 128, Lactate: 4.2)');
    });
  }

  // Preset Button 2: Crystalloid Fluid Resuscitation
  if (presetResuscitation) {
    presetResuscitation.addEventListener('click', () => {
      animateSliderTo(sliderMAP, 78);
      animateSliderTo(sliderHR, 82);
      animateSliderTo(sliderLactate, 1.4);
      animateSliderTo(sliderWBC, 9.8);
      showToast('Applied 30 mL/kg Crystalloid Resuscitation — Hemodynamics Stabilized');
    });
  }

  // Smooth slider transition animation
  function animateSliderTo(slider, targetVal) {
    if (!slider) return;
    const startVal = parseFloat(slider.value);
    const stepDiff = targetVal - startVal;
    const duration = 400; // ms
    const startTime = performance.now();

    function step(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      slider.value = startVal + stepDiff * easeProgress;
      updateSimulator();

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        slider.value = targetVal;
        updateSimulator();
      }
    }

    requestAnimationFrame(step);
  }

  // Initial simulator run
  updateSimulator();

  // 8. Video Player & Interactive Chapter Navigation
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
        showToast(`Jumped to chapter: ${btn.textContent.trim()}`);
      }
    });
  });

  if (demoVideo) {
    demoVideo.addEventListener('timeupdate', () => {
      const current = demoVideo.currentTime;
      let activeIndex = 0;
      chapterButtons.forEach((btn, index) => {
        const time = parseFloat(btn.dataset.time);
        if (current >= time) {
          activeIndex = index;
        }
      });
      chapterButtons.forEach((b, i) => {
        if (i === activeIndex) {
          b.classList.add('active');
        } else {
          b.classList.remove('active');
        }
      });
    });
  }

  // 9. BibTeX Citation Copy to Clipboard
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

  // 10. Image Lightbox Modal Preview
  const lightboxModal = document.getElementById('imageLightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');

  // Mark all diagrams and charts as clickable
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

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && lightboxModal && lightboxModal.classList.contains('open')) {
      lightboxModal.classList.remove('open');
    }
  });

  // 11. Toast Notification Helper
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
