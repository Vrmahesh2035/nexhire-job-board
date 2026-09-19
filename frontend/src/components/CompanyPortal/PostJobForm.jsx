import { jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { PlusCircle, AlertCircle, Trophy, GraduationCap, Briefcase } from "lucide-react";
import { api } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
export const PostJobForm = ({ onSuccess, onCancel }) => {
  const { user } = useAuth();
  const [type, setType] = useState("job");
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("Engineering");
  const [location, setLocation] = useState("San Francisco, CA");
  const [workMode, setWorkMode] = useState("Remote");
  const [experienceLevel, setExperienceLevel] = useState("0-2 Years / Entry-Level");
  const [salaryOrStipend, setSalaryOrStipend] = useState("$120,000 - $145,000 / yr");
  const [duration, setDuration] = useState("Full-Time Permanent");
  const [skillsRequired, setSkillsRequired] = useState("React, Node.js, MongoDB, TypeScript");
  const [description, setDescription] = useState("");
  const [responsibilities, setResponsibilities] = useState("");
  const [requirements, setRequirements] = useState("");
  const [perks, setPerks] = useState("");
  const [deadline, setDeadline] = useState(new Date(Date.now() + 30 * 864e5).toISOString().split("T")[0]);
  const [prizePool, setPrizePool] = useState("$30,000 USD");
  const [teamSize, setTeamSize] = useState("1 - 4 Members");
  const [startDate, setStartDate] = useState(new Date(Date.now() + 14 * 864e5).toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState(new Date(Date.now() + 16 * 864e5).toISOString().split("T")[0]);
  const [theme, setTheme] = useState("Next-Gen AI & Web Applications");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const handleTypeChange = (newType) => {
    setType(newType);
    if (newType === "internship") {
      setDuration("12 Weeks (Summer 2026)");
      setSalaryOrStipend("$45 - $55 / hr + Housing Stipend");
      setExperienceLevel("Freshers / University Students");
    } else if (newType === "hackathon") {
      setDuration("48 Hours Virtual Hackathon");
      setSalaryOrStipend("$30,000 in Cash & Cloud Credits");
      setExperienceLevel("Open to All Students");
    } else {
      setDuration("Full-Time Permanent");
      setSalaryOrStipend("$120,000 - $150,000 / yr + Equity");
      setExperienceLevel("0-2 Years / Entry-Level");
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const payload = {
        type,
        title,
        department,
        location,
        workMode,
        experienceLevel,
        salaryOrStipend,
        duration,
        skillsRequired: skillsRequired.split(",").map((s) => s.trim()).filter(Boolean),
        description,
        responsibilities: responsibilities.split("\n").map((s) => s.trim()).filter(Boolean),
        requirements: requirements.split("\n").map((s) => s.trim()).filter(Boolean),
        perks: perks.split("\n").map((s) => s.trim()).filter(Boolean),
        deadline,
        status: "active"
      };
      if (type === "hackathon") {
        payload.prizePool = prizePool;
        payload.teamSize = teamSize;
        payload.startDate = startDate;
        payload.endDate = endDate;
        payload.theme = theme;
      }
      const created = await api.listings.create(payload);
      onSuccess(created);
    } catch (err) {
      setError(err.message || "Failed to post listing.");
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 max-w-3xl mx-auto transition-colors", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3 pb-4 mb-6 border-b border-slate-200 dark:border-slate-800", children: [
      /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center", children: /* @__PURE__ */ jsx(PlusCircle, { className: "w-5 h-5" }) }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-lg font-bold text-slate-900 dark:text-white", children: "Post a New Opportunity" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500 dark:text-slate-400", children: "Publish an Internship, Hackathon, or Full-Time Job Role to students and candidates" })
      ] })
    ] }),
    error && /* @__PURE__ */ jsxs("div", { className: "mb-5 p-3 bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-300 text-xs flex items-start space-x-2", children: [
      /* @__PURE__ */ jsx(AlertCircle, { className: "w-4 h-4 shrink-0 mt-0.5" }),
      /* @__PURE__ */ jsx("span", { children: error })
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-5", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2", children: "Opportunity Type *" }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: () => handleTypeChange("internship"),
              className: `p-3 rounded-xl border flex flex-col items-center justify-center space-y-1 transition-all cursor-pointer ${type === "internship" ? "bg-purple-50 dark:bg-purple-950/60 border-purple-500 text-purple-800 dark:text-purple-300 ring-2 ring-purple-200 dark:ring-purple-900" : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"}`,
              children: [
                /* @__PURE__ */ jsx(GraduationCap, { className: "w-5 h-5 text-purple-600 dark:text-purple-400" }),
                /* @__PURE__ */ jsx("span", { className: "text-xs font-bold", children: "Internship" }),
                /* @__PURE__ */ jsx("span", { className: "text-[10px] text-slate-500 dark:text-slate-400", children: "Summer/Winter Program" })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: () => handleTypeChange("hackathon"),
              className: `p-3 rounded-xl border flex flex-col items-center justify-center space-y-1 transition-all cursor-pointer ${type === "hackathon" ? "bg-amber-50 dark:bg-amber-950/60 border-amber-500 text-amber-800 dark:text-amber-300 ring-2 ring-amber-200 dark:ring-amber-900" : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"}`,
              children: [
                /* @__PURE__ */ jsx(Trophy, { className: "w-5 h-5 text-amber-600 dark:text-amber-400" }),
                /* @__PURE__ */ jsx("span", { className: "text-xs font-bold", children: "Hackathon" }),
                /* @__PURE__ */ jsx("span", { className: "text-[10px] text-slate-500 dark:text-slate-400", children: "Prize Pool & Fast-Track" })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: () => handleTypeChange("job"),
              className: `p-3 rounded-xl border flex flex-col items-center justify-center space-y-1 transition-all cursor-pointer ${type === "job" ? "bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-blue-800 dark:text-blue-300 ring-2 ring-blue-200 dark:ring-blue-900" : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"}`,
              children: [
                /* @__PURE__ */ jsx(Briefcase, { className: "w-5 h-5 text-blue-600 dark:text-blue-400" }),
                /* @__PURE__ */ jsx("span", { className: "text-xs font-bold", children: "Job Role" }),
                /* @__PURE__ */ jsx("span", { className: "text-[10px] text-slate-500 dark:text-slate-400", children: "Full-Time / New Grad" })
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1", children: "Opportunity Title *" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            required: true,
            value: title,
            onChange: (e) => setTitle(e.target.value),
            placeholder: type === "internship" ? "e.g. Summer 2026 Software Engineering Intern" : type === "hackathon" ? "e.g. Global Innovation Sprint Hackathon 2026" : "e.g. Full Stack Software Engineer (Entry to Mid)",
            className: "w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-3", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1", children: "Department" }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              value: department,
              onChange: (e) => setDepartment(e.target.value),
              className: "w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-slate-800 text-slate-800 dark:text-white",
              children: [
                /* @__PURE__ */ jsx("option", { value: "Engineering", children: "Engineering" }),
                /* @__PURE__ */ jsx("option", { value: "Product Engineering", children: "Product Engineering" }),
                /* @__PURE__ */ jsx("option", { value: "AI & Machine Learning", children: "AI & Machine Learning" }),
                /* @__PURE__ */ jsx("option", { value: "Developer Relations", children: "Developer Relations" }),
                /* @__PURE__ */ jsx("option", { value: "Product & Design", children: "Product & Design" }),
                /* @__PURE__ */ jsx("option", { value: "Data & Analytics", children: "Data & Analytics" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1", children: "Location" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              value: location,
              onChange: (e) => setLocation(e.target.value),
              placeholder: "e.g. San Francisco, CA or Remote",
              className: "w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-slate-800 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1", children: "Work Mode" }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              value: workMode,
              onChange: (e) => setWorkMode(e.target.value),
              className: "w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-slate-800 text-slate-800 dark:text-white",
              children: [
                /* @__PURE__ */ jsx("option", { value: "Remote", children: "Remote" }),
                /* @__PURE__ */ jsx("option", { value: "Hybrid", children: "Hybrid" }),
                /* @__PURE__ */ jsx("option", { value: "On-site", children: "On-site" })
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-3", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1", children: type === "hackathon" ? "Prize Pool / Rewards" : "Compensation / Stipend" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              value: salaryOrStipend,
              onChange: (e) => setSalaryOrStipend(e.target.value),
              placeholder: "e.g. $50/hr or $120k/yr",
              className: "w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-slate-800 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1", children: "Duration / Commitment" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              value: duration,
              onChange: (e) => setDuration(e.target.value),
              placeholder: "e.g. 12 Weeks or Full-Time",
              className: "w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-slate-800 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1", children: "Application Deadline" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "date",
              value: deadline,
              onChange: (e) => setDeadline(e.target.value),
              className: "w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-slate-800 text-slate-800 dark:text-white"
            }
          )
        ] })
      ] }),
      type === "hackathon" && /* @__PURE__ */ jsxs("div", { className: "p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 grid grid-cols-1 sm:grid-cols-3 gap-3", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-amber-900 dark:text-amber-300 mb-1", children: "Team Size" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              value: teamSize,
              onChange: (e) => setTeamSize(e.target.value),
              placeholder: "1 - 4 Members",
              className: "w-full px-3 py-1.5 text-xs rounded-lg border border-amber-300 dark:border-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white dark:bg-slate-800 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-amber-900 dark:text-amber-300 mb-1", children: "Start Date" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "date",
              value: startDate,
              onChange: (e) => setStartDate(e.target.value),
              className: "w-full px-3 py-1.5 text-xs rounded-lg border border-amber-300 dark:border-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white dark:bg-slate-800 text-slate-800 dark:text-white"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-amber-900 dark:text-amber-300 mb-1", children: "End Date" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "date",
              value: endDate,
              onChange: (e) => setEndDate(e.target.value),
              className: "w-full px-3 py-1.5 text-xs rounded-lg border border-amber-300 dark:border-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white dark:bg-slate-800 text-slate-800 dark:text-white"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("label", { className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1", children: [
          "Required Candidate Skills ",
          /* @__PURE__ */ jsx("span", { className: "text-slate-400 dark:text-slate-500 font-normal", children: "(comma-separated)" }),
          " *"
        ] }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            required: true,
            value: skillsRequired,
            onChange: (e) => setSkillsRequired(e.target.value),
            placeholder: "React, TypeScript, Node.js, Express, Python",
            className: "w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
          }
        ),
        /* @__PURE__ */ jsx("p", { className: "text-[11px] text-slate-500 dark:text-slate-400 mt-1", children: "Candidates' applications will be scored and ranked automatically against these skills in your ATS." })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1", children: "Detailed Description *" }),
        /* @__PURE__ */ jsx(
          "textarea",
          {
            rows: 4,
            required: true,
            value: description,
            onChange: (e) => setDescription(e.target.value),
            placeholder: "Describe the opportunity, team mission, and what the candidate will be building...",
            className: "w-full p-3 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("label", { className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1", children: [
          "Key Responsibilities ",
          /* @__PURE__ */ jsx("span", { className: "text-slate-400 dark:text-slate-500 font-normal", children: "(one per line)" })
        ] }),
        /* @__PURE__ */ jsx(
          "textarea",
          {
            rows: 3,
            value: responsibilities,
            onChange: (e) => setResponsibilities(e.target.value),
            placeholder: "Build responsive user interfaces\nDevelop REST APIs and scalable backend services\nParticipate in code reviews",
            className: "w-full p-3 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("label", { className: "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1", children: [
          "Qualifications & Requirements ",
          /* @__PURE__ */ jsx("span", { className: "text-slate-400 dark:text-slate-500 font-normal", children: "(one per line)" })
        ] }),
        /* @__PURE__ */ jsx(
          "textarea",
          {
            rows: 3,
            value: requirements,
            onChange: (e) => setRequirements(e.target.value),
            placeholder: "Pursuing BS/MS in Computer Science or related field\nProficiency in JavaScript or TypeScript\nStrong problem solving and communication skills",
            className: "w-full p-3 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end space-x-3", children: [
        onCancel && /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: onCancel,
            className: "px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "submit",
            disabled: loading,
            className: "px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-md flex items-center space-x-2 transition-all cursor-pointer",
            children: [
              /* @__PURE__ */ jsx(PlusCircle, { className: "w-4 h-4" }),
              /* @__PURE__ */ jsx("span", { children: loading ? "Publishing..." : "Publish Opportunity to Board" })
            ]
          }
        )
      ] })
    ] })
  ] });
};
