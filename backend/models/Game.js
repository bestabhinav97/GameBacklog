const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Game title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    genre: {
      type: String,
      required: [true, "Genre is required"],
      enum: [
        "Action",
        "RPG",
        "Strategy",
        "Sports",
        "Horror",
        "Adventure",
        "Puzzle",
        "Shooter",
        "Platformer",
        "Simulation",
        "Fighting",
        "Other",
      ],
    },
    status: {
      type: String,
      required: [true, "Status is required"],
      enum: ["Backlog", "Playing", "Completed", "Dropped"],
      default: "Backlog",
    },
    platformId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Platform",
      required: [true, "Platform is required"],
    },
    hoursPlayed: {
      type: Number,
      min: [0, "Hours played cannot be negative"],
      default: 0,
    },
    releaseYear: {
      type: Number,
      min: [1970, "Release year must be 1970 or later"],
      max: [2030, "Release year seems too far in the future"],
    },
    coverUrl: {
      type: String,
      default: "",
    },
    addedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Game", gameSchema);
