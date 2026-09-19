import { jsx, jsxs } from "react/jsx-runtime";
import { Clock, CheckCircle2, AlertCircle, Building2, MessageSquare, ArrowRight } from "lucide-react";
const STAGES = ["Applied", "Screening", "Shortlisted", "Interview", "Offer"];
export const StudentApplicationsView = ({
  applications,
  loading,
  onExplore
}) => {
  if (loading) {
    return /* @__PURE__ */ jsxs("div", { className: "py-16 text-center text-slate-500", children: [
      /* @__PURE__ */ jsx("div", { className: "w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" }),
      /* @__PURE__ */ jsx("p", { className: "text-xs font-medium", children: "Loading your applications..." })
    ] });
  }
  if (applications.length === 0) {
    return /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center max-w-lg mx-auto my-8 transition-colors", children: [
      /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-3", children: /* @__PURE__ */ jsx(Clock, { className: "w-6 h-6" }) }),
      /* @__PURE__ */ jsx("h3", { className: "text-base font-bold text-slate-800 dark:text-white", children: "No Applications Yet" }),
      /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500 dark:text-slate-400 mt-1 mb-5 leading-relaxed", children: "You haven't applied to any internships, hackathons, or job roles yet. Explore open opportunities and start applying!" }),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: onExplore,
          className: "px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors inline-flex items-center space-x-2 cursor-pointer",
          children: [
            /* @__PURE__ */ jsx("span", { children: "Explore Opportunities" }),
            /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4" })
          ]
        }
      )
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-base font-bold text-slate-900 dark:text-white", children: "Application Tracking Dashboard" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500 dark:text-slate-400", children: "Live progress across recruiter review stages" })
      ] }),
      /* @__PURE__ */ jsxs("span", { className: "text-xs font-semibold px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 rounded-full border border-indigo-200 dark:border-indigo-800", children: [
        applications.length,
        " ",
        applications.length === 1 ? "Application" : "Applications",
        " Submitted"
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "space-y-4", children: applications.map((app) => {
      const currentStageIndex = STAGES.indexOf(app.status);
      const isRejected = app.status === "Rejected";
      return /* @__PURE__ */ jsxs(
        "div",
        {
          className: "bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all space-y-4",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-2", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700", children: app.listingType }),
                  /* @__PURE__ */ jsx("span", { className: "text-xs text-slate-400", children: "\u2022" }),
                  /* @__PURE__ */ jsxs("span", { className: "text-xs text-slate-500 dark:text-slate-400", children: [
                    "Applied ",
                    new Date(app.appliedAt).toLocaleDateString()
                  ] })
                ] }),
                /* @__PURE__ */ jsx("h3", { className: "font-bold text-base text-slate-900 dark:text-white mt-1", children: app.listingTitle }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-1.5 text-xs text-slate-600 dark:text-slate-400 mt-0.5", children: [
                  /* @__PURE__ */ jsx(Building2, { className: "w-3.5 h-3.5 text-slate-400 dark:text-slate-500" }),
                  /* @__PURE__ */ jsx("span", { className: "font-semibold text-slate-800 dark:text-slate-200", children: app.companyName })
                ] })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "flex items-center space-x-2 self-start sm:self-center", children: /* @__PURE__ */ jsx(
                "span",
                {
                  className: `px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusBadge(
                    app.status
                  )}`,
                  children: app.status
                }
              ) })
            ] }),
            !isRejected ? /* @__PURE__ */ jsx("div", { className: "pt-2", children: /* @__PURE__ */ jsxs("div", { className: "relative flex items-center justify-between", children: [
              /* @__PURE__ */ jsx("div", { className: "absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-100 dark:bg-slate-800 -z-0" }),
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: "absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-indigo-600 transition-all -z-0",
                  style: {
                    width: `${Math.max(0, currentStageIndex / (STAGES.length - 1) * 100)}%`
                  }
                }
              ),
              STAGES.map((stage, idx) => {
                const isCompleted = idx <= currentStageIndex;
                const isCurrent = idx === currentStageIndex;
                return /* @__PURE__ */ jsxs("div", { className: "relative z-10 flex flex-col items-center", children: [
                  /* @__PURE__ */ jsx(
                    "div",
                    {
                      className: `w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${isCurrent ? "bg-indigo-600 text-white ring-4 ring-indigo-100 dark:ring-indigo-950" : isCompleted ? "bg-indigo-600 text-white" : "bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400"}`,
                      children: isCompleted ? /* @__PURE__ */ jsx(CheckCircle2, { className: "w-4 h-4" }) : idx + 1
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "span",
                    {
                      className: `mt-1 text-[11px] font-medium hidden sm:block ${isCurrent ? "text-indigo-700 dark:text-indigo-400 font-bold" : isCompleted ? "text-slate-800 dark:text-slate-200" : "text-slate-400 dark:text-slate-500"}`,
                      children: stage
                    }
                  )
                ] }, stage);
              })
            ] }) }) : /* @__PURE__ */ jsxs("div", { className: "p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl text-rose-800 dark:text-rose-200 text-xs flex items-center space-x-2", children: [
              /* @__PURE__ */ jsx(AlertCircle, { className: "w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" }),
              /* @__PURE__ */ jsx("span", { children: "The recruiter has decided to move forward with other candidates at this time." })
            ] }),
            app.recruiterNotes && /* @__PURE__ */ jsxs("div", { className: "p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 space-y-1", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-1.5 font-semibold text-slate-800 dark:text-slate-200", children: [
                /* @__PURE__ */ jsx(MessageSquare, { className: "w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" }),
                /* @__PURE__ */ jsx("span", { children: "Recruiter Note / Status Feedback:" })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-slate-600 dark:text-slate-300 pl-5 leading-relaxed", children: app.recruiterNotes })
            ] }),
            app.timeline && app.timeline.length > 0 && /* @__PURE__ */ jsxs("div", { className: "border-t border-slate-100 dark:border-slate-800 pt-3 text-[11px] text-slate-500 dark:text-slate-400 space-y-1", children: [
              /* @__PURE__ */ jsx("span", { className: "font-semibold text-slate-700 dark:text-slate-300 block", children: "Activity History:" }),
              app.timeline.map((event, idx) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-slate-600 dark:text-slate-400", children: [
                /* @__PURE__ */ jsxs("span", { children: [
                  "\u2022 ",
                  event.note || `Stage updated to ${event.stage}`
                ] }),
                /* @__PURE__ */ jsx("span", { className: "text-slate-400 dark:text-slate-500", children: new Date(event.date).toLocaleDateString() })
              ] }, idx))
            ] })
          ]
        },
        app.id
      );
    }) })
  ] });
};
function getStatusBadge(status) {
  switch (status) {
    case "Applied":
      return "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800";
    case "Screening":
      return "bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800";
    case "Shortlisted":
      return "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800";
    case "Interview":
      return "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800";
    case "Offer":
      return "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800";
    case "Rejected":
      return "bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800";
    default:
      return "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700";
  }
}
