const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcryptjs");
const router = express.Router();

router.post("/register", async (req, res) => {
  const { firstName, lastName, email, password, mobile, discord, teamsId } =
    req.body;
  const role = "student";
  const hashed = await bcrypt.hash(password, 10);

  const db = new sqlite3.Database("./backend.db");

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
          db.run(
            `INSERT INTO tblPhone (PhoneNumber, Status, UserEmail) VALUES (?, ?, ?)`,
            [mobile, "active", email]
          );
        }

        if (discord) {
          db.run(
            `INSERT INTO tblSocials (SocialType, Username, UserEmail) VALUES (?, ?, ?)`,
            ["discord", discord, email]
          );
        }

        if (teamsId) {
          db.run(
            `INSERT INTO tblSocials (SocialType, Username, UserEmail) VALUES (?, ?, ?)`,
            ["teams", teamsId, email]
          );
        }

        res.status(201).json({ userId });
        db.close();
      }
    );
  });
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  const db = new sqlite3.Database("./backend.db");

  db.get(
    "SELECT * FROM tblUsers WHERE Email = ? AND Role = 'student'",
    [email],
    (err, user) => {
      if (err) {
        console.error(err.message);
        db.close();
        return res.status(500).json({ error: "Database error" });
      }

      if (!user) {
        db.close();
        return res
          .status(401)
          .json({ error: "No student found with that email." });
      }

      const isMatch = bcrypt.compareSync(password, user.Password);

      if (!isMatch) {
        db.close();
        return res.status(401).json({ error: "Incorrect password." });
      }

      db.close();
      return res
        .status(200)
        .json({ userId: user.UserID, name: user.FirstName });
    }
  );
});

router.get('/all', (req, res) => {
  const query = `SELECT UserID, FirstName, LastName, Email FROM tblUsers WHERE Role = 'student'`;
  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ students: rows });
  });
});

router.get('/groups/:studentId', (req, res) => {
  const { studentId } = req.params;

  const query = `
    SELECT g.GroupID, g.GroupName, gm.UserID AS MemberID, u.FirstName AS MemberFirstName, u.LastName AS MemberLastName
    FROM tblGroupMembers gm
    JOIN tblCoursGroups g ON gm.GroupID = g.GroupID
    JOIN tblUsers u ON gm.UserID = u.UserID
    WHERE g.GroupID IN (
      SELECT GroupID
      FROM tblGroupMembers
      WHERE UserID = ?
    )
    ORDER BY g.GroupID, u.FirstName
  `;

  const db = new sqlite3.Database('./backend.db');
  db.all(query, [studentId], (err, rows) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: 'Failed to fetch groups' });
    }

    if (rows.length === 0) {
      return res.status(404).json({ error: 'No groups found for this student' });
    }

    const groups = rows.reduce((acc, row) => {
      const group = acc.find(g => g.GroupID === row.GroupID);
      if (group) {
        group.Members.push({
          MemberID: row.MemberID,
          FirstName: row.MemberFirstName,
          LastName: row.MemberLastName,
        });
      } else {
        acc.push({
          GroupID: row.GroupID,
          GroupName: row.GroupName,
          Members: [
            {
              MemberID: row.MemberID,
              FirstName: row.MemberFirstName,
              LastName: row.MemberLastName,
            },
          ],
        });
      }
      return acc;
    }, []);

    res.json({ groups });
  });
});


module.exports = router;
