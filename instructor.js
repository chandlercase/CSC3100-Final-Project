const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../db')

router.post('/register', async (req, res) => {
    const {firstName, lastName, email, password } = req.body
    const role = 'instructor'
    const hashed = await bcrypt.hash(password, 10)

    const insertQuery = `INSERT INTO tblUsers (FirstName, LastName, Email, Password, Role, CreationDateTime) VALUES (?, ?, ?, ?,?, datetime('now'))`;
    db.run(insertQuery, [firstName, lastName, email, hashed, role], function(err) {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Failed to register user' });
        } else {
            res.status(201).json({ message: 'User registered successfully', userId: this.lastID });
        }
    })
})

router.post('/login', (req, res) => {
    const { email, password } = req.body;
  
    db.get(`SELECT * FROM tblUsers WHERE Email = ? AND Role = 'instructor'`, [email], async (err, user) => {
      if (err || !user) {
        return res.status(400).json({ error: "Invalid email" });
      }
      const match = await bcrypt.compare(password, user.Password);
      if (!match) return res.status(401).json({ error: "Invalid password" });
  
      db.run(`INSERT INTO tblSessions (UserID, StartDateTime, LastUsedDateTime, Status) VALUES (?, datetime('now'), datetime('now'), 'active')`, [user.UserID]);
  
      res.json({
        message: "Login successful",
        instructor: {
          id: user.UserID,
          name: user.FirstName + " " + user.LastName,
          email: user.Email
        }
      });
    });
  });

module.exports = router;
