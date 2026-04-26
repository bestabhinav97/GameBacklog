const Game = require("../models/Game");

// GET all games (with optional filters)
const getGames = async (req, res) => {
  try {
    const { status, genre, platform, search } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (genre) filter.genre = genre;
    if (platform) filter.platformId = platform;
    if (search) filter.title = { $regex: search, $options: "i" };

    const games = await Game.find(filter).populate(
      "platformId",
      "name manufacturer",
    );

    res.json(games);
  } catch (err) {
    res.status(500).json({ error: "Server error", message: err.message });
  }
};

// GET single game by id
const getGameById = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id).populate("platformId");
    if (!game) return res.status(404).json({ error: "Game not found" });
    res.json(game);
  } catch (err) {
    res.status(500).json({ error: "Server error", message: err.message });
  }
};

// POST create a game
const createGame = async (req, res) => {
  try {
    const {
      title,
      genre,
      status,
      platformId,
      hoursPlayed,
      releaseYear,
      coverUrl,
    } = req.body;

    if (!title || !genre || !platformId) {
      return res
        .status(400)
        .json({ error: "title, genre, and platformId are required" });
    }

    const game = new Game({
      title,
      genre,
      status,
      platformId,
      hoursPlayed,
      releaseYear,
      coverUrl,
    });
    const saved = await game.save();
    const populated = await saved.populate("platformId", "name manufacturer");
    res.status(201).json(populated);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res
        .status(400)
        .json({ error: "Validation error", message: err.message });
    }
    res.status(500).json({ error: "Server error", message: err.message });
  }
};

// PUT update a game
const updateGame = async (req, res) => {
  try {
    const {
      title,
      genre,
      status,
      platformId,
      hoursPlayed,
      releaseYear,
      coverUrl,
    } = req.body;

    const game = await Game.findByIdAndUpdate(
      req.params.id,
      { title, genre, status, platformId, hoursPlayed, releaseYear, coverUrl },
      { new: true, runValidators: true },
    ).populate("platformId", "name manufacturer");

    if (!game) return res.status(404).json({ error: "Game not found" });
    res.json(game);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res
        .status(400)
        .json({ error: "Validation error", message: err.message });
    }
    res.status(500).json({ error: "Server error", message: err.message });
  }
};

// DELETE a game
const deleteGame = async (req, res) => {
  try {
    const game = await Game.findByIdAndDelete(req.params.id);
    if (!game) return res.status(404).json({ error: "Game not found" });
    res.json({ message: "Game deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error", message: err.message });
  }
};

module.exports = { getGames, getGameById, createGame, updateGame, deleteGame };
