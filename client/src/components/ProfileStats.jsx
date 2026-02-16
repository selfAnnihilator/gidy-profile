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
    <div className="bg-[var(--bg-card)] rounded-2xl shadow-sm border border-[var(--border)] p-6 hover:shadow-md transition">
      <h3 className="font-semibold text-[var(--text-primary)] mb-4">Profile Insights</h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[var(--bg-card)] rounded-xl p-4 hover:bg-[var(--bg-card)] transition">
          <div className="text-2xl font-semibold text-blue-600">{totalExperience}</div>
          <div className="text-xs text-[var(--text-secondary)] mt-1">Experience</div>
        </div>

        <div className="bg-[var(--bg-card)] rounded-xl p-4 hover:bg-[var(--bg-card)] transition">
          <div className="text-2xl font-semibold text-blue-600">{totalSkills}</div>
          <div className="text-xs text-[var(--text-secondary)] mt-1">Skills</div>
        </div>

        <div className="bg-[var(--bg-card)] rounded-xl p-4 hover:bg-[var(--bg-card)] transition">
          <div className="text-2xl font-semibold text-blue-600">{completeness}%</div>
          <div className="text-xs text-[var(--text-secondary)] mt-1">Complete</div>
        </div>

        <div className="bg-[var(--bg-card)] rounded-xl p-4 hover:bg-[var(--bg-card)] transition">
          <div className="text-xs text-[var(--text-secondary)] truncate">{lastUpdated}</div>
          <div className="text-xs text-[var(--text-secondary)] mt-1">Updated</div>
        </div>
      </div>
    </div>
  );
}