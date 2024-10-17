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

exports.saveSocials = async (req, res) => {
  const { learner_id, linkedin_url, twitter_url, discord_url, github_url } = req.body;

  const updateFields = [];
  const values = [];

  if (linkedin_url !== undefined) {
    updateFields.push("linkedin_url = ?");
    values.push(linkedin_url);
  }
  if (twitter_url !== undefined) {
    updateFields.push("twitter_url = ?");
    values.push(twitter_url);
  }
  if (discord_url !== undefined) {
    updateFields.push("discord_url = ?");
    values.push(discord_url);
  }
  if (github_url !== undefined) {
    updateFields.push("github_url = ?");
    values.push(github_url);
  }

  if (updateFields.length === 0) {
    return res.status(400).json({ success: false, message: "No fields to update" });
  }

  values.push(learner_id);

  const query = `
    UPDATE Learners
    SET ${updateFields.join(", ")}
    WHERE learner_id = ?
  `;

  try {
    const [result] = await db.query(query, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "User not found or no changes made" });
    }

    res.json({
      success: true,
      message: "Social accounts updated successfully",
    });
  } catch (error) {
    console.error("Error updating social accounts:", error);
    res.status(500).json({ success: false, message: "Database error" });
  }
};