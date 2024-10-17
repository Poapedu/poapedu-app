const express = require("express");
const profileController = require("../controllers/profileController");

const router = express.Router();

router.post("/save-profile", profileController.saveProfile);
router.post("/save-socials", profileController.saveSocials);

module.exports = router;