require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

const gameRoutes = require("./routes/gameRoutes");
const platformRoutes = require("./routes/platformRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/games", gameRoutes);
app.use("/api/platforms", platformRoutes);
app.use("/api/reviews", reviewRoutes);

// Stats endpoint
app.use("/api/stats", require("./routes/statsRoutes"));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB Atlas");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });
