import React, { useState, useRef, useEffect } from "react";
import { API } from "../api";
import { getSocket } from "../socket";

const PLACEHOLDER_AVATAR = "https://ui-avatars.com/api/?name=User&background=random";

function getInitials(name) {
  if (!name) return "U";
  return name
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function EditProfile({ profile, onClose, onSaved, open }) {
  const [form, setForm] = useState({
    name: profile.name || "",
    title: profile.title || "",
    email: profile.email || "",
    location: profile.location || "",
    bio: profile.bio || "",
    avatarUrl: profile.avatarUrl || "",
    socials: profile.socials || {},
  });

  const [avatarFile, setAvatarFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [avatarError, setAvatarError] = useState(false);
  const maxBio = 500;
  const fileInputRef = useRef(null);

  // Reset avatar error when modal opens
  useEffect(() => {
    setAvatarError(false);
  }, [open]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Reset avatar error when a new file is selected
    setAvatarError(false);

    // Create a temporary URL for preview
    const tempUrl = URL.createObjectURL(file);
    setForm(prev => ({ ...prev, avatarUrl: tempUrl }));
    
    // Create FormData for upload
    const formData = new FormData();
    formData.append("avatar", file);

    try {
      // Upload the avatar and get the URL
      const res = await API.post("/profile/upload-avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      // Update the form with the new avatar URL - ensure it's the full URL
      // Remove /api from the base URL since static files are served from /uploads/
      const baseUrl = API.defaults.baseURL.replace('/api', '');
      const fullUrl = `${baseUrl}${res.data.url}`;
      setForm(prev => ({ ...prev, avatarUrl: fullUrl }));
    } catch (error) {
      console.error("Error uploading avatar:", error);
      // Revert to previous avatar if upload fails
      setForm(prev => ({ ...prev, avatarUrl: profile.avatarUrl || profile.image || PLACEHOLDER_AVATAR }));
      alert("Failed to upload avatar");
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  async function handleSubmit() {
    try {
      console.log("Saving profile:", form);
      const res = await API.put("/profile/demo", form);
      console.log("API response:", res.data);
      console.log("Location in response:", res.data.location);
      onSaved(res.data);
      onClose();

      // Save to localStorage as well
      localStorage.setItem("profile", JSON.stringify(res.data));

      // Emit socket event to notify other clients
      getSocket().emit("profileUpdate", res.data);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile");
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">

      <div className="bg-white dark:bg-[#111c2d] w-full max-w-2xl rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.25)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.5)] p-7 relative">

        {/* Avatar */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            {!avatarError && form.avatarUrl ? (
              <img
                src={form.avatarUrl}
                className="w-28 h-28 rounded-full object-cover border-3 border-[#e6ecf5]"
                onError={() => setAvatarError(true)}
              />
            ) : (
              <div className="w-28 h-28 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg border-3 border-[#e6ecf5]">
                {getInitials(profile.name)}
              </div>
            )}
            <button 
              className="absolute bottom-1 right-1 bg-blue-600 text-white rounded-full p-2 cursor-pointer text-xs"
              onClick={triggerFileSelect}
            >
              ✎
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              hidden
              onChange={handleAvatarChange}
            />
          </div>
        </div>

        {/* Form Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          <Input label="Name *" name="name" value={form.name} onChange={handleChange} />
          <Input label="Title *" name="title" value={form.title} onChange={handleChange} />

          <Input label="Email ID *" name="email" value={form.email} onChange={handleChange} />

          <Input label="Location" name="location" value={form.location} onChange={handleChange} />

        </div>

        {/* Bio */}
        <div className="mt-5">
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-[#e5e7eb]">Bio</label>
          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            maxLength={maxBio}
            rows={5}
            className="mt-1 w-full border border-[#eef1f5] dark:border-[#1f2a3a] rounded-lg p-3 bg-white dark:bg-[#111c2d] text-gray-900 dark:text-[#e5e7eb]"
          />
          <div className="text-xs text-right text-gray-500 dark:text-[#94a3b8]">
            {form.bio.length} / {maxBio}
          </div>
        </div>

        {/* Resume Upload */}
        <div className="mt-6 border-2 border-dashed border-[#eef1f5] dark:border-[#1f2a3a] rounded-xl p-6 text-center bg-[#f8fafc] dark:bg-[#162338]">
          <div className="text-3xl mb-2">☁️</div>
          <label className="cursor-pointer">
            <span className="bg-[#eef1f5] dark:bg-[#1f2a3a] px-4 py-2 rounded-md text-sm text-gray-700 dark:text-[#e5e7eb]">
              UPLOAD RESUME
            </span>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              hidden
              onChange={(e) => setResumeFile(e.target.files[0])}
            />
          </label>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4 mt-8">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-[#eef1f5] dark:border-[#1f2a3a] bg-white dark:bg-[#111c2d] text-gray-700 dark:text-[#e5e7eb]">
            CANCEL
          </button>

          <button
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-sm"
          >
            UPDATE
          </button>
        </div>

      </div>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-[#e5e7eb]">{label}</label>
      <input
        {...props}
        className="mt-1 w-full border border-[#eef1f5] dark:border-[#1f2a3a] rounded-lg p-3 bg-white dark:bg-[#111c2d] text-gray-900 dark:text-[#e5e7eb]"
      />
    </div>
  );
}

