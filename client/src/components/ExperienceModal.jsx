import React, { useState, useEffect } from "react";
import { API } from "../api";
import { getSocket } from "../socket";

export default function ExperienceModal({ open, onClose, profile, fetchProfile, editExp = null }) {
  const [form, setForm] = useState({
    role: "",
    company: "",
    location: "",
    joinDate: "",
    leaveDate: "",
    current: false
  });

  // Prefill form when in edit mode
  useEffect(() => {
    if (editExp) {
      setForm({
        role: editExp.role || "",
        company: editExp.company || "",
        location: editExp.location || "",
        joinDate: editExp.joinDate || "",
        leaveDate: editExp.leaveDate || "",
        current: editExp.current || false
      });
    } else {
      // Reset form when not in edit mode
      setForm({
        role: "",
        company: "",
        location: "",
        joinDate: "",
        leaveDate: "",
        current: false
      });
    }
  }, [editExp]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleSubmit = async () => {
    if (!form.role || !form.company) {
      alert("Role and Company required");
      return;
    }

    try {
      if (editExp) {
        // Update existing experience
        await API.put(`/profile/experience/${editExp._id}`, form);
      } else {
        // Add new experience
        await API.post("/profile/experience", form);
      }
      
      await fetchProfile(); // refetch profile
      onClose();

      // Emit socket event to notify other clients
      // The profile will be updated via fetchProfile
    } catch (error) {
      console.error("Error handling experience:", error);
      alert(editExp ? "Failed to update experience" : "Failed to add experience");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-[#111c2d] border border-[#eef1f5] dark:border-[#1f2a3a] w-[520px] rounded-2xl p-7 shadow-[0_25px_60px_rgba(0,0,0,0.25)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.5)]">
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-[#e5e7eb]">
          {editExp ? "Edit Experience" : "Add Experience"}
        </h2>

        <div className="space-y-3.5">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-[#e5e7eb]">Role</label>
            <input 
              name="role" 
              placeholder="Role" 
              className="w-full px-3 py-2 border border-[#eef1f5] dark:border-[#1f2a3a] rounded-lg bg-white dark:bg-[#111c2d] text-gray-900 dark:text-[#e5e7eb]" 
              value={form.role}
              onChange={handleChange} 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-[#e5e7eb]">Company</label>
            <input 
              name="company" 
              placeholder="Company" 
              className="w-full px-3 py-2 border border-[#eef1f5] dark:border-[#1f2a3a] rounded-lg bg-white dark:bg-[#111c2d] text-gray-900 dark:text-[#e5e7eb]" 
              value={form.company}
              onChange={handleChange} 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-[#e5e7eb]">Location</label>
            <input 
              name="location" 
              placeholder="Location" 
              className="w-full px-3 py-2 border border-[#eef1f5] dark:border-[#1f2a3a] rounded-lg bg-white dark:bg-[#111c2d] text-gray-900 dark:text-[#e5e7eb]" 
              value={form.location}
              onChange={handleChange} 
            />
          </div>
          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-[#e5e7eb]">Start Date</label>
              <input 
                name="joinDate" 
                type="date" 
                className="w-full px-3 py-2 border border-[#eef1f5] dark:border-[#1f2a3a] rounded-lg bg-white dark:bg-[#111c2d] text-gray-900 dark:text-[#e5e7eb]" 
                value={form.joinDate}
                onChange={handleChange} 
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-[#e5e7eb]">End Date</label>
              <input 
                name="leaveDate" 
                type="date" 
                className="w-full px-3 py-2 border border-[#eef1f5] dark:border-[#1f2a3a] rounded-lg bg-white dark:bg-[#111c2d] text-gray-900 dark:text-[#e5e7eb]" 
                value={form.leaveDate}
                onChange={handleChange} 
              />
            </div>
          </div>

          <label className="flex gap-2 text-sm text-gray-700 dark:text-[#e5e7eb]">
            <input 
              type="checkbox" 
              name="current" 
              className="mt-1 rounded border-[#eef1f5] dark:border-[#1f2a3a] bg-white dark:bg-[#111c2d]" 
              checked={form.current}
              onChange={handleChange} 
            />
            Currently working here
          </label>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-[#eef1f5] dark:border-[#1f2a3a] bg-white dark:bg-[#111c2d] text-gray-700 dark:text-[#e5e7eb]">Cancel</button>
          <button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-sm">
            {editExp ? "Update" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}