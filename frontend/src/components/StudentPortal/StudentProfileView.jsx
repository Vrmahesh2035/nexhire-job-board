import React, { useState } from "react";
import {
  FileText,
  UploadCloud,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Link as LinkIcon,
  Github,
  Linkedin,
  GraduationCap,
  Briefcase,
  Layers,
  ArrowRight,
  Plus,
  X,
  RefreshCw,
  Edit3,
  Save,
  Check,
  Download
} from "lucide-react";
import { api } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const sampleResumes = [
  {
    label: "Full-Stack MERN Engineer",
    fileName: "Alex_Rivera_FullStack_Resume.pdf",
    text: `Alex Rivera
Berkeley, CA | student@demo.com | https://github.com/alexrivera-demo | https://linkedin.com/in/alexrivera-demo
EDUCATION
University of California, Berkeley - B.S. in Computer Science (Expected May 2026)
Coursework: Data Structures, Algorithms, Distributed Systems, Database Management, Operating Systems

TECHNICAL SKILLS
Languages: TypeScript, JavaScript, Python, C++, SQL, HTML5, CSS3
Frameworks & Libraries: React, Next.js, Node.js, Express, Tailwind CSS, Redux, Vite
Databases & Cloud: MongoDB, PostgreSQL, Redis, Docker, AWS (EC2, S3), Git, CI/CD, GitHub Actions

PROJECTS
NexHire Recruitment Hub - Full-Stack React, Node.js, Express, MongoDB, Tailwind CSS
- Architected candidate tracking ATS pipeline and resume skill matching algorithm.
- Implemented real-time status updates and JWT session authentication.

DevSync AI Bot - React, TypeScript, LangChain, OpenAI, Docker
- Built automated code-review companion for GitHub pull requests, identifying breaking changes.
- Won 1st place overall at CalHacks 11.0 out of 400+ collegiate developer teams.`
  },
  {
    label: "AI & Machine Learning Engineer",
    fileName: "Priya_Sharma_ML_Resume.pdf",
    text: `Priya Sharma
Stanford, CA | priya.sharma@stanford.edu | https://github.com/priyasharma-ai | https://linkedin.com/in/priyasharma
EDUCATION
Stanford University - M.S. in Artificial Intelligence & Computer Science (2025)

TECHNICAL SKILLS
Machine Learning: PyTorch, TensorFlow, Deep Learning, Computer Vision, NLP, LLMs, HuggingFace, Scikit-learn
Data & Backend: Python, FastAPI, Docker, PostgreSQL, Pandas, NumPy, Redis, Git, Linux, Prompt Engineering

RESEARCH & PROJECTS
Low-Latency LLM Speculative Decoding - PyTorch, Python, Docker
- Published research at NeurIPS workshop reducing model generation latency by 42%.
- Deployed quantized open-weights models onto edge GPUs using FastAPI microservices.`
  },
  {
    label: "Cloud & DevOps Specialist",
    fileName: "Jordan_Lee_DevOps_Resume.pdf",
    text: `Jordan Lee
Atlanta, GA | jordan.lee@gatech.edu | https://github.com/jordanlee-devops
EDUCATION
Georgia Tech - B.S. in Computer Science (2026)

CERTIFICATIONS
AWS Certified Solutions Architect - Associate (Score: 920/1000)

TECHNICAL SKILLS
Cloud & Infrastructure: AWS, Docker, Kubernetes, Terraform, Linux, CI/CD, GitHub Actions, Nginx
Languages & Backend: Go, Python, Bash, Node.js, REST API, Microservices, Prometheus, Grafana

EXPERIENCE & PROJECTS
Cloud Infrastructure Automation - Terraform, AWS EKS, Docker, Kubernetes
- Engineered reproducible multi-region VPC with automated blue-green deployments.`
  }
];

export const StudentProfileView = ({ onNavigateToRecommended, onOpenAuth }) => {
  const { user, refreshUser } = useAuth();

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    university: user?.studentProfile?.university || "",
    degree: user?.studentProfile?.degree || "",
    gradYear: user?.studentProfile?.gradYear || "2026",
    bio: user?.studentProfile?.bio || "",
    github: user?.studentProfile?.github || "",
    linkedin: user?.studentProfile?.linkedin || "",
    portfolio: user?.studentProfile?.portfolio || ""
  });

  const [resumeText, setResumeText] = useState(user?.studentProfile?.resumeText || "");
  const [resumeFileName, setResumeFileName] = useState(user?.studentProfile?.resumeFileName || "");
  const [resumeFileData, setResumeFileData] = useState(user?.studentProfile?.resumeFileData || "");
  const [resumeFileType, setResumeFileType] = useState(user?.studentProfile?.resumeFileType || "application/pdf");
  const [extractedSkills, setExtractedSkills] = useState(user?.studentProfile?.skills || []);
  const [categorizedSkills, setCategorizedSkills] = useState(null);
  const [resumeSummary, setResumeSummary] = useState(user?.studentProfile?.resumeSummary || "");
  const [recommendedPreview, setRecommendedPreview] = useState([]);

  const [newSkillInput, setNewSkillInput] = useState("");
  const [isScraping, setIsScraping] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [showRawText, setShowRawText] = useState(false);

  if (!user) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
          <GraduationCap className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Student Sign In Required</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          Please sign in to upload your resume, view extracted skills, and unlock personalized opportunity recommendations.
        </p>
        <button
          onClick={onOpenAuth}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors shadow-md cursor-pointer"
        >
          Sign In as Student
        </button>
      </div>
    );
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMessage(null);
    setSuccessMessage(null);
    setResumeFileName(file.name);
    setResumeFileType(file.type || "application/pdf");

    const reader = new FileReader();

    reader.onload = async (event) => {
      const dataUrl = event.target?.result;
      setResumeFileData(dataUrl);

      // Trigger automatic scrape & direct persistence
      await triggerScrape({
        fileData: dataUrl,
        fileName: file.name,
        fileType: file.type,
        saveToProfile: true
      });
    };

    reader.readAsDataURL(file);
  };

  const handleSelectSample = async (sample) => {
    setResumeFileName(sample.fileName);
    setResumeText(sample.text);
    setResumeFileType("application/pdf");
    // Generate sample data URL so it can be stored
    const sampleDataUrl = "data:text/plain;base64," + btoa(unescape(encodeURIComponent(sample.text)));
    setResumeFileData(sampleDataUrl);

    await triggerScrape({
      resumeText: sample.text,
      fileName: sample.fileName,
      fileData: sampleDataUrl,
      saveToProfile: true
    });
  };

  const triggerScrape = async ({ resumeText: textToScrape, fileData, fileName, fileType, saveToProfile }) => {
    setIsScraping(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const payload = {
        resumeText: textToScrape || resumeText,
        fileData: fileData || resumeFileData,
        fileName: fileName || resumeFileName || "Resume.pdf",
        fileType: fileType || resumeFileType || "application/pdf",
        saveToProfile: saveToProfile ?? true
      };

      const response = await api.resume.parse(payload);

      setExtractedSkills(response.skills || []);
      setCategorizedSkills(response.categorizedSkills || null);
      setResumeSummary(response.summary || "");
      setRecommendedPreview(response.recommendedOpportunities || []);
      if (response.textPreview) {
        setResumeText(response.textPreview);
      }

      await refreshUser();

      setSuccessMessage(
        `Resume successfully processed & saved! Scraped ${response.skills?.length || 0} skills and matched ${response.recommendedOpportunities?.length || 0} opportunities.`
      );
    } catch (err) {
      console.error("Resume scrape error:", err);
      setErrorMessage(err.message || "Failed to scrape resume skills.");
    } finally {
      setIsScraping(false);
    }
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    const clean = newSkillInput.trim();
    if (!clean) return;
    if (!extractedSkills.some((s) => s.toLowerCase() === clean.toLowerCase())) {
      setExtractedSkills((prev) => [...prev, clean]);
    }
    setNewSkillInput("");
  };

  const handleRemoveSkill = (skillToRemove) => {
    setExtractedSkills((prev) => prev.filter((s) => s !== skillToRemove));
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await api.auth.updateProfile({
        name: profileForm.name,
        studentProfile: {
          university: profileForm.university,
          degree: profileForm.degree,
          gradYear: profileForm.gradYear,
          bio: profileForm.bio,
          github: profileForm.github,
          linkedin: profileForm.linkedin,
          portfolio: profileForm.portfolio,
          skills: extractedSkills,
          resumeText: resumeText.slice(0, 15000),
          resumeFileName: resumeFileName || "Resume.pdf",
          resumeFileData: resumeFileData || user?.studentProfile?.resumeFileData || "",
          resumeFileType: resumeFileType || user?.studentProfile?.resumeFileType || "application/pdf",
          resumeSummary
        }
      });

      await refreshUser();
      setIsEditingProfile(false);
      setSuccessMessage("Student Profile & Resume saved!");
    } catch (err) {
      console.error("Save profile error:", err);
      setErrorMessage(err.message || "Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const hasStoredResume = Boolean(user?.studentProfile?.resumeFileName || resumeFileName);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Alert Banners */}
      {successMessage && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-emerald-800 dark:text-emerald-200 text-xs flex items-center justify-between shadow-xs">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="font-medium">{successMessage}</span>
          </div>
          <button onClick={() => setSuccessMessage(null)} className="text-emerald-600 hover:text-emerald-800 text-xs cursor-pointer">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 rounded-2xl text-red-800 dark:text-red-200 text-xs flex items-center justify-between shadow-xs">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
            <span className="font-medium">{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage(null)} className="text-red-600 hover:text-red-800 text-xs cursor-pointer">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Profile Overview Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-xs space-y-6 transition-colors">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-emerald-500 flex items-center justify-center text-white text-2xl font-black shadow-md">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">{user.name}</h1>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold uppercase tracking-wider border border-indigo-200 dark:border-indigo-800">
                  Student
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {user.studentProfile?.degree || "Computer Science Candidate"} • {user.studentProfile?.university || "University Student"} (Class of {user.studentProfile?.gradYear || "2026"})
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsEditingProfile(!isEditingProfile)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditingProfile ? "Cancel Editing" : "Edit Profile Info"}</span>
            </button>
            <button
              onClick={handleSaveProfile}
              disabled={isSaving}
              className="flex items-center space-x-1.5 px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? "Saving..." : "Saved"}</span>
            </button>
          </div>
        </div>

        {/* Collapsible Edit Profile Form */}
        {isEditingProfile && (
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
              Personal & Academic Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Full Name</label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">University / College</label>
                <input
                  type="text"
                  value={profileForm.university}
                  onChange={(e) => setProfileForm({ ...profileForm, university: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Degree / Major</label>
                <input
                  type="text"
                  value={profileForm.degree}
                  onChange={(e) => setProfileForm({ ...profileForm, degree: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Graduation Year</label>
                <input
                  type="text"
                  value={profileForm.gradYear}
                  onChange={(e) => setProfileForm({ ...profileForm, gradYear: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">GitHub URL</label>
                <input
                  type="url"
                  placeholder="https://github.com/..."
                  value={profileForm.github}
                  onChange={(e) => setProfileForm({ ...profileForm, github: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">LinkedIn URL</label>
                <input
                  type="url"
                  placeholder="https://linkedin.com/in/..."
                  value={profileForm.linkedin}
                  onChange={(e) => setProfileForm({ ...profileForm, linkedin: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Portfolio Link</label>
                <input
                  type="url"
                  placeholder="https://myportfolio.dev"
                  value={profileForm.portfolio}
                  onChange={(e) => setProfileForm({ ...profileForm, portfolio: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                />
              </div>
            </div>
          </div>
        )}

        {/* Links & Stored Resume Badge */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          {profileForm.github && (
            <a
              href={profileForm.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center space-x-1.5 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>
          )}
          {profileForm.linkedin && (
            <a
              href={profileForm.linkedin}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center space-x-1.5 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium"
            >
              <Linkedin className="w-3.5 h-3.5" />
              <span>LinkedIn</span>
            </a>
          )}
          {profileForm.portfolio && (
            <a
              href={profileForm.portfolio}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center space-x-1.5 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium"
            >
              <LinkIcon className="w-3.5 h-3.5" />
              <span>Portfolio</span>
            </a>
          )}

          {hasStoredResume && (
            <div className="ml-auto flex items-center">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-[11px] font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Resume saved</span>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Resume Upload & Scraper Section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-xs space-y-6 transition-colors">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
              <Sparkles className="w-4 h-4" />
            </span>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Resume Upload & Skills Scraper
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Upload your resume (PDF, Word DOCX, or text). The file is saved directly and scraped using our high-precision text parser to extract verified tech skills and match you to suitable roles.
          </p>
        </div>

        {/* 1-Click Sample Resumes for instant testing */}
        <div className="space-y-2">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
            1-Click Sample Resumes (Test Instantly)
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {sampleResumes.map((sample) => (
              <button
                key={sample.label}
                type="button"
                onClick={() => handleSelectSample(sample)}
                className="text-left p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-white dark:hover:bg-slate-800 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                    {sample.label}
                  </span>
                  <Sparkles className="w-3 h-3 text-indigo-500 opacity-70 group-hover:opacity-100" />
                </div>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 block mt-0.5 truncate">
                  {sample.fileName}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* File Dropzone */}
        <div className="relative border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 sm:p-8 text-center hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors bg-slate-50/50 dark:bg-slate-800/30">
          <input
            type="file"
            accept=".pdf,.doc,.docx,.txt,.md"
            onChange={handleFileUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            id="resume-upload-input"
          />
          <div className="space-y-2 pointer-events-none">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center mx-auto">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                Click to browse or drag and drop your resume
              </p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                Supports PDF (.pdf), Microsoft Word (.docx), or plain text (.txt, .md) up to 10MB
              </p>
            </div>
            {resumeFileName && (
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-indigo-600 dark:text-indigo-400 shadow-xs mt-2">
                <FileText className="w-3.5 h-3.5" />
                <span>Selected: {resumeFileName}</span>
              </div>
            )}
          </div>
        </div>

        {/* Action bar to trigger scrape / view text */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => triggerScrape({ saveToProfile: true })}
              disabled={isScraping || (!resumeText && !resumeFileName && !resumeFileData)}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              {isScraping ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Processing & Saving...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Scrape & Save</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setShowRawText(!showRawText)}
              className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              {showRawText ? "Hide Resume Text" : "View/Edit Plain Text"}
            </button>
          </div>

          <div className="flex items-center space-x-2">
            {hasStoredResume && (
              <a
                href={`/api/resume/file/${user.id}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-indigo-500" />
                <span>View Stored PDF</span>
              </a>
            )}

            <button
              type="button"
              onClick={handleSaveProfile}
              disabled={isSaving}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer disabled:opacity-50"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{isSaving ? "Saving..." : "Saved"}</span>
            </button>
          </div>
        </div>

        {/* Optional raw text viewer / editor */}
        {showRawText && (
          <div className="space-y-2 pt-2 animate-in fade-in duration-150">
            <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400">
              Resume Text Content (Parsed by Scraper)
            </label>
            <textarea
              rows={6}
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste or edit your resume text here..."
              className="w-full p-3 text-xs font-mono rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        )}

        {/* Extracted Skills Showcase */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Extracted Skills</span>
              <span className="px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[11px] font-bold">
                {extractedSkills.length} Detected
              </span>
            </div>
            <span className="text-[11px] text-slate-400">Click &times; to remove or add custom skills below</span>
          </div>

          {/* Categorized Skills View or Pills */}
          {extractedSkills.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 text-slate-400 text-xs">
              No skills extracted yet. Upload a resume or select a sample profile above.
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {extractedSkills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 text-indigo-800 dark:text-indigo-200 text-xs font-medium group transition-all"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-indigo-400 hover:text-red-500 p-0.5 rounded-full transition-colors cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Add custom skill input */}
          <form onSubmit={handleAddSkill} className="flex items-center space-x-2 max-w-sm">
            <input
              type="text"
              value={newSkillInput}
              onChange={(e) => setNewSkillInput(e.target.value)}
              placeholder="Add skill (e.g. Next.js, Redis)..."
              className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="px-3 py-1.5 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors cursor-pointer flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </form>

          {/* Generated Resume Summary */}
          {resumeSummary && (
            <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-50/50 to-slate-50 dark:from-slate-800/80 dark:to-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-indigo-600 dark:text-indigo-400 tracking-wider block">
                Executive Profile Summary
              </span>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{resumeSummary}</p>
            </div>
          )}
        </div>
      </div>

      {/* Immediate Match Opportunities Preview */}
      {recommendedPreview.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-xs space-y-4 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <span className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  <Briefcase className="w-4 h-4" />
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Opportunities Matched from Your Resume
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Based on your {extractedSkills.length} extracted skills, here are the top opportunities waiting for you:
              </p>
            </div>

            <button
              type="button"
              onClick={onNavigateToRecommended}
              className="hidden sm:inline-flex items-center space-x-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
            >
              <span>Explore All in Recommended Tab</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {recommendedPreview.slice(0, 4).map((opp) => (
              <div
                key={opp.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/70 dark:bg-slate-800/50 flex flex-col justify-between space-y-2 hover:border-indigo-400 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                      {opp.matchScore}% Match
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{opp.workMode}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-1.5">{opp.title}</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{opp.companyName} • {opp.location}</p>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-700/60 flex flex-wrap gap-1">
                  {opp.matchedSkills?.slice(0, 3).map((s) => (
                    <span
                      key={s}
                      className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-medium"
                    >
                      {s}
                    </span>
                  ))}
                  {opp.missingSkills?.length > 0 && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300">
                      +{opp.missingSkills.length} to learn
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 text-center sm:hidden">
            <button
              type="button"
              onClick={onNavigateToRecommended}
              className="inline-flex items-center space-x-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 cursor-pointer"
            >
              <span>Explore All in Recommended Tab</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
