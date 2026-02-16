import React, { useState, useRef, useEffect } from "react";
import { API } from "../api";
import { getSocket } from "../socket";

export default function AddEducationModal({ onClose, fetchProfile }) {
  const [form, setForm] = useState({
    college: "",
    degree: "",
    field: "",
    location: "",
    from: "",
    to: "",
    current: false
  });

  const [errors, setErrors] = useState({});
  const firstInputRef = useRef(null);

  useEffect(() => {
    // Focus first input when modal opens
    if (firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === "current") {
      if (checked) {
        setForm({
          ...form,
          [name]: checked,
          to: ""
        });
      } else {
        setForm({
          ...form,
          [name]: checked
        });
      }
    } else {
      setForm({
        ...form,
        [name]: value
      });
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!form.college.trim()) newErrors.college = "College is required";
    if (!form.degree.trim()) newErrors.degree = "Degree is required";
    if (!form.field.trim()) newErrors.field = "Field of study is required";
    if (!form.location.trim()) newErrors.location = "Location is required";
    if (!form.from) newErrors.from = "Start date is required";
    
    if (!form.current && !form.to) {
      newErrors.to = "Completion date is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      await API.post("/profile/education", form);
      await fetchProfile(); // refetch profile
      onClose();
    } catch (error) {
      console.error("Error adding education:", error);
      alert("Failed to add education");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  // fetchProfile is passed as a prop, so we don't need to redefine it

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-[#111c2d] border border-[#eef1f5] dark:border-[#1f2a3a] rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.25)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.5)] p-7 w-[520px]"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-[#e5e7eb]">Add Education</h2>

        <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} className="space-y-3.5">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-[#e5e7eb]">College *</label>
            <input
              ref={firstInputRef}
              name="college"
              placeholder="College"
              className={`w-full px-3 py-2 border border-[#eef1f5] dark:border-[#1f2a3a] rounded-lg bg-white dark:bg-[#111c2d] ${errors.college ? 'border-red-500' : ''}`}
              value={form.college}
              onChange={handleChange}
            />
            {errors.college && <p className="text-red-500 text-xs mt-1">{errors.college}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-[#e5e7eb]">Degree *</label>
            <input
              name="degree"
              placeholder="Degree"
              className={`w-full px-3 py-2 border border-[#eef1f5] dark:border-[#1f2a3a] rounded-lg bg-white dark:bg-[#111c2d] ${errors.degree ? 'border-red-500' : ''}`}
              value={form.degree}
              onChange={handleChange}
            />
            {errors.degree && <p className="text-red-500 text-xs mt-1">{errors.degree}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-[#e5e7eb]">Field of Study *</label>
            <input
              name="field"
              placeholder="Field of Study"
              className={`w-full px-3 py-2 border border-[#eef1f5] dark:border-[#1f2a3a] rounded-lg bg-white dark:bg-[#111c2d] ${errors.field ? 'border-red-500' : ''}`}
              value={form.field}
              onChange={handleChange}
            />
            {errors.field && <p className="text-red-500 text-xs mt-1">{errors.field}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-[#e5e7eb]">Location *</label>
            <input
              name="location"
              placeholder="Location"
              className={`w-full px-3 py-2 border border-[#eef1f5] dark:border-[#1f2a3a] rounded-lg bg-white dark:bg-[#111c2d] ${errors.location ? 'border-red-500' : ''}`}
              value={form.location}
              onChange={handleChange}
            />
            {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-[#e5e7eb]">Date of joining *</label>
              <input
                name="from"
                type="date"
                className={`w-full px-3 py-2 border border-[#eef1f5] dark:border-[#1f2a3a] rounded-lg bg-white dark:bg-[#111c2d] ${errors.from ? 'border-red-500' : ''}`}
                value={form.from}
                onChange={handleChange}
              />
              {errors.from && <p className="text-red-500 text-xs mt-1">{errors.from}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-[#e5e7eb]">
                {form.current ? "Expected completion" : "Date of completion"} *
              </label>
              <input
                name="to"
                type="date"
                className={`w-full px-3 py-2 border border-[#eef1f5] dark:border-[#1f2a3a] rounded-lg bg-white dark:bg-[#111c2d] ${errors.to ? 'border-red-500' : ''}`}
                value={form.to}
                onChange={handleChange}
                disabled={form.current}
              />
              {errors.to && <p className="text-red-500 text-xs mt-1">{errors.to}</p>}
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="current"
              checked={form.current}
              onChange={handleChange}
              className="mr-2 rounded border-[#eef1f5] dark:border-[#1f2a3a] bg-white dark:bg-[#111c2d]"
            />
            <label className="text-sm text-gray-700 dark:text-[#e5e7eb]">
              Currently studying / not completed
            </label>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-[#eef1f5] dark:border-[#1f2a3a] bg-white dark:bg-[#111c2d] text-gray-700 dark:text-[#e5e7eb]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-sm"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}