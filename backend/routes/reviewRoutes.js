const express = require("express");
const router = express.Router();
const {
  getReviewsByGame,
  getAllReviews,
  createReview,
  deleteReview,
} = require("../controllers/reviewController");

router.get("/", getAllReviews);
router.get("/game/:gameId", getReviewsByGame);
router.post("/", createReview);
router.delete("/:id", deleteReview);

module.exports = router;
