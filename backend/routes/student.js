const express = require('express');
const router = express.Router();
const studentauth = require("../middlewares/studentauth");
const { Student, Course } = require("../db/index");
const jwt = require("jsonwebtoken");
const { jwt_pass } = require("./secret.js");

const zod = require("zod");

const nameSchema = zod.string();
const mailSchema = zod.string().email();

router.post("/signup", async (req, res) => {
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let fullName = firstName + " " + lastName;
    const nameExc = nameSchema.safeParse(fullName);
    if (!nameExc.success) {
        return res.status(411).json({
            "msg": "Name is invalid"
        });
    }

    let { emailId, password, confirmPass } = req.body;
    const response = mailSchema.safeParse(emailId);
    if (!response.success) {
        return res.status(411).json({
            "msg": "Email is invalid"
        });
    }
    if (password != confirmPass) {
        return res.status(411).json({
            "msg": "The passwords do not match"
        });
    }
    try {
        let found = await Student.findOne({ emailId });
        if (found) {
            return res.status(400).send("You are already registered, please sign in");
        }
        let newstudent = new Student({ fullName, emailId, password });
        await newstudent.save();
        res.status(201).json({ msg: "student created successfully" });
    } catch (err) {
        res.status(500).send("Server error");
    }
});

router.post("/signin", async (req, res) => {
    let { emailId, password } = req.body;
    let response = await Student.findOne({ emailId, password });
    if (!response) {
        return res.status(411).send({
            "msg": "You are not registered..please register"
        });
    }

    const token = jwt.sign({ id: response._id }, jwt_pass);
    res.json({ token });
});

// New route for course enrollment
router.post("/enroll", studentauth, async (req, res) => {
    const { courseCode } = req.body;

    try {
        const course = await Course.findOne({ courseCode });
        
        if (!course) {
            return res.status(404).json({ error: "Invalid course code" });
        }

        // Check if student is already enrolled
        if (course.students.includes(req.studentId)) {
            return res.status(400).json({ error: "Already enrolled in this course" });
        }

        // Add student to course
        course.students.push(req.studentId);
        await course.save();

        res.json({ message: "Successfully enrolled in course" });
    } catch (error) {
        res.status(500).json({ error: "Failed to enroll in course" });
    }
});

// Get enrolled courses
router.get("/courses", studentauth, async (req, res) => {
    try {
        const courses = await Course.find({
            students: req.studentId
        }).populate('teacherId', 'Fullname');

        res.json(courses);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch courses" });
    }
});

module.exports = router;