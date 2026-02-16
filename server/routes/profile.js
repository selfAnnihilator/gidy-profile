import express from "express";
import multer from "multer";
import path from "path";
import Profile from "../models/Profile.js";

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

const router = express.Router();

// Get demo profile route
export const getDemoProfile = async (req, res) => {
  let profile = await Profile.findOne();

  if (!profile) {
    profile = await Profile.create({
      name: "Test Name",
      title: "Final Year Student",
      email: "youremail@example.com",
      bio: "Passionate about technology and problem solving.",
      location: "",
      skills: [
        { name: "JavaScript", endorsements: 0 },
        { name: "React", endorsements: 0 },
        { name: "Node.js", endorsements: 0 }
      ],
      experience: [],
      education: [],
      certifications: []
    });
  }

  res.json(profile);
};

// Update demo profile route
export const updateDemoProfile = async (req, res) => {
  let profile = await Profile.findOne();

  if (!profile) {
    // If no profile exists, create one
    profile = await Profile.create(req.body);
  } else {
    // Update existing profile
    Object.assign(profile, req.body);
    await profile.save();
  }

  res.json(profile);
};

// Define routes
router.get("/demo", getDemoProfile);
router.put("/demo", updateDemoProfile);

// Keep existing routes for experience, education, etc.
router.post("/experience", async (req, res) => {
  try {
    const profile = await Profile.findOne();
    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    profile.experience.push(req.body);
    const updatedProfile = await profile.save();
    res.json(updatedProfile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/experience/:id", async (req, res) => {
  try {
    const profile = await Profile.findOne();
    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    const experience = profile.experience.id(req.params.id);
    if (!experience) {
      return res.status(404).json({ error: "Experience not found" });
    }

    // Update the experience fields
    Object.assign(experience, req.body);

    const updatedProfile = await profile.save();
    res.json(updatedProfile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/experience/:id", async (req, res) => {
  try {
    const updatedProfile = await Profile.findOneAndUpdate(
      { "experience._id": req.params.id },
      { $pull: { experience: { _id: req.params.id } } },
      { new: true }
    );
    res.json(updatedProfile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Education routes
router.post("/education", async (req, res) => {
  try {
    const profile = await Profile.findOne();
    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    profile.education.unshift(req.body);
    await profile.save();

    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/education/:id", async (req, res) => {
  try {
    const profile = await Profile.findOne();
    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    const education = profile.education.id(req.params.id);
    if (!education) {
      return res.status(404).json({ error: "Education not found" });
    }

    // Update the education fields
    Object.assign(education, req.body);

    const updatedProfile = await profile.save();
    res.json(updatedProfile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/education/:id", async (req, res) => {
  try {
    const updatedProfile = await Profile.findOneAndUpdate(
      { "education._id": req.params.id },
      { $pull: { education: { _id: req.params.id } } },
      { new: true }
    );
    res.json(updatedProfile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/endorse/:skill", async (req, res) => {
  const profile = await Profile.findOne();
  const skill = profile.skills.find(s => s.name === req.params.skill);
  skill.endorsements++;
  await profile.save();
  res.json(profile);
});

// Certification routes
router.post("/certification", async (req, res) => {
  try {
    console.log("POST /certification called with body:", req.body);
    const profile = await Profile.findOne();
    if (!profile) {
      console.log("No profile found, creating new one");
      return res.status(404).json({ error: "Profile not found" });
    }

    console.log("Found profile, adding certification");
    if (!profile.certifications) {
      profile.certifications = [];
    }

    profile.certifications.push(req.body);
    await profile.save();

    console.log("Certification added, returning updated profile");
    res.json(profile);
  } catch (error) {
    console.error("Error in POST /certification:", error);
    res.status(500).json({ error: error.message });
  }
});

router.put("/certification/:id", async (req, res) => {
  try {
    console.log("PUT /certification/:id called with id:", req.params.id, "and body:", req.body);
    const profile = await Profile.findOne();
    if (!profile) {
      console.log("No profile found for PUT");
      return res.status(404).json({ error: "Profile not found" });
    }

    const certification = profile.certifications.id(req.params.id);
    if (!certification) {
      console.log("Certification not found with id:", req.params.id);
      return res.status(404).json({ error: "Certification not found" });
    }

    console.log("Updating certification:", certification);
    // Update the certification fields
    Object.assign(certification, req.body);

    const updatedProfile = await profile.save();
    console.log("Certification updated, returning updated profile");
    res.json(updatedProfile);
  } catch (error) {
    console.error("Error in PUT /certification:", error);
    res.status(500).json({ error: error.message });
  }
});

router.delete("/certification/:id", async (req, res) => {
  try {
    console.log("DELETE /certification/:id called with id:", req.params.id);
    const updatedProfile = await Profile.findOneAndUpdate(
      { "certifications._id": req.params.id },
      { $pull: { certifications: { _id: req.params.id } } },
      { new: true }
    );
    console.log("Certification deleted, returning updated profile");
    res.json(updatedProfile);
  } catch (error) {
    console.error("Error in DELETE /certification:", error);
    res.status(500).json({ error: error.message });
  }
});

// Skills routes
router.post("/skills", async (req, res) => {
  try {
    console.log("POST /skills called with body:", req.body);
    const profile = await Profile.findOne();
    if (!profile) {
      console.log("No profile found");
      return res.status(404).json({ error: "Profile not found" });
    }

    console.log("Found profile, adding skills");
    if (!profile.skills) {
      profile.skills = [];
    }

    // Extract skills from request body
    const incomingSkills = Array.isArray(req.body) ? req.body : [req.body];
    
    // Process incoming skills to ensure they're in the right format
    const processedSkills = incomingSkills.map(skill => {
      if (typeof skill === 'string') {
        // Check if this skill already exists
        const existingSkill = profile.skills.find(s => 
          (typeof s === 'object' ? s.name : s) === skill
        );
        if (existingSkill) {
          return existingSkill; // Return existing skill to preserve endorsements
        }
        return { name: skill, endorsements: 0 };
      } else if (typeof skill === 'object' && skill.name) {
        // Check if this skill already exists
        const existingSkill = profile.skills.find(s => 
          (typeof s === 'object' ? s.name : s) === skill.name
        );
        if (existingSkill) {
          // Preserve existing endorsements
          return { ...existingSkill, ...skill };
        }
        return skill;
      }
      return null;
    }).filter(Boolean); // Remove any null values

    // Combine existing skills with new ones, avoiding duplicates
    const existingSkillNames = profile.skills.map(s => typeof s === 'object' ? s.name : s);
    const newSkills = processedSkills.filter(skill => {
      const skillName = typeof skill === 'object' ? skill.name : skill;
      return !existingSkillNames.includes(skillName);
    });

    profile.skills = [...profile.skills, ...newSkills];
    await profile.save();

    console.log("Skills added, returning updated profile");
    res.json(profile);
  } catch (error) {
    console.error("Error in POST /skills:", error);
    res.status(500).json({ error: error.message });
  }
});

router.delete("/skills/:name", async (req, res) => {
  try {
    console.log("DELETE /skills/:name called with name:", req.params.name);
    const profile = await Profile.findOne();
    if (!profile) {
      console.log("No profile found for DELETE");
      return res.status(404).json({ error: "Profile not found" });
    }

    const skillName = req.params.name;
    profile.skills = profile.skills.filter(s => {
      const currentSkillName = typeof s === 'object' ? s.name : s;
      return currentSkillName !== skillName;
    });

    await profile.save();
    console.log("Skill deleted, returning updated profile");
    res.json(profile);
  } catch (error) {
    console.error("Error in DELETE /skills:", error);
    res.status(500).json({ error: error.message });
  }
});

// Avatar upload route
router.post("/upload-avatar", upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Return the URL of the uploaded file - using absolute URL
    const avatarUrl = `/uploads/${req.file.filename}`;
    res.json({ url: avatarUrl });
  } catch (error) {
    console.error("Error uploading avatar:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
