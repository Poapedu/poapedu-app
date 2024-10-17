const express = require("express");
const profileController = require("../controllers/profileController");

const router = express.Router();

// Define the /save-profile route
router.post("/save-profile", profileController.saveProfile);

module.exports = router;