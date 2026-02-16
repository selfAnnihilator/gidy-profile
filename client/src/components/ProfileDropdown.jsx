import React, { useState, useRef, useEffect } from "react";
import { User, LogOut, MessageSquare } from "lucide-react";

export default function ProfileDropdown({ user }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleItemClick = (action) => {
    console.log(action);
    setOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <img
        src={user?.avatarUrl || user?.image || "https://i.pravatar.cc/40"}
        className="w-9 h-9 rounded-full cursor-pointer border border-gray-200"
        onClick={() => setOpen(!open)}
      />

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#111c2d] rounded-xl shadow-lg border border-gray-100 dark:border-[#1f2a3a] p-1 z-50">
          <MenuItem
            icon={<User size={16} />}
            label="Profile"
            onClick={() => handleItemClick("Profile")}
          />
          
          <MenuItem
            icon={<LogOut size={16} className="text-red-500" />}
            label="Logout"
            danger
            onClick={() => handleItemClick("Logout")}
          />

          <MenuItem
            icon={<MessageSquare size={16} className="text-purple-500" />}
            label="Feedback"
            onClick={() => handleItemClick("Feedback")}
          />
        </div>
      )}
    </div>
  );
}

function MenuItem({ icon, label, danger, onClick }) {
  return (
    <div
      className={`flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#162338] cursor-pointer text-sm ${
        danger ? "text-red-600 dark:text-red-400" : "text-gray-700 dark:text-[#e5e7eb]"
      }`}
      onClick={onClick}
    >
      {icon}
      {label}
    </div>
  );
}