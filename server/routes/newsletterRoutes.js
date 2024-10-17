// routes/newsletterRoutes.js
const express = require("express");
const newsletterController = require("../controllers/newsletterController");

const router = express.Router();

router.post("/subscribe", newsletterController.subscribeNewsletter);

module.exports = router;
