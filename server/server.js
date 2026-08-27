const express = require("express");

const cors = require("cors");
const applicationRoutes = require("./routes/applicationroutes");
const authRoutes = require("./routes/authroutes");
const jobRoutes = require("./routes/jobroutes");
require("dotenv").config();

const connectDB = require("./config/db");


const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://127.0.0.1:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/jobs", jobRoutes);

connectDB();

app.get("/", (req, res) => {
  res.json({
    message: "ATS Backend is running",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
