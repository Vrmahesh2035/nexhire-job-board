import React, { useState, useEffect, Fragment } from "react";
import {
  Search,
  Sparkles,
  GraduationCap,
  Trophy,
  Briefcase,
  Layers,
  Bookmark,
  Clock,
  RotateCcw,
  User,
  FileText,
  ArrowRight,
  UploadCloud,
  CheckCircle2
} from "lucide-react";
import { OpportunityCard } from "./OpportunityCard";
import { OpportunityDetailModal } from "./OpportunityDetailModal";
import { ApplicationModal } from "./ApplicationModal";
import { StudentApplicationsView } from "./StudentApplicationsView";
import { StudentProfileView } from "./StudentProfileView";
import { StudentAchievementsView } from "./StudentAchievementsView";
import { api } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

export const StudentDashboard = ({ onOpenAuth }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("all");
  const [listings, setListings] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [appsLoading, setAppsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [workMode, setWorkMode] = useState("All");
  const [department, setDepartment] = useState("All");
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [selectedListing, setSelectedListing] = useState(null);
  const [applyingListing, setApplyingListing] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const typeParam =
        activeTab === "all" ||
        activeTab === "applications" ||
        activeTab === "saved" ||
        activeTab === "recommended" ||
        activeTab === "profile" ||
        activeTab === "achievements"
          ? undefined
          : activeTab;

      const data = await api.listings.getAll({
        type: typeParam,
        search: searchQuery || undefined,
        workMode: workMode !== "All" ? workMode : undefined,
        department: department !== "All" ? department : undefined
      });
      setListings(data);
    } catch (err) {
      console.error("Failed to load listings", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentData = async () => {
    if (user && user.role === "student") {
      try {
        setAppsLoading(true);
        const [savedListings, studentApps] = await Promise.all([
          api.bookmarks.getAll(),
          api.applications.getStudentApplications()
        ]);
        setBookmarks(savedListings.map((l) => l.id));
        setApplications(studentApps);
      } catch (err) {
        console.error("Failed to fetch student profile data", err);
      } finally {
        setAppsLoading(false);
      }
    } else {
      setBookmarks([]);
      setApplications([]);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [activeTab, workMode, department, searchQuery]);

  useEffect(() => {
    fetchStudentData();
  }, [user]);

  const handleToggleBookmark = async (listingId) => {
    if (!user) {
      onOpenAuth();
      return;
    }
    const isSaved = bookmarks.includes(listingId);
    if (isSaved) {
      setBookmarks((prev) => prev.filter((id) => id !== listingId));
      await api.bookmarks.remove(listingId);
    } else {
      setBookmarks((prev) => [...prev, listingId]);
      await api.bookmarks.add(listingId);
    }
  };

  const handleOpenDetail = (listing) => {
    setSelectedListing(listing);
    setShowDetailModal(true);
  };

  const handleStartApply = (listing) => {
    if (!user) {
      onOpenAuth();
      return;
    }
    setApplyingListing(listing);
    setShowApplyModal(true);
  };

  const handleApplicationSuccess = () => {
    setShowApplyModal(false);
    fetchStudentData();
    setActiveTab("applications");
  };

  const resetFilters = () => {
    setSearchQuery("");
    setWorkMode("All");
    setDepartment("All");
    setSelectedSkill(null);
  };

  const studentSkills = user?.studentProfile?.skills || [];

  let displayedListings = listings;

  if (activeTab === "saved") {
    displayedListings = listings.filter((l) => bookmarks.includes(l.id));
  } else if (activeTab === "recommended") {
    if (studentSkills.length > 0) {
      const lowerStudentSkills = studentSkills.map((s) => s.toLowerCase());
      displayedListings = [...listings]
        .map((listing) => {
          const reqs = listing.skillsRequired || [];
          let matches = 0;
          const matchedSkills = [];
          const missingSkills = [];

          for (const req of reqs) {
            const reqLower = req.toLowerCase();
            if (lowerStudentSkills.some((s) => s.includes(reqLower) || reqLower.includes(s))) {
              matches++;
              matchedSkills.push(req);
            } else {
              missingSkills.push(req);
            }
          }

          let score = reqs.length > 0 ? Math.round((matches / reqs.length) * 100) : 50;
          if (matchedSkills.length > 0 && score < 40) score = 40;

          return {
            ...listing,
            matchScore: score,
            matchedSkills,
            missingSkills
          };
        })
        .sort((a, b) => b.matchScore - a.matchScore);
    }
  }

  if (selectedSkill) {
    displayedListings = displayedListings.filter((l) =>
      l.skillsRequired.some((s) => s.toLowerCase() === selectedSkill.toLowerCase())
    );
  }

  const popularSkills = [
    "React",
    "Node.js",
    "MongoDB",
    "TypeScript",
    "Python",
    "Tailwind CSS",
    "Docker",
    "AWS",
    "AI & LLMs"
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Hero Banner with Dynamic Resume Scraping Callout */}
      <div className="rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 text-white p-6 sm:p-8 shadow-xl relative overflow-hidden border border-indigo-900/60">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-indigo-500/10 pointer-events-none blur-3xl" />
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Student Career, Resume & Hackathon Launchpad</span>
            </div>

            {user && (
              studentSkills.length > 0 ? (
                <button
                  onClick={() => setActiveTab("recommended")}
                  className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/40 hover:bg-emerald-500/30 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{studentSkills.length} Skills Scraped • View Recommended</span>
                </button>
              ) : (
                <button
                  onClick={() => setActiveTab("profile")}
                  className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/40 hover:bg-amber-500/30 transition-colors cursor-pointer animate-pulse"
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>Upload Resume to Unlock AI Match Scoring</span>
                </button>
              )
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
            Discover Verified Internships, Hackathons & Entry-Level Roles
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
            Upload your resume to automatically extract tech skills, receive personalized job match scores, track your ATS applications, and share project achievements with top tech recruiters.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab("profile")}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-md cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>{user?.studentProfile?.resumeFileName ? "Manage Resume & Skills" : "Upload & Scrape Resume"}</span>
            </button>
            <button
              onClick={() => setActiveTab("achievements")}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700 font-semibold text-xs transition-all cursor-pointer"
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Student Achievements Feed</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 max-w-full">
          {/* Recommended Tab */}
          <button
            onClick={() => setActiveTab("recommended")}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
              activeTab === "recommended"
                ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xs"
                : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Recommended for You</span>
            {studentSkills.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/30 text-white text-[10px] font-bold">
                AI Matched
              </span>
            )}
          </button>

          {/* All Opportunities */}
          <button
            onClick={() => setActiveTab("all")}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
              activeTab === "all"
                ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-xs"
                : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>All Opportunities</span>
          </button>

          {/* Internships */}
          <button
            onClick={() => setActiveTab("internship")}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
              activeTab === "internship"
                ? "bg-purple-600 text-white shadow-xs"
                : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Internships</span>
          </button>

          {/* Hackathons */}
          <button
            onClick={() => setActiveTab("hackathon")}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
              activeTab === "hackathon"
                ? "bg-amber-600 text-white shadow-xs"
                : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Hackathons</span>
          </button>

          {/* Job Roles */}
          <button
            onClick={() => setActiveTab("job")}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
              activeTab === "job"
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Job Roles</span>
          </button>

          {/* My Applications */}
          <button
            onClick={() => setActiveTab("applications")}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
              activeTab === "applications"
                ? "bg-indigo-600 text-white shadow-xs"
                : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>My Applications</span>
            {applications.length > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-indigo-200/50 dark:bg-indigo-900/60 text-indigo-900 dark:text-indigo-200 text-[10px] font-bold">
                {applications.length}
              </span>
            )}
          </button>

          {/* Saved */}
          <button
            onClick={() => setActiveTab("saved")}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
              activeTab === "saved"
                ? "bg-amber-700 text-white shadow-xs"
                : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Saved ({bookmarks.length})</span>
          </button>

          {/* Achievements Tab */}
          <button
            onClick={() => setActiveTab("achievements")}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
              activeTab === "achievements"
                ? "bg-amber-600 text-white shadow-xs"
                : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Achievements</span>
          </button>

          {/* My Profile & Resume Tab */}
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
              activeTab === "profile"
                ? "bg-indigo-600 text-white shadow-xs"
                : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>My Profile & Resume</span>
            {user?.studentProfile?.resumeFileName && (
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            )}
          </button>
        </div>
      </div>

      {/* Conditional View Rendering */}
      {activeTab === "profile" ? (
        <StudentProfileView
          onNavigateToRecommended={() => setActiveTab("recommended")}
          onOpenAuth={onOpenAuth}
        />
      ) : activeTab === "achievements" ? (
        <StudentAchievementsView onOpenAuth={onOpenAuth} />
      ) : activeTab === "applications" ? (
        <StudentApplicationsView
          applications={applications}
          loading={appsLoading}
          onExplore={() => setActiveTab("all")}
        />
      ) : (
        <Fragment>
          {/* Recommended Header Callout when activeTab === 'recommended' */}
          {activeTab === "recommended" && (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-teal-950/80 border border-emerald-800/60 text-white space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white">
                      Personalized Match Scoring (Ranked by Your Resume Skills)
                    </h2>
                    <p className="text-xs text-slate-300">
                      {studentSkills.length > 0
                        ? `Scored against ${studentSkills.length} extracted skills: ${studentSkills.slice(0, 6).join(", ")}${studentSkills.length > 6 ? "..." : ""}`
                        : "Upload your resume to calculate precise skills match percentages."}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab("profile")}
                  className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold transition-colors cursor-pointer self-start sm:self-center"
                >
                  Edit Resume Skills
                </button>
              </div>

              {studentSkills.length === 0 && (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <p>
                    You haven't uploaded or scraped your resume yet. Upload your resume now to get 100% personalized recommendations.
                  </p>
                  <button
                    onClick={() => setActiveTab("profile")}
                    className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shrink-0 cursor-pointer"
                  >
                    Upload Resume Now
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Search and Filters Card */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs space-y-3 transition-colors">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              <div className="md:col-span-5 relative">
                <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search opportunities, company name, skills..."
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="md:col-span-3">
                <select
                  value={workMode}
                  onChange={(e) => setWorkMode(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="All">All Work Modes</option>
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="On-site">On-site</option>
                </select>
              </div>
              <div className="md:col-span-3">
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="All">All Departments</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Product Engineering">Product Engineering</option>
                  <option value="Developer Relations & Community">Developer Relations</option>
                  <option value="FinTech Innovation Lab">FinTech Lab</option>
                  <option value="Infrastructure">Infrastructure</option>
                </select>
              </div>
              <div className="md:col-span-1 flex items-center justify-end">
                <button
                  onClick={resetFilters}
                  title="Reset all filters"
                  className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer w-full flex items-center justify-center"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Filter by skill buttons */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center flex-wrap gap-1.5 text-xs">
              <span className="text-slate-400 dark:text-slate-500 text-[11px] font-medium mr-1 flex items-center">
                <Sparkles className="w-3 h-3 text-indigo-500 mr-1" />
                Filter by Skill:
              </span>
              {popularSkills.map((skill) => (
                <button
                  key={skill}
                  onClick={() => setSelectedSkill(selectedSkill === skill ? null : skill)}
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium transition-colors cursor-pointer ${
                    selectedSkill === skill
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  {skill}
                </button>
              ))}
              {selectedSkill && (
                <button
                  onClick={() => setSelectedSkill(null)}
                  className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline ml-2 cursor-pointer"
                >
                  Clear skill filter
                </button>
              )}
            </div>
          </div>

          {/* Counts & Status */}
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
            <span>
              Showing <strong className="text-slate-800 dark:text-slate-200">{displayedListings.length}</strong> opportunities
            </span>
            {user && (
              <span className="text-emerald-700 dark:text-emerald-400 font-medium">
                Logged in as student ({user.name})
              </span>
            )}
          </div>

          {/* Listings Grid */}
          {loading ? (
            <div className="py-20 text-center text-slate-500 dark:text-slate-400">
              <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs font-medium">Loading opportunities...</p>
            </div>
          ) : displayedListings.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center max-w-md mx-auto">
              <Search className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">No opportunities match your search</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">
                Try loosening your filters or resetting search keywords.
              </p>
              <button
                onClick={resetFilters}
                className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-semibold cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {displayedListings.map((listing) => {
                const isBookmarked = bookmarks.includes(listing.id);
                const hasApplied = applications.some((app) => app.listingId === listing.id);
                return (
                  <OpportunityCard
                    key={listing.id}
                    listing={listing}
                    isBookmarked={isBookmarked}
                    hasApplied={hasApplied}
                    onSelect={handleOpenDetail}
                    onApply={handleStartApply}
                    onToggleBookmark={handleToggleBookmark}
                  />
                );
              })}
            </div>
          )}
        </Fragment>
      )}

      {/* Modals */}
      <OpportunityDetailModal
        listing={selectedListing}
        isOpen={showDetailModal}
        hasApplied={applications.some((a) => a.listingId === selectedListing?.id)}
        onClose={() => setShowDetailModal(false)}
        onApply={handleStartApply}
      />
      <ApplicationModal
        listing={applyingListing}
        isOpen={showApplyModal}
        onClose={() => setShowApplyModal(false)}
        onSuccess={handleApplicationSuccess}
        onOpenAuth={onOpenAuth}
      />
    </div>
  );
};
