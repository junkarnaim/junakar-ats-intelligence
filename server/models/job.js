const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    skills: {
      type: [String],
      required: true,
    },

    experience: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      default: "Remote",
    },

    status: {
      type: String,
      enum: ["active", "archived"],
      default: "active",
    },

    deadline: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Job", jobSchema);
