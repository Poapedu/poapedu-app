const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const puppeteer = require('puppeteer');
const { URL } = require('url');
require('dotenv').config(); 

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: `${process.env.PROD_MYSQL_HOST}`,
  user: `${process.env.PROD_MYSQL_USER}`,
  password: `${process.env.PROD_MYSQL_PASS}`,
  database: `${process.env.PROD_MYSQL_DB}`
});

/** 
 * Newsletter subscription API
 */
app.post('/subscribe', (req, res) => {
  const { email } = req.body;
  const sql = 'INSERT INTO NewsletterSubscribers (email) VALUES (?)';
  db.connect((err) => {
    if (err) {
      throw err;
    }
    console.log('Connected to MySQL database');
  });

  db.query(sql, [email], (err, result) => {
    db.end();
    if (err) {
      console.error('Database error:', err);
      res.status(500).json({ success: false, message: 'Subscription failed' });
    } else {
      res.json({ success: true, message: 'Subscription successful' });
    }
  });
});

/**
 * 
 */

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
        db.end();
        return res.status(500).json({ message: 'Database error' });
      }
      
      skillIds.push(skillId);
      skillsProcessed++;

      if (skillsProcessed === skills.length) {
        // All skills processed, now inserting into LearnerSkills
        const insertValues = skillIds.map(id => [userid, id, 'beginner']);
        const insertQuery = 'INSERT INTO LearnerSkills (learner_id, skill_id, proficiency_level) VALUES ?';
        db.connect((err) => {
          if (err) {
            throw err;
          }
          console.log('Connected to MySQL database');
        });
        db.query(insertQuery, [insertValues], (err) => {
          // Close the connection after all operations
          db.end();
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));