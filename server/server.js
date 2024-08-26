const express = require("express");
const cors = require("cors");
const puppeteer = require("puppeteer");
const { URL } = require("url");
require("dotenv").config();
const fs = require("fs");
const mysql = require("mysql2/promise");
const Moralis = require("moralis").default;

const db = mysql.createPool({
  host: `${process.env.PROD_MYSQL_HOST}`,
  user: `${process.env.PROD_MYSQL_USER}`,
  password: `${process.env.PROD_MYSQL_PASS}`,
  database: `${process.env.PROD_MYSQL_DB}`,
});

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

(async () => {
  try {
    await Moralis.start({
      apiKey: process.env.MORALIS_API_KEY,
    });
    console.log("Moralis initialized");
  } catch (error) {
    console.error("Failed to start Moralis:", error);
  }
})();

/**
 * Newsletter subscription API
 */
app.post("/subscribe", (req, res) => {
  const { email } = req.body;
  const sql = "INSERT INTO NewsletterSubscribers (email) VALUES (?)";

  db.query(sql, [email], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      res.status(500).json({ success: false, message: "Subscription failed" });
    } else {
      res.json({ success: true, message: "Subscription successful" });
    }
  });
});

app.get("/scrape", async (req, res) => {
  const { url: pageUrl } = req.query;
  if (!pageUrl) {
    return res.status(400).send("URL is required");
  }

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // console messages from the page to handle any errors. TBD to extend this but for now just a log.
    page.on("console", (msg) => {
      if (msg.type() === "log") {
        console.log(`PAGE LOG: ${msg.text()}`);
      }
    });

    await page.goto(pageUrl, { waitUntil: "networkidle2" });

    const hostname = new URL(pageUrl).hostname;

    let scrapedContent;

    if (hostname.includes("credly.com")) {
      scrapedContent = await page.evaluate(() => {
        const mainContent =
          document.querySelector("main#root")?.innerHTML || "";
        const ulContent = Array.from(
          document.querySelectorAll(".cr-badges-badge-skills__skills li")
        )
          .map((el) => el.textContent)
          .join(", ");

        const descriptionDiv = document.querySelector(
          ".cr-badges-full-badge__description"
        );
        const firstShiitakeSpan = descriptionDiv?.querySelector(
          "span.shiitake-children"
        );
        const descriptionText = firstShiitakeSpan
          ? firstShiitakeSpan.textContent.trim()
          : "";

        const certificateImage =
          document.querySelector(".cr-badges-full-badge__img")?.src || "";

        const issuedToHtmlTemp =
          document.querySelector(".badge-banner-issued-to-text")?.innerHTML ||
          "";

        const issuedToHtml =
          issuedToHtmlTemp.match(/<a[^>]*>(.*?)<\/a>/)?.[1].trim() || "";

        const certificateTitle =
          document
            .querySelector(".ac-heading--badge-name-hero")
            ?.textContent.trim() || "";
        const issuedBy =
          document.querySelector(".cr-badges-badge-issuer__entity")
            ?.innerHTML || "";

        return {
          domain: "credly.com",
          mainContent,
          skills: ulContent,
          description: descriptionText,
          issuedTo: issuedToHtml,
          certificateImage,
          certificateTitle: certificateTitle,
          issuedBy: issuedBy,
        };
      });
    } else if (hostname.includes("credential.net")) {
      scrapedContent = await page.evaluate(() => {
        //console.log('Extracting certificate image...');
        const certificateImage =
          document.querySelector(".certificate-bg.ng-star-inserted img")?.src ||
          "";
        //console.log('Extracting column structure...');
        const columnStructure =
          document.querySelector(".column-structure")?.innerHTML || "";
        //console.log('Extracting description...');
        const descriptionText =
          document.querySelector(".description")?.textContent.trim() || "";
        //console.log('Extracting skills...');
        const ulContent = Array.from(
          document.querySelectorAll("accredible-chip-list ul li")
        )
          .map((el) => el.textContent)
          .join(", ");
        //console.log('Extracting issued date...');
        const issuedOnText =
          document.querySelector(".issued-on > div")?.textContent.trim() || "";
        //console.log('Extracting expiry date...');
        const expiresOnText =
          document.querySelector(".expires-on")?.textContent.trim() || "";
        //console.log('Extracting issuer logo...');
        const issuerLogoHtml =
          document.querySelector(".issuer-logo")?.innerHTML || "";
        //console.log('Extracting certificate title...');
        const certificateTitle =
          document.querySelector("h1.mat-h1")?.textContent.trim() || "";
        //console.log('Extraction complete.');
        const issuedToHtml =
          document.querySelector("h2.name.mat-h2")?.textContent.trim() || "";

        return {
          domain: "credential.net",
          certificateImage,
          columnStructure,
          description: descriptionText,
          skills: ulContent,
          issuedOn: issuedOnText,
          expiresOn: expiresOnText,
          issuerLogo: issuerLogoHtml,
          issuedTo: issuedToHtml,
          certificateTitle: certificateTitle,
        };
      });
    } else if (
      hostname.includes("linkedin.com") &&
      pageUrl.includes("/certificates/")
    ) {
      scrapedContent = await page.evaluate(async () => {
        await new Promise((resolve) => setTimeout(resolve, 3000)); // Wait for dynamic content

        //console.log('Extracting certificate image...');
        const certificateImageElement =
          document.querySelector(".certificate-image");
        const certificateImage = certificateImageElement
          ? certificateImageElement.src
          : "";

        //console.log('Extracting issued to...');
        const issuedToElement = document.querySelector(
          ".certificate-details__recipient-profile"
        );
        const issuedToHtml = issuedToElement ? issuedToElement.innerHTML : "";

        //console.log('Extracting skills...');
        const skillsList = Array.from(
          document.querySelectorAll(".course-skills__skill-list li")
        )
          .map((el) => el.textContent.trim())
          .filter((text) => text.length > 0) // Remove any empty strings
          .join(", ");
        //console.log('Extracting certificate title...');
        const certificateTitleElement = document.querySelector(
          ".base-search-card__title"
        );
        const certificateTitle = certificateTitleElement
          ? certificateTitleElement.textContent.trim()
          : "";

        //console.log('Extracting description...');
        const descriptionElement = document.querySelector(
          ".show-more-less-html__markup"
        );
        const descriptionText = descriptionElement
          ? descriptionElement.textContent.trim()
          : "";

        //console.log('Extraction complete.');

        return {
          domain: "linkedin.com",
          certificateImage,
          issuedTo: issuedToHtml,
          skills: skillsList,
          certificateTitle,
          description: descriptionText,
        };
      });
    } else if (
      hostname.includes("cloudskillsboost.google") &&
      pageUrl.includes("/public_profiles/")
    ) {
      scrapedContent = await page.evaluate(async () => {
        // Wait for content to load
        await new Promise((resolve) => setTimeout(resolve, 3000));

        // Extract issuedTo
        const issuedToElement = document.querySelector(".ql-display-small");
        const issuedTo = issuedToElement
          ? issuedToElement.textContent.trim()
          : "";

        // Extract badges
        const badges = [];
        const badgeElements = document.querySelectorAll(
          ".profile-badges .profile-badge"
        );

        for (const badgeElement of badgeElements) {
          const image = badgeElement.querySelector("img")?.src || "";
          const title =
            badgeElement
              .querySelector(".profile-badge .l-mts")
              ?.textContent.trim() || "";
          const earnedOn =
            badgeElement
              .querySelector(".profile-badge .l-mbs")
              ?.textContent.trim() || "";

          // Extract modal ID from the button
          const buttonElement = badgeElement.querySelector("ql-button");
          const modalId = buttonElement
            ? buttonElement.getAttribute("modal")
            : "";

          // Extract description from <ql-dialog>
          const descriptionElement = modalId
            ? document.querySelector(`ql-dialog#${modalId} p`)
            : null;
          const description = descriptionElement
            ? descriptionElement.textContent.trim()
            : "";

          badges.push({ image, title, earnedOn, description });
        }

        return {
          domain: "cloudskillsboost.google",
          issuedTo,
          badges,
        };
      });
    } else {
      const bodyText = await page.evaluate(() => document.body.innerText);
      scrapedContent = { body: bodyText };
    }

    res.json(scrapedContent);
    await browser.close();
  } catch (error) {
    res.status(500).send("Error scraping the content");
  }
});

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

app.post("/api/save-skills", async (req, res) => {
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
    const insertQuery =
      "INSERT INTO LearnerSkills (learner_id, skill_id) VALUES ?";

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
});

// Webhook endpoint to parse skills JSON data and insert into our tables.
app.post("/skills-webhook", (req, res) => {
  const { userid, skills } = req.body;

  if (!userid || !Array.isArray(skills)) {
    return res.status(400).json({ message: "Invalid data" });
  }

  let skillsProcessed = 0;
  const skillIds = [];

  skills.forEach((skill) => {
    getSkillId(skill, (err, skillId) => {
      if (err) {
        console.error("Error processing skill:", err);
        return res.status(500).json({ message: "Database error" });
      }

      skillIds.push(skillId);
      skillsProcessed++;

      if (skillsProcessed === skills.length) {
        // All skills processed, now inserting into LearnerSkills
        const insertValues = skillIds.map((id) => [userid, id, "beginner"]);
        const insertQuery =
          "INSERT INTO LearnerSkills (learner_id, skill_id, proficiency_level) VALUES ?";

        db.query(insertQuery, [insertValues], (err) => {
          // Close the connection after all operations
          if (err) {
            console.error("Error inserting into LearnerSkills:", err);
            return res.status(500).json({ message: "Database error" });
          }

          res.json({
            message: "Data received and inserted successfully",
            userid,
            skills,
          });
        });
      }
    });
  });
});

// Save profile endpoint
app.post("/api/save-profile", async (req, res) => {
  const {
    email, // Take email from the request body, which should be passed from Supabase
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

  // const query = `
  //   INSERT INTO Learners (
  //     email, wallet_address, first_name, last_name,
  //     profile_photo, one_liner_bio,
  //     description, slug, hasFilled
  //   ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  //   ON DUPLICATE KEY UPDATE
  //     wallet_address = VALUES(wallet_address),
  //     first_name = VALUES(first_name),
  //     last_name = VALUES(last_name),
  //     profile_photo = VALUES(profile_photo),
  //     one_liner_bio = VALUES(one_liner_bio),
  //     description = VALUES(description),
  //     hasFilled = VALUES(hasFilled)
  // `;

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
});

// Save socials endpoint
app.post("/api/save-socials", async (req, res) => {
  const { learner_id, linkedin_url, twitter_url, discord_url, github_url } =
    req.body;

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
    return res
      .status(400)
      .json({ success: false, message: "No fields to update" });
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
      return res
        .status(404)
        .json({ success: false, message: "User not found or no changes made" });
    }

    res.json({
      success: true,
      message: "Social accounts updated successfully",
    });
  } catch (error) {
    console.error("Error updating social accounts:", error);
    res.status(500).json({ success: false, message: "Database error" });
  }
});

// Endpoint to update profile photo
app.post("/api/update-profile-photo", async (req, res) => {
  const { learner_id, profile_photo_url } = req.body;

  if (!learner_id || !profile_photo_url) {
    return res.status(400).json({
      success: false,
      message: "learner_id and profile_photo_url are required",
    });
  }
  try {
    const [result] = await db.query(
      "UPDATE Learners SET profile_photo = ? WHERE learner_id = ?",
      [profile_photo_url, learner_id]
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.json({ success: true, message: "Profile photo updated successfully" });
  } catch (error) {
    console.error("Error updating profile photo:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Endpoint to update profile banner
app.post("/api/update-profile-banner", async (req, res) => {
  const { learner_id, profile_banner_url } = req.body;

  if (!learner_id || !profile_banner_url) {
    return res.status(400).json({
      success: false,
      message: "learner_id and profile_banner_url are required",
    });
  }

  try {
    const [result] = await db.query(
      "UPDATE Learners SET profile_banner = ? WHERE learner_id = ?",
      [profile_banner_url, learner_id]
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.json({ success: true, message: "Profile banner updated successfully" });
  } catch (error) {
    console.error("Error updating profile banner:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

app.post("/api/learners/check-email", async (req, res) => {
  const email = req.body.email;

  //console.log('Received email:', req.body.email);

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    // Perform the query using the connection pool
    const [results] = await db.query("SELECT * FROM Learners WHERE email = ?", [
      email,
    ]);

    if (results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(results[0]);
  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).json({ error: "Database query error" });
  }
});

// Endpoint to create a new user
app.post("/api/learners", (req, res) => {
  const {
    app_metadata,
    aud,
    confirmation_sent_at,
    confirmed_at,
    email_confirmed_at,
    id,
    identities,
    is_anonymous,
    last_sign_in_at,
    phone,
    recovery_sent_at,
    role,
    user_metadata,
  } = req.body;

  // Ensure email is provided
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  const query = `
    INSERT INTO Learners (
      app_metadata, aud, confirmation_sent_at, 
      confirmed_at, email_confirmed_at, supabase_id, identities, is_anonymous, last_sign_in_at, 
      phone, recovery_sent_at, role, user_metadata
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    JSON.stringify(app_metadata),
    aud,
    confirmation_sent_at,
    confirmed_at,
    email_confirmed_at,
    id,
    JSON.stringify(identities),
    is_anonymous,
    last_sign_in_at,
    phone,
    recovery_sent_at,
    role,
    JSON.stringify(user_metadata),
  ];

  db.query(query, values, (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ error: "Database query error" });
    }

    res.status(201).json({
      message: "User created successfully",
      learnerId: results.insertId,
    });
  });
});

app.post("/supabase-webhook", async (req, res) => {
  const secret = req.headers["x-supabase-secret"];

  console.log("Secret:", secret);
  if (secret !== process.env.SUPABASE_WEBHOOK_SECRET) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const userData = req.body;
  console.log("New row inserted:", userData);

  const supabase_id = userData.record.id;
  console.log("User id:", supabase_id);

  const email = userData.record.email;

  try {
    // Insert user data into the MySQL database
    const [result] = await db.execute(
      "INSERT INTO Learners (supase_id, email) VALUES (?, ?)",
      [supabase_id, email]
    );

    res.status(200).json({ message: "User data saved to MySQL", result });
  } catch (error) {
    console.error("Error saving user data to MySQL:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/api/user", async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    // Query the MySQL database using the email
    const query = "SELECT * FROM Learners WHERE email = ?";
    const [rows] = await db.execute(query, [email]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = rows[0];
    res.json({
      learner_id: user.learner_id,
      wallet_address: user.wallet_address,
      first_name: user.first_name,
      last_name: user.last_name,
      profile_photo: user.profile_photo,
      profile_banner: user.profile_banner,
      linkedin_url: user.linkedin_url,
      twitter_url: user.twitter_url,
      discord_url: user.discord_url,
      github_url: user.github_url,
      devto_url: user.devto_url,
      website_url: user.website_url,
      one_liner_bio: user.one_liner_bio,
      description: user.description,
      slug: user.slug,
      bio: user.bio,
      email: user.email,
      hasFilled: user.hasFilled,
    });
  } catch (error) {
    console.error("Database query failed:", error);
    res.status(500).json({ error: "Database query failed" });
  }
});

// Example using Express.js
app.post("/upload-metadata", async (req, res) => {
  const metadata = req.body;

  const response = await fetch(
    "https://api.pinata.cloud/pinning/pinJSONToIPFS",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        pinata_api_key: process.env.POAPEDU_PINATA_API_KEY,
        pinata_secret_api_key: process.env.POAPEDU_PINATA_SECRET_API_KEY,
      },
      body: JSON.stringify(metadata),
    }
  );

  const result = await response.json();
  res.json({ ipfsUrl: `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}` });
});

app.post("/api/getUserNFTs", async (req, res) => {
  const { address } = req.body;

  try {
    const response = await Moralis.EvmApi.nft.getWalletNFTs({
      address: address,
      chain: "0x89", // Polygon Mainnet
      format: "decimal",
      mediaItems: true,
      excludeSpam: true,
    });

    res.json({
      success: true,
      nfts: response.raw,
    });
  } catch (error) {
    console.error("Error fetching NFTs from Moralis:", error);
    res.status(500).json({ error: "Failed to fetch NFTs" });
  }
});


// API endpoint to get skills of a specific learner
app.get('/api/skills/:learner_id', async (req, res) => {
  const learnerId = req.params.learner_id;

  const query = `
      SELECT s.name
      FROM LearnerSkills ls
      JOIN Skills s ON ls.skill_id = s.skill_id
      WHERE ls.learner_id = ?
  `;

  try {
    
      const [results] = await db.query(query, [learnerId]);

      if (results.length === 0) {
          return res.status(404).json({ skills: [] });
      }

      // Extract skill names from the results
      const skills = results.map(row => row.name);

      // Return the skills as an array
      res.json({ skills });
  } catch (error) {
      console.error('Error fetching skills:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
