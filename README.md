# NexHire: Intelligent MERN Job & Career Board

NexHire is a full-stack MERN career platform featuring automated resume skill parsing, dynamic opportunity recommendations, student achievement feeds, and an ATS candidate pipeline for recruiters.

---

## ⚡ Fast File Finder & Viva Guide

For instant code lookups during evaluations or technical questions, open:
📖 **[`FEATURE_FILE_INDEX.md`](./FEATURE_FILE_INDEX.md)**

---

## Directory Structure: Frontend vs. Backend Separation

```
nexhire-job-career-board/
│
├── backend/                       # BACKEND (Node.js, Express, MongoDB Atlas)
│   ├── server.js                  # Entry point, Express middlewares, CORS, SPA static serving
│   ├── db.js                      # MongoDB Atlas collections (users, listings, applications, resumes, studentPosts)
│   ├── resumeParser.js            # Resume text extraction, skill taxonomy, recommendation engine
│   └── routes/                    # REST API Endpoints
│       ├── resume.js              # POST /api/resume/parse, GET /file/:studentId, GET /recommendations
│       ├── studentPosts.js        # GET/POST/DELETE /api/student-posts (Student achievement feed)
│       ├── listings.js            # Opportunities (Jobs, Internships, Hackathons)
│       ├── applications.js        # ATS pipeline status updates & submissions
│       ├── auth.js                # JWT authentication & student/recruiter profile updates
│       └── bookmarks.js           # Student bookmarking
│
├── frontend/                      # FRONTEND (React 19, Vite, Tailwind CSS)
│   ├── src/
│   │   ├── services/
│   │   │   └── api.jsx            # Centralized API client for all backend endpoints
│   │   ├── context/
│   │   │   └── AuthContext.jsx    # Global JWT auth state & user session
│   │   ├── components/
│   │   │   ├── Navbar.jsx         # Header navigation, portal switcher, user menu
│   │   │   ├── AuthModal.jsx      # Student & Recruiter login/register modal
│   │   │   │
│   │   │   ├── StudentPortal/     # STUDENT FEATURES
│   │   │   │   ├── StudentProfileView.jsx       # Resume upload, MongoDB stored badge, skill tags
│   │   │   │   ├── StudentDashboard.jsx         # Opportunities, "Recommended for You" AI tab
│   │   │   │   ├── OpportunityCard.jsx          # Match % badge & matched vs missing skill pills
│   │   │   │   ├── OpportunityDetailModal.jsx   # Job details & 1-click apply modal
│   │   │   │   ├── StudentAchievementsView.jsx  # Student community achievement feed
│   │   │   │   ├── CreateAchievementModal.jsx   # Achievement posting modal
│   │   │   │   └── StudentApplicationsView.jsx  # Application tracking history
│   │   │   │
│   │   │   └── CompanyPortal/     # RECRUITER & ATS FEATURES
│   │   │       ├── CompanyDashboard.jsx         # Recruiter overview & navigation tabs
│   │   │       ├── ATSBoard.jsx                 # Kanban applicant tracking pipeline
│   │   │       ├── CandidateDetailModal.jsx     # Candidate details & "View Stored Resume (PDF)"
│   │   │       ├── RecruiterAchievementsView.jsx# Talent discovery feed filtered by achievements
│   │   │       ├── PostJobForm.jsx              # Create jobs, internships, hackathons
│   │   │       └── ManageListingsView.jsx       # Manage active postings & applicants
│   │   │
│   │   ├── App.jsx                # Root app component & portal router
│   │   └── main.jsx               # React DOM entry
│   ├── vite.config.js             # Vite configuration
│   └── index.html                 # Single page application HTML shell
│
├── sample_resume.pdf              # Pre-generated sample PDF resume for testing
├── sample_resume.txt              # Pre-generated sample TXT resume for testing
└── generate_sample_resume.js      # Script to generate sample resumes
```

---

## Running Locally

```bash
npm install
npm run dev
```
Open **`http://localhost:3000`** in your browser.

## Production Build & Start (Render)

```bash
npm run build
npm start
```
