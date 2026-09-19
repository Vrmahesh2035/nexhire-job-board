import { jsx, jsxs } from "react/jsx-runtime";
import { Briefcase, GraduationCap, Building2, LogOut, Sun, Moon } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
export const Navbar = ({ onOpenAuth }) => {
  const { user, activePortal, setActivePortal, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  return /* @__PURE__ */ jsx("header", { className: "sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between h-16", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2.5 cursor-pointer", onClick: () => setActivePortal("student"), children: [
          /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-emerald-500 flex items-center justify-center text-white shadow-md", children: /* @__PURE__ */ jsx(Briefcase, { className: "w-5 h-5" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("span", { className: "font-extrabold text-xl tracking-tight text-slate-900 dark:text-white flex items-center", children: [
              "Nex",
              /* @__PURE__ */ jsx("span", { className: "text-indigo-600 dark:text-indigo-400", children: "Hire" })
            ] }),
            /* @__PURE__ */ jsx("span", { className: "text-[10px] text-slate-500 dark:text-slate-400 font-medium block -mt-0.5", children: "Careers & Recruitment Hub" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("nav", { className: "hidden md:flex items-center space-x-1 bg-slate-100/80 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200 dark:border-slate-700", children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: () => setActivePortal("student"),
              className: `flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${activePortal === "student" ? "bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-400 shadow-xs" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"}`,
              children: [
                /* @__PURE__ */ jsx(GraduationCap, { className: "w-4 h-4 text-indigo-500 dark:text-indigo-400" }),
                /* @__PURE__ */ jsx("span", { children: "Student Portal" }),
                /* @__PURE__ */ jsx("span", { className: "text-[10px] px-1.5 py-0.2 bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 rounded-full font-bold", children: "Explore" })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: () => setActivePortal("company"),
              className: `flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${activePortal === "company" ? "bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"}`,
              children: [
                /* @__PURE__ */ jsx(Building2, { className: "w-4 h-4 text-emerald-500 dark:text-emerald-400" }),
                /* @__PURE__ */ jsx("span", { children: "Company / ATS Portal" }),
                /* @__PURE__ */ jsx("span", { className: "text-[10px] px-1.5 py-0.2 bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 rounded-full font-bold", children: "Hiring" })
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: toggleTheme,
            title: theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode",
            "aria-label": "Toggle theme",
            className: "p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer",
            children: theme === "dark" ? /* @__PURE__ */ jsx(Sun, { className: "w-4 h-4 text-amber-400 animate-in spin-in-180 duration-200" }) : /* @__PURE__ */ jsx(Moon, { className: "w-4 h-4 text-slate-700 animate-in spin-in-180 duration-200" })
          }
        ),
        user ? /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2.5", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2 pl-2 border-l border-slate-200 dark:border-slate-800", children: [
            /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-full bg-slate-900 dark:bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs", children: user.name.charAt(0).toUpperCase() }),
            /* @__PURE__ */ jsxs("div", { className: "hidden lg:block text-left", children: [
              /* @__PURE__ */ jsxs("div", { className: "text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight flex items-center space-x-1", children: [
                /* @__PURE__ */ jsx("span", { children: user.name }),
                /* @__PURE__ */ jsx(
                  "span",
                  {
                    className: `text-[9px] px-1.5 py-0.2 rounded font-semibold uppercase ${user.role === "company" ? "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300" : "bg-indigo-100 dark:bg-indigo-950/80 text-indigo-800 dark:text-indigo-300"}`,
                    children: user.role === "company" ? "Recruiter" : "Student"
                  }
                )
              ] }),
              /* @__PURE__ */ jsx("div", { className: "text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[140px]", children: user.role === "company" ? user.companyProfile?.companyName || user.email : user.studentProfile?.university || user.email })
            ] })
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: logout,
              title: "Sign Out",
              className: "p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer",
              children: /* @__PURE__ */ jsx(LogOut, { className: "w-4 h-4" })
            }
          )
        ] }) : /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => onOpenAuth(activePortal),
              className: "px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 transition-colors cursor-pointer",
              children: "Sign In"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => onOpenAuth(activePortal),
              className: `px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white shadow-xs transition-all cursor-pointer ${activePortal === "student" ? "bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600" : "bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"}`,
              children: activeRoleRegisterText(activePortal)
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex md:hidden items-center justify-around py-2 border-t border-slate-200 dark:border-slate-800", children: [
      /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          onClick: () => setActivePortal("student"),
          className: `flex items-center space-x-1.5 py-1 px-3 rounded-lg text-xs font-semibold ${activePortal === "student" ? "bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300" : "text-slate-600 dark:text-slate-400"}`,
          children: [
            /* @__PURE__ */ jsx(GraduationCap, { className: "w-3.5 h-3.5" }),
            /* @__PURE__ */ jsx("span", { children: "Student Portal" })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          onClick: () => setActivePortal("company"),
          className: `flex items-center space-x-1.5 py-1 px-3 rounded-lg text-xs font-semibold ${activePortal === "company" ? "bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300" : "text-slate-600 dark:text-slate-400"}`,
          children: [
            /* @__PURE__ */ jsx(Building2, { className: "w-3.5 h-3.5" }),
            /* @__PURE__ */ jsx("span", { children: "Company ATS Portal" })
          ]
        }
      )
    ] })
  ] }) });
};
function activeRoleRegisterText(role) {
  if (role === "student") return "Student Register";
  return "Company Register";
}
