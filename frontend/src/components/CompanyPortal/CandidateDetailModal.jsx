import { jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import {
  X,
  GraduationCap,
  Sparkles,
  ExternalLink,
  Github,
  Mail,
  Star,
  CheckCircle2,
  ArrowRight
} from "lucide-react";
const STAGES = ["Applied", "Screening", "Shortlisted", "Interview", "Offer", "Rejected"];
export const CandidateDetailModal = ({
  application,
  isOpen,
  onClose,
  onUpdateStatus
}) => {
  if (!isOpen || !application) return null;
  const [selectedStage, setSelectedStage] = useState(application.status);
  const [recruiterNotes, setRecruiterNotes] = useState(application.recruiterNotes || "");
  const [rating, setRating] = useState(application.recruiterRating || 0);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const handleSave = async () => {
    setSaving(true);
    setSavedSuccess(false);
    try {
      await onUpdateStatus(application.id, selectedStage, recruiterNotes, rating);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2e3);
    } catch (err) {
      console.error("Failed to update candidate", err);
    } finally {
      setSaving(false);
    }
  };
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200", children: /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-6 transition-colors", children: [
    /* @__PURE__ */ jsxs("div", { className: "p-6 bg-slate-900 dark:bg-slate-950 text-white relative", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: onClose,
          className: "absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer",
          children: /* @__PURE__ */ jsx(X, { className: "w-5 h-5" })
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3 mb-2", children: [
        /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-lg flex items-center justify-center", children: application.studentName.charAt(0) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-lg font-bold text-white leading-tight", children: application.studentName }),
            /* @__PURE__ */ jsxs("span", { className: "text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-semibold flex items-center space-x-1", children: [
              /* @__PURE__ */ jsx(Sparkles, { className: "w-3 h-3 text-emerald-400" }),
              /* @__PURE__ */ jsxs("span", { children: [
                application.skillsMatchScore,
                "% Skill Match"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-xs text-slate-400 mt-0.5", children: [
            "Applying for: ",
            /* @__PURE__ */ jsx("strong", { className: "text-slate-200", children: application.listingTitle })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-4 pt-3 border-t border-slate-800 flex flex-wrap items-center gap-4 text-xs text-slate-300", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-1", children: [
          /* @__PURE__ */ jsx(GraduationCap, { className: "w-3.5 h-3.5 text-slate-400" }),
          /* @__PURE__ */ jsxs("span", { children: [
            application.studentUniversity,
            " \u2022 Class of ",
            application.studentGradYear
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-1", children: [
          /* @__PURE__ */ jsx(Mail, { className: "w-3.5 h-3.5 text-slate-400" }),
          /* @__PURE__ */ jsx("span", { children: application.studentEmail })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "p-6 space-y-5 max-h-[60vh] overflow-y-auto", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3 text-xs", children: [
        application.githubUrl && /* @__PURE__ */ jsxs(
          "a",
          {
            href: application.githubUrl,
            target: "_blank",
            rel: "noreferrer",
            className: "inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium",
            children: [
              /* @__PURE__ */ jsx(Github, { className: "w-3.5 h-3.5" }),
              /* @__PURE__ */ jsx("span", { children: "GitHub Profile" }),
              /* @__PURE__ */ jsx(ExternalLink, { className: "w-3 h-3 text-slate-400" })
            ]
          }
        ),
        application.portfolioUrl && /* @__PURE__ */ jsxs(
          "a",
          {
            href: application.portfolioUrl,
            target: "_blank",
            rel: "noreferrer",
            className: "inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium",
            children: [
              /* @__PURE__ */ jsx("span", { children: "Portfolio / Demo" }),
              /* @__PURE__ */ jsx(ExternalLink, { className: "w-3 h-3 text-slate-400" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h4", { className: "text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5", children: "Candidate Skills" }),
        /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1.5", children: application.studentSkills.map((skill) => /* @__PURE__ */ jsx(
          "span",
          {
            className: "px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold",
            children: skill
          },
          skill
        )) })
      ] }),
      application.coverNote && /* @__PURE__ */ jsxs("div", { className: "p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-1", children: [
        /* @__PURE__ */ jsx("span", { className: "font-bold text-slate-700 dark:text-slate-200 block", children: "Candidate Cover Note & Pitch:" }),
        /* @__PURE__ */ jsxs("p", { className: "text-slate-700 dark:text-slate-300 leading-relaxed italic", children: [
          '"',
          application.coverNote,
          '"'
        ] })
      ] }),
      application.resumeSummary && /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h4", { className: "text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1", children: "Resume Highlights" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-600 dark:text-slate-300 leading-relaxed", children: application.resumeSummary })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "pt-4 border-t border-slate-200 dark:border-slate-800 space-y-4", children: [
        /* @__PURE__ */ jsx("h4", { className: "text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400", children: "Recruiter Evaluation & ATS Stage" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5", children: "Pipeline Stage" }),
          /* @__PURE__ */ jsx("div", { className: "grid grid-cols-3 sm:grid-cols-6 gap-1.5", children: STAGES.map((st) => /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => setSelectedStage(st),
              className: `py-1.5 px-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${selectedStage === st ? "bg-indigo-600 text-white border-indigo-600 shadow-xs" : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"}`,
              children: st
            },
            st
          )) })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1", children: "Recruiter Rating (1-5)" }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-1", children: [
            [1, 2, 3, 4, 5].map((star) => /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => setRating(star),
                className: "p-1 text-slate-300 hover:text-amber-400 transition-colors cursor-pointer",
                children: /* @__PURE__ */ jsx(
                  Star,
                  {
                    className: `w-5 h-5 ${star <= rating ? "fill-amber-400 text-amber-400" : "text-slate-300 dark:text-slate-600"}`
                  }
                )
              },
              star
            )),
            /* @__PURE__ */ jsx("span", { className: "text-xs text-slate-500 dark:text-slate-400 ml-2", children: rating > 0 ? `${rating} of 5 Stars` : "No rating set" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1", children: "Internal Recruiter Notes / Interview Feedback" }),
          /* @__PURE__ */ jsx(
            "textarea",
            {
              rows: 3,
              value: recruiterNotes,
              onChange: (e) => setRecruiterNotes(e.target.value),
              placeholder: "Log candidate interview performance, team fit, or next steps...",
              className: "w-full p-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-white bg-white dark:bg-slate-800"
            }
          )
        ] })
      ] }),
      application.timeline && application.timeline.length > 0 && /* @__PURE__ */ jsxs("div", { className: "border-t border-slate-100 dark:border-slate-800 pt-3 text-[11px] text-slate-500 dark:text-slate-400 space-y-1", children: [
        /* @__PURE__ */ jsx("span", { className: "font-semibold text-slate-700 dark:text-slate-300 block", children: "Stage Audit Timeline:" }),
        application.timeline.map((evt, idx) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-slate-600 dark:text-slate-400", children: [
          /* @__PURE__ */ jsxs("span", { children: [
            "\u2022 ",
            evt.note || `Stage set to ${evt.stage}`
          ] }),
          /* @__PURE__ */ jsx("span", { className: "text-slate-400 dark:text-slate-500", children: new Date(evt.date).toLocaleDateString() })
        ] }, idx))
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: onClose,
          className: "px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-700 transition-colors cursor-pointer",
          children: "Close"
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
        savedSuccess && /* @__PURE__ */ jsxs("span", { className: "text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center space-x-1", children: [
          /* @__PURE__ */ jsx(CheckCircle2, { className: "w-4 h-4" }),
          /* @__PURE__ */ jsx("span", { children: "Saved" })
        ] }),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: handleSave,
            disabled: saving,
            className: "px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs flex items-center space-x-1.5 transition-all cursor-pointer",
            children: [
              /* @__PURE__ */ jsx("span", { children: saving ? "Updating..." : "Save Candidate Status" }),
              /* @__PURE__ */ jsx(ArrowRight, { className: "w-3.5 h-3.5" })
            ]
          }
        )
      ] })
    ] })
  ] }) });
};
