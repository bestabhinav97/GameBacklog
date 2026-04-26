const mongoose = require("mongoose");

const platformSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Platform name is required"],
      unique: true,
      trim: true,
    },
    manufacturer: {
      type: String,
      required: [true, "Manufacturer is required"],
    },
    releaseYear: {
      type: Number,
      required: [true, "Release year is required"],
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Platform", platformSchema);
