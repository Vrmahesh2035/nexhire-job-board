import { jsx, jsxs } from "react/jsx-runtime";
import { Users, MapPin, Trash2, ArrowUpRight, Plus, CheckCircle2, PauseCircle } from "lucide-react";
export const ManageListingsView = ({
  listings,
  loading,
  onSelectListingForATS,
  onPostNew,
  onDeleteListing,
  onToggleStatus
}) => {
  if (loading) {
    return /* @__PURE__ */ jsxs("div", { className: "py-20 text-center text-slate-500", children: [
      /* @__PURE__ */ jsx("div", { className: "w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" }),
      /* @__PURE__ */ jsx("p", { className: "text-xs font-medium", children: "Loading your job postings..." })
    ] });
  }
  if (listings.length === 0) {
    return /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center max-w-md mx-auto my-8 transition-colors", children: [
      /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-3", children: /* @__PURE__ */ jsx(Plus, { className: "w-6 h-6" }) }),
      /* @__PURE__ */ jsx("h3", { className: "text-base font-bold text-slate-800 dark:text-white", children: "No Postings Created Yet" }),
      /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500 dark:text-slate-400 mt-1 mb-5 leading-relaxed", children: "Create your first internship, hackathon, or full-time engineering role to start receiving applicants into your ATS dashboard." }),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: onPostNew,
          className: "px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors inline-flex items-center space-x-2 cursor-pointer",
          children: [
            /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4" }),
            /* @__PURE__ */ jsx("span", { children: "Post First Opportunity" })
          ]
        }
      )
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-base font-bold text-slate-900 dark:text-white", children: "Manage Company Job Postings" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500 dark:text-slate-400", children: "Active listings, applicant metrics, and status controls" })
      ] }),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: onPostNew,
          className: "px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors flex items-center space-x-1.5 cursor-pointer",
          children: [
            /* @__PURE__ */ jsx(Plus, { className: "w-3.5 h-3.5" }),
            /* @__PURE__ */ jsx("span", { children: "Post New" })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "space-y-3", children: listings.map((listing) => /* @__PURE__ */ jsxs(
      "div",
      {
        className: "bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-1.5 max-w-xl", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
              /* @__PURE__ */ jsx(
                "span",
                {
                  className: `text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getTypeBadgeStyle(
                    listing.type
                  )}`,
                  children: listing.type
                }
              ),
              /* @__PURE__ */ jsx("span", { className: "text-xs text-slate-500 dark:text-slate-400", children: "\u2022" }),
              /* @__PURE__ */ jsx("span", { className: "text-xs text-slate-500 dark:text-slate-400", children: listing.department }),
              /* @__PURE__ */ jsx("span", { className: "text-xs text-slate-500 dark:text-slate-400", children: "\u2022" }),
              /* @__PURE__ */ jsx(
                "span",
                {
                  className: `text-[10px] font-semibold px-2 py-0.2 rounded-full ${listing.status === "active" ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700"}`,
                  children: listing.status === "active" ? "Active & Accepting Applications" : "Closed"
                }
              )
            ] }),
            /* @__PURE__ */ jsx("h3", { className: "text-base font-bold text-slate-900 dark:text-white leading-snug", children: listing.title }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400", children: [
              /* @__PURE__ */ jsxs("span", { className: "flex items-center space-x-1", children: [
                /* @__PURE__ */ jsx(MapPin, { className: "w-3.5 h-3.5 text-slate-400" }),
                /* @__PURE__ */ jsxs("span", { children: [
                  listing.location,
                  " (",
                  listing.workMode,
                  ")"
                ] })
              ] }),
              /* @__PURE__ */ jsx("span", { children: "\u2022" }),
              /* @__PURE__ */ jsx("span", { className: "text-slate-700 dark:text-slate-300 font-medium", children: listing.salaryOrStipend }),
              /* @__PURE__ */ jsx("span", { children: "\u2022" }),
              /* @__PURE__ */ jsxs("span", { children: [
                "Deadline: ",
                listing.deadline
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3 self-end md:self-center", children: [
            /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: () => onSelectListingForATS(listing.id),
                className: "px-3 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold flex items-center space-x-2 transition-colors cursor-pointer",
                title: "Filter ATS candidates for this posting",
                children: [
                  /* @__PURE__ */ jsx(Users, { className: "w-4 h-4 text-indigo-600 dark:text-indigo-400" }),
                  /* @__PURE__ */ jsxs("span", { children: [
                    listing.applicantCount || 0,
                    " Candidates in ATS"
                  ] }),
                  /* @__PURE__ */ jsx(ArrowUpRight, { className: "w-3.5 h-3.5" })
                ]
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => onToggleStatus(listing),
                title: listing.status === "active" ? "Pause / Close applications" : "Activate posting",
                className: "p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer",
                children: listing.status === "active" ? /* @__PURE__ */ jsx(PauseCircle, { className: "w-4 h-4 text-amber-600" }) : /* @__PURE__ */ jsx(CheckCircle2, { className: "w-4 h-4 text-emerald-600" })
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => {
                  if (confirm(`Delete listing "${listing.title}"?`)) {
                    onDeleteListing(listing.id);
                  }
                },
                title: "Delete Listing",
                className: "p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-rose-50 dark:hover:bg-rose-950/50 hover:border-rose-200 dark:hover:border-rose-800 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer",
                children: /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4" })
              }
            )
          ] })
        ]
      },
      listing.id
    )) })
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
