const db = require("../config/dbConfig");

exports.saveProfile = async (req, res) => {
  const {
    email, 
    wallet_address,
    first_name,
    last_name,
    profile_photo,
    one_liner_bio,
    description,
    learner_id,
  } = req.body;

  // Determine the value of hasFilled based on first_name and last_name
  const hasFilled = first_name && last_name ? "1" : "0";

  const query = `
    UPDATE Learners
    SET
      email = ?,
      wallet_address = ?,
      first_name = ?,
      last_name = ?,
      profile_photo = ?,
      one_liner_bio = ?,
      description = ?,
      hasFilled = ?
    WHERE learner_id = ?
  `;
  
  const values = [
    email,
    wallet_address,
    first_name,
    last_name,
    profile_photo,
    one_liner_bio,
    description,
    hasFilled,
    learner_id,
  ];

  try {
    const [result] = await db.query(query, values);

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, message: "User not found or no changes made" });
    }

    res.json({ success: true, message: "Profile saved successfully" });
  } catch (error) {
    console.error("Error saving profile:", error);
    res.status(500).json({ success: false, message: "Database error" });
  }
};
