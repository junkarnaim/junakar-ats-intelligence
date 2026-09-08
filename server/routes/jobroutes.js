const express = require("express");
const Job = require("../models/job");
const User = require("../models/user");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

const seedJobs = [
  {
    title: "Frontend Developer",
    description:
      "Build polished recruiter and candidate experiences for an AI-powered applicant tracking platform.",
    skills: ["React", "JavaScript", "MUI", "REST APIs"],
    experience: "3-5 years",
    location: "Bengaluru, India",
    status: "active",
    deadline: new Date("2026-09-30"),
  },
  {
    title: "MERN Stack Developer",
    description:
      "Own end-to-end applicant workflows across job management, applications, and AI scoring surfaces.",
    skills: ["React", "Node.js", "Express", "MongoDB"],
    experience: "1-3 years",
    location: "Pune, India",
    status: "active",
    deadline: new Date("2026-10-12"),
  },
  {
    title: "Backend Developer",
    description:
      "Build secure APIs for job posting, resume ingestion, candidate ranking, and recruiter collaboration.",
    skills: ["Node.js", "Express", "MongoDB", "AWS"],
    experience: "3-5 years",
    location: "Hyderabad, India",
    status: "active",
    deadline: new Date("2026-09-24"),
  },
];

function serializeJob(job) {
  return {
    id: job._id,
    title: job.title,
    company: job.recruiterId?.name ? `${job.recruiterId.name}'s Team` : "ATS Hiring Team",
    recruiter: job.recruiterId?.name || "Recruiter",
    recruiterId: job.recruiterId?._id || job.recruiterId,
    location: job.location,
    type: "Full-time",
    workplace: job.location === "Remote" ? "Remote" : "Hybrid",
    salary: "Salary disclosed during interview",
    experience: job.experience,
    status: job.status === "active" ? "Active" : "Archived",
    rawStatus: job.status,
    deadline: job.deadline,
    requiredSkills: job.skills,
    description: job.description,
    responsibilities: [
      "Collaborate with product and engineering teams on applicant tracking workflows.",
      "Build reliable features with clean implementation and clear API contracts.",
      "Improve hiring operations through maintainable software and measurable outcomes.",
    ],
    postedAt: job.createdAt,
    applications: 0,
    featured: true,
  };
}

async function ensureSeedJobs() {
  const count = await Job.countDocuments();

  if (count > 0) {
    return;
  }

  let recruiter = await User.findOne({ role: "recruiter" });

  if (!recruiter) {
    recruiter = await User.create({
      name: "Demo Recruiter",
      email: "recruiter@ats.local",
      password: "seeded-account-login-disabled",
      role: "recruiter",
    });
  }

  await Job.insertMany(
    seedJobs.map((job) => ({
      ...job,
      recruiterId: recruiter._id,
    })),
  );
}

// GET /api/jobs — list all jobs (public)
router.get("/", async (req, res) => {
  try {
    await ensureSeedJobs();

    const { experience, location, search, skill } = req.query;
    const query = {};

    if (experience) {
      query.experience = experience;
    }

    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    if (skill) {
      query.skills = skill;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const jobs = await Job.find(query)
      .populate("recruiterId", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      jobs: jobs.map(serializeJob),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Unable to load jobs",
    });
  }
});

// POST /api/jobs — create a job (recruiter only)
router.post("/", protect, authorize("recruiter"), async (req, res) => {
  try {
    const { title, description, skills, experience, location, deadline } = req.body;

    if (!title || !description || !experience || !location) {
      return res.status(422).json({
        success: false,
        error: "Title, description, experience, and location are required",
      });
    }

    const job = await Job.create({
      title,
      description,
      skills: Array.isArray(skills) ? skills : [],
      experience,
      location,
      deadline: deadline ? new Date(deadline) : undefined,
      status: "active",
      recruiterId: req.user._id,
    });

    await job.populate("recruiterId", "name email");

    res.status(201).json({
      success: true,
      job: serializeJob(job),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Unable to create job",
    });
  }
});

// GET /api/jobs/:id — get single job (public)
router.get("/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate("recruiterId", "name email");

    if (!job) {
      return res.status(404).json({
        success: false,
        error: "Job not found",
      });
    }

    res.json({
      success: true,
      job: serializeJob(job),
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      error: "Job not found",
    });
  }
});

// PATCH /api/jobs/:id — update/archive a job (recruiter, must own it)
router.patch("/:id", protect, authorize("recruiter"), async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        error: "Job not found",
      });
    }

    if (!job.recruiterId.equals(req.user._id)) {
      return res.status(403).json({
        success: false,
        error: "You do not have permission to update this job",
      });
    }

    const allowedFields = ["title", "description", "skills", "experience", "location", "deadline", "status"];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        job[field] = req.body[field];
      }
    });

    await job.save();
    await job.populate("recruiterId", "name email");

    res.json({
      success: true,
      job: serializeJob(job),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Unable to update job",
    });
  }
});

module.exports = router;
