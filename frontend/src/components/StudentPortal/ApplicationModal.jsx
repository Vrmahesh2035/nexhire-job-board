import { jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { X, Send, AlertCircle, GraduationCap, Link as LinkIcon, Github } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";
export const ApplicationModal = ({
  listing,
  isOpen,
  onClose,
  onSuccess,
  onOpenAuth
}) => {
  const { user } = useAuth();
  const [coverNote, setCoverNote] = useState("");
  const [resumeSummary, setResumeSummary] = useState(user?.studentProfile?.resumeSummary || "");
  const [portfolioUrl, setPortfolioUrl] = useState(user?.studentProfile?.portfolio || "");
  const [githubUrl, setGithubUrl] = useState(user?.studentProfile?.github || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  if (!isOpen || !listing) return null;
  if (!user || user.role !== "student") {
    return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200", children: /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-center space-y-4", children: [
      /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto", children: /* @__PURE__ */ jsx(GraduationCap, { className: "w-6 h-6" }) }),
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-slate-900 dark:text-white", children: "Student Sign In Required" }),
      /* @__PURE__ */ jsxs("p", { className: "text-xs text-slate-500 dark:text-slate-400 leading-relaxed", children: [
        "To submit an application for ",
        /* @__PURE__ */ jsx("strong", { children: listing.title }),
        " at ",
        listing.companyName,
        ", please log in or register with your student account."
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "pt-2 flex flex-col gap-2", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => {
              onClose();
              onOpenAuth();
            },
            className: "w-full py-2 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors cursor-pointer",
            children: "Sign In / Register as Student"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: onClose,
            className: "w-full py-2 px-4 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs transition-colors cursor-pointer",
            children: "Cancel"
          }
        )
      ] })
    ] }) });
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await api.applications.submit({
        listingId: listing.id,
        coverNote,
        resumeSummary: resumeSummary || user.studentProfile?.resumeSummary,
        portfolioUrl: portfolioUrl || user.studentProfile?.portfolio,
        githubUrl: githubUrl || user.studentProfile?.github
      });
      onSuccess();
    } catch (err) {
      setError(err.message || "Failed to submit application.");
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200", children: /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-6 transition-colors", children: [
    /* @__PURE__ */ jsxs("div", { className: "p-5 bg-slate-900 dark:bg-slate-950 text-white flex items-center justify-between border-b border-slate-800", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold uppercase tracking-wider text-emerald-400 block", children: "Application Submission" }),
        /* @__PURE__ */ jsx("h3", { className: "text-base font-bold text-white leading-tight", children: listing.title }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-400 mt-0.5", children: listing.companyName })
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: onClose,
          className: "text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer",
          children: /* @__PURE__ */ jsx(X, { className: "w-5 h-5" })
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "p-6 space-y-4 max-h-[70vh] overflow-y-auto", children: [
      error && /* @__PURE__ */ jsxs("div", { className: "p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-300 text-xs flex items-start space-x-2", children: [
        /* @__PURE__ */ jsx(AlertCircle, { className: "w-4 h-4 shrink-0 mt-0.5" }),
        /* @__PURE__ */ jsx("span", { children: error })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-1.5", children: [
        /* @__PURE__ */ jsx("span", { className: "text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider block", children: "Submitting as Candidate" }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsx("span", { className: "font-bold text-slate-900 dark:text-white", children: user.name }),
          /* @__PURE__ */ jsx("span", { className: "text-slate-500 dark:text-slate-400", children: user.email })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "text-slate-600 dark:text-slate-300", children: [
          user.studentProfile?.degree,
          " \u2022 ",
          user.studentProfile?.university,
          " (Class of ",
          user.studentProfile?.gradYear,
          ")"
        ] }),
        user.studentProfile?.skills && user.studentProfile.skills.length > 0 && /* @__PURE__ */ jsx("div", { className: "pt-1 flex flex-wrap gap-1", children: user.studentProfile.skills.map((skill) => /* @__PURE__ */ jsx(
          "span",
          {
            className: "text-[10px] bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium",
            children: skill
          },
          skill
        )) })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("label", { className: "block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1", children: [
          "Cover Note & Pitch ",
          /* @__PURE__ */ jsx("span", { className: "text-slate-400 dark:text-slate-500 font-normal", children: "(Why are you excited for this?)" })
        ] }),
        /* @__PURE__ */ jsx(
          "textarea",
          {
            rows: 3,
            required: true,
            value: coverNote,
            onChange: (e) => setCoverNote(e.target.value),
            placeholder: "Highlight relevant projects, coursework, or why this role matches your career aspirations...",
            className: "w-full p-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1", children: "Resume Summary / Highlight" }),
        /* @__PURE__ */ jsx(
          "textarea",
          {
            rows: 2,
            value: resumeSummary,
            onChange: (e) => setResumeSummary(e.target.value),
            placeholder: "Brief summary of your technical background...",
            className: "w-full p-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1", children: "GitHub Profile" }),
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx(Github, { className: "w-3.5 h-3.5 text-slate-400 dark:text-slate-500 absolute left-2.5 top-2.5" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "url",
                value: githubUrl,
                onChange: (e) => setGithubUrl(e.target.value),
                placeholder: "https://github.com/...",
                className: "w-full pl-8 pr-2.5 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1", children: "Portfolio / Project Link" }),
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx(LinkIcon, { className: "w-3.5 h-3.5 text-slate-400 dark:text-slate-500 absolute left-2.5 top-2.5" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "url",
                value: portfolioUrl,
                onChange: (e) => setPortfolioUrl(e.target.value),
                placeholder: "https://...",
                className: "w-full pl-8 pr-2.5 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "pt-3", children: /* @__PURE__ */ jsxs(
        "button",
        {
          type: "submit",
          disabled: loading,
          className: "w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center justify-center space-x-2 transition-all shadow-md cursor-pointer",
          children: [
            /* @__PURE__ */ jsx(Send, { className: "w-3.5 h-3.5" }),
            /* @__PURE__ */ jsx("span", { children: loading ? "Submitting Application..." : "Send Application to Recruiter" })
          ]
        }
      ) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "px-6 py-2.5 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-center text-[11px] text-slate-500 dark:text-slate-400", children: "Your profile and match score will be sent directly to the employer's ATS pipeline." })
  ] }) });
};
