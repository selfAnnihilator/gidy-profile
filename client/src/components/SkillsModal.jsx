import React, { useState, useEffect } from "react";
import { API } from "../api";
import { getSocket } from "../socket";

export default function SkillsModal({ open, onClose, profile, fetchProfile }) {
  const [inputValue, setInputValue] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  // Pre-populate with existing skills
  useEffect(() => {
    if (open && profile?.skills) {
      setSelectedSkills(profile.skills.map(s => typeof s === 'object' ? s.name : s));
    } else {
      setSelectedSkills([]);
    }
    setInputValue("");
    setSearchTerm("");
  }, [open, profile]);

  // Sample suggestions for the dropdown
  const allSkills = [
    "JavaScript", "React", "Node.js", "Python", "Java", "C++", "HTML", "CSS", "SQL", "MongoDB",
    "Express", "Git", "AWS", "Docker", "Kubernetes", "TypeScript", "Angular", "Vue.js", "Redux",
    "GraphQL", "PostgreSQL", "MySQL", "Firebase", "SASS", "Webpack", "Jest", "Cypress", "Next.js",
    "Tailwind CSS", "Material UI", "Bootstrap", "jQuery", "PHP", "Ruby", "Go", "Rust", "Swift",
    "Kotlin", "Spring", "Hibernate", "Laravel", "Symfony", "Django", "Flask", "FastAPI", "Pandas",
    "NumPy", "TensorFlow", "PyTorch", "Scikit-Learn", "OpenCV", "Unity", "Unreal Engine", "Blender"
  ];

  // Filter suggestions based on search term
  useEffect(() => {
    if (searchTerm) {
      const filtered = allSkills.filter(skill =>
        skill.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !selectedSkills.some(selected => selected.toLowerCase() === skill.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 8)); // Limit to 8 suggestions
    } else {
      setSuggestions([]);
    }
  }, [searchTerm, selectedSkills]);

  const handleAddSkill = (skill) => {
    const trimmedSkill = skill.trim();
    if (trimmedSkill && !selectedSkills.some(s => s.toLowerCase() === trimmedSkill.toLowerCase())) {
      setSelectedSkills([...selectedSkills, trimmedSkill]);
      setInputValue("");
      setSearchTerm("");
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSelectedSkills(selectedSkills.filter(skill => skill !== skillToRemove));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      handleAddSkill(inputValue.trim());
    }
  };

  const handleSuggestionClick = (skill) => {
    handleAddSkill(skill);
  };

  const handleSubmit = async () => {
    if (selectedSkills.length === 0) {
      alert("Please add at least one skill");
      return;
    }

    try {
      // Prepare the skills data - if the profile.skills contains objects with endorsements, we need to handle that
      const skillsPayload = selectedSkills.map(skill => {
        if (typeof skill === 'string') {
          return { name: skill, endorsements: 0 };
        }
        return skill;
      });

      // Send the skills to the backend - replace the entire skills array
      const profileResponse = await API.get("/profile/demo");
      const updatedProfile = { ...profileResponse.data };
      
      // Replace the skills array with the new one
      updatedProfile.skills = skillsPayload;
      
      await API.put("/profile/demo", updatedProfile);
      await fetchProfile(); // refetch profile
      onClose();

      // Emit socket event to notify other clients
      // The profile will be updated via fetchProfile
    } catch (error) {
      console.error("Error updating skills:", error);
      alert("Failed to update skills");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-[#111c2d] border border-[#eef1f5] dark:border-[#1f2a3a] w-[520px] rounded-2xl p-7 shadow-[0_25px_60px_rgba(0,0,0,0.25)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.5)]">
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-[#e5e7eb]">
          Update Skills
        </h2>

        <div className="space-y-3.5">
          {/* Selected Skills Chips */}
          <div className="flex flex-wrap gap-2 min-h-[40px]">
            {selectedSkills.map((skill, index) => (
              <div
                key={index}
                className="flex items-center gap-1 bg-blue-100 dark:bg-[#162338] text-gray-800 dark:text-[#e5e7eb] px-3 py-1 rounded-full text-sm"
              >
                {typeof skill === 'object' ? skill.name : skill}
                <button
                  onClick={() => handleRemoveSkill(typeof skill === 'object' ? skill.name : skill)}
                  className="ml-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          {/* Input Field */}
          <div className="relative">
            <input
              type="text"
              placeholder="Type or search for skills..."
              className="w-full px-3 py-2 border border-[#eef1f5] dark:border-[#1f2a3a] rounded-lg bg-white dark:bg-[#111c2d] text-gray-900 dark:text-[#e5e7eb]"
              value={inputValue || searchTerm}
              onChange={(e) => {
                const value = e.target.value;
                setInputValue(value);
                setSearchTerm(value);
              }}
              onKeyPress={handleKeyPress}
            />

            {/* Suggestions Dropdown */}
            {suggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white dark:bg-[#111c2d] border border-[#eef1f5] dark:border-[#1f2a3a] rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-[#162338] cursor-pointer text-gray-900 dark:text-[#e5e7eb]"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-[#eef1f5] dark:border-[#1f2a3a] bg-white dark:bg-[#111c2d] text-gray-700 dark:text-[#e5e7eb]">Cancel</button>
          <button 
            onClick={handleSubmit} 
            disabled={selectedSkills.length === 0}
            className={`px-4 py-2 rounded-lg shadow-sm ${
              selectedSkills.length === 0 
                ? "bg-gray-400 cursor-not-allowed" 
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
}