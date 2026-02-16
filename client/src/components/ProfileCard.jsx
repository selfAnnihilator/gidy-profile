import React from "react";
import { API } from "../api";

export default function ProfileCard({ profile, setProfile, setEdit }) {

  const endorse = async (skill) => {
    const res = await API.post(`/profile/endorse/${skill}`);
    setProfile(res.data);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      {/* PROFILE CARD */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-xl p-6 flex gap-6">
        <img
          src="https://i.pravatar.cc/140"
          className="w-32 h-32 rounded-lg object-cover"
        />

        <div className="flex-1">
          <h1 className="text-3xl font-bold">{profile.name}</h1>
          <p className="text-gray-500 mt-1">{profile.title}</p>

          <p className="mt-4 text-gray-700 dark:text-gray-300 leading-relaxed">
            {profile.bio}
          </p>

          <button
            onClick={() => setEdit(true)}
            className="mt-5 bg-blue-600 text-white px-5 py-2 rounded-lg"
          >
            Edit Profile
          </button>
        </div>
      </div>

      {/* SKILLS CARD */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Skills</h2>

        <div className="flex flex-wrap gap-3">
          {profile.skills.map(s => (
            <div
              key={s.name}
              className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg"
            >
              <span>{s.name}</span>

              <button
                onClick={() => endorse(s.name)}
                className="bg-yellow-400 text-sm px-2 py-1 rounded"
              >
                👍 {s.endorsements}
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

