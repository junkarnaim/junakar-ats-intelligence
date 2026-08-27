const express = require("express");
const multer = require("multer");
const axios = require("axios");
const FormData = require("form-data");

const Application = require("../models/application");
const Job = require("../models/job");
const { authorize, protect } = require("../middleware/auth");
const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      cb(new Error("Only PDF resumes are supported"));
      return;
    }

    cb(null, true);
  },
});

function serializeApplication(application) {
  return {
    id: application._id,
    job: application.jobId
      ? {
          id: application.jobId._id,
          title: application.jobId.title,
          company: application.jobId.recruiterId?.name
            ? `${application.jobId.recruiterId.name}'s Team`
            : "ATS Hiring Team",
          location: application.jobId.location,
        }
      : null,
    candidate: application.applicantId
      ? {
          id: application.applicantId._id,
          name: application.applicantId.name,
          email: application.applicantId.email,
        }
      : null,
    resumeFileName: application.resumeFileName,
    coverLetter: application.coverLetter,
    aiScore: application.aiScore || 0,
    matchedSkills: application.matchedSkills || [],
    missingSkills: application.missingSkills || [],
    experienceMatch: Boolean(application.experienceMatch),
    aiSummary: application.aiSummary || "",
    status: application.status,
    appliedAt: application.createdAt,
  };
}

router.post(
  "/",
  protect,
  authorize("candidate"),
  upload.single("resume"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(422).json({
          success: false,
          error: "Resume PDF is required",
        });
      }

      const { coverLetter, jobId } = req.body;

      if (!jobId) {
        return res.status(422).json({
          success: false,
          error: "jobId is required",
        });
      }

      const job = await Job.findById(jobId);

      if (!job) {
        return res.status(404).json({
          success: false,
          error: "Job not found",
        });
      }

      const existingApplication = await Application.findOne({
        applicantId: req.user._id,
        jobId,
      });

      if (existingApplication) {
        return res.status(409).json({
          success: false,
          error: "You have already applied to this job",
        });
      }

      const matchedSkills = job.skills.slice(0, Math.min(3, job.skills.length));

      const application = await Application.create({
        applicantId: req.user._id,
        coverLetter: coverLetter || "",
        experienceMatch: false,
        jobId,
        matchedSkills,
        missingSkills: [],
        resumeFileName: req.file.originalname,
        resumeText: "",
        status: "Applied",
      });

      const populatedApplication = await Application.findById(application._id)
        .populate({
          path: "jobId",
          populate: { path: "recruiterId", select: "name email" },
        })
        .populate("applicantId", "name email");

      res.status(201).json({
        success: true,
        application: serializeApplication(populatedApplication),
      });
    } catch (error) {
      const isMulterError = error instanceof multer.MulterError;
      const isUploadValidation = error.message === "Only PDF resumes are supported";

      res.status(isMulterError || isUploadValidation ? 422 : 500).json({
        success: false,
        error:
          isMulterError || isUploadValidation
            ? error.message
            : error.message || "Unable to submit application",
      });
    }
  },
);

router.get("/mine", protect, authorize("candidate"), async (req, res) => {
  try {
    const applications = await Application.find({ applicantId: req.user._id })
      .populate({
        path: "jobId",
        populate: { path: "recruiterId", select: "name email" },
      })
      .populate("applicantId", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      applications: applications.map(serializeApplication),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Unable to load applications",
    });
  }
});

router.get("/:id", protect, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate({
        path: "jobId",
        populate: { path: "recruiterId", select: "name email" },
      })
      .populate("applicantId", "name email");

    if (!application) {
      return res.status(404).json({
        success: false,
        error: "Application not found",
      });
    }

    const isOwner = application.applicantId._id.equals(req.user._id);
    const isRecruiter = req.user.role === "recruiter";

    if (!isOwner && !isRecruiter) {
      return res.status(403).json({
        success: false,
        error: "You do not have permission to view this application",
      });
    }

    res.json({
      success: true,
      application: serializeApplication(application),
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      error: "Application not found",
    });
  }
});

router.post("/analyze", upload.single("resume"), async (req, res) => {
  try {
    // Resume check
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "Resume PDF is required",
      });
    }

    const jobDescription = req.body.jobDescription || "";
    const jobId = req.body.jobId;
    const applicantId = req.body.applicantId;

    if (!jobDescription.trim()) {
      return res.status(400).json({
        success: false,
        error: "Job description is required",
      });
    }

    if (!jobId || !applicantId) {
      return res.status(400).json({
        success: false,
        error: "jobId and applicantId are required",
      });
    }

    // Send PDF + job description to Flask
    const form = new FormData();

    form.append("resume", req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    form.append("jobDescription", jobDescription);

    const aiResponse = await axios.post(
      "http://localhost:8000/extract-resume",
      form,
      {
        headers: form.getHeaders(),
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      },
    );

    const result = aiResponse.data;

    // Save AI result in MongoDB
    const application = await Application.create({
      jobId: jobId,
      applicantId: applicantId,

      resumeText: result.text || "",

      aiScore: result.aiAnalysis?.aiScore || 0,

      matchedSkills: result.aiAnalysis?.matchedSkills || [],

      missingSkills: result.aiAnalysis?.missingSkills || [],

      experienceMatch: result.aiAnalysis?.experienceMatch || false,

      aiSummary: result.aiAnalysis?.aiSummary || "",

      status: "Applied",
    });

    // Send response to frontend
    res.status(201).json({
      success: true,

      applicationId: application._id,

      aiAnalysis: {
        aiScore: application.aiScore,
        matchedSkills: application.matchedSkills,
        missingSkills: application.missingSkills,
        experienceMatch: application.experienceMatch,
        aiSummary: application.aiSummary,
      },
    });
  } catch (error) {
    console.error(
      "Application analysis error:",
      error.response?.data || error.message,
    );

    res.status(500).json({
      success: false,
      error: "Failed to analyze and save application",
    });
  }
});

module.exports = router;
