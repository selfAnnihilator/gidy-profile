import React from "react";
import { Moon, Sun } from "lucide-react";
import ProfileDropdown from "./ProfileDropdown";

export default function Navbar({ dark, setDark, profile }) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 py-3 border-b border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-1 cursor-pointer">
          <img src="/Gidy_logo_full_transparent.png" alt="Gidy Logo" className="w-14 h-14 object-contain" />
        </div>

        <div className="hidden md:flex gap-7 text-sm text-gray-600 dark:text-[#94a3b8]">
          <span>Jobs</span>
          <span>Hackathons</span>
          <span>Projects</span>
          <span>Tasks</span>
          <span>Organization</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => setDark(!dark)}
          className="p-2 rounded-lg border border-gray-300 dark:border-[#1f2a3a] bg-white dark:bg-[#111c2d] text-gray-700 dark:text-[#e5e7eb] hover:bg-gray-100 dark:hover:bg-[#162338]"
        >
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <ProfileDropdown user={profile} />
      </div>
    </div>
  );
}

