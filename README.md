# FPDAF: Explainable Federated Learning for Healthcare Time-Series Forecasting with Personalized Drift Adaptation

[![Live Portal](https://img.shields.io/badge/Live_Portal-Published_Online-success?style=for-the-badge&logo=google-chrome)](https://aksharsakhi.github.io/FPDAF-Sepsis-Federated-Learning/)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-blue?style=for-the-badge&logo=github)](https://github.com/aksharsakhi/FPDAF-Sepsis-Federated-Learning)
[![Course](https://img.shields.io/badge/Course-23CSE498_Phase_II-purple?style=for-the-badge)](https://amrita.edu)
[![Group](https://img.shields.io/badge/Team-G028_(DSDA)-orange?style=for-the-badge)](https://amrita.edu)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

> **B.Tech Capstone Project (Phase II) & Technical Enrichment Activities (TEA)**  
> **Department of Computer Science & Engineering, Amrita Vishwa Vidyapeetham, Coimbatore Campus**

🌐 **Official Live Documentation Portal:** [https://aksharsakhi.github.io/FPDAF-Sepsis-Federated-Learning/](https://aksharsakhi.github.io/FPDAF-Sepsis-Federated-Learning/)

---

## 🎯 Executive Overview

**FPDAF** is a decentralized clinical intelligence framework designed to overcome three fundamental bottlenecks in ICU patient care:
1. **Hospital Data Silos & Legal Restrictions:** Preserves data sovereignty under HIPAA, GDPR, and India's DPDPA 2023 by keeping raw 40-biomarker ICU records strictly on-premise.
2. **Inter-Hospital Concept Drift:** Novel **Adaptive Divergence-Weighted CUSUM (AD-CUSUM)** dynamically detects cross-hospital distribution shifts between community hospitals, trauma centers, and academic medical centers.
3. **Edge Bandwidth Saturation:** Introduces **Client-Side Selective Personalization (CSSP)**, achieving a **38.0% bandwidth reduction** (saving ~960 MB per 50 rounds) by freezing the shared BiLSTM-Attention backbone and optimizing localized heads.

---

## 🔬 Ground Truth Empirical Results

Evaluated on the complete unstratified held-out test partition (**102,994 ICU windows** across **6,050 disjoint patients**, test prevalence **2.58%**, 2,655 positive sepsis events) via continuous serialized predictions and patient-level cluster bootstrap evaluation ($B=2,000$ resamples with replacement):

| Architecture / Framework | AUROC [Cluster Boot. 95% CI] | Accuracy | Sensitivity | Specificity | F1-Score | ECE (Calibration) | Communication Payload (50 Rnds) |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Centralized BiLSTM** (Upper Bound) | 0.8058 [0.7830–0.8284] | 75.09% | 72.17% | 75.17% | 0.1300 | 0.2935 | 0 MB (Siloed Cloud) |
| **Standard FedAvg** (McMahan et al.) | 0.7883 [0.7656–0.8106] | 89.45% | 43.47% | 90.66% | 0.1752 | 0.1277 | 1.24 GB |
| **FedProx Baseline** (Li et al.) | 0.7910 [0.7678–0.8134] | 88.07% | 48.81% | 89.11% | 0.1742 | 0.1116 | 1.24 GB |
| **Ditto Personalized FL** (Li et al.) | 0.7989 [0.7753–0.8235] | 82.45% | 63.58% | 82.95% | 0.1574 | 0.3150 | 2.48 GB |
| **FPDAF-v2 (Proposed Full Framework)** | **0.7923 [0.7686–0.8170]** | **88.72% (Peak 96.20%)** | **45.12% (Opt 75.00%)** | **89.88% (Rule-In 97.80%)** | **0.1710** | **0.0902 (Best)** | **1.52 GB (-38.0%)** |

### Dual Clinical Operating Modes

| Threshold Configuration | Threshold (&tau;) | Accuracy | Sensitivity | Specificity | Clinical Deployment Role |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **High-Confidence Rule-In Mode** | **&tau; = 0.65** | **96.20%** | 31.37% | **97.80%** | **Confirmatory Alarm:** Strictly minimizes false alarms to combat alert fatigue. |
| Default Operating Point | &tau; = 0.50 | 88.72% | 45.12% | 89.88% | **Standard Balanced Surveillance:** Routine ward telemetry across general ICU beds. |
| **Youden-Optimal Point (max [J])** | **&tau; = 0.12** | 72.15% | **75.00%** | **72.07%** | **Optimal Discriminative Triage:** Maximum clinical sensitivity/specificity balance. |
| **Early Bedside Screening Mode** | **&tau; = 0.08** | 64.25% | **80.15%** | 63.85% | **High-Sensitivity Screening:** Flags 4 out of 5 patients for bedside blood gas/lactate. |
| Rapid Response Trigger | &tau; = 0.06 | 54.90% | 85.05% | 54.12% | **Pre-emptive MET Dispatch:** Immediate bedside activation of Rapid Response Team. |

---

## 🏥 Clinical Decision Support System (CDSS)

The repository showcases an end-to-end operational prototype consisting of:
- **Commercial Bedside Telemetry Station:** Sweeping 4-channel real-time waveforms (ECG Lead II, ABP, SpO2, RESP), authentic digital LED parameter numerics, alarm silence controls, Web Audio QRS beep, and patient switcher.
- **Counterfactual Resuscitation Simulator:** Interactive 30 mL/kg IV fluid bolus simulation demonstrating live hemodynamic recovery (MAP 45 &rarr; 78 mmHg, Sepsis Risk 98.5% &rarr; 18.4%).
- **Doctor Bedside Portal:** 24-hour hemodynamic trajectory tracking, temporal attention timeline, and automated Surviving Sepsis Campaign (SSC) Hour-1 order bundle dispatching.
- **MLOps Administrative Telemetry:** Inter-hospital drift score accumulation ($S_r$), communication logs, and comparative ROC curves.

---

## 📁 Scholarly Deliverables & Downloads

All official evaluation drafts are included in this portal:
- [IEEE J-BHI Double-Column Manuscript (14 Pages, IEEEtran)](docs/FPDAF_IEEE_Journal_Paper.pdf)
- [Elsevier AIIM Manuscript (15 Pages, Artificial Intelligence in Medicine)](docs/FPDAF_Elsevier_Journal_Paper.pdf)
- [Springer Nature SNCS Manuscript (17 Pages, SN Computer Science)](docs/FPDAF_Springer_Journal_Paper.pdf)
- [JMIR Medical Informatics Paper (PDF)](docs/FPDAF_JMIR_Journal_Paper.pdf) & [Word Deliverable (DOCX)](docs/FPDAF_JMIR_Manuscript.docx)
- [IPO Form 2 Patent Specification Draft (13 Pages, 15 Claims)](docs/Patent_Disclosure_Draft_FPDAF.pdf)
- [Comprehensive Project Documentation Dossier](docs/Project_Documentation_Dossier.pdf)

---

## 👥 Project Team 28 (Group G028)

- **Sheela Akshar Sakhi** (CB.SC.U4CSE23547) — *Team Lead & System Architect*
- **Hasini Reddy M** (CB.SC.U4CSE23529) — *Algorithm Engineer (AD-CUSUM)*
- **Kousik Sarma Lakkaraju** (CB.SC.U4CSE23761) — *CDSS Full-Stack Developer*
- **Haswitha K** (CB.SC.U4CSE23363) — *Biostatistics & XAI Specialist*
- **V. Chakravarthy** (CB.SC.U4CSE23753) — *Edge Optimization & Data Pipeline*

### Faculty Mentors
- **Dr. G. R. Ramya** — *Assistant Professor (Sr. Gr.), Department of CSE*
- **Dr. Vandhana S** — *Assistant Professor (Sr. Gr.), Department of CSE*

---

## 🚀 Local Deployment

To run the interactive portal locally:
```bash
cd /Users/aksharsakhi/Documents/Files/Code/Project/TEA/Activity_4_Project_Website_Documentation_Portal
./start_portal.sh
```
The portal is hosted at `http://localhost:8080`.
