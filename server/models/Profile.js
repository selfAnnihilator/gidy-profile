
import mongoose from "mongoose";

const skillSchema = new mongoose.Schema({
  name: String,
  endorsements: { type: Number, default: 0 }
});

const experienceSchema = new mongoose.Schema({
  role: String,
  company: String,
  location: String,
  joinDate: String,
  leaveDate: String,
  current: Boolean
});

const educationSchema = new mongoose.Schema({
  college: String,
  degree: String,
  field: String,
  location: String,
  startDate: String,
  endDate: String,
  isCurrent: Boolean
});

const certSchema = new mongoose.Schema({
  name: String,
  provider: String,
  certificateUrl: String,
  certificateId: String,
  issuedDate: String,
  expiryDate: String,
  description: String
});

const profileSchema = new mongoose.Schema({
  name: { type: String, default: "Test Name" },
  title: { type: String, default: "Final Year Student" },
  bio: { type: String, default: "Passionate about technology and problem solving." },
  email: { type: String, default: "youremail@example.com" },
  image: { type: String, default: "" },
  avatarUrl: { type: String, default: "" },
  location: { type: String, default: "" },

  skills: { type: [skillSchema], default: [] },

  experience: { type: [experienceSchema], default: [] },
  education: { type: [educationSchema], default: [] },
  certifications: { type: [certSchema], default: [] },
  
  socials: {
    github: String,
    linkedin: String,
    instagram: String
  }
});

export default mongoose.model("Profile", profileSchema);

