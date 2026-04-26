const express = require("express");
const router = express.Router();
const {
  getPlatforms,
  createPlatform,
  deletePlatform,
} = require("../controllers/platformController");

router.get("/", getPlatforms);
router.post("/", createPlatform);
router.delete("/:id", deletePlatform);

module.exports = router;
