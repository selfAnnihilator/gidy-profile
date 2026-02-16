import React from "react";

export default function SkillChip({ skill }) {
  const skillName = typeof skill === 'object' ? skill.name : skill;
  const endorsements = typeof skill === 'object' ? skill.endorsements || 0 : 0;

  return (
    <div className="flex items-center gap-2 bg-gray-100 dark:bg-[#162338] rounded-full px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-[#e5e7eb]">
      {skillName}
      {endorsements > 0 && (
        <span className="text-xs bg-blue-100 text-blue-800 rounded-full px-1.5 py-0.5">
          {endorsements}
        </span>
      )}
    </div>
  );
}