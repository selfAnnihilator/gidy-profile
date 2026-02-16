import React from "react";

export default function ProfileStrength({ profile }) {

  const checks = [
    profile.name,
    profile.bio,
    profile.skills?.length > 0,
    profile.experience?.length > 0,
    profile.education?.length > 0,
    profile.certifications?.length > 0,
    profile.github
  ];

  const score = Math.round(
    (checks.filter(Boolean).length / checks.length) * 100
  );

  const missing = [];

  if (!profile.experience?.length) missing.push("Experience");
  if (!profile.education?.length) missing.push("Education");
  if (!profile.certifications?.length) missing.push("Certifications");
  if (!profile.github) missing.push("GitHub");

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 shadow transition-colors">
      <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-3">Profile Strength</h3>

      <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-3 mb-3">
        <div
          className="bg-green-500 h-3 rounded-full transition-all"
          style={{ width: `${score}%` }}
        />
      </div>

      <p className="text-sm text-gray-900 dark:text-white mb-2">{score}% Complete</p>

      {missing.length > 0 && (
        <div className="text-sm text-gray-600 dark:text-slate-200">
          Missing:
          <ul className="list-disc ml-5">
            {missing.map((m) => (
              <li key={m} className="text-gray-600 dark:text-slate-200">{m}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}