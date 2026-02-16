import React, { useEffect, useState } from "react";
import { API } from "./api";
import { getSocket } from "./socket";
import ProfileDashboard from "./components/ProfileDashboard";
import EditProfile from "./components/EditProfile";
import Navbar from "./components/Navbar";


export default function App() {
  const [profile, setProfile] = useState(null);
  const [edit, setEdit] = useState(false);
  const [dark, setDark] = useState(
    localStorage.getItem("dark") === "true"
  );

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/profile/demo");
        console.log("Initial profile load:", res.data);
        console.log("Location in initial load:", res.data.location);
        setProfile(res.data);
      } catch (e) {
        console.error(e);
        // Fallback to localStorage if backend not available
        const storedProfile = localStorage.getItem("profile");
        if (storedProfile) {
          const parsedProfile = JSON.parse(storedProfile);
          console.log("Loaded from localStorage:", parsedProfile);
          console.log("Location in localStorage:", parsedProfile.location);
          setProfile(parsedProfile);
        }
      }
    };

    fetchProfile();

    // Connect to socket and listen for real-time updates
    const socket = getSocket();

    socket.on("profileUpdated", (updatedProfile) => {
      console.log("Socket profile update:", updatedProfile);
      console.log("Location in socket update:", updatedProfile.location);
      setProfile(updatedProfile);
    });

    // Clean up socket connection on component unmount
    return () => {
      socket.off("profileUpdated");
    };
  }, []);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("dark", dark);
  }, [dark]);

  if (!profile) {
    return <div className="p-10">Loading profile...</div>;
  }

  return (
    <div className={dark ? "dark" : ""}>
      <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a] transition-colors">

        <Navbar dark={dark} setDark={setDark} profile={profile} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8">
          {edit ? (
            <EditProfile
              profile={profile}
              onClose={() => setEdit(false)}
              onSaved={(updatedProfile) => setProfile(prev => ({
                ...prev,
                ...updatedProfile
              }))}
            />
          ) : (
            <ProfileDashboard
              profile={profile}
              setProfile={setProfile}
              setEdit={setEdit}
            />
          )}
        </div>

      </div>
    </div>
  );

}

