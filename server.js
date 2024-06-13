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
      courseYear,
      courseId,
      fullName,
      nameWithInitials,
      NIC,
      MISNumber,
      mobile,
      address,
      gender,
      password, // Assuming you added password field to the table
      dateEntered,
      module1,
      module1Marks,
      module2,
      module2Marks,
      module3,
      module3Marks,
      dropout,
      finalExamSitted,
      repeatStudent,
    } = req.body;
  
    const sql = `INSERT INTO StudentDetailsTable 
      (CourseYear, CourseId, FullName, NameWithInitials, NIC, MISNumber, Mobile, Address, Gender, Password, DateEntered, Module1, Module1Marks, Module2, Module2Marks, Module3, Module3Marks, Dropout, FinalExamSitted, RepeatStudent)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  
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
        password,
        dateEntered,
        module1,
        module1Marks,
        module2,
        module2Marks,
        module3,
        module3Marks,
        dropout,
        finalExamSitted,
        repeatStudent,
      ],
      (err, result) => {
        if (err) {
          console.error("Error adding student: ", err);
          res.status(500).send("Error adding student");
          return;
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

// Get student details by ID
app.get('/students/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM StudentDetailsTable WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error fetching student details:', err);
      res.status(500).send('Error fetching student details');
      return;
    }
    res.json(result[0]);
  });
});

// Get modules list
app.get('/modules', (req, res) => {
  const sql = 'SELECT * FROM ModulesListTable';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching modules list:', err);
      res.status(500).send('Error fetching modules list');
      return;
    }
    res.json(results);
  });
});

// Get modules assigned to course
app.get('/modules/assigned', (req, res) => {
  const sql = 'SELECT * FROM ModulesAssignedTable';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching modules assigned to course:', err);
      res.status(500).send('Error fetching modules assigned to course');
      return;
    }
    res.json(results);
  });
});

// Update student details
app.put('/students/:id', (req, res) => {
  const { id } = req.params;
  const {
    courseYear,
    moduleId,
    module1,
    module1Marks,
    module2,
    module2Marks,
    module3,
    module3Marks,
    dropout,
    finalExamSitted,
    repeatStudent
  } = req.body;

  const sql = `UPDATE StudentDetailsTable 
               SET CourseYear = ?, ModuleId = ?, Module1 = ?, Module1Marks = ?, Module2 = ?, Module2Marks = ?, 
                   Module3 = ?, Module3Marks = ?, Dropout = ?, FinalExamSitted = ?, RepeatStudent = ?
               WHERE id = ?`;

  db.query(
    sql,
    [
      courseYear,
      moduleId,
      module1,
      module1Marks,
      module2,
      module2Marks,
      module3,
      module3Marks,
      dropout,
      finalExamSitted,
      repeatStudent,
      id
    ],
    (err, result) => {
      if (err) {
        console.error('Error updating student details:', err);
        res.status(500).send('Error updating student details');
        return;
      }
      res.status(200).json({ message: 'Student details updated successfully' });
    }
  );
});


// Add a course module
app.post('/course-modules', (req, res) => {
  const { moduleName, moduleCode, dateEntered } = req.body;

  const sql = `INSERT INTO CourseModule (ModuleName, ModuleCode, DateEntered) VALUES (?, ?, ?)`;

  db.query(sql, [moduleName, moduleCode, dateEntered], (err, result) => {
    if (err) {
      console.error('Error adding course module: ', err);
      res.status(500).send('Error adding course module');
      return;
    }

    console.log('Course module added successfully');
    res.status(200).json({ message: 'Course module added successfully' });
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
