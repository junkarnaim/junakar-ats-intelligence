const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    applicantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    resumeUrl: {
      type: String,
    },

    resumeFileName: {
      type: String,
    },

    coverLetter: {
      type: String,
      default: "",
    },

    resumeText: {
      type: String,
    },

    extractedSkills: {
      type: [String],
      default: [],
    },

    aiScore: {
      type: Number,
      min: 0,
      max: 100,
    },

    matchedSkills: {
      type: [String],
      default: [],
    },

    missingSkills: {
      type: [String],
      default: [],
    },

    experienceMatch: {
      type: Boolean,
    },

    aiSummary: {
      type: String,
    },

    status: {
      type: String,
      enum: ["Applied", "Interview", "Offered", "Rejected"],
      default: "Applied",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Application", applicationSchema);
