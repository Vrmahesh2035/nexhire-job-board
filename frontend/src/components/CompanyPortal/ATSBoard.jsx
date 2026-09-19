import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import {
  Search,
  Sparkles,
  GraduationCap,
  Star,
  SlidersHorizontal,
  RotateCcw,
  Users,
  LayoutGrid,
  ListFilter
} from "lucide-react";
import { CandidateDetailModal } from "./CandidateDetailModal";
const STAGES = ["Applied", "Screening", "Shortlisted", "Interview", "Offer", "Rejected"];
export const ATSBoard = ({
  applications,
  listings,
  loading,
  onUpdateStatus,
  onRefresh
}) => {
  const [selectedListingId, setSelectedListingId] = useState("all");
  const [selectedStage, setSelectedStage] = useState("all");
  const [minMatchScore, setMinMatchScore] = useState("all");
  const [gradYearFilter, setGradYearFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("kanban");
  const [activeCandidate, setActiveCandidate] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const filteredCandidates = applications.filter((app) => {
    if (selectedListingId !== "all" && app.listingId !== selectedListingId) return false;
    if (selectedStage !== "all" && app.status !== selectedStage) return false;
    if (gradYearFilter !== "all" && app.studentGradYear !== gradYearFilter) return false;
    if (minMatchScore !== "all") {
      const min = parseInt(minMatchScore, 10);
      if (app.skillsMatchScore < min) return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = app.studentName.toLowerCase().includes(q);
      const matchUni = app.studentUniversity.toLowerCase().includes(q);
      const matchEmail = app.studentEmail.toLowerCase().includes(q);
      const matchSkills = app.studentSkills.some((s) => s.toLowerCase().includes(q));
      const matchListing = app.listingTitle.toLowerCase().includes(q);
      if (!matchName && !matchUni && !matchEmail && !matchSkills && !matchListing) return false;
    }
    return true;
  });
  const resetFilters = () => {
    setSelectedListingId("all");
    setSelectedStage("all");
    setMinMatchScore("all");
    setGradYearFilter("all");
    setSearchQuery("");
  };
  const handleOpenCandidate = (candidate) => {
    setActiveCandidate(candidate);
    setShowDetailModal(true);
  };
  const stageCounts = STAGES.reduce((acc, stage) => {
    acc[stage] = applications.filter((a) => a.status === stage).length;
    return acc;
  }, {});
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs transition-colors", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("h2", { className: "text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2", children: [
            /* @__PURE__ */ jsx("span", { children: "Candidate Applicant Tracking Pipeline" }),
            /* @__PURE__ */ jsxs("span", { className: "text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-200 dark:border-emerald-800", children: [
              applications.length,
              " Total Applicants"
            ] })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500 dark:text-slate-400 mt-0.5", children: "Screen, rank by skill match, evaluate, and advance applicants through recruitment stages" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex items-center space-x-2 self-start sm:self-center", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700 text-xs", children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: () => setViewMode("kanban"),
              className: `flex items-center space-x-1.5 px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${viewMode === "kanban" ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs" : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"}`,
              children: [
                /* @__PURE__ */ jsx(LayoutGrid, { className: "w-3.5 h-3.5" }),
                /* @__PURE__ */ jsx("span", { children: "Kanban Pipeline" })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: () => setViewMode("list"),
              className: `flex items-center space-x-1.5 px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${viewMode === "list" ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs" : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"}`,
              children: [
                /* @__PURE__ */ jsx(ListFilter, { className: "w-3.5 h-3.5" }),
                /* @__PURE__ */ jsx("span", { children: "List View" })
              ]
            }
          )
        ] }) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-4", children: STAGES.map((stage) => /* @__PURE__ */ jsxs(
        "div",
        {
          onClick: () => setSelectedStage(selectedStage === stage ? "all" : stage),
          className: `p-2.5 rounded-xl border cursor-pointer transition-all ${selectedStage === stage ? "bg-indigo-50/80 dark:bg-indigo-950/60 border-indigo-300 dark:border-indigo-700 ring-2 ring-indigo-200 dark:ring-indigo-900" : "bg-slate-50/60 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:bg-slate-100/70 dark:hover:bg-slate-800"}`,
          children: [
            /* @__PURE__ */ jsx("span", { className: "text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block tracking-wider truncate", children: stage }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mt-1", children: [
              /* @__PURE__ */ jsx("span", { className: "text-lg font-bold text-slate-900 dark:text-white", children: stageCounts[stage] }),
              /* @__PURE__ */ jsx("span", { className: `w-2 h-2 rounded-full ${getStageDotColor(stage)}` })
            ] })
          ]
        },
        stage
      )) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs space-y-3 transition-colors", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-200 pb-1", children: [
        /* @__PURE__ */ jsxs("span", { className: "flex items-center space-x-1.5", children: [
          /* @__PURE__ */ jsx(SlidersHorizontal, { className: "w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" }),
          /* @__PURE__ */ jsx("span", { children: "Candidate Screening & Filtering Tools" })
        ] }),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: resetFilters,
            className: "text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline flex items-center space-x-1 cursor-pointer font-semibold",
            children: [
              /* @__PURE__ */ jsx(RotateCcw, { className: "w-3 h-3" }),
              /* @__PURE__ */ jsx("span", { children: "Reset Filters" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-2.5", children: [
        /* @__PURE__ */ jsxs("div", { className: "lg:col-span-4 relative", children: [
          /* @__PURE__ */ jsx(Search, { className: "w-4 h-4 text-slate-400 absolute left-3 top-2.5" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              value: searchQuery,
              onChange: (e) => setSearchQuery(e.target.value),
              placeholder: "Search candidate name, university, skills...",
              className: "w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-white bg-white dark:bg-slate-800"
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "lg:col-span-3", children: /* @__PURE__ */ jsxs(
          "select",
          {
            value: selectedListingId,
            onChange: (e) => setSelectedListingId(e.target.value),
            className: "w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200",
            children: [
              /* @__PURE__ */ jsx("option", { value: "all", children: "All Job & Internship Postings" }),
              listings.map((l) => /* @__PURE__ */ jsx("option", { value: l.id, children: l.title.length > 35 ? l.title.substring(0, 35) + "..." : l.title }, l.id))
            ]
          }
        ) }),
        /* @__PURE__ */ jsx("div", { className: "lg:col-span-2", children: /* @__PURE__ */ jsxs(
          "select",
          {
            value: selectedStage,
            onChange: (e) => setSelectedStage(e.target.value),
            className: "w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200",
            children: [
              /* @__PURE__ */ jsx("option", { value: "all", children: "All Stages" }),
              STAGES.map((s) => /* @__PURE__ */ jsx("option", { value: s, children: s }, s))
            ]
          }
        ) }),
        /* @__PURE__ */ jsx("div", { className: "lg:col-span-2", children: /* @__PURE__ */ jsxs(
          "select",
          {
            value: minMatchScore,
            onChange: (e) => setMinMatchScore(e.target.value),
            className: "w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200",
            children: [
              /* @__PURE__ */ jsx("option", { value: "all", children: "Any Match Score" }),
              /* @__PURE__ */ jsx("option", { value: "90", children: "\u2265 90% Match (Top Tier)" }),
              /* @__PURE__ */ jsx("option", { value: "80", children: "\u2265 80% Match" }),
              /* @__PURE__ */ jsx("option", { value: "70", children: "\u2265 70% Match" })
            ]
          }
        ) }),
        /* @__PURE__ */ jsx("div", { className: "lg:col-span-1", children: /* @__PURE__ */ jsxs(
          "select",
          {
            value: gradYearFilter,
            onChange: (e) => setGradYearFilter(e.target.value),
            className: "w-full px-2 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200",
            children: [
              /* @__PURE__ */ jsx("option", { value: "all", children: "Class" }),
              /* @__PURE__ */ jsx("option", { value: "2025", children: "2025" }),
              /* @__PURE__ */ jsx("option", { value: "2026", children: "2026" }),
              /* @__PURE__ */ jsx("option", { value: "2027", children: "2027" })
            ]
          }
        ) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400", children: [
        /* @__PURE__ */ jsxs("span", { children: [
          "Showing ",
          /* @__PURE__ */ jsx("strong", { children: filteredCandidates.length }),
          " matching candidates"
        ] }),
        selectedListingId !== "all" && /* @__PURE__ */ jsxs("span", { className: "text-indigo-600 dark:text-indigo-400 truncate max-w-[280px]", children: [
          "Filtered by: ",
          listings.find((l) => l.id === selectedListingId)?.title
        ] })
      ] })
    ] }),
    loading ? /* @__PURE__ */ jsxs("div", { className: "py-20 text-center text-slate-500 dark:text-slate-400", children: [
      /* @__PURE__ */ jsx("div", { className: "w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" }),
      /* @__PURE__ */ jsx("p", { className: "text-xs font-medium", children: "Loading candidate pipeline..." })
    ] }) : filteredCandidates.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center max-w-md mx-auto transition-colors", children: [
      /* @__PURE__ */ jsx(Users, { className: "w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" }),
      /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold text-slate-800 dark:text-white", children: "No Candidates Found" }),
      /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4", children: "No applicants match the current filter selection. Reset filters or post a new opportunity to attract talent." }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: resetFilters,
          className: "px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 text-xs font-semibold cursor-pointer",
          children: "Reset Filters"
        }
      )
    ] }) : viewMode === "kanban" ? (
      /* Kanban Pipeline View */
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 gap-4 items-start", children: STAGES.map((stage) => {
        const stageCandidates = filteredCandidates.filter((c) => c.status === stage);
        return /* @__PURE__ */ jsxs("div", { className: "bg-slate-50/70 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 p-3 flex flex-col min-h-[450px] transition-colors", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-200 dark:border-slate-800", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-1.5", children: [
              /* @__PURE__ */ jsx("span", { className: `w-2 h-2 rounded-full ${getStageDotColor(stage)}` }),
              /* @__PURE__ */ jsx("span", { className: "font-bold text-xs text-slate-800 dark:text-slate-200", children: stage })
            ] }),
            /* @__PURE__ */ jsx("span", { className: "text-[11px] font-bold px-2 py-0.2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full border border-slate-200 dark:border-slate-700 shadow-2xs", children: stageCandidates.length })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "space-y-3 flex-1 overflow-y-auto", children: stageCandidates.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "text-center py-10 text-slate-400 dark:text-slate-600 text-[11px] italic", children: [
            "No candidates in ",
            stage
          ] }) : stageCandidates.map((candidate) => /* @__PURE__ */ jsx(
            CandidateCard,
            {
              candidate,
              onOpen: () => handleOpenCandidate(candidate),
              onQuickStageChange: (newStage) => onUpdateStatus(candidate.id, newStage)
            },
            candidate.id
          )) })
        ] }, stage);
      }) })
    ) : (
      /* Tabular List View */
      /* @__PURE__ */ jsx("div", { className: "bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs transition-colors", children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left text-xs", children: [
        /* @__PURE__ */ jsx("thead", { className: "bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-700", children: /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("th", { className: "py-3 px-4", children: "Candidate" }),
          /* @__PURE__ */ jsx("th", { className: "py-3 px-4", children: "Role Applied" }),
          /* @__PURE__ */ jsx("th", { className: "py-3 px-4", children: "Skills Match" }),
          /* @__PURE__ */ jsx("th", { className: "py-3 px-4", children: "University & Grad" }),
          /* @__PURE__ */ jsx("th", { className: "py-3 px-4", children: "Stage" }),
          /* @__PURE__ */ jsx("th", { className: "py-3 px-4", children: "Rating" }),
          /* @__PURE__ */ jsx("th", { className: "py-3 px-4 text-right", children: "Actions" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-slate-100 dark:divide-slate-800", children: filteredCandidates.map((candidate) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors", children: [
          /* @__PURE__ */ jsxs("td", { className: "py-3 px-4", children: [
            /* @__PURE__ */ jsx("div", { className: "font-bold text-slate-900 dark:text-white cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400", onClick: () => handleOpenCandidate(candidate), children: candidate.studentName }),
            /* @__PURE__ */ jsx("div", { className: "text-slate-500 dark:text-slate-400 text-[11px]", children: candidate.studentEmail })
          ] }),
          /* @__PURE__ */ jsxs("td", { className: "py-3 px-4 max-w-[200px]", children: [
            /* @__PURE__ */ jsx("div", { className: "truncate font-medium text-slate-800 dark:text-slate-200", children: candidate.listingTitle }),
            /* @__PURE__ */ jsx("span", { className: "text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700", children: candidate.listingType })
          ] }),
          /* @__PURE__ */ jsx("td", { className: "py-3 px-4", children: /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center space-x-1 font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 text-[11px]", children: [
            /* @__PURE__ */ jsx(Sparkles, { className: "w-3 h-3 text-emerald-500" }),
            /* @__PURE__ */ jsxs("span", { children: [
              candidate.skillsMatchScore,
              "%"
            ] })
          ] }) }),
          /* @__PURE__ */ jsxs("td", { className: "py-3 px-4", children: [
            /* @__PURE__ */ jsx("div", { className: "text-slate-800 dark:text-slate-200", children: candidate.studentUniversity }),
            /* @__PURE__ */ jsxs("div", { className: "text-slate-500 dark:text-slate-400 text-[11px]", children: [
              candidate.studentDegree,
              " ('",
              candidate.studentGradYear,
              ")"
            ] })
          ] }),
          /* @__PURE__ */ jsx("td", { className: "py-3 px-4", children: /* @__PURE__ */ jsx(
            "select",
            {
              value: candidate.status,
              onChange: (e) => onUpdateStatus(candidate.id, e.target.value),
              className: `text-xs font-semibold py-1 px-2 rounded-lg border focus:outline-none ${getStatusSelectStyle(
                candidate.status
              )}`,
              children: STAGES.map((s) => /* @__PURE__ */ jsx("option", { value: s, children: s }, s))
            }
          ) }),
          /* @__PURE__ */ jsx("td", { className: "py-3 px-4", children: /* @__PURE__ */ jsx("div", { className: "flex items-center text-amber-400", children: candidate.recruiterRating ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(Star, { className: "w-3.5 h-3.5 fill-amber-400" }),
            /* @__PURE__ */ jsx("span", { className: "text-slate-700 dark:text-slate-300 ml-1 font-semibold", children: candidate.recruiterRating })
          ] }) : /* @__PURE__ */ jsx("span", { className: "text-slate-400 text-[11px]", children: "-" }) }) }),
          /* @__PURE__ */ jsx("td", { className: "py-3 px-4 text-right", children: /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => handleOpenCandidate(candidate),
              className: "px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 font-semibold text-xs transition-colors cursor-pointer",
              children: "Review Profile"
            }
          ) })
        ] }, candidate.id)) })
      ] }) }) })
    ),
    /* @__PURE__ */ jsx(
      CandidateDetailModal,
      {
        application: activeCandidate,
        isOpen: showDetailModal,
        onClose: () => setShowDetailModal(false),
        onUpdateStatus: async (appId, newStatus, notes, rating) => {
          await onUpdateStatus(appId, newStatus, notes, rating);
          onRefresh();
        }
      }
    )
  ] });
};
const CandidateCard = ({ candidate, onOpen, onQuickStageChange }) => {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      onClick: onOpen,
      className: "bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-3.5 shadow-2xs hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-500 transition-all cursor-pointer group space-y-2.5",
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-1.5", children: [
          /* @__PURE__ */ jsx("h4", { className: "font-bold text-xs text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-tight", children: candidate.studentName }),
          /* @__PURE__ */ jsxs("span", { className: "shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center space-x-0.5", children: [
            /* @__PURE__ */ jsx(Sparkles, { className: "w-2.5 h-2.5 text-emerald-500" }),
            /* @__PURE__ */ jsxs("span", { children: [
              candidate.skillsMatchScore,
              "%"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "text-[11px] text-slate-500 dark:text-slate-400 truncate", title: candidate.listingTitle, children: candidate.listingTitle }),
        /* @__PURE__ */ jsxs("div", { className: "text-[11px] text-slate-600 dark:text-slate-300 flex items-center space-x-1 truncate", children: [
          /* @__PURE__ */ jsx(GraduationCap, { className: "w-3.5 h-3.5 text-slate-400 shrink-0" }),
          /* @__PURE__ */ jsxs("span", { className: "truncate", children: [
            candidate.studentUniversity,
            " ('",
            candidate.studentGradYear,
            ")"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-1", children: [
          candidate.studentSkills.slice(0, 3).map((skill) => /* @__PURE__ */ jsx("span", { className: "text-[9px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600", children: skill }, skill)),
          candidate.studentSkills.length > 3 && /* @__PURE__ */ jsxs("span", { className: "text-[9px] px-1 py-0.2 rounded bg-slate-50 dark:bg-slate-700/40 text-slate-400", children: [
            "+",
            candidate.studentSkills.length - 3
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500", children: [
          /* @__PURE__ */ jsx("div", { className: "flex items-center space-x-0.5 text-amber-500", children: candidate.recruiterRating ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(Star, { className: "w-3 h-3 fill-amber-400" }),
            /* @__PURE__ */ jsxs("span", { className: "font-semibold text-slate-700 dark:text-slate-300 ml-0.5", children: [
              candidate.recruiterRating,
              "/5"
            ] })
          ] }) : /* @__PURE__ */ jsx("span", { className: "text-slate-400 dark:text-slate-500", children: "No rating" }) }),
          /* @__PURE__ */ jsx("span", { children: new Date(candidate.appliedAt).toLocaleDateString() })
        ] })
      ]
    }
  );
};
function getStageDotColor(stage) {
  switch (stage) {
    case "Applied":
      return "bg-blue-500";
    case "Screening":
      return "bg-purple-500";
    case "Shortlisted":
      return "bg-indigo-500";
    case "Interview":
      return "bg-amber-500";
    case "Offer":
      return "bg-emerald-500";
    case "Rejected":
      return "bg-rose-500";
    default:
      return "bg-slate-400";
  }
}
function getStatusSelectStyle(stage) {
  switch (stage) {
    case "Applied":
      return "bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800";
    case "Screening":
      return "bg-purple-50 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800";
    case "Shortlisted":
      return "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800";
    case "Interview":
      return "bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800";
    case "Offer":
      return "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800";
    case "Rejected":
      return "bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800";
    default:
      return "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700";
  }
}
