import React, { useState } from "react";
import { API } from "../api";
import { getSocket } from "../socket";

export default function EditSocialModal({ open, onClose, profile, fetchProfile }) {
  const [editingSocials, setEditingSocials] = useState({});

  // Initialize editingSocials with current socials
  React.useEffect(() => {
    if (open && profile?.socials) {
      setEditingSocials({ ...profile.socials });
    } else if (open) {
      // If modal is open but no socials exist, initialize with empty object
      setEditingSocials({});
    }
  }, [open, profile]);

  if (!open) return null;

  const handleSave = async (platform) => {
    try {
      // Prepare the updated socials object
      const updatedSocials = {
        ...profile.socials,
        [platform]: editingSocials[platform]
      };

      // Update the profile with the new social link
      const res = await API.put("/profile/demo", {
        ...profile,
        socials: updatedSocials
      });

      await fetchProfile(); // refetch profile
    } catch (error) {
      console.error("Error updating social:", error);
      alert("Failed to update social link");
    }
  };

  const handleDelete = async (platform) => {
    try {
      // Prepare the updated socials object without the deleted platform
      const updatedSocials = { ...profile.socials };
      delete updatedSocials[platform];

      // Update the profile with the new social links
      const res = await API.put("/profile/demo", {
        ...profile,
        socials: updatedSocials
      });

      await fetchProfile(); // refetch profile
      setEditingSocials(updatedSocials); // Update local state as well
    } catch (error) {
      console.error("Error deleting social:", error);
      alert("Failed to delete social link");
    }
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  };

  const handleChange = (platform, value) => {
    setEditingSocials(prev => ({
      ...prev,
      [platform]: value
    }));
  };

  const onSaveChanges = async () => {
    try {
      // Update the profile with the new social links
      const res = await API.put("/profile/demo", {
        ...profile,
        socials: editingSocials
      });

      await fetchProfile(); // refetch profile
      onClose();
    } catch (error) {
      console.error("Error saving socials:", error);
      alert("Failed to save social links");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-[#111c2d] border border-[#eef1f5] dark:border-[#1f2a3a] w-[520px] rounded-2xl p-7 shadow-[0_25px_60px_rgba(0,0,0,0.25)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.5)]">
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-[#e5e7eb]">
          Edit Social Links
        </h2>

        <div className="space-y-3.5">
          {['github', 'linkedin', 'instagram'].map(platform => (
            profile.socials?.[platform] && (
              <div key={platform} className="flex items-center gap-3">
                <label className="w-24 text-sm font-medium text-gray-700 dark:text-[#e5e7eb]">
                  {platform.charAt(0).toUpperCase() + platform.slice(1)}:
                </label>
                <input
                  type="text"
                  placeholder={`https://${platform}.com/username`}
                  className="flex-1 px-3 py-2 border border-[#eef1f5] dark:border-[#1f2a3a] rounded-lg bg-white dark:bg-[#111c2d] text-gray-900 dark:text-[#e5e7eb]"
                  value={editingSocials[platform] || ''}
                  onChange={(e) => handleChange(platform, e.target.value)}
                />
                {isValidUrl(editingSocials[platform]) && (
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    ✓
                  </div>
                )}
                <button
                  onClick={() => handleDelete(platform)}
                  className="w-8 h-8 rounded-full bg-red-100 hover:bg-red-200 flex items-center justify-center text-red-600"
                >
                  🗑
                </button>
              </div>
            )
          ))}
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-[#eef1f5] dark:border-[#1f2a3a] bg-white dark:bg-[#111c2d] text-gray-700 dark:text-[#e5e7eb]">Cancel</button>
          <button 
            onClick={onSaveChanges}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-sm"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}