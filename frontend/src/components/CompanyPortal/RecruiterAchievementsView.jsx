import React, { useState, useEffect } from "react";
import {
  Trophy,
  Search,
  ExternalLink,
  Mail,
  GraduationCap,
  Sparkles,
  Calendar,
  Check,
  Copy,
  Users,
  Building2,
  Filter
} from "lucide-react";
import { api } from "../../services/api";

const categoryFilters = [
  "All",
  "Hackathon Win",
  "Project Launch",
  "Certification",
  "Research & Publication",
  "Open Source Contribution"
];

export const RecruiterAchievementsView = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [skillSearch, setSkillSearch] = useState("");
  const [copiedEmail, setCopiedEmail] = useState(null);

  const fetchAchievements = async () => {
    setLoading(true);
    try {
      const data = await api.studentPosts.getAll({
        achievementType: selectedCategory !== "All" ? selectedCategory : undefined,
        skill: skillSearch || undefined
      });
      setPosts(data);
    } catch (err) {
      console.error("Failed to fetch recruiter achievements feed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, [selectedCategory, skillSearch]);

  const handleCopyEmail = (email) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(null), 3000);
  };

  const getTypeStyle = (type) => {
    switch (type) {
      case "Hackathon Win":
        return "bg-amber-50 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800";
      case "Project Launch":
        return "bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800";
      case "Certification":
        return "bg-cyan-50 dark:bg-cyan-950/70 text-cyan-800 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800";
      case "Research & Publication":
        return "bg-purple-50 dark:bg-purple-950/70 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800";
      default:
        return "bg-indigo-50 dark:bg-indigo-950/70 text-indigo-800 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800";
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Recruiter Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 rounded-2xl text-white p-6 sm:p-7 shadow-lg border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-xl">
          <div className="inline-flex items-center space-x-2 px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
            <Users className="w-3.5 h-3.5" />
            <span>Candidate Sourcing & Proof-of-Work Spotlight</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
            Scout High-Caliber Student Talent by Real Achievements
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Discover collegiate builders, hackathon winners, and certified developers who have built verified projects with your company's required tech stack.
          </p>
        </div>

        <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3.5 text-center shrink-0 self-start md:self-center">
          <span className="text-lg font-bold text-emerald-400 block">{posts.length}</span>
          <span className="text-[10px] text-slate-300 uppercase tracking-wider">Candidate Accomplishments</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs space-y-3 transition-colors">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={skillSearch}
              onChange={(e) => setSkillSearch(e.target.value)}
              placeholder="Search candidate skills (e.g. React, Python, Docker)..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center space-x-1 overflow-x-auto pb-1 max-w-full w-full sm:w-auto">
            {categoryFilters.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Candidates Feed */}
      {loading ? (
        <div className="py-20 text-center text-slate-500 dark:text-slate-400">
          <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-medium">Screening talent achievements...</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center max-w-md mx-auto space-y-3">
          <Trophy className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">No student accomplishments match</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Try loosening your skill search keyword or choosing "All" categories.
          </p>
          <button
            onClick={() => {
              setSelectedCategory("All");
              setSkillSearch("");
            }}
            className="px-4 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
          >
            Reset Sourcing Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs hover:border-emerald-400 dark:hover:border-emerald-600 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Header: Candidate Info & Badge */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-700 text-white font-black text-sm flex items-center justify-center shadow-xs">
                      {post.studentName?.charAt(0) || "S"}
                    </div>
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <span className="font-bold text-sm text-slate-900 dark:text-white leading-tight">
                          {post.studentName}
                        </span>
                        <span className="text-[10px] text-slate-400">•</span>
                        <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                          {post.university}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {post.degree || "B.S. Computer Science"} • Class of {post.gradYear || "2026"}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${getTypeStyle(
                      post.achievementType
                    )}`}
                  >
                    {post.achievementType || "Achievement"}
                  </span>
                </div>

                {/* Title & Story */}
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
                    {post.content}
                  </p>
                </div>

                {/* Verified Skills */}
                {post.skills && post.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {post.skills.map((skill) => (
                      <span
                        key={skill}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium border border-slate-200 dark:border-slate-700"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Recruiter Outreach Action Bar */}
              <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center space-x-2 text-xs text-slate-400">
                  <span className="inline-flex items-center space-x-1 text-[11px]">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  </span>
                  {post.studentEmail && (
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:inline">
                      {post.studentEmail}
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  {post.projectUrl && (
                    <a
                      href={post.projectUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 font-medium transition-colors"
                    >
                      <span>View Project</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}

                  {post.studentEmail && (
                    <button
                      onClick={() => handleCopyEmail(post.studentEmail)}
                      className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
                    >
                      {copiedEmail === post.studentEmail ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Copied Email!</span>
                        </>
                      ) : (
                        <>
                          <Mail className="w-3.5 h-3.5" />
                          <span>Contact Candidate</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
