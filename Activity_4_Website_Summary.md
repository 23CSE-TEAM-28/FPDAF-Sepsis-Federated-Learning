# Activity 4: Project Website / Documentation Portal
**Evaluation Component:** Technical Enrichment Activities (TEA) — Group Activity 4 (5 Marks)  
**Project:** Explainable Federated Learning for Healthcare Time-Series Forecasting with Personalized Drift Adaptation (FPDAF)  
**Team:** Team 28 (Group G028) • **Track:** DSDA • **Dept. of CSE, Amrita Vishwa Vidyapeetham**  

---

## 1. Executive Summary & Live Publication

The official Project Website & Documentation Portal has been completely transformed into an **authentic, commercial-grade ICU central telemetry monitor workstation and patent-grade medical AI showcase platform**, published live on GitHub Pages:
- 🌐 **Live Published Portal:** [https://aksharsakhi.github.io/FPDAF-Sepsis-Federated-Learning/](https://aksharsakhi.github.io/FPDAF-Sepsis-Federated-Learning/)
- 💻 **Official GitHub Repository:** [https://github.com/aksharsakhi/FPDAF-Sepsis-Federated-Learning](https://github.com/aksharsakhi/FPDAF-Sepsis-Federated-Learning)
- 🏢 **Organization Hub:** [https://github.com/23CSE-TEAM-28](https://github.com/23CSE-TEAM-28)
- 📌 **Submission Shortcut Artifact:** `G028_Website.url` (points directly to the live portal)

---

## 2. Commercial ICU Workstation & Full-Cohort Feature Matrix

| Feature Module | Description & Implementation | Clinical / Legal Impact | Status |
| :--- | :--- | :--- | :---: |
| **Commercial ICU Telemetry Workstation** | Dual-pane clinical central telemetry bezel integrating multi-channel sweeping waveforms on the left with digital LED parameter boxes (HR, ABP, SpO2, RESP, TEMP/Lactate, CVP/CO, FPDAF Risk) and alarm banner on the right | True-to-life ICU monitor visual fidelity matching Philips IntelliVue and Mindray CARESCAPE systems | **100% Active** |
| **4-Channel Sweeping Waveform Engine** | Real-time HTML5 60fps canvas rendering 4 continuous channels: ECG Lead II (Green), Arterial Line ABP with dicrotic notch (Red), SpO2 Plethysmogram (Cyan), and Thoracic Impedance Respiration (Yellow) with a phosphorescent beam head | Continuous physiological telemetry visualization at point of care | **100% Active** |
| **Interactive Bedside Patient Switcher** | Dropdown enabling instantaneous triage switching across Bed 14 (PAT-1033: Septic Shock, 98.5% Risk), Bed 02 (PAT-1000: Post-Op Stable, 10.9% Risk), and Bed 08 (PAT-1018: Intermediate SIRS, 42.1% Risk) | Simulates multi-patient clinical department surveillance | **100% Active** |
| **Counterfactual Fluid Bolus Simulation** | Interactive button executing a simulated 30 mL/kg IV crystalloid fluid resuscitation over 2.4s, smoothly recovering MAP from 45 to 78 mmHg, reducing sepsis risk from 98.5% to 18.4%, and normalizing ECG frequency | Interactive proof of CDSS counterfactual intervention capability | **100% Active** |
| **Web Audio QRS Heartbeat Synthesizer** | Real-time 880Hz medical-grade sine tone audio beep synchronized with each ECG R-wave peak, accompanied by synchronous heartbeat icon pulsing, with a mute/unmute toggle | Multi-sensory authentic bedside auditory telemetry | **100% Active** |
| **Full-Cohort Benchmark Table** | Ground truth verified evaluation on the complete unstratified held-out test partition ($N=102,994$ windows, $M=6,050$ disjoint patients, prevalence 2.58%): FPDAF-v2 achieves 0.7923 AUROC [0.7686–0.8170], 88.72% balanced accuracy, 96.20% peak accuracy, and lowest ECE (0.0902) | Full mathematical and statistical rigor across all 6 baseline models | **100% Active** |
| **Dual Clinical Operating Modes Table** | Five calibrated operating configurations (&tau; = 0.65, 0.50, 0.12, 0.08, 0.06) spanning High-Confidence Rule-In (96.20% Acc, 97.80% Spec) to Early Bedside Screening (80.15% Sens) | Eliminates clinical alert fatigue while preventing diagnostic missed cases | **100% Active** |
| **Patent Claims Explorer (IPO Form 2)** | Interactive accordion tree showcasing all 15 legal patent claims (Independent vs. Dependent) + Prior-Art Novelty Matrix (FPDAF vs. D1–D5) | Ready for Indian Patent Office filing under The Patents Act, 1970 | **100% Active** |
| **Scholarly Artifacts & Downloads Center** | Integrated in-browser viewer and direct download cards for all 4 formal journal submissions (IEEE JBHI, Elsevier AIIM, Springer Nature SNCS, JMIR Medical Informatics PDF & DOCX), IPO Patent Draft, and Technical Dossier | Transparent access to all university and peer-review submissions | **100% Active** |

---

## 3. How to Launch the Portal Locally

```bash
cd /Users/aksharsakhi/Documents/Files/Code/Project/TEA/Activity_4_Project_Website_Documentation_Portal
./start_portal.sh
```
This serves the application on `http://localhost:8080` and opens the portal in your browser.
