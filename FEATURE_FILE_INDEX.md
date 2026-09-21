# NexHire: Feature-by-Feature Architecture & Viva File Index

This quick-reference index is designed to help you instantly locate code, explain architecture, and answer evaluation/viva questions.

---

## High-Level Architecture Separation

```
nexhire-job-career-board/
├── backend/                  # Node.js + Express + MongoDB Atlas
│   ├── server.js             # Server initialization, Express middlewares, routing, and Vite SSR/SPA
│   ├── db.js                 # MongoDB Atlas driver, collection abstractions & seed data
│   ├── resumeParser.js       # AI skill extraction engine, taxonomy, and match scoring
│   └── routes/               # Modular REST API endpoints
│       ├── resume.js         # Resume parse, MongoDB file storage, and file streaming
│       ├── studentPosts.js   # Student achievement CRUD & recruiter visibility
│       ├── listings.js       # Job, internship, and hackathon management
│       ├── applications.js   # ATS job application submissions & status updates
│       ├── auth.js           # JWT authentication, student/recruiter profiles
│       └── bookmarks.js      # Student saved opportunities
│
├── frontend/src/             # React 19 + Vite + Tailwind CSS + Lucide Icons
│   ├── services/
│   │   └── api.jsx           # Centralized Axios/Fetch API client for all backend routes
│   ├── context/
│   │   └── AuthContext.jsx   # Global user state, JWT storage, role-based access
│   ├── components/
│   │   ├── Navbar.jsx        # Navigation header, portal switch, user pill
│   │   ├── AuthModal.jsx     # Login & registration modal for student/recruiter
│   │   ├── StudentPortal/    # Student features (Resume, Recommendations, Achievements, Applications)
│   │   └── CompanyPortal/    # Recruiter features (ATS Kanban, Talent Feed, Job Posting)
│   ├── App.jsx               # Top-level view router & state coordination
│   └── index.css             # Tailwind design system tokens & custom styles
```

---

## Feature-by-Feature File Mapping

### 1. Resume Scraper & Skill Extraction Engine
| Layer | File Path | Key Functions / Symbols | Purpose |
| :--- | :--- | :--- | :--- |
| **Backend Core** | [`backend/resumeParser.js`](file:///c:/Users/mahesh/Desktop/nexhire-job-career-board/backend/resumeParser.js) | `extractTextFromBuffer` | Multi-engine text parser (`pdf-parse`, `mammoth` for DOCX, Node `zlib` stream decompressor) |
| **Backend Core** | [`backend/resumeParser.js`](file:///c:/Users/mahesh/Desktop/nexhire-job-career-board/backend/resumeParser.js) | `extractResumeSkills` | Scrapes 180+ tech skills using word-boundary regex and alias matching |
| **Backend Core** | [`backend/resumeParser.js`](file:///c:/Users/mahesh/Desktop/nexhire-job-career-board/backend/resumeParser.js) | `categorizeSkills` | Categorizes detected skills into Frontend, Backend, Databases, Cloud/DevOps, AI/ML |
| **Backend Core** | [`backend/resumeParser.js`](file:///c:/Users/mahesh/Desktop/nexhire-job-career-board/backend/resumeParser.js) | `extractCandidateMetadata` | Auto-detects GitHub, LinkedIn, Email, and Degree from text |
| **Backend Route** | [`backend/routes/resume.js`](file:///c:/Users/mahesh/Desktop/nexhire-job-career-board/backend/routes/resume.js) | `POST /api/resume/parse` | Receives Base64 resume, runs parser, saves to DB, returns skills |
| **Frontend API** | [`frontend/src/services/api.jsx`](file:///c:/Users/mahesh/Desktop/nexhire-job-career-board/frontend/src/services/api.jsx) | `api.resume.parse()` | Client request sending file data and receiving extracted skills |
| **Frontend UI** | [`frontend/src/components/StudentPortal/StudentProfileView.jsx`](file:///c:/Users/mahesh/Desktop/nexhire-job-career-board/frontend/src/components/StudentPortal/StudentProfileView.jsx) | `handleFileUpload` | Drag-and-drop upload zone, 1-click test buttons, skill pills |

---

### 2. Resume File Storage & Viewing (MongoDB Atlas)
| Layer | File Path | Key Functions / Symbols | Purpose |
| :--- | :--- | :--- | :--- |
| **Backend DB** | [`backend/db.js`](file:///c:/Users/mahesh/Desktop/nexhire-job-career-board/backend/db.js) | `db.resumes` | MongoDB collection storing Base64 file binary, MIME type, file size, and upload timestamp |
| **Backend Route** | [`backend/routes/resume.js`](file:///c:/Users/mahesh/Desktop/nexhire-job-career-board/backend/routes/resume.js) | `GET /api/resume/file/:studentId` | Streams raw resume PDF / DOCX directly to browser with inline disposition |
| **Frontend Student** | [`frontend/src/components/StudentPortal/StudentProfileView.jsx`](file:///c:/Users/mahesh/Desktop/nexhire-job-career-board/frontend/src/components/StudentPortal/StudentProfileView.jsx) | "View Stored File" Button | Displays "MongoDB Stored" badge and opens the uploaded resume file in a new tab |
| **Frontend Recruiter** | [`frontend/src/components/CompanyPortal/CandidateDetailModal.jsx`](file:///c:/Users/mahesh/Desktop/nexhire-job-career-board/frontend/src/components/CompanyPortal/CandidateDetailModal.jsx) | "View Stored Resume (PDF)" Button | Recruiter clicks to view candidate's stored resume directly from MongoDB |

---

### 3. Skill-Based Opportunity Recommendations & Match Scoring
| Layer | File Path | Key Functions / Symbols | Purpose |
| :--- | :--- | :--- | :--- |
| **Backend Algorithm** | [`backend/resumeParser.js`](file:///c:/Users/mahesh/Desktop/nexhire-job-career-board/backend/resumeParser.js) | `recommendOpportunities` | Calculates match percentage: `(matchedSkills / requiredSkills) * 100`, sorts descending |
| **Backend Route** | [`backend/routes/resume.js`](file:///c:/Users/mahesh/Desktop/nexhire-job-career-board/backend/routes/resume.js) | `GET /api/resume/recommendations` | Returns personalized jobs/internships/hackathons for authenticated student |
| **Frontend UI** | [`frontend/src/components/StudentPortal/StudentDashboard.jsx`](file:///c:/Users/mahesh/Desktop/nexhire-job-career-board/frontend/src/components/StudentPortal/StudentDashboard.jsx) | "Recommended for You" Tab | Displays ranked opportunity cards with match score badges |
| **Frontend Card** | [`frontend/src/components/StudentPortal/OpportunityCard.jsx`](file:///c:/Users/mahesh/Desktop/nexhire-job-career-board/frontend/src/components/StudentPortal/OpportunityCard.jsx) | Match badge & skill pills | Visual indicators showing which skills matched (green) vs. missing (gray) |

---

### 4. Student Achievement Posting & Social Feed
| Layer | File Path | Key Functions / Symbols | Purpose |
| :--- | :--- | :--- | :--- |
| **Backend DB** | [`backend/db.js`](file:///c:/Users/mahesh/Desktop/nexhire-job-career-board/backend/db.js) | `db.studentPosts` | MongoDB collection storing achievement posts, skills, proof links, visibility |
| **Backend Routes** | [`backend/routes/studentPosts.js`](file:///c:/Users/mahesh/Desktop/nexhire-job-career-board/backend/routes/studentPosts.js) | `GET /`, `POST /`, `DELETE /:id` | CRUD endpoints with JWT auth and recruiter visibility filters |
| **Frontend Modal** | [`frontend/src/components/StudentPortal/CreateAchievementModal.jsx`](file:///c:/Users/mahesh/Desktop/nexhire-job-career-board/frontend/src/components/StudentPortal/CreateAchievementModal.jsx) | Achievement Creator | Category select (Hackathon, Project, Cert), proof link, skills, recruiter toggle |
| **Frontend Feed** | [`frontend/src/components/StudentPortal/StudentAchievementsView.jsx`](file:///c:/Users/mahesh/Desktop/nexhire-job-career-board/frontend/src/components/StudentPortal/StudentAchievementsView.jsx) | Community Feed | Timeline of peer achievements, clapping reactions, external proof links |
| **Frontend Recruiter** | [`frontend/src/components/CompanyPortal/RecruiterAchievementsView.jsx`](file:///c:/Users/mahesh/Desktop/nexhire-job-career-board/frontend/src/components/CompanyPortal/RecruiterAchievementsView.jsx) | Recruiter Talent Feed | Dedicated recruiter tab to discover candidates by their real project achievements |

---

### 5. ATS Recruitment Pipeline & Candidate Tracking
| Layer | File Path | Key Functions / Symbols | Purpose |
| :--- | :--- | :--- | :--- |
| **Backend DB** | [`backend/db.js`](file:///c:/Users/mahesh/Desktop/nexhire-job-career-board/backend/db.js) | `db.applications` | Stores applications with status: applied, screening, interview, offer, rejected |
| **Backend Routes** | [`backend/routes/applications.js`](file:///c:/Users/mahesh/Desktop/nexhire-job-career-board/backend/routes/applications.js) | Application Routes | Submitting job applications & updating candidate stages |
| **Frontend ATS** | [`frontend/src/components/CompanyPortal/ATSBoard.jsx`](file:///c:/Users/mahesh/Desktop/nexhire-job-career-board/frontend/src/components/CompanyPortal/ATSBoard.jsx) | Kanban Pipeline | Drag/move candidates between hiring stages with search & role filters |
| **Frontend Modal** | [`frontend/src/components/CompanyPortal/CandidateDetailModal.jsx`](file:///c:/Users/mahesh/Desktop/nexhire-job-career-board/frontend/src/components/CompanyPortal/CandidateDetailModal.jsx) | Candidate Detail | Review student GPA, university, skills, application notes, and stored resume |

---

### 6. Job, Internship & Hackathon Management
| Layer | File Path | Key Functions / Symbols | Purpose |
| :--- | :--- | :--- | :--- |
| **Backend DB** | [`backend/db.js`](file:///c:/Users/mahesh/Desktop/nexhire-job-career-board/backend/db.js) | `db.listings` | MongoDB collection for all company postings |
| **Backend Routes** | [`backend/routes/listings.js`](file:///c:/Users/mahesh/Desktop/nexhire-job-career-board/backend/routes/listings.js) | `GET /`, `POST /`, `DELETE /` | Listing creation, filtering, and company listing queries |
| **Frontend Post** | [`frontend/src/components/CompanyPortal/PostJobForm.jsx`](file:///c:/Users/mahesh/Desktop/nexhire-job-career-board/frontend/src/components/CompanyPortal/PostJobForm.jsx) | Job Posting Wizard | Form to post jobs, internships, and hackathons with skill tags |
| **Frontend Manage**| [`frontend/src/components/CompanyPortal/ManageListingsView.jsx`](file:///c:/Users/mahesh/Desktop/nexhire-job-career-board/frontend/src/components/CompanyPortal/ManageListingsView.jsx) | Listings Table | View active listings, applicant counts, and close/delete actions |

---

### 7. Authentication & Role-Based Access Control
| Layer | File Path | Key Functions / Symbols | Purpose |
| :--- | :--- | :--- | :--- |
| **Backend Routes** | [`backend/routes/auth.js`](file:///c:/Users/mahesh/Desktop/nexhire-job-career-board/backend/routes/auth.js) | `/register`, `/login`, `/profile` | JWT signing, bcrypt password hashing, and user profile sync |
| **Frontend Context**| [`frontend/src/context/AuthContext.jsx`](file:///c:/Users/mahesh/Desktop/nexhire-job-career-board/frontend/src/context/AuthContext.jsx) | `useAuth()` hook | Stores JWT in localStorage, tracks `user.role` (`student` or `company`) |
| **Frontend Modal** | [`frontend/src/components/AuthModal.jsx`](file:///c:/Users/mahesh/Desktop/nexhire-job-career-board/frontend/src/components/AuthModal.jsx) | Auth Modal Dialog | Clean tabbed modal with 1-click demo logins for student and recruiter |

---

## Common Viva / Interview Questions & Fast Cheat Answers

#### Q1: "Where and how does the resume scraper extract text from uploaded files?"
- **Answer**: In [`backend/resumeParser.js`](file:///c:/Users/mahesh/Desktop/nexhire-job-career-board/backend/resumeParser.js) in function `extractTextFromBuffer()`. It uses a 4-tier pipeline:
  1. `pdf-parse` (handles modern PDF font tables and encoding)
  2. `mammoth` (for Microsoft Word `.docx` documents)
  3. Native Node `zlib` stream decompressor for FlateDecode compressed streams
  4. Standard UTF-8 / ASCII token fallbacks.

#### Q2: "How does the skill matching and recommendation algorithm work?"
- **Answer**: In [`backend/resumeParser.js`](file:///c:/Users/mahesh/Desktop/nexhire-job-career-board/backend/resumeParser.js) in function `recommendOpportunities()`.
  It normalizes candidate skills, compares them against `listing.skillsRequired`, counts matched skills, computes `matchScore = (matched / required) * 100`, and sorts active listings in descending match order.

#### Q3: "Where is the uploaded resume stored in MongoDB?"
- **Answer**: In [`backend/routes/resume.js`](file:///c:/Users/mahesh/Desktop/nexhire-job-career-board/backend/routes/resume.js) (`POST /api/resume/parse`).
  It stores the file Base64 data, MIME type, and metadata in the dedicated `db.resumes` collection, and mirrors it into the student's profile (`users.studentProfile.resumeFileData`).

#### Q4: "How does a recruiter view the candidate's actual resume?"
- **Answer**: The recruiter clicks **"View Stored Resume (PDF)"** in [`frontend/src/components/CompanyPortal/CandidateDetailModal.jsx`](file:///c:/Users/mahesh/Desktop/nexhire-job-career-board/frontend/src/components/CompanyPortal/CandidateDetailModal.jsx).
  This calls the backend streaming endpoint `GET /api/resume/file/:studentId` in [`backend/routes/resume.js`](file:///c:/Users/mahesh/Desktop/nexhire-job-career-board/backend/routes/resume.js), which fetches the document from MongoDB and streams it directly with inline `Content-Disposition: inline`.

#### Q5: "Where are the student achievements stored and filtered?"
- **Answer**: In [`backend/routes/studentPosts.js`](file:///c:/Users/mahesh/Desktop/nexhire-job-career-board/backend/routes/studentPosts.js) and `db.studentPosts` collection.
  Students create them via [`CreateAchievementModal.jsx`](file:///c:/Users/mahesh/Desktop/nexhire-job-career-board/frontend/src/components/StudentPortal/CreateAchievementModal.jsx) and recruiters browse them via [`RecruiterAchievementsView.jsx`](file:///c:/Users/mahesh/Desktop/nexhire-job-career-board/frontend/src/components/CompanyPortal/RecruiterAchievementsView.jsx).
