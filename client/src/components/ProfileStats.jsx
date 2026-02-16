import React from "react";

export default function ProfileStats({ profile }) {
  // Calculate stats
  const totalExperience = profile.experience ? profile.experience.length : 0;
  const totalSkills = profile.skills ? profile.skills.length : 0;

  // Calculate profile completeness percentage
  const fields = [
    profile.name,
    profile.title,
    profile.bio,
    profile.email,
    profile.location,
    profile.skills && profile.skills.length > 0,
    profile.experience && profile.experience.length > 0,
  ];

  const completeness = Math.round((fields.filter(Boolean).length / fields.length) * 100);
  
  // Format last updated date (using current date as placeholder)
  const lastUpdated = new Date().toLocaleDateString();

  return (
    <div className="bg-white dark:bg-[#111c2d] rounded-2xl shadow-sm border border-gray-100 dark:border-[#1f2a3a] p-6 hover:shadow-md transition">
      <h3 className="font-semibold text-gray-900 dark:text-[#e5e7eb] mb-4">Profile Insights</h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 dark:bg-[#162338] rounded-xl p-4 hover:bg-gray-100 dark:hover:bg-[#1a2840] transition">
          <div className="text-2xl font-semibold text-blue-600">{totalExperience}</div>
          <div className="text-xs text-gray-500 dark:text-[#94a3b8] mt-1">Experience</div>
        </div>

        <div className="bg-gray-50 dark:bg-[#162338] rounded-xl p-4 hover:bg-gray-100 dark:hover:bg-[#1a2840] transition">
          <div className="text-2xl font-semibold text-blue-600">{totalSkills}</div>
          <div className="text-xs text-gray-500 dark:text-[#94a3b8] mt-1">Skills</div>
        </div>

        <div className="bg-gray-50 dark:bg-[#162338] rounded-xl p-4 hover:bg-gray-100 dark:hover:bg-[#1a2840] transition">
          <div className="text-2xl font-semibold text-blue-600">{completeness}%</div>
          <div className="text-xs text-gray-500 dark:text-[#94a3b8] mt-1">Complete</div>
        </div>

        <div className="bg-gray-50 dark:bg-[#162338] rounded-xl p-4 hover:bg-gray-100 dark:hover:bg-[#1a2840] transition">
          <div className="text-xs text-gray-500 dark:text-[#94a3b8] truncate">{lastUpdated}</div>
          <div className="text-xs text-gray-500 dark:text-[#94a3b8] mt-1">Updated</div>
        </div>
      </div>
    </div>
  );
}