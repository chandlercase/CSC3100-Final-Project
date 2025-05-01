const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const router = express.Router();

router.post('/register', async (req, res) => {
  const { firstName, lastName, email, password, mobile, discord, teamsId } = req.body;
  const role = 'student';
  const hashed = await bcrypt.hash(password, 10);

  const db = new sqlite3.Database('./backend.db');

  db.get("SELECT * FROM tblUsers WHERE Email = ?", [email], (err, existing) => {
    if (err) {
      console.error(err.message);
      db.close();
      return res.status(500).json({ error: "Database error" });
    }

    if (existing) {
      db.close();
      return res.status(400).json({ error: "Email already exists" });
    }

    db.run(
      `INSERT INTO tblUsers (FirstName, LastName, Email, Password, Role, CreationDateTime)
       VALUES (?, ?, ?, ?, ?, datetime('now'))`,
      [firstName, lastName, email, hashed, role],
      function (err) {
        if (err) {
          console.error(err.message);
          db.close();
          return res.status(500).json({ error: "Failed to register user" });
        }

        const userId = this.lastID;

        if (mobile) {
          db.run(`INSERT INTO tblPhone (PhoneNumber, Status, UserEmail) VALUES (?, ?, ?)`,
            [mobile, 'active', email]);
        }

        if (discord) {
          db.run(`INSERT INTO tblSocials (SocialType, Username, UserEmail) VALUES (?, ?, ?)`,
            ['discord', discord, email]);
        }

        if (teamsId) {
          db.run(`INSERT INTO tblSocials (SocialType, Username, UserEmail) VALUES (?, ?, ?)`,
            ['teams', teamsId, email]);
        }

        res.status(201).json({ userId });
        db.close();
      }
    );
  });
});

module.exports = router;
