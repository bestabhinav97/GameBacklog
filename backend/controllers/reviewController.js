const Review = require("../models/Review");
const Game = require("../models/Game");

// GET reviews for a specific game
const getReviewsByGame = async (req, res) => {
  try {
    const reviews = await Review.find({ gameId: req.params.gameId }).populate(
      "gameId",
      "title",
    );
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: "Server error", message: err.message });
  }
};

// GET all reviews (relational — joins with game data)
const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().populate({
      path: "gameId",
      select: "title genre status",
      populate: { path: "platformId", select: "name" },
    });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: "Server error", message: err.message });
  }
};

// POST create a review
const createReview = async (req, res) => {
  try {
    const { gameId, rating, notes, recommended } = req.body;
    if (!gameId || !rating) {
      return res.status(400).json({ error: "gameId and rating are required" });
    }

    const game = await Game.findById(gameId);
    if (!game) return res.status(404).json({ error: "Game not found" });

    const review = new Review({ gameId, rating, notes, recommended });
    const saved = await review.save();
    res.status(201).json(saved);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res
        .status(400)
        .json({ error: "Validation error", message: err.message });
    }
    res.status(500).json({ error: "Server error", message: err.message });
  }
};

// DELETE a review
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ error: "Review not found" });
    res.json({ message: "Review deleted" });
  } catch (err) {
    res.status(500).json({ error: "Server error", message: err.message });
  }
};

module.exports = {
  getReviewsByGame,
  getAllReviews,
  createReview,
  deleteReview,
};
