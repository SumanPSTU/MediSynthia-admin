// src/components/AdminNavbar.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Menu, X, LogOut, LogIn, LayoutDashboard,
  Users, Pill, Moon, Sun, UserCircle, ShoppingBag,
  File
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../contexts/ThemeContext.jsx";
import { useAuth } from "../hooks/useAuth.js";

export default function AdminNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDayMode, toggleTheme } = useTheme();

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { isAuthenticated, admin, logout } = useAuth();
  const adminName = admin?.username || admin?.name || localStorage.getItem("adminName") || "";

  const MotionLink = motion(Link);

  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to logout?")) {
      await logout();
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      navigate("/login");
    }
  };



  const navLinks = [
    { name: "Dashboard", to: "/dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: "Users", to: "/users-list", icon: <Users className="w-5 h-5" /> },
    { name: "Products", to: "/products-list", icon: <Pill className="w-5 h-5" /> },
    { name: "Orders", to: "/orders-list", icon: <ShoppingBag className="w-5 h-5" /> },
    { name:"Prescriptions", to:"/prescription-uploaded", icon:<File className="w-5 h-5"/>}
  ];

  const NavLinks = ({ onClick, vertical }) => (
    <div className={`${vertical ? "flex flex-col gap-3" : "flex gap-4 items-center"}`}>
      {navLinks.map((link, i) => (
        <MotionLink
          key={link.name}
          to={link.to}
          onClick={onClick}
          initial={{ opacity: 0, x: vertical ? 50 : 0, y: vertical ? 20 : 0 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${location.pathname === link.to
            ? "bg-emerald-500 text-white shadow-lg scale-[1.05]"
            : isDayMode
              ? "text-gray-700 hover:text-emerald-600 hover:bg-emerald-100"
              : "text-cyan-300 hover:text-emerald-400 hover:bg-gray-800/70"
            }`}
        >
          {link.icon}
          {link.name}
        </MotionLink>
      ))}
    </div>
  );

  return (
    <nav
      className={`fixed top-0 w-full z-50 backdrop-blur-md shadow-lg transition-all duration-500 "bg-white/60 border-b border-emerald-100"
       
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/dashboard" className="text-xl font-bold flex items-center gap-2">
          <motion.span
            className={`bg-gradient-to-r ${"from-emerald-600 to-teal-400"} bg-clip-text text-transparent`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            MediSynthia
          </motion.span>
          <span className="text-sm opacity-70 font-semibold">Admin</span>
        </Link>

        <motion.button>
          <motion.span
            layout
            className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white shadow-md transition-transform ${isDayMode ? "translate-x-0" : "translate-x-6"}`}
          />
        </motion.button>

        {/* Desktop Navbar */}
        <div className="hidden md:flex items-center gap-6">
          <NavLinks vertical={false} />
          <div className="flex items-center gap-4 border-l pl-4">
            {isAuthenticated && (
              <>
                <UserCircle className={`w-6 h-6 ${isDayMode ? "text-emerald-500" : "text-cyan-400"}`} />
                <span className={isDayMode ? "" : "text-cyan-200"}>{adminName}</span>
                <button onClick={handleLogout} className="flex items-center gap-1 text-red-500 hover:text-red-600">
                  <LogOut className="w-5 h-5" /> Logout
                </button>
              </>
            )}

          </div>
        </div>

        {/* Mobile Button */}
        <button className="md:hidden" onClick={() => setIsMobileOpen(true)} aria-label="Open menu">
          <Menu className="w-7 h-7" />
        </button>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40"
              onClick={() => setIsMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={`fixed top-0 right-0 w-723 h-full z-50 p-6 flex flex-col justify-between rounded-l-2xl transition-all ${isDayMode ? "bg-white text-gray-900" : "bg-gradient-to-b from-gray-900 via-gray-800 to-gray-950 text-cyan-200"
                }`}
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className={`text-lg font-bold ${isDayMode ? "text-emerald-600" : "text-cyan-400"}`}>Admin Panel</h2>
                <button onClick={() => setIsMobileOpen(false)}>
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Admin Info */}
              {isAuthenticated && (
                <div className="flex items-center gap-3 mb-6 p-3 rounded-lg bg-gray-100/50 dark:bg-gray-800/50">
                  <UserCircle className={`w-6 h-6 ${isDayMode ? "text-emerald-500" : "text-cyan-400"}`} />
                  <span className={isDayMode ? "" : "text-cyan-200"}>{adminName}</span>
                </div>
              )}

              {/* Links */}
              <NavLinks onClick={() => setIsMobileOpen(false)} vertical={true} />

              {/* Footer Actions */}
              <div className="flex flex-col gap-4 mt-6">
                {isAuthenticated && (
                  <button onClick={() => { handleLogout(); setIsMobileOpen(false); }}
                    className="flex items-center gap-2 text-red-500 hover:text-red-600 px-4 py-2 rounded-lg transition-all bg-red-50 dark:bg-gray-800/50">
                    <LogOut className="w-5 h-5" /> Logout
                  </button>
                )}
                {/* <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleTheme}
                  className={`relative flex items-center justify-center w-full h-10 rounded-full transition-all ${isDayMode ? "bg-emerald-300" : "bg-cyan-700/80 shadow-inner shadow-cyan-400/50"}`}
                >
                  <motion.span
                    layout
                    className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white shadow-md transition-transform ${isDayMode ? "translate-x-0" : "translate-x-[calc(100%-1.5rem)]"}`}
                  />
                  {isDayMode ? <Sun className="absolute right-3 w-4 h-4 text-yellow-500" /> : <Moon className="absolute left-3 w-4 h-4 text-blue-300" />}
                </motion.button> */}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
