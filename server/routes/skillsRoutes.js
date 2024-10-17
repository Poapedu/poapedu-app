const express = require("express");
const skillsController = require("../controllers/skillsController");

const router = express.Router();

// Define the route for saving skills
router.post("/save-skills", skillsController.saveSkills);

module.exports = router;