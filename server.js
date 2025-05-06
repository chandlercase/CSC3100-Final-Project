const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const app = express();

app.use(express.static("public"));
app.use(express.json());
app.use(cors());

const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./backend.db", (err) => {
  if (err) {
    console.error("Error opening database " + err.message);
  } else {
    console.log("Connected to the backend database.");
  }
});

app.post("/api/instructor/register", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  const role = "instructor";

  const insertQuery = `INSERT INTO tblUsers (FirstName, LastName, Email, Password, Role, CreationDateTime)
                       VALUES (?, ?, ?, ?, ?, datetime('now'))`;

  db.run(
    insertQuery,
    [firstName, lastName, email, hashed, role],
    function (err) {
      if (err) {
        console.error(err.message);
        res.status(500).json({ error: "Failed to register user" });
      } else {
        res
          .status(201)
          .json({
            message: "User registered successfully",
            userId: this.lastID,
          });
      }
    }
  );
});

app.post("/api/login", (req, res) => {
  const { email, password, role } = req.body;

  db.get(
    "SELECT * FROM tblUsers WHERE Email = ? AND Role = ?",
    [email, role],
    async (err, user) => {
      if (err || !user) {
        return res.status(401).json({ error: "Invalid email" });
      }

      const match = await bcrypt.compare(password, user.Password);
      if (!match) {
        return res.status(401).json({ error: "Invalid password" });
      }

      res
        .status(200)
        .json({
          message: "Login successful",
          userId: user.UserID,
          role: user.Role,
        });
    }
  );
});

app.post("/api/courses", (req, res) => {
  const {
    instructorId,
    courseName,
    courseNumber,
    courseSection,
    courseTerm,
    startDate,
    endDate,
  } = req.body;

  const insertQuery = `INSERT INTO tblCourses 
    (CourseName, CourseNumber, CourseSection, CourseTerm, StartDate, EndDate, InstructorID)
    VALUES (?, ?, ?, ?, ?, ?, ?)`;

  db.run(
    insertQuery,
    [courseName, courseNumber, courseSection, courseTerm, startDate, endDate, instructorId],
    function (err) {
      if (err) {
        console.error(err.message);
        res.status(500).json({ error: "Failed to create course" });
      } else {
        res
          .status(201)
          .json({
            message: "Course created successfully",
            courseId: this.lastID,
          });
      }
    }
  );
});

app.put('/api/courses/:courseId', (req, res) => {
  const { courseId } = req.params;
  const {
    courseName,
    courseNumber,
    courseSection,
    courseTerm,
    startDate,
    endDate,
    instructorId,
  } = req.body;

  const updateQuery = `
    UPDATE tblCourses
    SET CourseName = ?, CourseNumber = ?, CourseSection = ?, CourseTerm = ?, StartDate = ?, EndDate = ?, InstructorID = ?
    WHERE CourseID = ?
  `;

  db.run(
    updateQuery,
    [courseName, courseNumber, courseSection, courseTerm, startDate, endDate, instructorId, courseId],
    function (err) {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ error: 'Failed to update course' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Course not found' });
      }

      res.status(200).json({ message: 'Course updated successfully' });
    }
  );
});

app.post("/api/enroll", (req, res) => {
  const { courseId, studentId } = req.body;

  const insertQuery = `INSERT INTO tblEnrollments (CourseID, UserID) VALUES (?, ?)`;

  db.run(insertQuery, [courseId, studentId], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ enrollmentId: this.lastID });
  });
});

app.get("/api/instructor/all", (req, res) => {
  const query = `
    SELECT UserID, FirstName, LastName, Email
    FROM tblUsers
    WHERE Role = 'instructor'
  `;

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: 'Failed to fetch instructors' });
    }
    res.json({ instructors: rows });
  });
});

app.post('/api/reviews', (req, res) => {
  const { courseId, title, description, isPublic, dueDate, questions } = req.body;

  const insertAssessmentQuery = `
    INSERT INTO tblAssessments (CourseID, StartDate, EndDate, Name, Status, Type)
    VALUES (?, datetime('now'), ?, ?, ?, ?)
  `;

  db.run(
    insertAssessmentQuery,
    [courseId, dueDate, title, isPublic ? 'Public' : 'Private', 'Review'],
    function (err) {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ error: 'Failed to save review' });
      }

      const assessmentId = this.lastID;

      const insertQuestionQuery = `
        INSERT INTO tblAssessmentQuestions (AssessmentID, QuestionType, Options, QuestionNarrative, HelperText)
        VALUES (?, ?, ?, ?, ?)
      `;

      const questionPromises = questions.map((question) => {
        return new Promise((resolve, reject) => {
          db.run(
            insertQuestionQuery,
            [assessmentId, question.questionType, null, question.questionText, null],
            function (err) {
              if (err) reject(err);
              else resolve();
            }
          );
        });
      });

      Promise.all(questionPromises)
        .then(() => {
          res.status(201).json({ success: true, message: 'Review saved successfully' });
        })
        .catch((err) => {
          console.error(err.message);
          res.status(500).json({ error: 'Failed to save questions' });
        });
    }
  );
});

app.get('/api/courses/:instructorId', (req, res) => {
  const { instructorId } = req.params;

  const query = `
    SELECT CourseID, CourseName, CourseNumber, CourseSection, CourseTerm, StartDate, EndDate, InstructorID
    FROM tblCourses
    WHERE InstructorID = ?
  `;

  db.all(query, [instructorId], (err, rows) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: 'Failed to fetch courses' });
    }
    res.json({ courses: rows });
  });
});

app.get('/api/course/:courseId', (req, res) => {
  const { courseId } = req.params;

  const query = `
    SELECT CourseID, CourseName, CourseNumber, CourseSection, CourseTerm, StartDate, EndDate, InstructorID
    FROM tblCourses
    WHERE CourseID = ?
  `;

  db.get(query, [courseId], (err, row) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: 'Failed to fetch course' });
    }
    if (!row) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.json(row);
  });
});

app.delete("/api/courses/:courseId", (req, res) => {
  const { courseId } = req.params;

  const deleteEnrollmentsQuery = `DELETE FROM tblEnrollments WHERE CourseID = ?`;
  const deleteCourseQuery = `DELETE FROM tblCourses WHERE CourseID = ?`;

  db.run(deleteEnrollmentsQuery, [courseId], function (err) {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: "Failed to delete enrollments for the course" });
    }

    db.run(deleteCourseQuery, [courseId], function (err) {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ error: "Failed to delete course" });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: "Course not found" });
      }

      res.status(200).json({ message: "Course deleted successfully" });
    });
  });
});

app.get('/api/reviews/:instructorId', (req, res) => {
  const { instructorId } = req.params;

  const query = `
    SELECT a.AssessmentID, a.Name AS ReviewName, a.EndDate, a.Status, a.Type, c.CourseName
    FROM tblAssessments a
    JOIN tblCourses c ON a.CourseID = c.CourseID
    WHERE c.InstructorID = ?
    ORDER BY a.EndDate DESC
  `;

  db.all(query, [instructorId], (err, rows) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: 'Failed to fetch reviews' });
    }
    res.json({ reviews: rows });
  });
});

app.get('/api/review/:reviewId', (req, res) => {
  const { reviewId } = req.params;

  const query = `
    SELECT a.AssessmentID, a.Name AS ReviewName, a.EndDate, a.Status, a.Type, a.CourseID, c.CourseName
    FROM tblAssessments a
    JOIN tblCourses c ON a.CourseID = c.CourseID
    WHERE a.AssessmentID = ?
  `;

  db.get(query, [reviewId], (err, row) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: 'Failed to fetch review' });
    }
    if (!row) {
      return res.status(404).json({ error: 'Review not found' });
    }
    res.json(row);
  });
});

app.put('/api/review/:reviewId', (req, res) => {
  const { reviewId } = req.params;
  const { title, dueDate, status } = req.body;

  const query = `
    UPDATE tblAssessments
    SET Name = ?, EndDate = ?, Status = ?
    WHERE AssessmentID = ?
  `;

  db.run(query, [title, dueDate, status, reviewId], function (err) {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: 'Failed to update review' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Review not found' });
    }

    res.status(200).json({ message: 'Review updated successfully' });
  });
});

app.delete('/api/review/:reviewId', (req, res) => {
  const { reviewId } = req.params;

  const query = `DELETE FROM tblAssessments WHERE AssessmentID = ?`;

  db.run(query, [reviewId], function (err) {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: 'Failed to delete review' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Review not found' });
    }

    res.status(200).json({ message: 'Review deleted successfully' });
  });
});

app.use("/api/student", require("./routes/student"));
app.use("/api/review", require("./routes/review"));
app.use('/api/instructor', require('./routes/instructor'));

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
