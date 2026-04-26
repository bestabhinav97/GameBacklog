const Game = require("../models/Game");
const Review = require("../models/Review");

const getStats = async (req, res) => {
  try {
    const totalGames = await Game.countDocuments();

    // Count per status
    const statusBreakdown = await Game.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    // Total hours played across all games
    const hoursResult = await Game.aggregate([
      { $group: { _id: null, totalHours: { $sum: "$hoursPlayed" } } },
    ]);
    const totalHours = hoursResult[0]?.totalHours || 0;

    // Average rating from reviews
    const ratingResult = await Review.aggregate([
      { $group: { _id: null, avgRating: { $avg: "$rating" } } },
    ]);
    const avgRating = ratingResult[0]?.avgRating
      ? ratingResult[0].avgRating.toFixed(1)
      : null;

    // Genre breakdown
    const genreBreakdown = await Game.aggregate([
      { $group: { _id: "$genre", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.json({
      totalGames,
      totalHours,
      avgRating,
      statusBreakdown,
      genreBreakdown,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error", message: err.message });
  }
};

module.exports = { getStats };
