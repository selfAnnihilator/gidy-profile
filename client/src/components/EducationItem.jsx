import React, { useState, useRef, useEffect } from "react";
import { Edit3, Trash2 } from "lucide-react";

export default function EducationItem({ edu, onDelete, onEdit }) {
  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric"
    });
  };

  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRef = useRef(null);

  const toggleMenu = (id) => {
    if (openMenuId === id) {
      setOpenMenuId(null);
    } else {
      setOpenMenuId(id);
    }
  };

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="
      flex items-start justify-between
      pt-4
    ">
      <div className="flex gap-4">

        {/* icon box */}
        <div className="
          w-12 h-12 rounded-xl
          bg-blue-50
          flex items-center justify-center
        ">
          🎓
        </div>

        {/* text */}
        <div className="space-y-1">
          <div className="font-medium text-[var(--text-primary)]">
            {edu.degree} — {edu.field}
          </div>

          <div className="text-sm text-[var(--text-secondary)]">
            {edu.college}, {edu.location}
          </div>

          <div className="text-sm text-[var(--text-muted)]">
            {formatDate(edu.startDate)} — {edu.isCurrent ? "Present" : formatDate(edu.endDate)}
          </div>
        </div>

      </div>

      {/* 3-dot menu */}
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => toggleMenu(edu._id)}
          className="p-1 rounded hover:bg-[var(--bg-card)] cursor-pointer text-[var(--text-secondary)]"
        >
          ⋯
        </button>

        {openMenuId === edu._id && (
          <div className="absolute right-0 mt-1 w-44 bg-[var(--bg-card)] rounded-xl shadow-lg border border-[var(--border)] p-1 space-y-1 z-50">
            <button
              className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-[var(--bg-card)] transition cursor-pointer text-[var(--text-primary)]"
              onClick={() => {
                onEdit(edu);
                setOpenMenuId(null);
              }}
            >
              Edit education
            </button>
            <button
              className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-[var(--bg-card)] transition cursor-pointer text-red-600"
              onClick={async () => {
                await onDelete(edu._id);
                setOpenMenuId(null);
              }}
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}