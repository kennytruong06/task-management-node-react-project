require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const logger = require("morgan");

const { connectDB } = require("../config/db");
const taskRoutes = require("../routes/taskRoutes");

connectDB();
const app = express();

app.use(express.json({ }));
app.use(helmet());
app.use(cors());

app.use(logger("dev"));

//root route
app.get("/", (req, res) => {
  res.send("App works properly!");
});

app.use("/tasks/", taskRoutes);

// Use express's default error handling middleware
app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  res.status(400).json({ message: err.message });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`server running on port ${PORT}`));
