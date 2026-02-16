import React, { useState, useEffect } from "react";
import { API } from "../api";
import { getSocket } from "../socket";

export default function EducationModal({ open, onClose, profile, fetchProfile, editEdu = null }) {
  const [form, setForm] = useState({
    college: "",
    degree: "",
    field: "",
    location: "",
    startDate: "",
    endDate: "",
    isCurrent: false
  });

  // Prefill form when in edit mode
  useEffect(() => {
    if (editEdu) {
      setForm({
        college: editEdu.college || "",
        degree: editEdu.degree || "",
        field: editEdu.field || "",
        location: editEdu.location || "",
        startDate: editEdu.startDate || "",
        endDate: editEdu.endDate || "",
        isCurrent: editEdu.isCurrent || false
      });
    } else {
      // Reset form when not in edit mode
      setForm({
        college: "",
        degree: "",
        field: "",
        location: "",
        startDate: "",
        endDate: "",
        isCurrent: false
      });
    }
  }, [editEdu]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleSubmit = async () => {
    if (!form.college || !form.degree || !form.field) {
      alert("College, Degree, and Field of Study are required");
      return;
    }

    try {
      if (editEdu) {
        // Update existing education
        await API.put(`/profile/education/${editEdu._id}`, form);
      } else {
        // Add new education
        await API.post("/profile/education", form);
      }

      await fetchProfile(); // refetch profile
      onClose();

      // Emit socket event to notify other clients
      // The profile will be updated via fetchProfile
    } catch (error) {
      console.error("Error handling education:", error);
      alert(editEdu ? "Failed to update education" : "Failed to add education");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-[#111c2d] border border-[#eef1f5] dark:border-[#1f2a3a] w-[520px] rounded-2xl p-7 shadow-[0_25px_60px_rgba(0,0,0,0.25)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.5)]">
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-[#e5e7eb]">
          {editEdu ? "Edit Education" : "Add Education"}
        </h2>

        <div className="space-y-3.5">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-[#e5e7eb]">College *</label>
            <input
              name="college"
              placeholder="College"
              className="w-full px-3 py-2 border border-[#eef1f5] dark:border-[#1f2a3a] rounded-lg bg-white dark:bg-[#111c2d] text-gray-900 dark:text-[#e5e7eb]"
              value={form.college}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-[#e5e7eb]">Degree *</label>
            <input
              name="degree"
              placeholder="Degree"
              className="w-full px-3 py-2 border border-[#eef1f5] dark:border-[#1f2a3a] rounded-lg bg-white dark:bg-[#111c2d] text-gray-900 dark:text-[#e5e7eb]"
              value={form.degree}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-[#e5e7eb]">Field of Study *</label>
            <input
              name="field"
              placeholder="Field of Study"
              className="w-full px-3 py-2 border border-[#eef1f5] dark:border-[#1f2a3a] rounded-lg bg-white dark:bg-[#111c2d] text-gray-900 dark:text-[#e5e7eb]"
              value={form.field}
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
                name="startDate"
                type="date"
                className="w-full px-3 py-2 border border-[#eef1f5] dark:border-[#1f2a3a] rounded-lg bg-white dark:bg-[#111c2d] text-gray-900 dark:text-[#e5e7eb]"
                value={form.startDate}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-[#e5e7eb]">End Date</label>
              <input
                name="endDate"
                type="date"
                className="w-full px-3 py-2 border border-[#eef1f5] dark:border-[#1f2a3a] rounded-lg bg-white dark:bg-[#111c2d] text-gray-900 dark:text-[#e5e7eb]"
                value={form.endDate}
                onChange={handleChange}
                disabled={form.isCurrent}
              />
            </div>
          </div>

          <label className="flex gap-2 text-sm text-gray-700 dark:text-[#e5e7eb]">
            <input
              type="checkbox"
              name="isCurrent"
              className="mt-1 rounded border-[#eef1f5] dark:border-[#1f2a3a] bg-white dark:bg-[#111c2d]"
              checked={form.isCurrent}
              onChange={handleChange}
            />
            Currently studying here
          </label>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-[#eef1f5] dark:border-[#1f2a3a] bg-white dark:bg-[#111c2d] text-gray-700 dark:text-[#e5e7eb]">Cancel</button>
          <button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-sm">
            {editEdu ? "Update" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}