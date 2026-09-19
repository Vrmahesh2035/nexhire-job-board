import { jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { Navbar } from "./components/Navbar";
import { StudentDashboard } from "./components/StudentPortal/StudentDashboard";
import { CompanyDashboard } from "./components/CompanyPortal/CompanyDashboard";
import { AuthModal } from "./components/AuthModal";
const MainLayout = () => {
  const { activePortal } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authDefaultRole, setAuthDefaultRole] = useState("student");
  const handleOpenAuth = (role) => {
    setAuthDefaultRole(role || activePortal);
    setAuthModalOpen(true);
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans antialiased transition-colors duration-200", children: [
    /* @__PURE__ */ jsx(Navbar, { onOpenAuth: handleOpenAuth }),
    /* @__PURE__ */ jsx("main", { className: "flex-1", children: activePortal === "student" ? /* @__PURE__ */ jsx(StudentDashboard, { onOpenAuth: () => handleOpenAuth("student") }) : /* @__PURE__ */ jsx(CompanyDashboard, { onOpenAuth: () => handleOpenAuth("company") }) }),
    /* @__PURE__ */ jsx("footer", { className: "bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 mt-16 py-8 text-xs text-slate-500 dark:text-slate-400 transition-colors", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
        /* @__PURE__ */ jsx("span", { className: "font-extrabold text-slate-900 dark:text-white tracking-tight", children: "NexHire" }),
        /* @__PURE__ */ jsx("span", { children: "\u2022" }),
        /* @__PURE__ */ jsx("span", { children: "Career & Recruitment Hub" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-4 text-slate-400 dark:text-slate-500", children: [
        /* @__PURE__ */ jsx("span", { children: "Student Opportunities" }),
        /* @__PURE__ */ jsx("span", { children: "\u2022" }),
        /* @__PURE__ */ jsx("span", { children: "Company ATS Pipeline" }),
        /* @__PURE__ */ jsx("span", { children: "\u2022" }),
        /* @__PURE__ */ jsx("span", { children: "Candidate Screening" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(
      AuthModal,
      {
        isOpen: authModalOpen,
        onClose: () => setAuthModalOpen(false),
        defaultRole: authDefaultRole
      }
    )
  ] });
};
export default function App() {
  return /* @__PURE__ */ jsx(ThemeProvider, { children: /* @__PURE__ */ jsx(AuthProvider, { children: /* @__PURE__ */ jsx(MainLayout, {}) }) });
}
