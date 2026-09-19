import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import {
  Search,
  Sparkles,
  GraduationCap,
  Trophy,
  Briefcase,
  Layers,
  Bookmark,
  Clock,
  RotateCcw
} from "lucide-react";
import { OpportunityCard } from "./OpportunityCard";
import { OpportunityDetailModal } from "./OpportunityDetailModal";
import { ApplicationModal } from "./ApplicationModal";
import { StudentApplicationsView } from "./StudentApplicationsView";
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
      const typeParam = activeTab === "all" || activeTab === "applications" || activeTab === "saved" ? void 0 : activeTab;
      const data = await api.listings.getAll({
        type: typeParam,
        search: searchQuery || void 0,
        workMode: workMode !== "All" ? workMode : void 0,
        department: department !== "All" ? department : void 0
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
  let displayedListings = listings;
  if (activeTab === "saved") {
    displayedListings = listings.filter((l) => bookmarks.includes(l.id));
  }
  if (selectedSkill) {
    displayedListings = displayedListings.filter(
      (l) => l.skillsRequired.some((s) => s.toLowerCase() === selectedSkill.toLowerCase())
    );
  }
  const popularSkills = ["React", "Node.js", "MongoDB", "TypeScript", "Python", "Tailwind CSS", "Docker"];
  return /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "rounded-2xl bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 text-white p-6 sm:p-8 shadow-lg relative overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute right-0 top-0 bottom-0 w-1/3 bg-indigo-500/10 pointer-events-none blur-3xl" }),
      /* @__PURE__ */ jsxs("div", { className: "relative z-10 max-w-2xl", children: [
        /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-3 border border-indigo-500/30", children: [
          /* @__PURE__ */ jsx(GraduationCap, { className: "w-3.5 h-3.5" }),
          /* @__PURE__ */ jsx("span", { children: "Student Career & Hackathon Launchpad" })
        ] }),
        /* @__PURE__ */ jsx("h1", { className: "text-2xl sm:text-3xl font-extrabold tracking-tight text-white", children: "Discover Verified Internships, Hackathons & Entry-Level Roles" }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed", children: "Direct access to tech opportunities with one-click applications, automated match scores, and real-time candidate stage tracking." }),
        /* @__PURE__ */ jsxs("div", { className: "mt-5 grid grid-cols-3 gap-3 pt-4 border-t border-indigo-800/60 max-w-md text-xs", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("span", { className: "text-indigo-400 font-bold block text-base", children: "500+" }),
            /* @__PURE__ */ jsx("span", { className: "text-slate-400 text-[11px]", children: "Active Opportunities" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("span", { className: "text-emerald-400 font-bold block text-base", children: "Top 1%" }),
            /* @__PURE__ */ jsx("span", { className: "text-slate-400 text-[11px]", children: "Vetted Tech Companies" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("span", { className: "text-amber-400 font-bold block text-base", children: "$35k+" }),
            /* @__PURE__ */ jsx("span", { className: "text-slate-400 text-[11px]", children: "Hackathon Prizes" })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-slate-200 dark:border-slate-800", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-1.5 overflow-x-auto pb-1 max-w-full", children: [
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => setActiveTab("all"),
          className: `flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${activeTab === "all" ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-xs" : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"}`,
          children: [
            /* @__PURE__ */ jsx(Layers, { className: "w-3.5 h-3.5" }),
            /* @__PURE__ */ jsx("span", { children: "All Opportunities" })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => setActiveTab("internship"),
          className: `flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${activeTab === "internship" ? "bg-purple-600 text-white shadow-xs" : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"}`,
          children: [
            /* @__PURE__ */ jsx(GraduationCap, { className: "w-3.5 h-3.5" }),
            /* @__PURE__ */ jsx("span", { children: "Internships" })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => setActiveTab("hackathon"),
          className: `flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${activeTab === "hackathon" ? "bg-amber-600 text-white shadow-xs" : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"}`,
          children: [
            /* @__PURE__ */ jsx(Trophy, { className: "w-3.5 h-3.5" }),
            /* @__PURE__ */ jsx("span", { children: "Hackathons" })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => setActiveTab("job"),
          className: `flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${activeTab === "job" ? "bg-blue-600 text-white shadow-xs" : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"}`,
          children: [
            /* @__PURE__ */ jsx(Briefcase, { className: "w-3.5 h-3.5" }),
            /* @__PURE__ */ jsx("span", { children: "Job Roles" })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => setActiveTab("applications"),
          className: `flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${activeTab === "applications" ? "bg-indigo-600 text-white shadow-xs" : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"}`,
          children: [
            /* @__PURE__ */ jsx(Clock, { className: "w-3.5 h-3.5" }),
            /* @__PURE__ */ jsx("span", { children: "My Applications" }),
            applications.length > 0 && /* @__PURE__ */ jsx("span", { className: "ml-1 px-1.5 py-0.2 rounded-full bg-indigo-200/50 dark:bg-indigo-900/60 text-indigo-900 dark:text-indigo-200 text-[10px] font-bold", children: applications.length })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => setActiveTab("saved"),
          className: `flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${activeTab === "saved" ? "bg-amber-700 text-white shadow-xs" : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"}`,
          children: [
            /* @__PURE__ */ jsx(Bookmark, { className: "w-3.5 h-3.5" }),
            /* @__PURE__ */ jsxs("span", { children: [
              "Saved (",
              bookmarks.length,
              ")"
            ] })
          ]
        }
      )
    ] }) }),
    activeTab === "applications" ? /* @__PURE__ */ jsx(
      StudentApplicationsView,
      {
        applications,
        loading: appsLoading,
        onExplore: () => setActiveTab("all")
      }
    ) : /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs space-y-3 transition-colors", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-12 gap-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "md:col-span-5 relative", children: [
            /* @__PURE__ */ jsx(Search, { className: "w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-3" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: searchQuery,
                onChange: (e) => setSearchQuery(e.target.value),
                placeholder: "Search opportunities, company name, skills...",
                className: "w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              }
            )
          ] }),
          /* @__PURE__ */ jsx("div", { className: "md:col-span-3", children: /* @__PURE__ */ jsxs(
            "select",
            {
              value: workMode,
              onChange: (e) => setWorkMode(e.target.value),
              className: "w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500",
              children: [
                /* @__PURE__ */ jsx("option", { value: "All", children: "All Work Modes" }),
                /* @__PURE__ */ jsx("option", { value: "Remote", children: "Remote" }),
                /* @__PURE__ */ jsx("option", { value: "Hybrid", children: "Hybrid" }),
                /* @__PURE__ */ jsx("option", { value: "On-site", children: "On-site" })
              ]
            }
          ) }),
          /* @__PURE__ */ jsx("div", { className: "md:col-span-3", children: /* @__PURE__ */ jsxs(
            "select",
            {
              value: department,
              onChange: (e) => setDepartment(e.target.value),
              className: "w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500",
              children: [
                /* @__PURE__ */ jsx("option", { value: "All", children: "All Departments" }),
                /* @__PURE__ */ jsx("option", { value: "Engineering", children: "Engineering" }),
                /* @__PURE__ */ jsx("option", { value: "Product Engineering", children: "Product Engineering" }),
                /* @__PURE__ */ jsx("option", { value: "Developer Relations & Community", children: "Developer Relations" }),
                /* @__PURE__ */ jsx("option", { value: "FinTech Innovation Lab", children: "FinTech Lab" }),
                /* @__PURE__ */ jsx("option", { value: "Infrastructure", children: "Infrastructure" })
              ]
            }
          ) }),
          /* @__PURE__ */ jsx("div", { className: "md:col-span-1 flex items-center justify-end", children: /* @__PURE__ */ jsx(
            "button",
            {
              onClick: resetFilters,
              title: "Reset all filters",
              className: "p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer w-full flex items-center justify-center",
              children: /* @__PURE__ */ jsx(RotateCcw, { className: "w-4 h-4" })
            }
          ) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center flex-wrap gap-1.5 text-xs", children: [
          /* @__PURE__ */ jsxs("span", { className: "text-slate-400 dark:text-slate-500 text-[11px] font-medium mr-1 flex items-center", children: [
            /* @__PURE__ */ jsx(Sparkles, { className: "w-3 h-3 text-indigo-500 mr-1" }),
            "Filter by Skill:"
          ] }),
          popularSkills.map((skill) => /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setSelectedSkill(selectedSkill === skill ? null : skill),
              className: `px-2.5 py-0.5 rounded-full text-[11px] font-medium transition-colors cursor-pointer ${selectedSkill === skill ? "bg-indigo-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"}`,
              children: skill
            },
            skill
          )),
          selectedSkill && /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setSelectedSkill(null),
              className: "text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline ml-2 cursor-pointer",
              children: "Clear skill filter"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1", children: [
        /* @__PURE__ */ jsxs("span", { children: [
          "Showing ",
          /* @__PURE__ */ jsx("strong", { className: "text-slate-800 dark:text-slate-200", children: displayedListings.length }),
          " opportunities"
        ] }),
        user && /* @__PURE__ */ jsxs("span", { className: "text-emerald-700 dark:text-emerald-400 font-medium", children: [
          "Logged in as student (",
          user.name,
          ")"
        ] })
      ] }),
      loading ? /* @__PURE__ */ jsxs("div", { className: "py-20 text-center text-slate-500 dark:text-slate-400", children: [
        /* @__PURE__ */ jsx("div", { className: "w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs font-medium", children: "Loading opportunities..." })
      ] }) : displayedListings.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center max-w-md mx-auto", children: [
        /* @__PURE__ */ jsx(Search, { className: "w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" }),
        /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold text-slate-800 dark:text-slate-200", children: "No opportunities match your search" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4", children: "Try loosening your filters or resetting search keywords." }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: resetFilters,
            className: "px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-semibold cursor-pointer",
            children: "Reset Filters"
          }
        )
      ] }) : /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5", children: displayedListings.map((listing) => {
        const isBookmarked = bookmarks.includes(listing.id);
        const hasApplied = applications.some((app) => app.listingId === listing.id);
        return /* @__PURE__ */ jsx(
          OpportunityCard,
          {
            listing,
            isBookmarked,
            hasApplied,
            onSelect: handleOpenDetail,
            onApply: handleStartApply,
            onToggleBookmark: handleToggleBookmark
          },
          listing.id
        );
      }) })
    ] }),
    /* @__PURE__ */ jsx(
      OpportunityDetailModal,
      {
        listing: selectedListing,
        isOpen: showDetailModal,
        hasApplied: applications.some((a) => a.listingId === selectedListing?.id),
        onClose: () => setShowDetailModal(false),
        onApply: handleStartApply
      }
    ),
    /* @__PURE__ */ jsx(
      ApplicationModal,
      {
        listing: applyingListing,
        isOpen: showApplyModal,
        onClose: () => setShowApplyModal(false),
        onSuccess: handleApplicationSuccess,
        onOpenAuth
      }
    )
  ] });
};
