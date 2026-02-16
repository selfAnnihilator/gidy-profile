import React, { useState, useRef, useEffect } from "react";
import { API } from "../api";
import { getSocket } from "../socket";
import { MoreVertical, Edit3, Github, Linkedin, Instagram } from "lucide-react";
import ExperienceModal from "./ExperienceModal";
import EducationModal from "./EducationModal";
import SkillsModal from "./SkillsModal";
import AddSocialModal from "./AddSocialModal";
import EditSocialModal from "./EditSocialModal";
import ProfileStats from "./ProfileStats";
import AddEducationModal from "./AddEducationModal";
import ExperienceItem from "./ExperienceItem";
import EducationItem from "./EducationItem";
import CertificationItem from "./CertificationItem";
import CertificationModal from "./CertificationModal";
import SkillChip from "./SkillChip";

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


export default function ProfileDashboard({ profile, setProfile, setEdit }) {
  const [expOpen, setExpOpen] = useState(false);
  const [eduOpen, setEduOpen] = useState(false);
  const [certOpen, setCertOpen] = useState(false);
  const [skillsOpen, setSkillsOpen] = useState(false);
  const [socialOpen, setSocialOpen] = useState(false);
  const [editSocialOpen, setEditSocialOpen] = useState(false);
  const [careerModalOpen, setCareerModalOpen] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const [editExp, setEditExp] = useState(null); // Track which experience is being edited
  const [editEdu, setEditEdu] = useState(null); // Track which education is being edited
  const [editCert, setEditCert] = useState(null); // Track which certification is being edited
  const [menuOpen, setMenuOpen] = useState(false);
  const [expMenuOpen, setExpMenuOpen] = useState(null); // Track which exp menu is open
  const [eduMenuOpen, setEduMenuOpen] = useState(null); // Track which edu menu is open
  const [certMenuOpen, setCertMenuOpen] = useState(null); // Track which cert menu is open
  const menuRef = useRef(null);
  const expMenuRef = useRef(null);
  const eduMenuRef = useRef(null);
  const certMenuRef = useRef(null);

  const [careerForm, setCareerForm] = useState({
    bestDescription: "",
    aspiration: "",
    field: "",
    inspiration: "",
    currentAim: ""
  });

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
      if (expMenuRef.current && !expMenuRef.current.contains(e.target)) {
        setExpMenuOpen(null);
      }
      if (eduMenuRef.current && !eduMenuRef.current.contains(e.target)) {
        setEduMenuOpen(null);
      }
      if (certMenuRef.current && !certMenuRef.current.contains(e.target)) {
        setCertMenuOpen(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setCareerForm({
      bestDescription: profile?.careerVision?.bestDescription || "",
      aspiration: profile?.careerVision?.aspiration || "",
      field: profile?.careerVision?.field || "",
      inspiration: profile?.careerVision?.inspiration || "",
      currentAim: profile?.careerVision?.currentAim || ""
    });
  }, [profile]);

  // Load saved career vision from localStorage on profile change
  useEffect(() => {
    const userId = profile.id || "demo-user";
    const CAREER_KEY = `careerVision_${userId}`;
    
    const saved = localStorage.getItem(CAREER_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        
        setProfile(prev => ({
          ...prev,
          careerVision: {
            bestDescription: parsed.bestDescription || "",
            aspiration: parsed.aspiration || "",
            field: parsed.field || "",
            inspiration: parsed.inspiration || "",
            currentAim: parsed.currentAim || ""
          }
        }));
      } catch (error) {
        console.error('Error parsing saved career vision:', error);
      }
    }
  }, [profile.id]); // Only run when profile.id changes

  const fetchProfile = async () => {
    try {
      const res = await API.get("/profile/demo");
      
      // Get saved career vision from localStorage before updating profile
      const userId = res.data.id || "demo-user";
      const CAREER_KEY = `careerVision_${userId}`;
      const savedCareerVision = localStorage.getItem(CAREER_KEY);
      const parsedSavedCareer = savedCareerVision ? JSON.parse(savedCareerVision) : null;
      
      const normalized = {
        ...res.data,
        education: res.data.education || [],
        certifications: res.data.certifications || [],
        experience: res.data.experience || [],
        skills: res.data.skills || [],
        careerVision: parsedSavedCareer || {
          bestDescription: res.data.careerVision?.bestDescription || "",
          aspiration: res.data.careerVision?.aspiration || "",
          field: res.data.careerVision?.field || "",
          inspiration: res.data.careerVision?.inspiration || "",
          currentAim: res.data.careerVision?.currentAim || ""
        },
        career: res.data.career || {
          type: "",
          aspiration: "",
          field: "",
          inspiration: "",
          currentAim: ""
        }
      };
      setProfile(normalized);
    } catch (e) {
      console.error(e);
    }
  };

  // Load profile on component mount
  useEffect(() => {
    console.log("ProfileDashboard profile state:", profile);
    console.log("Location in ProfileDashboard:", profile?.location);
    fetchProfile();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">

      {/* PROFILE HEADER */}
      <div className="relative bg-[var(--bg-card)] rounded-2xl shadow-sm hover:shadow-md transition-shadow p-7 border border-[var(--border)]">
        <div className="flex flex-col md:flex-row gap-7">
          <div className="flex-shrink-0 flex justify-center md:justify-start">
            {!avatarError && (profile.avatarUrl || profile.image) ? (
              <img
                src={profile.avatarUrl || profile.image}
                className="w-20 h-20 rounded-full ring-4 ring-blue-50 object-cover"
                onError={() => setAvatarError(true)}
              />
            ) : (
              <div className="w-20 h-20 rounded-full ring-4 ring-blue-50 bg-blue-500 flex items-center justify-center text-white font-bold text-lg">
                {getInitials(profile.name)}
              </div>
            )}
          </div>

          <div className="flex-grow">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div>
                <h1 className="text-xl font-semibold text-[var(--text-primary)]">{profile.name || "Your Name"}</h1>
                <p className="text-sm text-[var(--text-secondary)] space-y-1 mt-1">{profile.title || "Add your headline"}</p>

                <div className="mt-3 flex gap-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                    Available for work
                  </span>
                </div>

                <p className="mt-3 text-[var(--text-secondary)] max-w-2xl leading-relaxed">
                  {profile.bio || "Add a short bio about yourself"}
                </p>
              </div>

            </div>

            <div className="mt-5 flex flex-wrap gap-4">
              {profile.email && (
                <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                  <svg className="w-4 h-4 text-[var(--text-muted)]" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg>
                  {profile.email}
                </div>
              )}
              {profile.location && (
                <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                  <svg className="w-4 h-4 text-[var(--text-muted)]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
                  {profile.location}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* MENU BUTTONS */}
        <div className="absolute top-4 right-4 flex gap-2">
          {/* Social Icons */}
          <div className="header-actions flex gap-2 items-center">
            {profile.socials?.github && (
              <a
                href={profile.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg hover:bg-[var(--bg-card)] cursor-pointer text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                <Github size={18} />
              </a>
            )}

            {profile.socials?.linkedin && (
              <a
                href={profile.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg hover:bg-[var(--bg-card)] cursor-pointer text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                <Linkedin size={18} />
              </a>
            )}

            {profile.socials?.instagram && (
              <a
                href={profile.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg hover:bg-[var(--bg-card)] cursor-pointer text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                <Instagram size={18} />
              </a>
            )}
          </div>

          <div ref={menuRef} className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-lg hover:bg-[var(--bg-card)] cursor-pointer text-[var(--text-secondary)]"
            >
              <MoreVertical size={18} />
            </button>

            {/* DROPDOWN MENU */}
            {menuOpen && (
              <div className="absolute right-0 top-8 w-44 bg-[var(--bg-card)] rounded-xl shadow-lg border border-[var(--border)] p-1 space-y-1 z-50">
                <button
                  onClick={() => { setEdit(true); setMenuOpen(false); }}
                  className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-[var(--bg-card)] transition cursor-pointer text-[var(--text-primary)]"
                >
                  Edit profile
                </button>
                <button
                  onClick={() => { console.log("share"); setMenuOpen(false); }}
                  className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-[var(--bg-card)] transition cursor-pointer text-[var(--text-primary)]"
                >
                  Share profile
                </button>
                <button
                  onClick={() => { setSocialOpen(true); setMenuOpen(false); }}
                  className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-[var(--bg-card)] transition cursor-pointer text-[var(--text-primary)]"
                >
                  Add socials
                </button>
                <button
                  onClick={() => { setEditSocialOpen(true); setMenuOpen(false); }}
                  className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-[var(--bg-card)] transition cursor-pointer text-[var(--text-primary)]"
                >
                  Edit socials
                </button>
                <button
                  onClick={() => { setCareerModalOpen(true); setMenuOpen(false); }}
                  className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-[var(--bg-card)] transition cursor-pointer text-[var(--text-primary)]"
                >
                  Career vision
                </button>
                <button
                  onClick={() => { console.log("settings"); setMenuOpen(false); }}
                  className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-[var(--bg-card)] transition cursor-pointer text-[var(--text-primary)]"
                >
                  Settings
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CAREER VISION SECTION - Always render */}
      <div className="bg-[var(--bg-card)] rounded-2xl shadow-sm border border-[var(--border)] p-6 hover:shadow-md transition mt-6">
        <div className="mb-4">
          <div>
            <span className="text-xs uppercase tracking-wide text-[var(--text-secondary)] font-medium">YOUR CAREER VISION</span>
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mt-1">
              {profile.careerVision?.aspiration || "NA"}
            </h2>
          </div>
        </div>

        <div className="border-t border-[var(--divider)] pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="text-sm text-[var(--text-secondary)] block mb-1">What you're growing into right now</label>
              <p className="font-medium text-[var(--text-primary)]">
                {profile.careerVision?.currentAim || "NA"}
              </p>
            </div>

            <div>
              <label className="text-sm text-[var(--text-secondary)] block mb-1">The space you want to grow in</label>
              <p className="font-medium text-[var(--text-primary)]">
                {profile.careerVision?.field || "NA"}
              </p>
            </div>

            <div>
              <label className="text-sm text-[var(--text-secondary)] block mb-1">Inspired by</label>
              <p className="font-medium text-[var(--text-primary)]">
                {profile.careerVision?.inspiration || "NA"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT GRID - Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* LEFT COLUMN (1/3 width) - Profile Stats and Skills */}
        <div className="lg:col-span-4 space-y-5">
          <ProfileStats profile={profile} />

          {/* SKILLS */}
          <div className="bg-[var(--bg-card)] rounded-2xl shadow-sm border border-[var(--border)] p-6 hover:shadow-md transition">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-[var(--text-primary)]">Skills</h3>
              <button
                onClick={() => setSkillsOpen(true)}
                className="w-8 h-8 rounded-full border border-[var(--border)] hover:bg-[var(--bg-card)] flex items-center justify-center text-[var(--text-secondary)]"
                title="Edit Skills"
              >
                <Edit3 size={16} />
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {profile.skills.map(s => (
                <SkillChip
                  key={typeof s === 'object' ? s._id || s.name : s}
                  skill={s}
                />
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (2/3 width) - Experience, Education, and Certification */}
        <div className="lg:col-span-8 space-y-5">
          <div className="bg-[var(--bg-card)] rounded-2xl shadow-sm border border-[var(--border)] p-6 hover:shadow-md transition">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-[var(--text-primary)]">Experience</h3>
              <button onClick={() => setExpOpen(true)} className="w-8 h-8 rounded-full border border-[var(--border)] hover:bg-[var(--bg-card)] flex items-center justify-center text-[var(--text-secondary)]">+</button>
            </div>

            <div className="border-t border-[var(--divider)] pt-4 space-y-3">
              {profile.experience?.length === 0 ? (
                <p className="text-[var(--text-secondary)]">Add your experiences</p>
              ) : (
                profile.experience?.map(exp => (
                  <ExperienceItem
                    key={exp._id}
                    exp={exp}
                    onDelete={async (id) => {
                      try {
                        const res = await API.delete(`/profile/experience/${id}`);
                        setProfile(prev => ({
                          ...prev,
                          ...res.data,
                          education: res.data.education ?? prev.education ?? [],
                          certifications: res.data.certifications ?? prev.certifications ?? [],
                          experience: res.data.experience ?? prev.experience ?? [],
                          skills: res.data.skills ?? prev.skills ?? [],
                          careerVision: prev.careerVision ?? {
                            bestDescription: "",
                            aspiration: "",
                            field: "",
                            inspiration: "",
                            currentAim: ""
                          },
                          career: res.data.career ?? prev.career ?? {
                            type: "",
                            aspiration: "",
                            field: "",
                            inspiration: "",
                            currentAim: ""
                          }
                        }));

                        // Emit socket event to notify other clients
                        getSocket().emit("profileUpdate", res.data);
                      } catch (error) {
                        console.error("Error deleting experience:", error);
                        alert("Failed to delete experience");
                      }
                    }}
                    onEdit={(exp) => {
                      setEditExp(exp);
                      setExpOpen(true);
                    }}
                  />
                ))
              )}
            </div>
          </div>

          {/* EDUCATION AND CERTIFICATION IN SAME ROW */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-[var(--bg-card)] rounded-2xl shadow-sm border border-[var(--border)] p-6 hover:shadow-md transition">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-[var(--text-primary)]">Education</h3>
            <button
              onClick={() => setEduOpen(true)}
              className="w-8 h-8 rounded-full border border-[var(--border)] hover:bg-[var(--bg-card)] flex items-center justify-center text-[var(--text-secondary)]"
            >
              +
            </button>
          </div>

          <div className="border-t border-[var(--divider)] pt-4 space-y-3">
            {(profile.education || []).length === 0 ? (
              <p className="text-sm text-[var(--text-secondary)]">Add your education</p>
            ) : (
              (profile.education || []).map((edu, i) => (
                <EducationItem
                  key={edu._id}
                  edu={edu}
                  onDelete={async (id) => {
                    try {
                      const res = await API.delete(`/profile/education/${id}`);
                      setProfile(prev => ({
                        ...prev,
                        ...res.data,
                        education: res.data.education ?? prev.education ?? [],
                        certifications: res.data.certifications ?? prev.certifications ?? [],
                        experience: res.data.experience ?? prev.experience ?? [],
                        skills: res.data.skills ?? prev.skills ?? [],
                        careerVision: prev.careerVision ?? {
                          bestDescription: "",
                          aspiration: "",
                          field: "",
                          inspiration: "",
                          currentAim: ""
                        }
                      }));

                      // Emit socket event to notify other clients
                      getSocket().emit("profileUpdate", res.data);
                    } catch (error) {
                      console.error("Error deleting education:", error);
                      alert("Failed to delete education");
                    }
                  }}
                  onEdit={(edu) => {
                    setEditEdu(edu);
                    setEduOpen(true);
                  }}
                />
              ))
            )}
          </div>
        </div>

        <div className="bg-[var(--bg-card)] rounded-2xl shadow-sm border border-[var(--border)] p-6 hover:shadow-md transition">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-[var(--text-primary)]">Certification</h3>
            <button
              onClick={() => setCertOpen(true)}
              className="w-8 h-8 rounded-full border border-[var(--border)] hover:bg-[var(--bg-card)] flex items-center justify-center text-[var(--text-secondary)]"
            >
              +
            </button>
          </div>

          <div className="border-t border-[var(--divider)] pt-4 space-y-3">
            {(profile.certifications || []).length === 0 ? (
              <p className="text-sm text-[var(--text-secondary)]">Add certifications</p>
            ) : (
              (profile.certifications || []).map((cert, i) => (
                <CertificationItem
                  key={cert._id}
                  cert={cert}
                  onDelete={async (id) => {
                    try {
                      const res = await API.delete(`/profile/certification/${id}`);
                      setProfile(prev => ({
                        ...prev,
                        ...res.data,
                        education: res.data.education ?? prev.education ?? [],
                        certifications: res.data.certifications ?? prev.certifications ?? [],
                        experience: res.data.experience ?? prev.experience ?? [],
                        skills: res.data.skills ?? prev.skills ?? [],
                        careerVision: prev.careerVision ?? {
                          bestDescription: "",
                          aspiration: "",
                          field: "",
                          inspiration: "",
                          currentAim: ""
                        }
                      }));

                      // Emit socket event to notify other clients
                      getSocket().emit("profileUpdate", res.data);
                    } catch (error) {
                      console.error("Error deleting certification:", error);
                      alert("Failed to delete certification");
                    }
                  }}
                  onEdit={(cert) => {
                    setEditCert(cert);
                    setCertOpen(true);
                  }}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  </div>

    {/* MODALS - These should be at the end of the main div */}
    <ExperienceModal
      open={expOpen}
      onClose={() => {
        setExpOpen(false);
        setEditExp(null); // Reset edit experience when closing modal
      }}
      profile={profile}
      editExp={editExp}
      fetchProfile={async () => {
        const res = await API.get("/profile/demo");
        
        // Get saved career vision from localStorage before updating profile
        const userId = res.data.id || "demo-user";
        const CAREER_KEY = `careerVision_${userId}`;
        const savedCareerVision = localStorage.getItem(CAREER_KEY);
        const parsedSavedCareer = savedCareerVision ? JSON.parse(savedCareerVision) : null;
        
        const normalized = {
          ...res.data,
          education: res.data.education || [],
          certifications: res.data.certifications || [],
          experience: res.data.experience || [],
          skills: res.data.skills || [],
          careerVision: parsedSavedCareer || {
            bestDescription: res.data.careerVision?.bestDescription || "",
            aspiration: res.data.careerVision?.aspiration || "",
            field: res.data.careerVision?.field || "",
            inspiration: res.data.careerVision?.inspiration || "",
            currentAim: res.data.careerVision?.currentAim || ""
          },
          career: res.data.career || {
            type: "",
            aspiration: "",
            field: "",
            inspiration: "",
            currentAim: ""
          }
        };
        setProfile(normalized);
      }}
    />

    <EducationModal
      open={eduOpen}
      onClose={() => {
        setEduOpen(false);
        setEditEdu(null); // Reset edit education when closing modal
      }}
      profile={profile}
      editEdu={editEdu}
      fetchProfile={async () => {
        const res = await API.get("/profile/demo");
        
        // Get saved career vision from localStorage before updating profile
        const userId = res.data.id || "demo-user";
        const CAREER_KEY = `careerVision_${userId}`;
        const savedCareerVision = localStorage.getItem(CAREER_KEY);
        const parsedSavedCareer = savedCareerVision ? JSON.parse(savedCareerVision) : null;
        
        const normalized = {
          ...res.data,
          education: res.data.education || [],
          certifications: res.data.certifications || [],
          experience: res.data.experience || [],
          skills: res.data.skills || [],
          careerVision: parsedSavedCareer || {
            bestDescription: res.data.careerVision?.bestDescription || "",
            aspiration: res.data.careerVision?.aspiration || "",
            field: res.data.careerVision?.field || "",
            inspiration: res.data.careerVision?.inspiration || "",
            currentAim: res.data.careerVision?.currentAim || ""
          },
          career: res.data.career || {
            type: "",
            aspiration: "",
            field: "",
            inspiration: "",
            currentAim: ""
          }
        };
        setProfile(normalized);
      }}
    />

    <CertificationModal
      open={certOpen}
      onClose={() => {
        setCertOpen(false);
        setEditCert(null); // Reset edit certification when closing modal
      }}
      profile={profile}
      editCert={editCert}
      fetchProfile={async () => {
        const res = await API.get("/profile/demo");
        
        // Get saved career vision from localStorage before updating profile
        const userId = res.data.id || "demo-user";
        const CAREER_KEY = `careerVision_${userId}`;
        const savedCareerVision = localStorage.getItem(CAREER_KEY);
        const parsedSavedCareer = savedCareerVision ? JSON.parse(savedCareerVision) : null;
        
        const normalized = {
          ...res.data,
          education: res.data.education || [],
          certifications: res.data.certifications || [],
          experience: res.data.experience || [],
          skills: res.data.skills || [],
          careerVision: parsedSavedCareer || {
            bestDescription: res.data.careerVision?.bestDescription || "",
            aspiration: res.data.careerVision?.aspiration || "",
            field: res.data.careerVision?.field || "",
            inspiration: res.data.careerVision?.inspiration || "",
            currentAim: res.data.careerVision?.currentAim || ""
          },
          career: res.data.career || {
            type: "",
            aspiration: "",
            field: "",
            inspiration: "",
            currentAim: ""
          }
        };
        setProfile(normalized);
      }}
    />

    <SkillsModal
      open={skillsOpen}
      onClose={() => setSkillsOpen(false)}
      profile={profile}
      fetchProfile={async () => {
        const res = await API.get("/profile/demo");
        
        // Get saved career vision from localStorage before updating profile
        const userId = res.data.id || "demo-user";
        const CAREER_KEY = `careerVision_${userId}`;
        const savedCareerVision = localStorage.getItem(CAREER_KEY);
        const parsedSavedCareer = savedCareerVision ? JSON.parse(savedCareerVision) : null;
        
        const normalized = {
          ...res.data,
          education: res.data.education || [],
          certifications: res.data.certifications || [],
          experience: res.data.experience || [],
          skills: res.data.skills || [],
          careerVision: parsedSavedCareer || {
            bestDescription: res.data.careerVision?.bestDescription || "",
            aspiration: res.data.careerVision?.aspiration || "",
            field: res.data.careerVision?.field || "",
            inspiration: res.data.careerVision?.inspiration || "",
            currentAim: res.data.careerVision?.currentAim || ""
          },
          career: res.data.career || {
            type: "",
            aspiration: "",
            field: "",
            inspiration: "",
            currentAim: ""
          }
        };
        setProfile(normalized);
      }}
    />

    <AddSocialModal
      open={socialOpen}
      onClose={() => setSocialOpen(false)}
      profile={profile}
      fetchProfile={async () => {
        const res = await API.get("/profile/demo");
        
        // Get saved career vision from localStorage before updating profile
        const userId = res.data.id || "demo-user";
        const CAREER_KEY = `careerVision_${userId}`;
        const savedCareerVision = localStorage.getItem(CAREER_KEY);
        const parsedSavedCareer = savedCareerVision ? JSON.parse(savedCareerVision) : null;
        
        const normalized = {
          ...res.data,
          education: res.data.education || [],
          certifications: res.data.certifications || [],
          experience: res.data.experience || [],
          skills: res.data.skills || [],
          careerVision: parsedSavedCareer || {
            bestDescription: res.data.careerVision?.bestDescription || "",
            aspiration: res.data.careerVision?.aspiration || "",
            field: res.data.careerVision?.field || "",
            inspiration: res.data.careerVision?.inspiration || "",
            currentAim: res.data.careerVision?.currentAim || ""
          },
          career: res.data.career || {
            type: "",
            aspiration: "",
            field: "",
            inspiration: "",
            currentAim: ""
          }
        };
        setProfile(normalized);
      }}
    />

    <EditSocialModal
      open={editSocialOpen}
      onClose={() => setEditSocialOpen(false)}
      profile={profile}
      fetchProfile={async () => {
        const res = await API.get("/profile/demo");
        
        // Get saved career vision from localStorage before updating profile
        const userId = res.data.id || "demo-user";
        const CAREER_KEY = `careerVision_${userId}`;
        const savedCareerVision = localStorage.getItem(CAREER_KEY);
        const parsedSavedCareer = savedCareerVision ? JSON.parse(savedCareerVision) : null;
        
        const normalized = {
          ...res.data,
          education: res.data.education || [],
          certifications: res.data.certifications || [],
          experience: res.data.experience || [],
          skills: res.data.skills || [],
          careerVision: parsedSavedCareer || {
            bestDescription: res.data.careerVision?.bestDescription || "",
            aspiration: res.data.careerVision?.aspiration || "",
            field: res.data.careerVision?.field || "",
            inspiration: res.data.careerVision?.inspiration || "",
            currentAim: res.data.careerVision?.currentAim || ""
          },
          career: res.data.career || {
            type: "",
            aspiration: "",
            field: "",
            inspiration: "",
            currentAim: ""
          }
        };
        setProfile(normalized);
      }}
    />

    {/* Career Vision Modal */}
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${careerModalOpen ? 'block' : 'hidden'}`}
      onClick={() => setCareerModalOpen(false)}
    >
      <div
        className="bg-[var(--bg-card)] rounded-xl p-6 w-full max-w-md mx-4 shadow-xl border border-[var(--border)]"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Career Vision</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">What Best Describes You?</label>
            <input
              type="text"
              value={careerForm.bestDescription}
              onChange={(e) => setCareerForm({...careerForm, bestDescription: e.target.value})}
              className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--bg-card)] text-[var(--text-primary)]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">What Is Your Long-Term Career Aspiration?</label>
            <input
              type="text"
              value={careerForm.aspiration}
              onChange={(e) => setCareerForm({...careerForm, aspiration: e.target.value})}
              className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--bg-card)] text-[var(--text-primary)]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Aspirational Field</label>
            <input
              type="text"
              value={careerForm.field}
              onChange={(e) => setCareerForm({...careerForm, field: e.target.value})}
              className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--bg-card)] text-[var(--text-primary)]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Who Is Your Inspiration?</label>
            <input
              type="text"
              value={careerForm.inspiration}
              onChange={(e) => setCareerForm({...careerForm, inspiration: e.target.value})}
              className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--bg-card)] text-[var(--text-primary)]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">What Are You Aiming For Right Now?</label>
            <input
              type="text"
              value={careerForm.currentAim}
              onChange={(e) => setCareerForm({...careerForm, currentAim: e.target.value})}
              className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--bg-card)] text-[var(--text-primary)]"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={() => setCareerModalOpen(false)}
            className="px-4 py-2 text-sm font-medium text-[var(--text-primary)] bg-[var(--bg-card)] rounded-lg hover:bg-[var(--bg-card)] border border-[var(--border)]"
          >
            CANCEL
          </button>
          <button
            onClick={() => {
              const updatedCareer = careerForm;
              
              setProfile(prev => ({
                ...prev,
                careerVision: updatedCareer
              }));
              
              // Save to localStorage
              const userId = profile.id || "demo-user";
              const CAREER_KEY = `careerVision_${userId}`;
              localStorage.setItem(CAREER_KEY, JSON.stringify(updatedCareer));
              
              setCareerModalOpen(false);
            }}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            UPDATE
          </button>
        </div>
      </div>
    </div>
  </div>
);
}

function MenuItem({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-gray-100 cursor-pointer"
    >
      {label}
    </button>
  );
}

function Card({ title, text }) {
  return (
    <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl shadow-sm p-6 transition-colors">
      <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
      <p className="text-sm text-gray-500 dark:text-slate-400 mt-2">{text}</p>
    </div>
  );
}

function CardEditable({ title, field, profile, setProfile }) {
  const addItem = async () => {
    const value = prompt(`Add ${title}`);
    if (!value) return;

    const updated = {
      ...profile,
      [field]: [...(profile[field] || []), { name: value }]
    };

    const res = await API.put("/profile", updated);
    setProfile(res.data);

    // Emit socket event to notify other clients
    getSocket().emit("profileUpdate", res.data);
  };

  return (
    <div className="border bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex justify-between">
        <h3 className="font-semibold">{title}</h3>
        <button onClick={addItem}>＋</button>
      </div>

      {(profile[field] || []).map((x,i) => (
        <div key={i} className="text-sm mt-2">{x.name}</div>
      ))}
    </div>
  );
}

