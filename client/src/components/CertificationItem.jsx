import React, { useState, useRef, useEffect } from "react";
import { Edit3, Trash2 } from "lucide-react";

export default function CertificationItem({ cert, onDelete, onEdit }) {
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
          📜
        </div>

        {/* text */}
        <div className="space-y-1">
          <div className="font-medium text-gray-900">
            {cert.name}
          </div>

          <div className="text-sm text-gray-500">
            {cert.provider}
          </div>

          {cert.certificateUrl && (
            <a
              href={cert.certificateUrl.startsWith("http") 
                ? cert.certificateUrl 
                : `https://${cert.certificateUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline"
            >
              Certificate Link
            </a>
          )}

          <div className="text-sm text-gray-500">
            Provided on: {formatDate(cert.issuedDate)}
          </div>
        </div>

      </div>

      {/* 3-dot menu */}
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => toggleMenu(cert._id)}
          className="p-1 rounded hover:bg-gray-100 cursor-pointer"
        >
          ⋯
        </button>
        
        {openMenuId === cert._id && (
          <div className="absolute right-0 mt-1 w-44 bg-white rounded-xl shadow-lg border border-gray-100 p-1 space-y-1 z-50">
            <button
              className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-gray-100 transition cursor-pointer"
              onClick={() => {
                onEdit(cert);
                setOpenMenuId(null);
              }}
            >
              Edit certification
            </button>
            <button
              className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-gray-100 transition cursor-pointer text-red-600"
              onClick={async () => {
                await onDelete(cert._id);
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