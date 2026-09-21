import React, { useState } from "react";
import {
  X,
  Trophy,
  Sparkles,
  Link as LinkIcon,
  Tag,
  Eye,
  AlertCircle,
  CheckCircle2,
  Plus
} from "lucide-react";
import { api } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const achievementCategories = [
  "Hackathon Win",
  "Project Launch",
  "Certification",
  "Research & Publication",
  "Award & Honor",
  "Open Source Contribution"
];

const popularSkillSuggestions = [
  "React",
  "Node.js",
  "TypeScript",
  "Python",
  "MongoDB",
  "AI & LLMs",
  "PyTorch",
  "Docker",
  "AWS",
  "Tailwind CSS",
  "PostgreSQL",
  "FastAPI"
];

export const CreateAchievementModal = ({ isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [achievementType, setAchievementType] = useState("Hackathon Win");
  const [content, setContent] = useState("");
  const [projectUrl, setProjectUrl] = useState("");
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [visibleToRecruiters, setVisibleToRecruiters] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleAddSkillTag = (skillToAdd) => {
    const clean = skillToAdd.trim();
    if (!clean) return;
    if (!skills.some((s) => s.toLowerCase() === clean.toLowerCase())) {
      setSkills([...skills, clean]);
    }
    setSkillInput("");
  };

  const handleRemoveSkillTag = (skillToRemove) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError("Please provide both a title and a description of your achievement.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const created = await api.studentPosts.create({
        title: title.trim(),
        achievementType,
        content: content.trim(),
        skills,
        projectUrl: projectUrl.trim(),
        visibleToRecruiters
      });

      onSuccess(created);
      onClose();
    } catch (err) {
      console.error("Failed to post achievement:", err);
      setError(err.message || "Failed to publish achievement.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-6 transition-colors">
        {/* Modal Header */}
        <div className="p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white leading-tight">Post Student Achievement</h3>
              <p className="text-[11px] text-slate-300">Showcase your project, hackathon win, or certification</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-300 text-xs flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Author Badge */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 text-xs flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                {user?.name?.charAt(0) || "S"}
              </div>
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200 block leading-tight">{user?.name}</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">
                  {user?.studentProfile?.university || "Student Candidate"}
                </span>
              </div>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-200 dark:border-emerald-800">
              Verified Student
            </span>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Achievement Headline <span className="text-indigo-600">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Won 1st Place at CalHacks 11.0 with DevSync AI"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Category
            </label>
            <select
              value={achievementType}
              onChange={(e) => setAchievementType(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {achievementCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Description & Highlights <span className="text-indigo-600">*</span>
            </label>
            <textarea
              rows={3}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Describe the challenge, what you built, key architectural decisions, or performance metrics achieved..."
              className="w-full p-3 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Tech Stack & Skills Tags */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Tech Stack & Key Skills
            </label>

            <div className="flex items-center space-x-2 mb-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                placeholder="Type a skill and click Add..."
                className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddSkillTag(skillInput);
                  }
                }}
              />
              <button
                type="button"
                onClick={() => handleAddSkillTag(skillInput)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
              >
                Add
              </button>
            </div>

            {/* Selected Tags */}
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                {skills.map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[11px] font-medium border border-indigo-200 dark:border-indigo-800"
                  >
                    <span>{s}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkillTag(s)}
                      className="text-indigo-400 hover:text-red-500 ml-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Suggestions */}
            <div className="flex flex-wrap gap-1 items-center pt-1">
              <span className="text-[10px] text-slate-400 mr-1">Suggestions:</span>
              {popularSkillSuggestions.slice(0, 7).map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => handleAddSkillTag(suggestion)}
                  className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 cursor-pointer"
                >
                  +{suggestion}
                </button>
              ))}
            </div>
          </div>

          {/* Project Proof / Link */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Proof / Demo / Repository URL
            </label>
            <div className="relative">
              <LinkIcon className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="url"
                value={projectUrl}
                onChange={(e) => setProjectUrl(e.target.value)}
                placeholder="https://github.com/your-project or Devpost link..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Recruiter Visibility Toggle */}
          <div className="p-3.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 flex items-start space-x-3">
            <input
              type="checkbox"
              id="visibilityToggle"
              checked={visibleToRecruiters}
              onChange={(e) => setVisibleToRecruiters(e.target.checked)}
              className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            />
            <label htmlFor="visibilityToggle" className="text-xs cursor-pointer">
              <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-1.5">
                <Eye className="w-3.5 h-3.5 text-indigo-500" />
                <span>Visible to Company Recruiters</span>
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Featured in the Recruiter Talent Spotlight feed so companies hiring for relevant skills can scout and invite you directly.
              </p>
            </label>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center justify-center space-x-2 transition-all shadow-md cursor-pointer disabled:opacity-50"
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>{loading ? "Publishing Achievement..." : "Share Achievement to Feed"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
