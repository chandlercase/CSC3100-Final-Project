const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const router = express.Router();

router.post('/create', (req, res) => {
  const db = new sqlite3.Database('./backend.db');

  const { courseId, name, type, startDate, endDate, questions } = req.body;

  db.run(
    `INSERT INTO tblAssessments (CourseID, Name, Type, StartDate, EndDate, Status)
     VALUES (?, ?, ?, ?, ?, 'active')`,
    [courseId, name, type, startDate, endDate],
    function (err) {
      if (err) {
        db.close();
        return res.status(500).json({ error: err.message });
      }

      const assessmentId = this.lastID;

      const stmt = db.prepare(`
        INSERT INTO tblAssessmentQuestions 
        (AssessmentID, QuestionType, Options, QuestionNarrative, HelperText)
        VALUES (?, ?, ?, ?, ?)
      `);

      questions.forEach(q => {
        stmt.run([assessmentId, q.type, q.options || '', q.text, q.helper || '']);
      });

      stmt.finalize(() => {
        db.close();
        res.json({ assessmentId });
      });
    }
  );
});

router.post('/submit', (req, res) => {
  const db = new sqlite3.Database('./backend.db');

  const { assessmentId, userId, answers } = req.body;

  const stmt = db.prepare(`
    INSERT INTO tblAssessmentResponses
    (AssessmentID, UserID, QuestionID, TargetUserID, UserResponse, Public)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  answers.forEach(ans => {
    stmt.run([
      assessmentId,
      userId,
      ans.questionId,
      ans.targetUserId || null,
      ans.response,
      ans.public ? 1 : 0
    ]);
  });

  stmt.finalize(() => {
    db.close();
    res.json({ message: "Review submitted successfully" });
  });
});

module.exports = router;