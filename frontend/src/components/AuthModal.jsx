import { jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { X, GraduationCap, Building2, ArrowRight, Lock, Mail, Sparkles, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
export const AuthModal = ({ isOpen, onClose, defaultRole = "student" }) => {
  const { login, register, loginDemo } = useAuth();
  const [activeRole, setActiveRole] = useState(defaultRole);
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [university, setUniversity] = useState("");
  const [degree, setDegree] = useState("");
  const [gradYear, setGradYear] = useState("2026");
  const [skills, setSkills] = useState("");
  const [resumeSummary, setResumeSummary] = useState("");
  const [github, setGithub] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [recruiterName, setRecruiterName] = useState("");
  const [industry, setIndustry] = useState("Technology & Software");
  const [website, setWebsite] = useState("");
  const [headquarters, setHeadquarters] = useState("");
  const [size, setSize] = useState("50 - 200 Employees");
  if (!isOpen) return null;
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (isRegistering) {
        if (activeRole === "student") {
          await register({
            role: "student",
            email,
            password,
            name,
            studentProfile: {
              university,
              degree,
              gradYear,
              skills: skills.split(",").map((s) => s.trim()).filter(Boolean),
              resumeSummary,
              github,
              portfolio
            }
          });
        } else {
          await register({
            role: "company",
            email,
            password,
            name: recruiterName || name,
            companyProfile: {
              companyName,
              recruiterName: recruiterName || name,
              industry,
              website,
              headquarters,
              size
            }
          });
        }
      } else {
        await login(email, password, activeRole);
      }
      onClose();
    } catch (err) {
      setError(err.message || "Authentication failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };
  const handleDemoClick = async (role) => {
    setError(null);
    setLoading(true);
    try {
      await loginDemo(role);
      onClose();
    } catch (err) {
      setError(err.message || "Demo login failed.");
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200", children: /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8 transition-colors", children: [
    /* @__PURE__ */ jsxs("div", { className: "px-6 py-4 bg-slate-900 dark:bg-slate-950 text-white flex items-center justify-between border-b border-slate-800", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("span", { className: "text-xs font-semibold text-emerald-400 uppercase tracking-wider", children: "NexHire Authentication" }),
        /* @__PURE__ */ jsx("h2", { className: "text-lg font-bold text-white", children: isRegistering ? "Create Your Account" : "Welcome Back to NexHire" })
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: onClose,
          className: "text-slate-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-slate-800 cursor-pointer",
          children: /* @__PURE__ */ jsx(X, { className: "w-5 h-5" })
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "p-4 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-2 bg-slate-200/80 dark:bg-slate-800 p-1 rounded-xl", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: () => {
              setActiveRole("student");
              setError(null);
            },
            className: `flex items-center justify-center space-x-2 py-2.5 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${activeRole === "student" ? "bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-400 shadow-xs" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"}`,
            children: [
              /* @__PURE__ */ jsx(GraduationCap, { className: "w-4 h-4" }),
              /* @__PURE__ */ jsx("span", { children: "Student / Candidate" })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: () => {
              setActiveRole("company");
              setError(null);
            },
            className: `flex items-center justify-center space-x-2 py-2.5 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${activeRole === "company" ? "bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"}`,
            children: [
              /* @__PURE__ */ jsx(Building2, { className: "w-4 h-4" }),
              /* @__PURE__ */ jsx("span", { children: "Company / Recruiter" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-3 flex items-center justify-between text-xs px-1", children: [
        /* @__PURE__ */ jsx("span", { className: "text-slate-500 dark:text-slate-400 font-medium", children: "Fast preview testing:" }),
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: () => handleDemoClick(activeRole),
            className: "inline-flex items-center space-x-1 font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer",
            children: [
              /* @__PURE__ */ jsx(Sparkles, { className: "w-3.5 h-3.5" }),
              /* @__PURE__ */ jsxs("span", { children: [
                "1-Click Demo as ",
                activeRole === "student" ? "Student (Alex)" : "Recruiter (CloudScale)"
              ] })
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "p-6 space-y-4 max-h-[70vh] overflow-y-auto", children: [
      error && /* @__PURE__ */ jsxs("div", { className: "p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 rounded-xl text-red-700 dark:text-red-300 text-xs flex items-start space-x-2", children: [
        /* @__PURE__ */ jsx(AlertCircle, { className: "w-4 h-4 shrink-0 mt-0.5" }),
        /* @__PURE__ */ jsx("span", { children: error })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex border-b border-slate-200 dark:border-slate-800 pb-2 mb-2", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => {
              setIsRegistering(false);
              setError(null);
            },
            className: `text-sm font-semibold pb-2 px-3 border-b-2 transition-colors cursor-pointer ${!isRegistering ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400" : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"}`,
            children: "Sign In"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => {
              setIsRegistering(true);
              setError(null);
            },
            className: `text-sm font-semibold pb-2 px-3 border-b-2 transition-colors cursor-pointer ${isRegistering ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400" : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"}`,
            children: "Create Account"
          }
        )
      ] }),
      isRegistering && /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("label", { className: "block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1", children: [
          activeRole === "student" ? "Full Name" : "Recruiter Full Name",
          " *"
        ] }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            required: true,
            value: name,
            onChange: (e) => {
              setName(e.target.value);
              if (activeRole === "company") setRecruiterName(e.target.value);
            },
            placeholder: activeRole === "student" ? "e.g. Alex Rivera" : "e.g. Sarah Jenkins",
            className: "w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("label", { className: "block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1", children: [
          activeRole === "student" ? "Student / Personal Email" : "Work Email",
          " *"
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsx(Mail, { className: "w-4 h-4 text-slate-400 absolute left-3 top-2.5" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "email",
              required: true,
              value: email,
              onChange: (e) => setEmail(e.target.value),
              placeholder: activeRole === "student" ? "alex@university.edu" : "recruiter@company.com",
              className: "w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1", children: "Password *" }),
        /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsx(Lock, { className: "w-4 h-4 text-slate-400 absolute left-3 top-2.5" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "password",
              required: true,
              value: password,
              onChange: (e) => setPassword(e.target.value),
              placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022",
              className: "w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            }
          )
        ] })
      ] }),
      isRegistering && activeRole === "student" && /* @__PURE__ */ jsxs("div", { className: "space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800", children: [
        /* @__PURE__ */ jsx("span", { className: "text-xs font-semibold text-slate-700 dark:text-slate-300 block", children: "Academic & Career Profile" }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1", children: "University / College" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: university,
                onChange: (e) => setUniversity(e.target.value),
                placeholder: "e.g. UC Berkeley",
                className: "w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1", children: "Graduation Year" }),
            /* @__PURE__ */ jsxs(
              "select",
              {
                value: gradYear,
                onChange: (e) => setGradYear(e.target.value),
                className: "w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500",
                children: [
                  /* @__PURE__ */ jsx("option", { value: "2025", children: "2025" }),
                  /* @__PURE__ */ jsx("option", { value: "2026", children: "2026" }),
                  /* @__PURE__ */ jsx("option", { value: "2027", children: "2027" }),
                  /* @__PURE__ */ jsx("option", { value: "2028", children: "2028" })
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1", children: "Degree / Major" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              value: degree,
              onChange: (e) => setDegree(e.target.value),
              placeholder: "e.g. B.S. in Computer Science",
              className: "w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("label", { className: "block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1", children: [
            "Technical Skills ",
            /* @__PURE__ */ jsx("span", { className: "text-slate-400 dark:text-slate-500 font-normal", children: "(comma-separated)" })
          ] }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              value: skills,
              onChange: (e) => setSkills(e.target.value),
              placeholder: "React, Node.js, TypeScript, Python",
              className: "w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1", children: "GitHub URL" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "url",
                value: github,
                onChange: (e) => setGithub(e.target.value),
                placeholder: "https://github.com/...",
                className: "w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1", children: "Portfolio / LinkedIn" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "url",
                value: portfolio,
                onChange: (e) => setPortfolio(e.target.value),
                placeholder: "https://...",
                className: "w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1", children: "Elevator Pitch / Bio" }),
          /* @__PURE__ */ jsx(
            "textarea",
            {
              rows: 2,
              value: resumeSummary,
              onChange: (e) => setResumeSummary(e.target.value),
              placeholder: "Brief summary of your background, experience, and interests...",
              className: "w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            }
          )
        ] })
      ] }),
      isRegistering && activeRole === "company" && /* @__PURE__ */ jsxs("div", { className: "space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800", children: [
        /* @__PURE__ */ jsx("span", { className: "text-xs font-semibold text-slate-700 dark:text-slate-300 block", children: "Company Details" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1", children: "Company / Organization Name *" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              required: true,
              value: companyName,
              onChange: (e) => setCompanyName(e.target.value),
              placeholder: "e.g. CloudScale Technologies",
              className: "w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1", children: "Industry" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: industry,
                onChange: (e) => setIndustry(e.target.value),
                placeholder: "e.g. Cloud Infrastructure",
                className: "w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1", children: "Headquarters" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: headquarters,
                onChange: (e) => setHeadquarters(e.target.value),
                placeholder: "e.g. San Francisco, CA",
                className: "w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1", children: "Company Website" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "url",
                value: website,
                onChange: (e) => setWebsite(e.target.value),
                placeholder: "https://company.com",
                className: "w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1", children: "Company Size" }),
            /* @__PURE__ */ jsxs(
              "select",
              {
                value: size,
                onChange: (e) => setSize(e.target.value),
                className: "w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500",
                children: [
                  /* @__PURE__ */ jsx("option", { value: "1 - 10 Employees", children: "1 - 10 Employees" }),
                  /* @__PURE__ */ jsx("option", { value: "10 - 50 Employees", children: "10 - 50 Employees" }),
                  /* @__PURE__ */ jsx("option", { value: "50 - 200 Employees", children: "50 - 200 Employees" }),
                  /* @__PURE__ */ jsx("option", { value: "200 - 1000 Employees", children: "200 - 1000 Employees" }),
                  /* @__PURE__ */ jsx("option", { value: "1000+ Employees", children: "1000+ Employees" })
                ]
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(
        "button",
        {
          type: "submit",
          disabled: loading,
          className: `w-full py-2.5 px-4 rounded-xl text-white font-semibold text-sm flex items-center justify-center space-x-2 transition-all shadow-md cursor-pointer ${activeRole === "student" ? "bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:ring-indigo-500" : "bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 focus:ring-emerald-500"}`,
          children: [
            /* @__PURE__ */ jsx("span", { children: loading ? "Processing..." : isRegistering ? `Create ${activeRole === "student" ? "Student" : "Company"} Account` : `Sign In to ${activeRole === "student" ? "Student" : "Company"} Portal` }),
            /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4" })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "px-6 py-3 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400", children: "Secure dual-role access for Students and Recruiters" })
  ] }) });
};
