import React, { useState, useEffect } from "react";
import {
  Trophy,
  PlusCircle,
  Sparkles,
  ExternalLink,
  Trash2,
  Filter,
  Eye,
  Calendar,
  GraduationCap,
  Github,
  Search,
  CheckCircle
} from "lucide-react";
import { api } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { CreateAchievementModal } from "./CreateAchievementModal";

const categoryFilters = [
  "All",
  "Hackathon Win",
  "Project Launch",
  "Certification",
  "Research & Publication",
  "Open Source Contribution"
];

export const StudentAchievementsView = ({ onOpenAuth }) => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [feedbackNotice, setFeedbackNotice] = useState(null);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const data = await api.studentPosts.getAll({
        achievementType: selectedCategory !== "All" ? selectedCategory : undefined,
        skill: searchQuery || undefined
      });
      setPosts(data);
    } catch (err) {
      console.error("Failed to load achievements", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [selectedCategory, searchQuery]);

  const handlePostSuccess = (newPost) => {
    setPosts([newPost, ...posts]);
    setFeedbackNotice("Your achievement has been posted and is now live for recruiters & students!");
    setTimeout(() => setFeedbackNotice(null), 5000);
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this achievement post?")) {
      return;
    }

    try {
      await api.studentPosts.delete(postId);
      setPosts(posts.filter((p) => p.id !== postId));
      setFeedbackNotice("Achievement post deleted.");
      setTimeout(() => setFeedbackNotice(null), 4000);
    } catch (err) {
      console.error("Delete failed:", err);
      alert(err.message || "Failed to delete post");
    }
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
      {/* Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-7 shadow-lg border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-xl">
          <div className="inline-flex items-center space-x-2 px-3 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/30">
            <Trophy className="w-3.5 h-3.5" />
            <span>Student Achievement & Talent Spotlight</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
            Celebrate Wins, Open-Source Launches & Certifications
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Share your accomplishments directly with verified company recruiters and peers. Build proof of work that stands out in ATS candidate screening.
          </p>
        </div>

        <button
          onClick={() => {
            if (!user) {
              onOpenAuth();
            } else {
              setShowCreateModal(true);
            }
          }}
          className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-semibold text-xs shadow-md flex items-center justify-center space-x-2 transition-all cursor-pointer shrink-0 self-start md:self-center"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post Your Achievement</span>
        </button>
      </div>

      {/* Feedback notice */}
      {feedbackNotice && (
        <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-200 text-xs flex items-center space-x-2 shadow-xs">
          <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span className="font-medium">{feedbackNotice}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs space-y-3 transition-colors">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by skill (e.g. React, PyTorch, AWS)..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center space-x-1 overflow-x-auto pb-1 max-w-full w-full sm:w-auto">
            {categoryFilters.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Posts Feed */}
      {loading ? (
        <div className="py-20 text-center text-slate-500 dark:text-slate-400">
          <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-medium">Loading achievements feed...</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center max-w-md mx-auto space-y-3">
          <Trophy className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">No achievements match your filters</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Be the first to share a project launch, hackathon award, or tech certification!
          </p>
          <button
            onClick={() => {
              setSelectedCategory("All");
              setSearchQuery("");
            }}
            className="px-4 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {posts.map((post) => {
            const isAuthor = user && user.id === post.studentId;
            return (
              <div
                key={post.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs hover:border-indigo-300 dark:hover:border-indigo-500/50 hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  {/* Top Bar: Author & Category Badge */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-emerald-500 text-white font-black text-sm flex items-center justify-center shadow-xs">
                        {post.studentName?.charAt(0) || "S"}
                      </div>
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <span className="font-bold text-xs text-slate-900 dark:text-white leading-tight">
                            {post.studentName}
                          </span>
                          <span className="text-[10px] text-slate-400">•</span>
                          <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium">
                            {post.university}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">
                          {post.degree || "Computer Science"} (Class of {post.gradYear || "2026"})
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

                  {/* Title & Description */}
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
                      {post.content}
                    </p>
                  </div>

                  {/* Skills tags */}
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

                {/* Footer: Date, Recruiter Badge & Links */}
                <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center space-x-2">
                    <span className="inline-flex items-center space-x-1 text-[11px] text-slate-400">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    </span>
                    {post.visibleToRecruiters && (
                      <span className="inline-flex items-center space-x-1 text-[10px] text-emerald-700 dark:text-emerald-400 font-medium bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                        <Eye className="w-3 h-3" />
                        <span>Visible to Recruiters</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    {post.projectUrl && (
                      <a
                        href={post.projectUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center space-x-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        <span>View Project</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}

                    {isAuthor && (
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        title="Delete achievement post"
                        className="p-1 text-slate-400 hover:text-red-500 rounded transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      <CreateAchievementModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handlePostSuccess}
      />
    </div>
  );
};
