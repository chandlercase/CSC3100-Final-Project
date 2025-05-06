const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../db');

router.post('/register', async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  const role = 'instructor';
  const hashed = await bcrypt.hash(password, 10);

  const insertQuery = `INSERT INTO tblUsers (FirstName, LastName, Email, Password, Role, CreationDateTime)
                       VALUES (?, ?, ?, ?,?, datetime('now'))`;
  db.run(insertQuery, [firstName, lastName, email, hashed, role], function (err) {
    if (err) return res.status(500).json({ error: 'Failed to register user' });
    res.status(201).json({ message: 'User registered successfully', userId: this.lastID });
  });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  db.get(`SELECT * FROM tblUsers WHERE Email = ? AND Role = 'instructor'`, [email], async (err, user) => {
    if (err || !user) return res.status(400).json({ error: "Invalid email" });

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

router.post('/create-group', (req, res) => {
  const { courseId, groupName } = req.body;
  db.run(`INSERT INTO tblCoursGroups (GroupName, CourseID) VALUES (?, ?)`, [groupName, courseId], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ groupId: this.lastID });
  });
});

router.post('/assign-group-members', (req, res) => {
  const { groupId, studentIds } = req.body;
  const stmt = db.prepare(`INSERT INTO tblGroupMembers (GroupID, UserID) VALUES (?, ?)`);
  studentIds.forEach(id => stmt.run([groupId, id]));
  stmt.finalize(err => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Students assigned to group" });
  });
});

router.get('/all-courses', (req, res) => {
  db.all(`SELECT CourseID, CourseName, CourseTerm FROM tblCourses ORDER BY StartDate DESC`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ courses: rows });
  });
});

router.put('/api/courses/:id', (req, res) => {
  const { courseName } = req.body;
  const { id } = req.params;
  db.run(`UPDATE tblCourses SET CourseName = ? WHERE CourseID = ?`, [courseName, id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Course updated' });
  });
});

router.delete('/api/courses/:id', (req, res) => {
  const { id } = req.params;
  db.run(`DELETE FROM tblCourses WHERE CourseID = ?`, [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Course deleted' });
  });
});

router.get('/groups/:courseId', (req, res) => {
  const sql = `SELECT * FROM tblCoursGroups WHERE CourseID = ?`;
  db.all(sql, [req.params.courseId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ groups: rows });
  });
});

router.get('/students/all', (req, res) => {
  const sql = `SELECT UserID, FirstName, LastName, Email FROM tblUsers WHERE Role = 'student'`;
  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ students: rows });
  });
});

router.post('/groups/:groupId/members', (req, res) => {
  const { studentId } = req.body;
  const { groupId } = req.params;
  db.run(`INSERT INTO tblGroupMembers (GroupID, UserID) VALUES (?, ?)`, [groupId, studentId], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ added: true });
  });
});
router.get('/groups/:groupId/members', (req, res) => {
    const sql = `
      SELECT u.UserID, u.FirstName, u.LastName, u.Email
      FROM tblUsers u
      JOIN tblGroupMembers gm ON u.UserID = gm.UserID
      WHERE gm.GroupID = ?
    `;
    db.all(sql, [req.params.groupId], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ members: rows });
    });
  });
  router.delete('/groups/:groupId/members/:studentId', (req, res) => {
    const { groupId, studentId } = req.params;
    const sql = `DELETE FROM tblGroupMembers WHERE GroupID = ? AND UserID = ?`;
  
    db.run(sql, [groupId, studentId], function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ removed: true });
    });
  });
  

module.exports = router;
