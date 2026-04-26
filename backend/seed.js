require("dotenv").config();
const mongoose = require("mongoose");
const Platform = require("./models/Platform");
const Game = require("./models/Game");
const Review = require("./models/Review");

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected. Seeding...");

  // Clear existing data
  await Platform.deleteMany();
  await Game.deleteMany();
  await Review.deleteMany();

  // Seed platforms
  const platforms = await Platform.insertMany([
    { name: "PlayStation 5", manufacturer: "Sony", releaseYear: 2020 },
    { name: "Xbox Series X", manufacturer: "Microsoft", releaseYear: 2020 },
    { name: "Nintendo Switch", manufacturer: "Nintendo", releaseYear: 2017 },
    { name: "PC", manufacturer: "Various", releaseYear: 1980 },
    { name: "PlayStation 4", manufacturer: "Sony", releaseYear: 2013 },
  ]);

  const [ps5, xsx, nsw, pc, ps4] = platforms;

  // Seed games
  const games = await Game.insertMany([
    {
      title: "Elden Ring",
      genre: "RPG",
      status: "Completed",
      platformId: ps5._id,
      hoursPlayed: 87,
      releaseYear: 2022,
    },
    {
      title: "God of War Ragnarök",
      genre: "Action",
      status: "Completed",
      platformId: ps5._id,
      hoursPlayed: 42,
      releaseYear: 2022,
    },
    {
      title: "Hades",
      genre: "Action",
      status: "Playing",
      platformId: pc._id,
      hoursPlayed: 60,
      releaseYear: 2020,
    },
    {
      title: "The Legend of Zelda: Tears of the Kingdom",
      genre: "Adventure",
      status: "Playing",
      platformId: nsw._id,
      hoursPlayed: 35,
      releaseYear: 2023,
    },
    {
      title: "Cyberpunk 2077",
      genre: "RPG",
      status: "Dropped",
      platformId: pc._id,
      hoursPlayed: 12,
      releaseYear: 2020,
    },
    {
      title: "Starfield",
      genre: "RPG",
      status: "Backlog",
      platformId: xsx._id,
      hoursPlayed: 0,
      releaseYear: 2023,
    },
    {
      title: "Hollow Knight",
      genre: "Platformer",
      status: "Backlog",
      platformId: pc._id,
      hoursPlayed: 0,
      releaseYear: 2017,
    },
    {
      title: "Resident Evil 4 Remake",
      genre: "Horror",
      status: "Completed",
      platformId: ps5._id,
      hoursPlayed: 22,
      releaseYear: 2023,
    },
    {
      title: "Dave the Diver",
      genre: "Adventure",
      status: "Playing",
      platformId: pc._id,
      hoursPlayed: 18,
      releaseYear: 2023,
    },
    {
      title: "Bloodborne",
      genre: "Action",
      status: "Completed",
      platformId: ps4._id,
      hoursPlayed: 55,
      releaseYear: 2015,
    },
    {
      title: "Slay the Spire",
      genre: "Strategy",
      status: "Completed",
      platformId: pc._id,
      hoursPlayed: 120,
      releaseYear: 2019,
    },
    {
      title: "Baldur's Gate 3",
      genre: "RPG",
      status: "Playing",
      platformId: pc._id,
      hoursPlayed: 45,
      releaseYear: 2023,
    },
    {
      title: "Dead Space Remake",
      genre: "Horror",
      status: "Backlog",
      platformId: ps5._id,
      hoursPlayed: 0,
      releaseYear: 2023,
    },
    {
      title: "Pikmin 4",
      genre: "Strategy",
      status: "Backlog",
      platformId: nsw._id,
      hoursPlayed: 0,
      releaseYear: 2023,
    },
    {
      title: "Street Fighter 6",
      genre: "Fighting",
      status: "Dropped",
      platformId: ps5._id,
      hoursPlayed: 8,
      releaseYear: 2023,
    },
  ]);

  // Seed reviews for completed / playing games
  await Review.insertMany([
    {
      gameId: games[0]._id,
      rating: 10,
      notes:
        "One of the greatest open worlds ever made. The boss fights are brutal but fair.",
      recommended: true,
    },
    {
      gameId: games[1]._id,
      rating: 9,
      notes:
        "Kratos and Atreus deliver an emotional story. Combat is super satisfying.",
      recommended: true,
    },
    {
      gameId: games[2]._id,
      rating: 9,
      notes:
        "The roguelike loop is incredibly addictive. Each run feels fresh.",
      recommended: true,
    },
    {
      gameId: games[4]._id,
      rating: 5,
      notes:
        "Launched in a broken state. Lost interest after the bugs killed immersion.",
      recommended: false,
    },
    {
      gameId: games[7]._id,
      rating: 8,
      notes: "Tense, atmospheric, and faithful to the original. Great pacing.",
      recommended: true,
    },
    {
      gameId: games[9]._id,
      rating: 10,
      notes:
        "FromSoftware at their best. Chalice dungeons are a bit tedious though.",
      recommended: true,
    },
    {
      gameId: games[10]._id,
      rating: 9,
      notes:
        "Incredibly deep card mechanics. Took me 30 hours to beat Ascension 20.",
      recommended: true,
    },
  ]);

  console.log("Seeding complete!");
  await mongoose.disconnect();
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
