const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://Aadithhya:Venkat%40123@cluster0.7lvh3qz.mongodb.net/myTute")
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
    courseId: { type: mongoose.Types.ObjectId, ref: "Courses" },
    title: String,
    questions: [{
        question: String,
        options: {
            "1": String,
            "2": String,
            "3": String,
            "4": String
        },
        answer: String
    }]
});

const Test = mongoose.model("Tests", testSchema);

module.exports = { Course, Student, Teacher, Test };