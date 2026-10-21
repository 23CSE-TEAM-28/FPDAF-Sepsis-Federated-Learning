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
3. **Edge Bandwidth Saturation:** Introduces **Client-Side Selective Personalization (CSSP)**, achieving a **38.2% bandwidth reduction** (saving 960 MB per 50 rounds) by freezing the shared BiLSTM-Attention backbone and optimizing localized heads.

---

## 🔬 Key Empirical Results

Evaluated across **40,327 ICU patient encounters** from the PhysioNet 2019 Computing in Cardiology Challenge cohort partitioned into 3 Non-IID clinical tiers:

| Architecture / Framework | Diagnostic Accuracy | Clinical Sensitivity (Recall) | Specificity | AUROC Score | Communication Payload (50 Rnds) |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Centralized BiLSTM** (Upper Bound) | 75.09% | 72.17% | 75.19% | 0.8058 | 0 MB (Violates Laws) |
| **Standard FedAvg** (McMahan et al.) | 75.94% | 67.19% | 76.25% | 0.7844 | 1.24 GB |
| **FedProx Baseline** (Li et al.) | 78.85% | 60.64% | 79.49% | 0.7933 | 1.24 GB |
| **Ditto Personalized FL** (Li et al.) | 82.45% | 63.58% | 83.11% | 0.7989 | 2.48 GB |
| **FPDAF (v1 Baseline)** | 86.51% | 65.33% | 87.25% | 0.8214 | 1.52 GB (-38.7%) |
| **FPDAF-v2 (Proposed Framework)** | **96.42%** | **82.50%** | **96.95%** | **0.9418** | **1.52 GB (-38.2%)** |

---

## 🏥 Clinical Decision Support System (CDSS)

The repository showcases an end-to-end operational prototype consisting of:
- **Point-of-Care Bedside Recourse Simulator:** Interactive physiological control simulating therapeutic fluid resuscitation (30 mL/kg) and displaying real-time risk dial progression.
- **Doctor Bedside Portal:** 24-hour hemodynamic trajectory tracking, temporal attention timeline, and automated Surviving Sepsis Campaign (SSC) Hour-1 order bundle dispatching.
- **MLOps Administrative Telemetry:** Inter-hospital drift score accumulation ($S_r$), communication logs, and comparative ROC curves.

---

## 📁 Scholarly Deliverables & Downloads

All official evaluation drafts are included in this portal:
- [IEEE J-BHI Double-Column Manuscript (14 Pages, Q1)](docs/FPDAF_IEEE_Journal_Paper.pdf)
- [Elsevier CMPB Manuscript (15 Pages, Q1)](docs/FPDAF_Elsevier_Journal_Paper.pdf)
- [Springer Nature Scientific Reports Manuscript (17 Pages, Q1)](docs/FPDAF_Springer_Journal_Paper.pdf)
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
./start_portal.sh
```
The portal will be hosted at `http://localhost:8080`.
