const express = require("express");
const multer = require("multer");
const axios = require("axios");
const FormData = require("form-data");

const Application = require("../models/application");
const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
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
