const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer');
const { URL } = require('url');
require('dotenv').config(); 
const fs = require('fs');
const mysql = require('mysql2/promise');

const db = mysql.createPool({
    host: `${process.env.PROD_MYSQL_HOST}`,
    user: `${process.env.PROD_MYSQL_USER}`,
    password: `${process.env.PROD_MYSQL_PASS}`,
    database: `${process.env.PROD_MYSQL_DB}`,
});

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

/** 
 * Newsletter subscription API
 */
app.post('/subscribe', (req, res) => {
  const { email } = req.body;
  const sql = 'INSERT INTO NewsletterSubscribers (email) VALUES (?)';

  db.query(sql, [email], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      res.status(500).json({ success: false, message: 'Subscription failed' });
    } else {
      res.json({ success: true, message: 'Subscription successful' });
    }
  });
});


app.get('/scrape', async (req, res) => {
  const { url: pageUrl } = req.query;
  if (!pageUrl) {
    return res.status(400).send('URL is required');
  }

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // console messages from the page to handle any errors. TBD to extend this but for now just a log.
    page.on('console', (msg) => {
      if (msg.type() === 'log') {
        console.log(`PAGE LOG: ${msg.text()}`);
      }
    });

    await page.goto(pageUrl, { waitUntil: 'networkidle2' });

    const hostname = new URL(pageUrl).hostname;

    let scrapedContent;

    if (hostname.includes('credly.com')) {
        scrapedContent = await page.evaluate(() => {
        const mainContent = document.querySelector('main#root')?.innerHTML || '';
        const ulContent = Array.from(document.querySelectorAll('.cr-badges-badge-skills__skills li')).map(el => el.textContent).join(', ');
        
        const descriptionDiv = document.querySelector('.cr-badges-full-badge__description');
        const firstShiitakeSpan = descriptionDiv?.querySelector('span.shiitake-children');
        const descriptionText = firstShiitakeSpan ? firstShiitakeSpan.textContent.trim() : '';

        const certificateImage = document.querySelector('.cr-badges-full-badge__img')?.src || '';
        const issuedToHtml = document.querySelector('.badge-banner-issued-to-text')?.innerHTML || '';
        const certificateTitle = document.querySelector('.ac-heading--badge-name-hero')?.textContent.trim() || '';
        const issuedBy = document.querySelector('.cr-badges-badge-issuer__entity')?.innerHTML || '';

        return {
          domain: 'credly.com',
          mainContent,
          skills: ulContent,
          description: descriptionText,
          issuedTo: issuedToHtml,
          certificateImage,
          certificateTitle: certificateTitle,
          issuedBy: issuedBy
        };
      });

    } else if (hostname.includes('credential.net')) {

      scrapedContent = await page.evaluate(() => {
        //console.log('Extracting certificate image...');
        const certificateImage = document.querySelector('.certificate-bg.ng-star-inserted img')?.src || '';
        //console.log('Extracting column structure...');
        const columnStructure = document.querySelector('.column-structure')?.innerHTML || '';
        //console.log('Extracting description...');
        const descriptionText = document.querySelector('.description')?.textContent.trim() || '';
        //console.log('Extracting skills...');
        const ulContent = Array.from(document.querySelectorAll('accredible-chip-list ul li')).map(el => el.textContent).join(', ');
        //console.log('Extracting issued date...');
        const issuedOnText = document.querySelector('.issued-on')?.textContent.trim() || '';
        //console.log('Extracting expiry date...');
        const expiresOnText = document.querySelector('.expires-on')?.textContent.trim() || '';
        //console.log('Extracting issuer logo...');
        const issuerLogoHtml = document.querySelector('.issuer-logo')?.innerHTML || '';
        //console.log('Extracting certificate title...');
        const certificateTitle = document.querySelector('h1.mat-h1')?.textContent.trim() || '';
        //console.log('Extraction complete.');

        return {
          domain: 'credential.net',
          certificateImage,
          columnStructure,
          description: descriptionText,
          skills: ulContent,
          issuedOn: issuedOnText,
          expiresOn: expiresOnText,
          issuerLogo: issuerLogoHtml,
          certificateTitle
        };
      });
    }  else if (hostname.includes('linkedin.com') && pageUrl.includes('/certificates/')) {
      scrapedContent = await page.evaluate(async () => {
        await new Promise(resolve => setTimeout(resolve, 3000)); // Wait for dynamic content

        //console.log('Extracting certificate image...');
        const certificateImageElement = document.querySelector('.certificate-image');
        const certificateImage = certificateImageElement ? certificateImageElement.src : '';

        //console.log('Extracting issued to...');
        const issuedToElement = document.querySelector('.certificate-details__recipient-profile');
        const issuedToHtml = issuedToElement ? issuedToElement.innerHTML : '';

        //console.log('Extracting skills...');
        const skillsList = Array.from(document.querySelectorAll('.course-skills__skill-list li'))
        .map(el => el.textContent.trim())
        .filter(text => text.length > 0) // Remove any empty strings
        .join(', ');
        //console.log('Extracting certificate title...');
        const certificateTitleElement = document.querySelector('.base-search-card__title');
        const certificateTitle = certificateTitleElement ? certificateTitleElement.textContent.trim() : '';

        //console.log('Extracting description...');
        const descriptionElement = document.querySelector('.show-more-less-html__markup');
        const descriptionText = descriptionElement ? descriptionElement.textContent.trim() : '';

        //console.log('Extraction complete.');

        return {
          domain: 'linkedin.com',
          certificateImage,
          issuedTo: issuedToHtml,
          skills: skillsList,
          certificateTitle,
          description: descriptionText
        };
      });
    }  else if (hostname.includes('cloudskillsboost.google') && pageUrl.includes('/public_profiles/')) {
      scrapedContent = await page.evaluate(async () => {
        // Wait for content to load
        await new Promise(resolve => setTimeout(resolve, 3000)); 

        // Extract issuedTo
        const issuedToElement = document.querySelector('.ql-display-small');
        const issuedTo = issuedToElement ? issuedToElement.textContent.trim() : '';

        // Extract badges
        const badges = [];
        const badgeElements = document.querySelectorAll('.profile-badges .profile-badge');

        for (const badgeElement of badgeElements) {
          const image = badgeElement.querySelector('img')?.src || '';
          const title = badgeElement.querySelector('.profile-badge .l-mts')?.textContent.trim() || '';
          const earnedOn = badgeElement.querySelector('.profile-badge .l-mbs')?.textContent.trim() || '';

          // Extract modal ID from the button
          const buttonElement = badgeElement.querySelector('ql-button');
          const modalId = buttonElement ? buttonElement.getAttribute('modal') : '';

          // Extract description from <ql-dialog>
          const descriptionElement = modalId ? document.querySelector(`ql-dialog#${modalId} p`) : null;
          const description = descriptionElement ? descriptionElement.textContent.trim() : '';


          badges.push({ image, title, earnedOn, description });
        }

        return {
          domain: 'cloudskillsboost.google',
          issuedTo,
          badges
        };
      });
    } else {
      const bodyText = await page.evaluate(() => document.body.innerText);
      scrapedContent = { body: bodyText };
    }

    res.json(scrapedContent);
    await browser.close();

  } catch (error) {
    res.status(500).send('Error scraping the content');
  }
});

// Helper function to insert or get skill ID
const getSkillId = (skillName, callback) => {
  const checkQuery = 'SELECT skill_id FROM Skills WHERE name = ?';
  db.connect((err) => {
    if (err) {
      throw err;
    }
    console.log('Connected to MySQL database');
  });
  db.query(checkQuery, [skillName], (err, results) => {
    if (err) {
      return callback(err);
    }

    if (results.length > 0) {
      // Skill already exists
      callback(null, results[0].skill_id);
    } else {
      // Insert new skill
      const insertQuery = 'INSERT INTO Skills (name) VALUES (?)';
      db.query(insertQuery, [skillName], (err, results) => {
        db.end();
        if (err) {
          return callback(err);
        }
        callback(null, results.insertId);
      });
    }
  });
};

// Webhook endpoint to parse skills JSON data and insert into our tables.
app.post('/skills-webhook', (req, res) => {
  const { userid, skills } = req.body;

  if (!userid || !Array.isArray(skills)) {
    return res.status(400).json({ message: 'Invalid data' });
  }

  let skillsProcessed = 0;
  const skillIds = [];
  
  skills.forEach(skill => {
    getSkillId(skill, (err, skillId) => {
      if (err) {
        console.error('Error processing skill:', err);
        return res.status(500).json({ message: 'Database error' });
      }
      
      skillIds.push(skillId);
      skillsProcessed++;

      if (skillsProcessed === skills.length) {
        // All skills processed, now inserting into LearnerSkills
        const insertValues = skillIds.map(id => [userid, id, 'beginner']);
        const insertQuery = 'INSERT INTO LearnerSkills (learner_id, skill_id, proficiency_level) VALUES ?';

        db.query(insertQuery, [insertValues], (err) => {
          // Close the connection after all operations
          if (err) {
            console.error('Error inserting into LearnerSkills:', err);
            return res.status(500).json({ message: 'Database error' });
          }

          res.json({
            message: 'Data received and inserted successfully',
            userid,
            skills
          });
        });
      }
    });
  });
});

// Save profile endpoint
app.post('/api/save-profile', (req, res) => {
  const { learner_id, email, wallet_address, first_name, last_name,
          profile_photo, profile_banner, one_liner_bio,
          description, slug } = req.body;

  const query = `
    INSERT INTO Learners (
      learner_id, email, wallet_address, first_name, last_name,
      profile_photo, profile_banner, one_liner_bio,
      description, slug
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      email = VALUES(email),
      wallet_address = VALUES(wallet_address),
      first_name = VALUES(first_name),
      last_name = VALUES(last_name),
      profile_photo = VALUES(profile_photo),
      profile_banner = VALUES(profile_banner),
      one_liner_bio = VALUES(one_liner_bio),
      description = VALUES(description),
      slug = VALUES(slug)
  `;

  const values = [
    learner_id, email, wallet_address, first_name, last_name, profile_photo,
    profile_banner, one_liner_bio, description, slug
  ];

  db.query(query, values, (error, results) => {
    if (error) {
      console.error('Error saving profile:', error);
      return res.status(500).json({ success: false, message: 'Database error' });
    }
    console.log(results);
    res.json({ success: true, message: 'Profile saved successfully' });
  });
});

// Save socials endpoint
app.post('/api/save-socials', (req, res) => {
  const { learner_id, linkedin_url, twitter_url, discord_url,
          github_url, devto_url, website_url } = req.body;

  const query = `
    INSERT INTO Learners (
      learner_id, linkedin_url, twitter_url, discord_url,
      github_url, devto_url, website_url
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      linkedin_url = VALUES(linkedin_url),
      twitter_url = VALUES(twitter_url),
      discord_url = VALUES(discord_url),
      github_url = VALUES(github_url),
      devto_url = VALUES(devto_url),
      website_url = VALUES(website_url)
  `;

  const values = [
    learner_id, linkedin_url, twitter_url, discord_url,
    github_url, devto_url, website_url
  ];

  db.query(query, values, (error, results) => {
    if (error) {
      console.error('Error saving socials:', error);
      return res.status(500).json({ success: false, message: 'Database error' });
    }

    res.json({ success: true, message: 'Socials saved successfully' });
  });
});

// Endpoint to update profile photo
app.post('/api/update-profile-photo', async (req, res) => {
  const { learner_id, profile_photo_url } = req.body;

  if (!learner_id || !profile_photo_url) {
    return res.status(400).json({ success: false, message: 'learner_id and profile_photo_url are required' });
  }
  try {
    const [result] = await db.query(
      'UPDATE Learners SET profile_photo = ? WHERE learner_id = ?',
      [profile_photo_url, learner_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, message: 'Profile photo updated successfully' });
  } catch (error) {
    console.error('Error updating profile photo:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Endpoint to update profile banner
app.post('/api/update-profile-banner', async (req, res) => {
  const { learner_id, profile_banner_url } = req.body;

  if (!learner_id || !profile_banner_url) {
    return res.status(400).json({ success: false, message: 'learner_id and profile_banner_url are required' });
  }

  try {
    const [result] = await db.query(
      'UPDATE Learners SET profile_banner = ? WHERE learner_id = ?',
      [profile_banner_url, learner_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, message: 'Profile banner updated successfully' });
  } catch (error) {
    console.error('Error updating profile banner:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.post('/api/learners/check-email', async (req, res) => {
  const email = req.body.email;

  //console.log('Received email:', req.body.email);

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    // Perform the query using the connection pool
    const [results] = await db.query('SELECT * FROM Learners WHERE email = ?', [email]);

    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(results[0]);
  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).json({ error: 'Database query error' });
  }
});

// Endpoint to create a new user
app.post('/api/learners', (req, res) => {
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
    user_metadata
  } = req.body;

  // Ensure email is provided
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const query = `
    INSERT INTO Learners (
      app_metadata, aud, confirmation_sent_at, 
      confirmed_at, email_confirmed_at, supabase_id, identities, is_anonymous, last_sign_in_at, 
      phone, recovery_sent_at, role, user_metadata
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    JSON.stringify(app_metadata), aud, confirmation_sent_at,
    confirmed_at, email_confirmed_at, id, JSON.stringify(identities), is_anonymous,
    last_sign_in_at, phone, recovery_sent_at, role, JSON.stringify(user_metadata)
  ];

  db.query(query, values, (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ error: 'Database query error' });
    }

    res.status(201).json({ message: 'User created successfully', learnerId: results.insertId });
  });
});

app.post('/supabase-webhook', async (req, res) => {
  const secret = req.headers['x-supabase-secret'];
  
  // if (secret !== process.env.SUPABASE_WEBHOOK_SECRET) {
  //   return res.status(401).json({ message: 'Unauthorized' });
  // }

  // const userData = req.body;

  // // Extract user information from the webhook payload
  // const { id, email } = userData;

  // try {
  //   // Insert user data into the MySQL database
  //   const [result] = await db.execute('INSERT INTO users (supabase_id, email) VALUES (?, ?)', [id, email]);

  //   res.status(200).json({ message: 'User data saved to MySQL', result });
  // } catch (error) {
  //   console.error('Error saving user data to MySQL:', error);
  //   res.status(500).json({ message: 'Internal server error' });
  // }
  const userData = req.body;
  console.log('New row inserted:', userData)

  const supabase_id = userData.record.id;
  console.log('User id:', supabase_id)

  const email = userData.record.email

    try {
    // Insert user data into the MySQL database
    const [result] = await db.execute('INSERT INTO users (supabase_id, email) VALUES (?, ?)', [supabase_id, email]);

    res.status(200).json({ message: 'User data saved to MySQL', result });
  } catch (error) {
    console.error('Error saving user data to MySQL:', error);
    res.status(500).json({ message: 'Internal server error' });
  }

});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));