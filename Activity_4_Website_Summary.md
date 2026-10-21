# Activity 4: Project Website / Documentation Portal
**Evaluation Component:** Technical Enrichment Activities (TEA) — Group Activity 4 (5 Marks)  
**Project:** Explainable Federated Learning for Healthcare Time-Series Forecasting with Personalized Drift Adaptation (FPDAF)  
**Team:** Team 28 (Group G028) • **Track:** DSDA • **Dept. of CSE, Amrita Vishwa Vidyapeetham**  

---

## 1. Executive Summary & Live Publication

The official Project Website & Documentation Portal has been fully designed, developed, and **published live on GitHub Pages**:
- 🌐 **Live Published Portal:** [https://aksharsakhi.github.io/FPDAF-Sepsis-Federated-Learning/](https://aksharsakhi.github.io/FPDAF-Sepsis-Federated-Learning/)
- 💻 **Official GitHub Repository:** [https://github.com/aksharsakhi/FPDAF-Sepsis-Federated-Learning](https://github.com/aksharsakhi/FPDAF-Sepsis-Federated-Learning)
- 📌 **Submission Shortcut Artifact:** `G028_Website.url` (points directly to the published website)

---

## 2. Deliverables Checklist as per TEA Guidelines

| Required Deliverable | Provided Artifact | Format & Location | Status |
| :--- | :--- | :--- | :---: |
| **Official URL Shortcut** | `G028_Website.url` | Valid Windows/Browser `.url` file pointing to the live published portal | **100% Complete** |
| **Project Objectives** | 4 primary clinical AI objectives detailed in Hero & Problem sections | Web portal (`index.html`) & [Project_Documentation_Dossier.pdf](file:///Users/aksharsakhi/Documents/Files/Code/Project/TEA/Activity_4_Project_Website_Documentation_Portal/docs/Project_Documentation_Dossier.pdf) | **100% Complete** |
| **Problem Statement** | Sepsis mortality escalation (7.6%/hr), hospital data silos (HIPAA/DPDPA), and non-IID concept drift | Interactive 3-card challenge breakdown on website | **100% Complete** |
| **Methodology** | Full system architecture, AD-CUSUM, DDP-ERP, and CSSP edge protocol | Embedded diagrams (`ArcDigram.jpeg`, implementation logic, KaTeX math formulas) | **100% Complete** |
| **Team Details** | Complete profiles of all 5 team members and 2 faculty supervisors | Dedicated team grid on website and page 3 of dossier | **100% Complete** |
| **Project Progress** | Milestone roadmap chronicling Phase II Reviews 1, 2, 3, and 4 | Interactive timeline in `index.html` and Section 2 of dossier | **100% Complete** |
| **Documentation** | System architecture, SQLite schema, REST APIs, and installation guides | [Project_Documentation_Dossier.pdf](file:///Users/aksharsakhi/Documents/Files/Code/Project/TEA/Activity_4_Project_Website_Documentation_Portal/docs/Project_Documentation_Dossier.pdf) & GitHub README | **100% Complete** |
| **Interactive Simulator** | Bedside Counterfactual Recourse Playground | Real-time SVG gauge dial with MAP, HR, Lactate, and WBC sliders | **100% Complete** |
| **Demonstration Videos** | High-definition operational prototype video with chapter jumps | Embedded HTML5 video player streaming `videos/FPDAF.mp4` with 5 chapter markers | **100% Complete** |
| **Scholarly Downloads** | 6 complete downloadable PDFs | IEEE, Elsevier, Springer drafts, Patent disclosure, Dossier, and Similarity report | **100% Complete** |

---

## 3. UI/UX Design System Highlights

1. **Modern Dark Glassmorphism:** Deep navy canvas (`#060913`) layered with semi-transparent frosted cards (`rgba(15, 23, 42, 0.72)`), radial ambient glows, and `backdrop-filter: blur(16px)`.
2. **Dynamic Mathematical Formula Typography:** Integrated KaTeX CDN for crisp LaTeX rendering of mathematical formulas ($S_r$, $\mathcal{L}_{\text{DDP-ERP}}$, $\nabla_\theta \mathcal{L} \leftarrow 0$).
3. **Point-of-Care Recourse Simulator:** Interactive sliders compute sepsis shock probability, update a 251.2-unit SVG arc gauge, toggle dynamic status badges, and trigger Surviving Sepsis Campaign (SSC) Hour-1 order bundle alerts.
4. **Interactive Inventions Tabs & Portals:** Seamless tab switching across AD-CUSUM, DDP-ERP, and CSSP edge protocol, plus interactive views for Doctor Bedside, MLOps Admin, and Drift Telemetry.
5. **High-Resolution Lightbox:** Click-to-enlarge functionality for all architecture diagrams, comparative ROC curves, and cohort heatmaps.
6. **Self-Contained Downloads:** Direct downloads for all 3 journal drafts (IEEE, Elsevier, Springer), IPO Patent Disclosure, Dossier, and 4% Turnitin report.

---

## 4. How to Launch the Portal Locally

```bash
cd /Users/aksharsakhi/Documents/Files/Code/Project/TEA/Activity_4_Project_Website_Documentation_Portal
./start_portal.sh
```
This serves the application on `http://localhost:8080` (or `http://localhost:8086`) and automatically opens your web browser.
