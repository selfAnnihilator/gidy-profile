import React, { useState } from "react";
import { API } from "../api";
import { getSocket } from "../socket";

export default function AddCertificationModal({ open, onClose, fetchProfile }) {
  const [form, setForm] = useState({
    name: "",
    provider: "",
    certificateUrl: "",
    certificateId: "",
    issuedDate: "",
    expiryDate: "",
    description: ""
  });

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value
    });
  };

  const handleSubmit = async () => {
    if (!form.name || !form.provider) {
      alert("Certification name and provider are required");
      return;
    }

    try {
      // Add certification to profile
      await API.post("/profile/certification", form);
      await fetchProfile(); // refetch profile
      onClose();

      // Emit socket event to notify other clients
      // The profile will be updated via fetchProfile
    } catch (error) {
      console.error("Error adding certification:", error);
      alert("Failed to add certification");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-[#111c2d] border border-[#eef1f5] dark:border-[#1f2a3a] w-[520px] rounded-2xl p-7 shadow-[0_25px_60px_rgba(0,0,0,0.25)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.5)]">
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-[#e5e7eb]">
          Add Certification
        </h2>

        <div className="space-y-3.5">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-[#e5e7eb]">Certification Name *</label>
            <input
              name="name"
              placeholder="Certification Name"
              className="w-full px-3 py-2 border border-[#eef1f5] dark:border-[#1f2a3a] rounded-lg bg-white dark:bg-[#111c2d] text-gray-900 dark:text-[#e5e7eb]"
              value={form.name}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-[#e5e7eb]">Provider *</label>
            <input
              name="provider"
              placeholder="Provider"
              className="w-full px-3 py-2 border border-[#eef1f5] dark:border-[#1f2a3a] rounded-lg bg-white dark:bg-[#111c2d] text-gray-900 dark:text-[#e5e7eb]"
              value={form.provider}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-[#e5e7eb]">Certificate URL</label>
            <input
              name="certificateUrl"
              placeholder="Certificate URL"
              className="w-full px-3 py-2 border border-[#eef1f5] dark:border-[#1f2a3a] rounded-lg bg-white dark:bg-[#111c2d] text-gray-900 dark:text-[#e5e7eb]"
              value={form.certificateUrl}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-[#e5e7eb]">Certificate ID</label>
            <input
              name="certificateId"
              placeholder="Certificate ID"
              className="w-full px-3 py-2 border border-[#eef1f5] dark:border-[#1f2a3a] rounded-lg bg-white dark:bg-[#111c2d] text-gray-900 dark:text-[#e5e7eb]"
              value={form.certificateId}
              onChange={handleChange}
            />
          </div>
          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-[#e5e7eb]">Issued Date</label>
              <input
                name="issuedDate"
                type="date"
                className="w-full px-3 py-2 border border-[#eef1f5] dark:border-[#1f2a3a] rounded-lg bg-white dark:bg-[#111c2d] text-gray-900 dark:text-[#e5e7eb]"
                value={form.issuedDate}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-[#e5e7eb]">Expiry Date</label>
              <input
                name="expiryDate"
                type="date"
                className="w-full px-3 py-2 border border-[#eef1f5] dark:border-[#1f2a3a] rounded-lg bg-white dark:bg-[#111c2d] text-gray-900 dark:text-[#e5e7eb]"
                value={form.expiryDate}
                onChange={handleChange}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-[#e5e7eb]">Description</label>
            <textarea
              name="description"
              placeholder="Description"
              className="w-full px-3 py-2 border border-[#eef1f5] dark:border-[#1f2a3a] rounded-lg bg-white dark:bg-[#111c2d] text-gray-900 dark:text-[#e5e7eb]"
              value={form.description}
              onChange={handleChange}
              rows="3"
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-[#eef1f5] dark:border-[#1f2a3a] bg-white dark:bg-[#111c2d] text-gray-700 dark:text-[#e5e7eb]">Cancel</button>
          <button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-sm">
            Add
          </button>
        </div>
      </div>
    </div>
  );
}