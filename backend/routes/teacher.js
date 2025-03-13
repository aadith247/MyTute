const express = require('express');
const router = express.Router();
const { teacherauth } = require("../middlewares/teacherauth");
const { Teacher, Course } = require("../db/index");

const zod = require("zod");
const nodemailer = require("nodemailer");
const ls = require("local-storage");
require('dotenv').config("../");
const { jwt_pass } = require("./secret");
const jwt = require("jsonwebtoken");
const nameSchema = zod.string();
const mailIdSchema = zod.string().email();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

router.post("/signup", async (req, res) => {
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let Fullname = firstName + " " + lastName;

    const nameExc = nameSchema.safeParse(Fullname);
    if (!nameExc.success) {
        return res.status(411).json({
            "msg": "Name is invalid"
        });
    }
    let { emailId, password, confirmPass } = req.body;

    const mail = mailIdSchema.safeParse(emailId);
    if (!mail.success) {
        return res.status(411).json({
            "msg": "Email is invalid"
        });
    }

    if (password != confirmPass) {
        return res.status(411).json({
            "msg": "The passwords do not match"
        });
    }

    let found = await Teacher.findOne({ emailId });
    if (found) {
        return res.status(400).send("This emailID is already registered, please sign in");
    }

    let otp = Math.floor(1000 + Math.random() * 9000).toString();

    await transporter.sendMail({
        from: '"From Team myTute" <mytute05@gmail.com>',
        to: emailId,
        subject: "OTP Verification",
        text: `Your OTP is: ${otp}`,
    });

    ls.set("otp", otp);
    ls.set("email", emailId);
    ls.set("pass", password);
    ls.set("name", Fullname);
    res.json({ "msg": "successfully sent the mail" });
});

router.post("/verify-otp", async (req, res) => {
    const userOtp = req.body.userOtp;

    let Fullname = ls.get("name");
    let emailId = ls.get("email");
    let password = ls.get("pass");

    if (userOtp == ls.get("otp")) {
        await Teacher.create({ Fullname, emailId, password });
        ls.remove("otp");
        res.status(201).json({ msg: "Teacher created successfully" });
    } else {
        res.status(411).send({
            "msg": "OTP is wrong please check again"
        });
    }
});

router.post("/signin", async (req, res) => {
    let { emailId, password } = req.body;
    let response = await Teacher.findOne({ emailId, password });
    if (!response) {
        return res.status(411).send({
            "msg": "Incorrect credentials....try again.."
        });
    }

    const token = jwt.sign({ id: response._id }, jwt_pass);
    res.json({ token });
});


function generateCourseCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
}

router.post("/course", teacherauth, async (req, res) => {
    const { courseName, courseTitle } = req.body;

    try {
        // Generate a unique course code
        let courseCode;
        let isUnique = false;
        while (!isUnique) {
            courseCode = generateCourseCode();
            const existingCourse = await Course.findOne({ courseCode });
            if (!existingCourse) {
                isUnique = true;
            }
        }

        const course = await Course.create({
            courseName,
            courseTitle,
            courseCode,
            teacherId: req.teacherId,
            students: []
        });

        res.json({
            message: "success",
            courseCode: course.courseCode
        });
    } catch (e) {
        res.status(500).json({ error: "Failed to create course" });
    }
});

router.post("/test", teacherauth, async (req, res) => {
    const { courseId, title, questions } = req.body;

    try {
        const course = await Course.findOne({
            _id: courseId,
            teacherId: req.teacherId
        });

        if (!course) {
            return res.status(404).json({ error: "Course not found" });
        }

        const test = await Test.create({
            courseId,
            title,
            questions
        });

        res.json({ message: "Test created successfully", testId: test._id });
    } catch (error) {
        res.status(500).json({ error: "Failed to create test" });
    }
});

module.exports = router;