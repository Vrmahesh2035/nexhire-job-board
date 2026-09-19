import { jsx, jsxs } from "react/jsx-runtime";
import { X, CheckCircle2, Building2, ArrowRight } from "lucide-react";
export const OpportunityDetailModal = ({
  listing,
  isOpen,
  hasApplied,
  onClose,
  onApply
}) => {
  if (!isOpen || !listing) return null;
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200", children: /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-6 transition-colors", children: [
    /* @__PURE__ */ jsxs("div", { className: "p-6 bg-slate-900 dark:bg-slate-950 text-white relative border-b border-slate-800", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: onClose,
          className: "absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer",
          children: /* @__PURE__ */ jsx(X, { className: "w-5 h-5" })
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2 mb-2", children: [
        /* @__PURE__ */ jsx("span", { className: "text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/10 text-emerald-300 border border-white/20", children: listing.type === "job" ? "Full-Time Job" : listing.type === "internship" ? "Internship" : "Hackathon" }),
        /* @__PURE__ */ jsx("span", { className: "text-[11px] font-medium px-2 py-0.5 rounded-full bg-white/5 text-slate-300 border border-white/10", children: listing.workMode }),
        /* @__PURE__ */ jsx("span", { className: "text-[11px] font-medium px-2 py-0.5 rounded-full bg-white/5 text-slate-300 border border-white/10", children: listing.department })
      ] }),
      /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-white leading-snug", children: listing.title }),
      /* @__PURE__ */ jsxs("div", { className: "mt-1 flex items-center space-x-2 text-sm text-slate-300", children: [
        /* @__PURE__ */ jsx(Building2, { className: "w-4 h-4 text-emerald-400" }),
        /* @__PURE__ */ jsx("span", { className: "font-semibold", children: listing.companyName })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-4 pt-4 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("span", { className: "text-slate-400 block text-[10px] uppercase", children: "Location" }),
          /* @__PURE__ */ jsx("span", { className: "font-semibold text-white truncate block", children: listing.location })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("span", { className: "text-slate-400 block text-[10px] uppercase", children: listing.type === "hackathon" ? "Prize Pool" : "Compensation" }),
          /* @__PURE__ */ jsx("span", { className: "font-semibold text-emerald-400 truncate block", children: listing.prizePool || listing.salaryOrStipend })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("span", { className: "text-slate-400 block text-[10px] uppercase", children: "Duration" }),
          /* @__PURE__ */ jsx("span", { className: "font-semibold text-white truncate block", children: listing.duration || "Flexible" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("span", { className: "text-slate-400 block text-[10px] uppercase", children: "Deadline" }),
          /* @__PURE__ */ jsx("span", { className: "font-semibold text-amber-300 truncate block", children: listing.deadline })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "p-6 space-y-6 max-h-[60vh] overflow-y-auto", children: [
      listing.type === "hackathon" && /* @__PURE__ */ jsxs("div", { className: "p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 grid grid-cols-1 sm:grid-cols-3 gap-3", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("span", { className: "text-amber-700 dark:text-amber-300 font-semibold block", children: "Team Size:" }),
          /* @__PURE__ */ jsx("span", { children: listing.teamSize || "1 - 4 Members" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("span", { className: "text-amber-700 dark:text-amber-300 font-semibold block", children: "Event Dates:" }),
          /* @__PURE__ */ jsxs("span", { children: [
            listing.startDate,
            " to ",
            listing.endDate
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("span", { className: "text-amber-700 dark:text-amber-300 font-semibold block", children: "Theme:" }),
          /* @__PURE__ */ jsx("span", { children: listing.theme || "Innovation Challenge" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h4", { className: "text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2", children: "Overview" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-700 dark:text-slate-300 leading-relaxed", children: listing.description })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h4", { className: "text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2", children: "Skills & Technologies" }),
        /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: listing.skillsRequired.map((skill) => /* @__PURE__ */ jsx(
          "span",
          {
            className: "px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-800 dark:text-indigo-300 text-xs font-semibold",
            children: skill
          },
          skill
        )) })
      ] }),
      listing.responsibilities && listing.responsibilities.length > 0 && /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h4", { className: "text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2", children: listing.type === "hackathon" ? "Hackathon Tracks & Challenges" : "Key Responsibilities" }),
        /* @__PURE__ */ jsx("ul", { className: "space-y-2", children: listing.responsibilities.map((resp, idx) => /* @__PURE__ */ jsxs("li", { className: "flex items-start space-x-2 text-xs text-slate-700 dark:text-slate-300", children: [
          /* @__PURE__ */ jsx(CheckCircle2, { className: "w-4 h-4 text-emerald-500 shrink-0 mt-0.5" }),
          /* @__PURE__ */ jsx("span", { children: resp })
        ] }, idx)) })
      ] }),
      listing.requirements && listing.requirements.length > 0 && /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h4", { className: "text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2", children: "Eligibility & Requirements" }),
        /* @__PURE__ */ jsx("ul", { className: "space-y-2", children: listing.requirements.map((req, idx) => /* @__PURE__ */ jsxs("li", { className: "flex items-start space-x-2 text-xs text-slate-700 dark:text-slate-300", children: [
          /* @__PURE__ */ jsx(CheckCircle2, { className: "w-4 h-4 text-indigo-500 shrink-0 mt-0.5" }),
          /* @__PURE__ */ jsx("span", { children: req })
        ] }, idx)) })
      ] }),
      listing.perks && listing.perks.length > 0 && /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h4", { className: "text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2", children: "Perks & Benefits" }),
        /* @__PURE__ */ jsx("ul", { className: "space-y-2", children: listing.perks.map((perk, idx) => /* @__PURE__ */ jsxs("li", { className: "flex items-start space-x-2 text-xs text-slate-700 dark:text-slate-300", children: [
          /* @__PURE__ */ jsx(CheckCircle2, { className: "w-4 h-4 text-amber-500 shrink-0 mt-0.5" }),
          /* @__PURE__ */ jsx("span", { children: perk })
        ] }, idx)) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: onClose,
          className: "px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer",
          children: "Close"
        }
      ),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => {
            onClose();
            onApply(listing);
          },
          disabled: hasApplied,
          className: `px-5 py-2.5 rounded-xl font-semibold text-xs flex items-center space-x-2 transition-all shadow-md cursor-pointer ${hasApplied ? "bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 cursor-default" : listing.type === "hackathon" ? "bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 text-white" : "bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white"}`,
          children: [
            /* @__PURE__ */ jsx("span", { children: hasApplied ? "Already Applied" : listing.type === "hackathon" ? "Register Now" : "Apply for Opportunity" }),
            !hasApplied && /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4" })
          ]
        }
      )
    ] })
  ] }) });
};
