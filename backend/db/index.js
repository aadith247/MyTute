const mongoose = require("mongoose");
require('dotenv').config("../");
mongoose.connect(process.env.MONGODB_URL)
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch(err => {
        console.error("MongoDB connection error:", err);
    });

const teacherSchema = new mongoose.Schema({
    Fullname: String,
    emailId: String,
    password: String,
});

const Teacher = mongoose.model("Teachers", teacherSchema);

const studentSchema = new mongoose.Schema({
    Fullname: String,
    emailId: String,
    password: String
});

const Student = mongoose.model("Students", studentSchema);

const courseSchema = new mongoose.Schema({
    courseName: String,
    courseTitle: String,
    courseCode: {
        type: String,
        unique: true,
        required: true
    },
    teacherId: { type: mongoose.Types.ObjectId, ref: "Teachers" },
    students: [{ type: mongoose.Types.ObjectId, ref: "Students" }]
});

const Course = mongoose.model("Courses", courseSchema);

const testSchema = new mongoose.Schema({
    courseId: { type: mongoose.Types.ObjectId, ref: "Courses", required: true },
    title: { type: String, required: true },
    description: String,
    duration: { type: Number, required: true }, // in minutes
    startTime: { type: Date, required: true },
    questions: [{
        question: String,
        options: {
            "1": String,
            "2": String,
            "3": String,
            "4": String
        },
        correctAnswer: String
    }]
});

const Test = mongoose.model("Tests", testSchema);

const testSubmissionSchema = new mongoose.Schema({
    testId: { type: mongoose.Types.ObjectId, ref: "Tests", required: true },
    studentId: { type: mongoose.Types.ObjectId, ref: "Students", required: true },
    answers: [{
        questionIndex: Number,
        selectedAnswer: String
    }],
    score: { type: Number, default: 0 },
    submittedAt: { type: Date, default: Date.now }
});

const TestSubmission = mongoose.model("TestSubmissions", testSubmissionSchema);

module.exports = { Course, Student, Teacher, Test, TestSubmission };