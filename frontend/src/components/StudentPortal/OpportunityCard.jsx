import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Bookmark, MapPin, Clock, DollarSign, Award, Sparkles, ArrowUpRight } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
export const OpportunityCard = ({
  listing,
  isBookmarked,
  hasApplied,
  onSelect,
  onApply,
  onToggleBookmark
}) => {
  const { user } = useAuth();
  const studentSkills = user?.studentProfile?.skills || [];
  let matchCount = 0;
  if (studentSkills.length > 0 && listing.skillsRequired.length > 0) {
    const lowerStudent = studentSkills.map((s) => s.toLowerCase());
    for (const req of listing.skillsRequired) {
      if (lowerStudent.some((s) => s.includes(req.toLowerCase()) || req.toLowerCase().includes(s))) {
        matchCount++;
      }
    }
  }
  const matchPercentage = listing.skillsRequired.length > 0 && studentSkills.length > 0 ? Math.min(100, Math.max(40, Math.round(matchCount / listing.skillsRequired.length * 100))) : null;
  return /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-500 hover:shadow-md transition-all duration-200 p-5 flex flex-col justify-between group", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-2 mb-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-1.5", children: [
          /* @__PURE__ */ jsx(
            "span",
            {
              className: `text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${getTypeBadgeStyle(
                listing.type
              )}`,
              children: listing.type === "job" ? "Full-Time Job" : listing.type === "internship" ? "Internship" : "Hackathon"
            }
          ),
          /* @__PURE__ */ jsx("span", { className: "text-[11px] font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-700", children: listing.workMode }),
          matchPercentage !== null && /* @__PURE__ */ jsxs("span", { className: "text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 flex items-center space-x-1", children: [
            /* @__PURE__ */ jsx(Sparkles, { className: "w-3 h-3 text-emerald-500 dark:text-emerald-400" }),
            /* @__PURE__ */ jsxs("span", { children: [
              matchPercentage,
              "% Match"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: (e) => {
              e.stopPropagation();
              onToggleBookmark(listing.id);
            },
            title: isBookmarked ? "Remove bookmark" : "Bookmark for later",
            className: `p-1.5 rounded-lg border transition-colors cursor-pointer ${isBookmarked ? "bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-700 text-amber-600 dark:text-amber-400" : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700"}`,
            children: /* @__PURE__ */ jsx(Bookmark, { className: `w-4 h-4 ${isBookmarked ? "fill-amber-500" : ""}` })
          }
        )
      ] }),
      /* @__PURE__ */ jsx(
        "h3",
        {
          onClick: () => onSelect(listing),
          className: "font-bold text-base text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors cursor-pointer leading-snug line-clamp-2",
          children: listing.title
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "mt-1 flex items-center space-x-2 text-xs text-slate-600 dark:text-slate-400", children: [
        /* @__PURE__ */ jsx("span", { className: "font-semibold text-slate-800 dark:text-slate-200", children: listing.companyName }),
        /* @__PURE__ */ jsx("span", { children: "\u2022" }),
        /* @__PURE__ */ jsx("span", { children: listing.department })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-3 grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-400", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-1.5 truncate", children: [
          /* @__PURE__ */ jsx(MapPin, { className: "w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" }),
          /* @__PURE__ */ jsx("span", { className: "truncate", children: listing.location })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex items-center space-x-1.5 truncate font-medium text-slate-800 dark:text-slate-200", children: listing.type === "hackathon" ? /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(Award, { className: "w-3.5 h-3.5 text-amber-500 shrink-0" }),
          /* @__PURE__ */ jsx("span", { className: "truncate", children: listing.prizePool || listing.salaryOrStipend })
        ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(DollarSign, { className: "w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" }),
          /* @__PURE__ */ jsx("span", { className: "truncate", children: listing.salaryOrStipend })
        ] }) })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "mt-3 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed", children: listing.description }),
      /* @__PURE__ */ jsxs("div", { className: "mt-3.5 flex flex-wrap gap-1.5", children: [
        listing.skillsRequired.slice(0, 4).map((skill) => {
          const isMatch = studentSkills.some((s) => s.toLowerCase() === skill.toLowerCase());
          return /* @__PURE__ */ jsx(
            "span",
            {
              className: `text-[10px] px-2 py-0.5 rounded font-medium ${isMatch ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"}`,
              children: skill
            },
            skill
          );
        }),
        listing.skillsRequired.length > 4 && /* @__PURE__ */ jsxs("span", { className: "text-[10px] px-1.5 py-0.5 rounded bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700", children: [
          "+",
          listing.skillsRequired.length - 4,
          " more"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-1 text-slate-500 dark:text-slate-400 text-[11px]", children: [
        /* @__PURE__ */ jsx(Clock, { className: "w-3.5 h-3.5 text-slate-400 dark:text-slate-500" }),
        /* @__PURE__ */ jsxs("span", { children: [
          "Deadline: ",
          listing.deadline
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => onSelect(listing),
            className: "text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-2.5 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer",
            children: "Details"
          }
        ),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => onApply(listing),
            disabled: hasApplied,
            className: `text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center space-x-1 transition-all cursor-pointer ${hasApplied ? "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700 cursor-default" : listing.type === "hackathon" ? "bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 text-white shadow-xs" : "bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white shadow-xs"}`,
            children: [
              /* @__PURE__ */ jsx("span", { children: hasApplied ? "Applied" : listing.type === "hackathon" ? "Register" : "Apply" }),
              !hasApplied && /* @__PURE__ */ jsx(ArrowUpRight, { className: "w-3.5 h-3.5" })
            ]
          }
        )
      ] })
    ] })
  ] });
};
function getTypeBadgeStyle(type) {
  switch (type) {
    case "internship":
      return "bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800";
    case "hackathon":
      return "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800";
    case "job":
      return "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800";
    default:
      return "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700";
  }
}
