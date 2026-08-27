const express = require("express");

const cors = require("cors");
const applicationRoutes = require("./routes/applicationroutes");
require("dotenv").config();

const connectDB = require("./config/db");


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/applications", applicationRoutes);

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
