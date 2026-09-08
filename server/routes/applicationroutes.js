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
    aiScore: application.aiScore ?? null,
    matchedSkills: application.matchedSkills || [],
    missingSkills: application.missingSkills || [],
    strengths: application.strengths || [],
    recommendations: application.recommendations || [],
    experienceMatch: Boolean(application.experienceMatch),
    aiSummary: application.aiSummary || "",
    status: application.status,
    appliedAt: application.createdAt,
  };
}

/**
 * POST /api/applications
 * Submit a job application with resume PDF.
 * AI analysis is attempted via the Python service.
 * If the AI service is unavailable, the application is saved without AI data.
 */
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

      // Attempt AI analysis — gracefully degrade if Python service is down
      let aiData = {
        aiScore: null,
        matchedSkills: [],
        missingSkills: [],
        strengths: [],
        recommendations: [],
        experienceMatch: false,
        aiSummary: "",
        resumeText: "",
      };
      let aiAvailable = false;

      try {
        const form = new FormData();
        form.append("resume", req.file.buffer, {
          filename: req.file.originalname,
          contentType: req.file.mimetype,
        });
        form.append("jobDescription", job.description || "");
        // Pass required skills as a comma-separated string for better ATS scoring
        form.append("requiredSkills", (job.skills || []).join(","));

        const aiResponse = await axios.post(
          "http://localhost:8000/extract-resume",
          form,
          {
            headers: form.getHeaders(),
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
            timeout: 60000,
          },
        );

        const result = aiResponse.data;
        const analysis = result.aiAnalysis || {};

        aiData = {
          resumeText: result.text || "",
          aiScore: analysis.aiScore ?? null,
          matchedSkills: analysis.matchedSkills || [],
          missingSkills: analysis.missingSkills || [],
          strengths: analysis.strengths || [],
          recommendations: analysis.recommendations || [],
          experienceMatch: analysis.experienceMatch || false,
          aiSummary: analysis.aiSummary || "",
        };
        aiAvailable = true;

        console.log(`AI analysis complete — score: ${aiData.aiScore}`);
      } catch (aiError) {
        console.warn(
          "AI service unavailable, saving application without AI data:",
          aiError.message,
        );
      }

      const application = await Application.create({
        applicantId: req.user._id,
        coverLetter: coverLetter || "",
        jobId,
        resumeFileName: req.file.originalname,
        resumeText: aiData.resumeText,
        aiScore: aiData.aiScore,
        matchedSkills: aiData.matchedSkills,
        missingSkills: aiData.missingSkills,
        strengths: aiData.strengths,
        recommendations: aiData.recommendations,
        experienceMatch: aiData.experienceMatch,
        aiSummary: aiData.aiSummary,
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
        aiAvailable,
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

/**
 * GET /api/applications/mine
 * Returns all applications for the authenticated candidate.
 */
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

/**
 * GET /api/applications
 * Returns all applications (recruiter only). Supports ?jobId= filter.
 */
router.get("/", protect, authorize("recruiter"), async (req, res) => {
  try {
    const filter = {};

    if (req.query.jobId) {
      filter.jobId = req.query.jobId;
    }

    const applications = await Application.find(filter)
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

/**
 * GET /api/applications/:id
 * Get a single application by ID. Accessible by the owner candidate or any recruiter.
 */
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

/**
 * PATCH /api/applications/:id/status
 * Update the status of an application (recruiter only).
 */
router.patch("/:id/status", protect, authorize("recruiter"), async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["Applied", "Interview", "Offered", "Rejected"];

    if (!status || !validStatuses.includes(status)) {
      return res.status(422).json({
        success: false,
        error: `Status must be one of: ${validStatuses.join(", ")}`,
      });
    }

    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    )
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

    res.json({
      success: true,
      application: serializeApplication(application),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Unable to update application status",
    });
  }
});

module.exports = router;
