import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import {
  Building2,
  Users,
  PlusCircle,
  Briefcase,
  Sparkles
} from "lucide-react";
import { ATSBoard } from "./ATSBoard";
import { PostJobForm } from "./PostJobForm";
import { ManageListingsView } from "./ManageListingsView";
import { api } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
export const CompanyDashboard = ({ onOpenAuth }) => {
  const { user, loginDemo } = useAuth();
  const [activeTab, setActiveTab] = useState("ats");
  const [listings, setListings] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const isCompanyUser = user && user.role === "company";
  const fetchData = async () => {
    setLoading(true);
    try {
      if (isCompanyUser) {
        const [companyListings, companyApps] = await Promise.all([
          api.listings.getAll({ companyId: user.id }),
          api.applications.getCompanyApplications()
        ]);
        setListings(companyListings);
        setApplications(companyApps);
      } else {
        const allListings = await api.listings.getAll();
        setListings(allListings.slice(0, 3));
        setApplications([]);
      }
    } catch (err) {
      console.error("Failed to load company dashboard data", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [user]);
  const handleUpdateStatus = async (appId, newStatus, notes, rating) => {
    try {
      const updated = await api.applications.updateStatus(appId, {
        status: newStatus,
        recruiterNotes: notes,
        recruiterRating: rating
      });
      setApplications((prev) => prev.map((a) => a.id === appId ? updated : a));
    } catch (err) {
      console.error("Failed to update candidate status", err);
      throw err;
    }
  };
  const handleDeleteListing = async (listingId) => {
    try {
      await api.listings.delete(listingId);
      setListings((prev) => prev.filter((l) => l.id !== listingId));
    } catch (err) {
      console.error("Failed to delete listing", err);
    }
  };
  const handleToggleStatus = async (listing) => {
    try {
      const newStatus = listing.status === "active" ? "closed" : "active";
      const updated = await api.listings.update(listing.id, { status: newStatus });
      setListings((prev) => prev.map((l) => l.id === listing.id ? updated : l));
    } catch (err) {
      console.error("Failed to toggle listing status", err);
    }
  };
  const handlePostSuccess = (newListing) => {
    setListings((prev) => [newListing, ...prev]);
    setActiveTab("postings");
  };
  if (!isCompanyUser) {
    return /* @__PURE__ */ jsx("div", { className: "max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10", children: /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 sm:p-12 shadow-sm text-center space-y-6 transition-colors", children: [
      /* @__PURE__ */ jsx("div", { className: "w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center mx-auto shadow-xs", children: /* @__PURE__ */ jsx(Building2, { className: "w-8 h-8" }) }),
      /* @__PURE__ */ jsxs("div", { className: "max-w-xl mx-auto space-y-2", children: [
        /* @__PURE__ */ jsx("span", { className: "text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800", children: "Company & Recruiter Portal" }),
        /* @__PURE__ */ jsx("h2", { className: "text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight", children: "Applicant Tracking System & Candidate Screening" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-500 dark:text-slate-400 leading-relaxed", children: "Post internships, hackathons, and job roles. Screen candidates with automated skill-match rankings, manage multi-stage hiring pipelines, and track applicants end-to-end." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "pt-2 max-w-md mx-auto flex flex-col sm:flex-row gap-3 justify-center", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => loginDemo("company"),
            className: "py-3 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer",
            children: [
              /* @__PURE__ */ jsx(Sparkles, { className: "w-4 h-4" }),
              /* @__PURE__ */ jsx("span", { children: "1-Click Demo Recruiter Login (CloudScale)" })
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: onOpenAuth,
            className: "py-3 px-5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs transition-colors cursor-pointer",
            children: "Company Sign In / Register"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "pt-8 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left max-w-3xl mx-auto", children: [
        /* @__PURE__ */ jsxs("div", { className: "p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700", children: [
          /* @__PURE__ */ jsx("span", { className: "font-bold text-xs text-slate-800 dark:text-white block mb-1", children: "Post in Minutes" }),
          /* @__PURE__ */ jsx("p", { className: "text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed", children: "Publish internships, collegiate hackathons, or full-time roles with customizable requirements." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700", children: [
          /* @__PURE__ */ jsx("span", { className: "font-bold text-xs text-slate-800 dark:text-white block mb-1", children: "Automated Match Scoring" }),
          /* @__PURE__ */ jsx("p", { className: "text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed", children: "Our algorithm scores candidates against required tech stacks so you can prioritize top talent." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700", children: [
          /* @__PURE__ */ jsx("span", { className: "font-bold text-xs text-slate-800 dark:text-white block mb-1", children: "Visual ATS Stages" }),
          /* @__PURE__ */ jsx("p", { className: "text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed", children: "Move applicants seamlessly from Applied through Screening, Interview, and Offer with notes and ratings." })
        ] })
      ] })
    ] }) });
  }
  const totalApplicants = applications.length;
  const activePostingsCount = listings.filter((l) => l.status === "active").length;
  const inInterviewCount = applications.filter((a) => a.status === "Interview" || a.status === "Shortlisted").length;
  return /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "bg-slate-900 dark:bg-slate-950 rounded-2xl text-white p-6 sm:p-7 shadow-lg border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-4", children: [
        /* @__PURE__ */ jsx("div", { className: "w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white font-extrabold text-xl shadow-md", children: user.companyProfile?.companyName?.charAt(0) || "C" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
            /* @__PURE__ */ jsx("h1", { className: "text-xl font-bold text-white", children: user.companyProfile?.companyName || user.name }),
            /* @__PURE__ */ jsx("span", { className: "text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30", children: "Recruiter Portal" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-xs text-slate-400 mt-1 flex flex-wrap items-center gap-3", children: [
            /* @__PURE__ */ jsx("span", { children: user.companyProfile?.industry || "Technology" }),
            /* @__PURE__ */ jsx("span", { children: "\u2022" }),
            /* @__PURE__ */ jsx("span", { children: user.companyProfile?.headquarters || "Remote" }),
            /* @__PURE__ */ jsx("span", { children: "\u2022" }),
            /* @__PURE__ */ jsxs("span", { className: "text-slate-300", children: [
              "Recruiter: ",
              user.name
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3 text-center self-start md:self-center", children: [
        /* @__PURE__ */ jsxs("div", { className: "px-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700", children: [
          /* @__PURE__ */ jsx("span", { className: "text-lg font-bold text-white block", children: totalApplicants }),
          /* @__PURE__ */ jsx("span", { className: "text-[10px] text-slate-400 uppercase tracking-wider", children: "Candidates in ATS" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "px-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700", children: [
          /* @__PURE__ */ jsx("span", { className: "text-lg font-bold text-emerald-400 block", children: activePostingsCount }),
          /* @__PURE__ */ jsx("span", { className: "text-[10px] text-slate-400 uppercase tracking-wider", children: "Active Postings" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "px-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700", children: [
          /* @__PURE__ */ jsx("span", { className: "text-lg font-bold text-amber-400 block", children: inInterviewCount }),
          /* @__PURE__ */ jsx("span", { className: "text-[10px] text-slate-400 uppercase tracking-wider", children: "In Pipeline" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800 pb-2", children: [
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => setActiveTab("ats"),
          className: `flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${activeTab === "ats" ? "bg-emerald-600 text-white shadow-xs" : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800"}`,
          children: [
            /* @__PURE__ */ jsx(Users, { className: "w-3.5 h-3.5" }),
            /* @__PURE__ */ jsx("span", { children: "Applicant Tracking (ATS)" }),
            /* @__PURE__ */ jsx("span", { className: "px-1.5 py-0.2 bg-emerald-800/40 text-emerald-100 rounded-full text-[10px] font-bold", children: totalApplicants })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => setActiveTab("postings"),
          className: `flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${activeTab === "postings" ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-xs" : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800"}`,
          children: [
            /* @__PURE__ */ jsx(Briefcase, { className: "w-3.5 h-3.5" }),
            /* @__PURE__ */ jsx("span", { children: "My Job Postings" }),
            /* @__PURE__ */ jsx("span", { className: "px-1.5 py-0.2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full text-[10px] font-bold", children: listings.length })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => setActiveTab("post_new"),
          className: `flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${activeTab === "post_new" ? "bg-indigo-600 text-white shadow-xs" : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800"}`,
          children: [
            /* @__PURE__ */ jsx(PlusCircle, { className: "w-3.5 h-3.5" }),
            /* @__PURE__ */ jsx("span", { children: "Post New Opportunity" })
          ]
        }
      )
    ] }),
    activeTab === "ats" && /* @__PURE__ */ jsx(
      ATSBoard,
      {
        applications,
        listings,
        loading,
        onUpdateStatus: handleUpdateStatus,
        onRefresh: fetchData
      }
    ),
    activeTab === "postings" && /* @__PURE__ */ jsx(
      ManageListingsView,
      {
        listings,
        loading,
        onSelectListingForATS: (listingId) => {
          setActiveTab("ats");
        },
        onPostNew: () => setActiveTab("post_new"),
        onDeleteListing: handleDeleteListing,
        onToggleStatus: handleToggleStatus
      }
    ),
    activeTab === "post_new" && /* @__PURE__ */ jsx(
      PostJobForm,
      {
        onSuccess: handlePostSuccess,
        onCancel: () => setActiveTab("postings")
      }
    )
  ] });
};
