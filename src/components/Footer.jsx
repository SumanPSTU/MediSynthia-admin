// src/components/AdminFooter.jsx
import React from "react";
import { useTheme } from "../contexts/ThemeContext.jsx";

export default function AdminFooter() {
  const { isDayMode } = useTheme();

  return (
    <footer
      className={`mt-auto w-full transition-all duration-500 ${
        isDayMode
          ? "bg-white/80 border-t border-emerald-100 text-gray-700"
          : "bg-gradient-to-r from-gray-900 via-gray-800 to-gray-950 border-t border-gray-700 text-cyan-300"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Left Section: Links */}
        <div className="flex gap-4 text-sm order-1 md:order-1">
          <a
            href="#"
            className={`hover:underline transition-colors ${
              isDayMode ? "hover:text-emerald-600" : "hover:text-cyan-400"
            }`}
          >
            Privacy Policy
          </a>
          <a
            href="#"
            className={`hover:underline transition-colors ${
              isDayMode ? "hover:text-emerald-600" : "hover:text-cyan-400"
            }`}
          >
            Terms of Service
          </a>
          <a
            href="#"
            className={`hover:underline transition-colors ${
              isDayMode ? "hover:text-emerald-600" : "hover:text-cyan-400"
            }`}
          >
            Contact
          </a>
        </div>

        {/* Right Section: Optional Admin Info */}
        <div className="text-sm opacity-70 order-2 md:order-2">
          {isDayMode ? (
            <span>Powered by MediSynthia</span>
          ) : (
            <span className="text-cyan-400">Powered by MediSynthia</span>
          )}
        </div>

        {/* Center Section: Copyright */}
        <p className="text-sm order-3 md:order-3">
          © {new Date().getFullYear()} MediSynthia Admin. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
