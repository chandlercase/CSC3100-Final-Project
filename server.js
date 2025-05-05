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
    section,
    term,
    startDate,
    endDate,
  } = req.body;

  const insertQuery = `INSERT INTO tblCourses 
    (CourseName, CourseNumber, CourseSection, CourseTerm, StartDate, EndDate, InstructorID)
    VALUES (?, ?, ?, ?, ?, ?, ?)`;

  db.run(
    insertQuery,
    [courseName, courseNumber, section, term, startDate, endDate, instructorId],
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

app.post("/api/enroll", (req, res) => {
  const { courseId, studentId } = req.body;

  const insertQuery = `INSERT INTO tblEnrollments (CourseID, UserID) VALUES (?, ?)`;

  db.run(insertQuery, [courseId, studentId], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ enrollmentId: this.lastID });
  });
});

app.get("/api/instructor/all", (req, res) => {
  db.all(
    "SELECT UserID, FirstName, LastName, Email FROM tblUsers WHERE Role = ?",
    ["instructor"],
    (err, rows) => {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ error: "Failed to fetch instructors" });
      }
      res.json({ instructors: rows });
    }
  );
});



app.use("/api/student", require("./routes/student"));
app.use("/api/review", require("./routes/review"));
app.use('/api/instructor', require('./routes/instructor'));






const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
