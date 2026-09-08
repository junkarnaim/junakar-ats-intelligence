const express = require("express");
const User = require("../models/user");
const { createToken, protect } = require("../middleware/auth");
const { hashPassword, verifyPassword } = require("../utils/password");

const router = express.Router();

function serializeUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone || "",
    skills: user.skills || [],
    experience: user.experience || "",
    education: user.education || "",
    resumeUrl: user.resumeUrl || "",
  };
}

router.post("/register", async (req, res) => {
  try {
    const { email, name, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(422).json({
        success: false,
        error: "Name, email, password, and role are required",
      });
    }

    if (!["candidate", "recruiter"].includes(role)) {
      return res.status(422).json({
        success: false,
        error: "Role must be candidate or recruiter",
      });
    }

    if (password.length < 8) {
      return res.status(422).json({
        success: false,
        error: "Password must be at least 8 characters",
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: "A user with this email already exists",
      });
    }

    const user = await User.create({
      email,
      name,
      password: hashPassword(password),
      role,
    });

    const token = createToken(user);

    res.status(201).json({
      success: true,
      token,
      user: serializeUser(user),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Unable to register user",
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(422).json({
        success: false,
        error: "Email and password are required",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    const passwordMatches = verifyPassword(password, user.password);

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        error: "Invalid password",
      });
    }

    const token = createToken(user);

    res.json({
      success: true,
      token,
      user: serializeUser(user),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Unable to login",
    });
  }
});

router.get("/me", protect, (req, res) => {
  res.json({
    success: true,
    user: serializeUser(req.user),
  });
});

router.put("/profile", protect, async (req, res) => {
  try {
    const { name, phone, education, experience, skills, resumeUrl } = req.body;

    const updates = {};

    if (name !== undefined) {
      if (typeof name !== "string" || !name.trim()) {
        return res.status(422).json({
          success: false,
          error: "Full name is required",
        });
      }
      updates.name = name.trim();
    }

    if (phone !== undefined) {
      updates.phone = String(phone).trim();
    }

    if (education !== undefined) {
      updates.education = String(education).trim();
    }

    if (experience !== undefined) {
      updates.experience = String(experience).trim();
    }

    if (resumeUrl !== undefined) {
      updates.resumeUrl = String(resumeUrl).trim();
    }

    if (skills !== undefined) {
      if (Array.isArray(skills)) {
        updates.skills = skills.map((s) => String(s).trim()).filter(Boolean);
      } else if (typeof skills === "string") {
        updates.skills = skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true },
    );

    res.json({
      success: true,
      user: serializeUser(updatedUser),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Unable to update profile",
    });
  }
});

router.put("/me", protect, async (req, res) => {
  try {
    const { name, phone, education, experience, skills, resumeUrl } = req.body;

    const updates = {};

    if (name !== undefined) {
      if (typeof name !== "string" || !name.trim()) {
        return res.status(422).json({
          success: false,
          error: "Full name is required",
        });
      }
      updates.name = name.trim();
    }

    if (phone !== undefined) {
      updates.phone = String(phone).trim();
    }

    if (education !== undefined) {
      updates.education = String(education).trim();
    }

    if (experience !== undefined) {
      updates.experience = String(experience).trim();
    }

    if (resumeUrl !== undefined) {
      updates.resumeUrl = String(resumeUrl).trim();
    }

    if (skills !== undefined) {
      if (Array.isArray(skills)) {
        updates.skills = skills.map((s) => String(s).trim()).filter(Boolean);
      } else if (typeof skills === "string") {
        updates.skills = skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true },
    );

    res.json({
      success: true,
      user: serializeUser(updatedUser),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Unable to update profile",
    });
  }
});

router.post("/logout", protect, (req, res) => {
  res.json({
    success: true,
    message: "Logged out successfully",
  });
});

module.exports = router;
