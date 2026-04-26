const Platform = require("../models/Platform");

const getPlatforms = async (req, res) => {
  try {
    const platforms = await Platform.find().sort({ name: 1 });
    res.json(platforms);
  } catch (err) {
    res.status(500).json({ error: "Server error", message: err.message });
  }
};

const createPlatform = async (req, res) => {
  try {
    const { name, manufacturer, releaseYear } = req.body;
    if (!name || !manufacturer || !releaseYear) {
      return res
        .status(400)
        .json({ error: "name, manufacturer, and releaseYear are required" });
    }
    const existing = await Platform.findOne({ name });
    if (existing)
      return res.status(409).json({ error: "Platform already exists" });

    const platform = new Platform({ name, manufacturer, releaseYear });
    const saved = await platform.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: "Server error", message: err.message });
  }
};

const deletePlatform = async (req, res) => {
  try {
    const platform = await Platform.findByIdAndDelete(req.params.id);
    if (!platform) return res.status(404).json({ error: "Platform not found" });
    res.json({ message: "Platform deleted" });
  } catch (err) {
    res.status(500).json({ error: "Server error", message: err.message });
  }
};

module.exports = { getPlatforms, createPlatform, deletePlatform };
