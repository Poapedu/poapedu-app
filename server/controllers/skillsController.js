const db = require("../config/dbConfig");

// Helper function to insert or get skill ID
const getSkillId = async (skillName) => {
  const checkQuery = "SELECT skill_id FROM Skills WHERE name = ?";
  const [results] = await db.query(checkQuery, [skillName]);

  if (results.length > 0) {
    // Skill already exists
    return results[0].skill_id;
  } else {
    // Insert new skill
    const insertQuery = "INSERT INTO Skills (name) VALUES (?)";
    const [insertResult] = await db.query(insertQuery, [skillName]);
    return insertResult.insertId;
  }
};

exports.saveSkills = async (req, res) => {
  const { email, skills } = req.body;

  if (!email || !Array.isArray(skills)) {
    return res.status(400).json({ message: "Invalid data" });
  }

  // Preprocess the skills: lowercase and trim
  const formattedSkills = skills.map((skill) => skill.toLowerCase().trim());

  const connection = await db.getConnection(); // Get a connection from the pool

  try {
    // Fetch the learner_id using the email
    const learnerIdQuery = "SELECT learner_id FROM Learners WHERE email = ?";
    const [learnerResult] = await connection.query(learnerIdQuery, [email]);

    if (learnerResult.length === 0) {
      return res.status(404).json({ message: "Learner not found" });
    }

    const learnerId = learnerResult[0].learner_id;

    // Start a transaction
    await connection.beginTransaction();

    // Process each skill
    const skillIds = [];
    for (const skill of formattedSkills) {
      const skillId = await getSkillId(skill);
      skillIds.push(skillId);
    }

    // Insert the learner-skill relationships into LearnerSkills table
    const insertValues = skillIds.map((id) => [learnerId, id]);
    const insertQuery = "INSERT INTO LearnerSkills (learner_id, skill_id) VALUES ?";

    await connection.query(insertQuery, [insertValues]);

    // Commit the transaction
    await connection.commit();

    res.json({
      message: "Skills saved successfully",
      learnerId,
      skills: formattedSkills,
    });
  } catch (error) {
    // Rollback the transaction in case of error
    await connection.rollback();
    console.error("Error saving skills:", error);
    res.status(500).json({ message: "Database error" });
  } finally {
    connection.release(); // Release the connection back to the pool
  }
};
