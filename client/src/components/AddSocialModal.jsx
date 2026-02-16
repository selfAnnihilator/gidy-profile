import React, { useState } from "react";
import { API } from "../api";
import { getSocket } from "../socket";

export default function AddSocialModal({ open, onClose, profile, fetchProfile }) {
  const [form, setForm] = useState({
    platform: "",
    link: ""
  });

  if (!open) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.platform || !form.link) {
      alert("Please select a platform and enter a link");
      return;
    }

    try {
      // Prepare the updated socials object - ensure proper URL format
      const updatedSocials = {
        ...profile.socials,
        [form.platform]: form.link.startsWith('http') ? form.link : `https://${form.link}`
      };

      // Update the profile with the new social link
      const res = await API.put("/profile/demo", {
        ...profile,
        socials: updatedSocials
      });

      await fetchProfile(); // refetch profile
      onClose();

      // Emit socket event to notify other clients
      getSocket().emit("profileUpdate", res.data);
    } catch (error) {
      console.error("Error adding social:", error);
      alert("Failed to add social link");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-[#111c2d] border border-[#eef1f5] dark:border-[#1f2a3a] w-[520px] rounded-2xl p-7 shadow-[0_25px_60px_rgba(0,0,0,0.25)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.5)]">
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-[#e5e7eb]">
          Add Social Link
        </h2>

        <div className="space-y-3.5">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-[#e5e7eb]">Social Media</label>
            <select
              name="platform"
              className="w-full px-3 py-2 border border-[#eef1f5] dark:border-[#1f2a3a] rounded-lg bg-white dark:bg-[#111c2d] text-gray-900 dark:text-[#e5e7eb]"
              value={form.platform}
              onChange={handleChange}
            >
              <option value="">Select Platform</option>
              {!profile.socials?.github && (
                <option value="github">GitHub</option>
              )}
              {!profile.socials?.linkedin && (
                <option value="linkedin">LinkedIn</option>
              )}
              {!profile.socials?.instagram && (
                <option value="instagram">Instagram</option>
              )}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-[#e5e7eb]">Link</label>
            <input
              name="link"
              placeholder="https://example.com/username"
              className="w-full px-3 py-2 border border-[#eef1f5] dark:border-[#1f2a3a] rounded-lg bg-white dark:bg-[#111c2d] text-gray-900 dark:text-[#e5e7eb]"
              value={form.link}
              onChange={handleChange}
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