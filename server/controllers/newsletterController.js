// controllers/newsletterController.js
const db = require("../config/dbConfig");

exports.subscribeNewsletter = async (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ success: false, message: "Email is required" });
  }

  const sql = "INSERT INTO NewsletterSubscribers (email) VALUES (?)";

  try {
    await db.query(sql, [email]);
    res.json({ success: true, message: "Subscription successful" });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ success: false, message: "Subscription failed" });
  }
};
