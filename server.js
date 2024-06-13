// Import dependencies
const express = require('express');
const cors = require('cors');
const mysql = require("mysql2");
const bodyParser = require("body-parser");

// Create an Express app
const app = express();

// CORS configuration
const corsOptions = {
    origin: 'http://localhost:4200', // Adjust this to match your frontend URL
    methods: 'GET,POST,PUT,DELETE',
    credentials: true,
    optionsSuccessStatus: 200
};

// Enable CORS for all routes with specific options
app.use(cors(corsOptions));

const PORT = process.env.PORT || 3000;

// Connect to MySQL Database
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "20010922Insta",
  database: "sys",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL database: ", err);
    return;
  }
  console.log("Connected to MySQL database");
});

// Middleware
app.use(bodyParser.json());

// Define API Endpoints
app.get("/", (req, res) => {
  res.send("Welcome to the IITC backend!");
});

// Register student
app.post("/students", (req, res) => {
    const {
      courseYear = null,
      courseId = null,
      fullName,
      nameWithInitials,
      NIC,
      MISNumber,
      mobile,
      address,
      gender,
      password, // Assuming you added password field to the table
      dateEntered,
      module1 = null,
      module1Marks = null,
      module2 = null,
      module2Marks = null,
      module3 = null,
      module3Marks = null,
      dropout = null,
      finalExamSitted = null,
      repeatStudent = null,
    } = req.body;
  
    const sql = `
      INSERT INTO StudentDetailsTable 
      (CourseYear, CourseId, FullName, NameWithInitials, NIC, MISNumber, Mobile, Address, Gender, Password, DateEntered, Module1, Module1Marks, Module2, Module2Marks, Module3, Module3Marks, Dropout, FinalExamSitted, RepeatStudent)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
  
    db.query(
      sql,
      [
        courseYear,
        courseId,
        fullName,
        nameWithInitials,
        NIC,
        MISNumber,
        mobile,
        address,
        gender,
        null, // Assuming Password is null or not provided in the request body
        dateEntered,
        module1,
        module1Marks,
        module2,
        module2Marks,
        module3,
        module3Marks,
        dropout,
        finalExamSitted,
        repeatStudent
      ],
      (err, result) => {
        if (err) {
          console.error("Error adding student: ", err);
          return res.status(500).json({ message: "Error adding student", error: err.sqlMessage });
        }
  
        console.log("Student added successfully");
        res.status(200).json({ message: "Student added successfully" });
      }
    );
  });
  
  

// Retrieve all student data
app.get("/students", (req, res) => {
  console.log("Received GET request to /students");
  const sql = `SELECT * FROM StudentDetailsTable`;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching students: ", err);
      res.status(500).send("Error fetching students");
      return;
    }

    res.status(200).json(results);
  });
});

// Add a course module
app.post("/course-modules", (req, res) => {
    const { moduleName, moduleCode, dateEntered } = req.body;

    const sql = `INSERT INTO CourseModule (ModuleName, ModuleCode, DateEntered)
                 VALUES (?, ?, ?)`;

    db.query(sql, [moduleName, moduleCode, dateEntered], (err, result) => {
      if (err) {
        console.error("Error adding course module: ", err);
        res.status(500).send("Error adding course module");
        return;
      }

      console.log("Course module added successfully");
      res.status(200).json({ message: "Course module added successfully" });
    });
});


// Add a new course
app.post("/courses", (req, res) => {
  console.log("Received a POST request to /courses");
  const { courseName, courseType, duration, medium, courseLevel, moduleCode, active, dateEntered, user } = req.body;

  const sql = `INSERT INTO CourseDetailsTable (CourseName, CourseType, Duration, Medium, CourseLevel, ModuleCode, Active, DateEntered, User)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(
    sql,
    [courseName, courseType, duration, medium, courseLevel, moduleCode, active, dateEntered, user],
    (err, result) => {
      if (err) {
        console.error("Error adding course: ", err);
        res.status(500).send("Error adding course");
        return;
      }

      console.log("Course added successfully");
      res.status(200).json({ message: "Course added successfully" });
    }
  );
});

// Retrieve all course details
app.get("/courses", (req, res) => {
    console.log("Received GET request to /courses");
  
    const sql = `
      SELECT 
        cd.CD_ID, 
        cd.CourseName, 
        cd.CourseType, 
        cd.Duration, 
        cd.Medium, 
        cd.CourseLevel, 
        cd.ModuleCode, 
        cd.Active, 
        cd.DateEntered, 
        cd.User,
        GROUP_CONCAT(cm.ModuleName ORDER BY cm.ModuleName SEPARATOR ', ') AS ModuleNames
      FROM 
        CourseDetailsTable cd
      LEFT JOIN 
        CourseModule cm
      ON 
        cd.ModuleCode = cm.ModuleCode
      GROUP BY 
        cd.CD_ID, 
        cd.CourseName, 
        cd.CourseType, 
        cd.Duration, 
        cd.Medium, 
        cd.CourseLevel, 
        cd.ModuleCode, 
        cd.Active, 
        cd.DateEntered, 
        cd.User
    `;
  
    db.query(sql, (err, results) => {
      if (err) {
        console.error("Error fetching courses: ", err);
        res.status(500).send("Error fetching courses");
        return;
      }
  
      res.status(200).json(results);
    });
  });

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
