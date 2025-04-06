const express = require('express');
const router = express.Router();
const studentauth = require("../middlewares/studentauth");
const { Student, Course, Test, TestSubmission } = require("../db/index");
const jwt = require("jsonwebtoken");
const { GoogleGenAI } =require("@google/genai") ;
require('dotenv').config("../");
const moment = require('moment-timezone');
const zod = require("zod");

const nodemailer = require("nodemailer");
const ls = require("local-storage");
const PDFDocument = require('pdfkit');

 
const nameSchema = zod.string();
const mailSchema = zod.string().email();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const ai = new GoogleGenAI({ apiKey: " AIzaSyCIOzoWD59mXqkcyD11xdp0cwBMedCO9SM" });

async function generateAnalysis(testData, submissionData) {
  const response = await ai.models.generateContent(
    {
    model: "gemini-2.0-flash",
    contents:` Analyze this test performance:
                Test Title: ${testData.title}
                Score: ${submissionData.score} out of ${testData.questions.length}
                Total Questions: ${testData.questions.length} 
    Please provide:
              1. Overall performance assessment
              2. Areas of strength
              3. Areas needing improvement
              4. Recommendations for future improvement
              Keep the analysis concise but informative.
             and give me question wise analysis of the student from this raw data: 
              the questions and correct answer are ${testData}
              and the student attempted : ${submissionData}
              don't give me any table for question wise analysis..give me a structured text only
              please keep question wise analysis as short as possible...don't elongate too much

              
              `
    
  }
  );
  return response.text;
}
// catch (error) {
//     console.error('Error generating AI analysis:', error);
//     return "AI analysis currently unavailable. Please check your performance statistics above.";
// }



// async function generateAnalysis(testData, submissionData) {
//     try {
//         const prompt = `Analyze this test performance:
//             Test Title: ${testData.title}
//             Score: ${submissionData.score} out of ${testData.questions.length}
//             Time Taken: ${moment(submissionData.submittedAt).diff(testData.startTime, 'minutes')} minutes
//             Total Questions: ${testData.questions.length}
            
//             Please provide:
//             1. Overall performance assessment
//             2. Areas of strength
//             3. Areas needing improvement
//             4. Recommendations for future improvement
            
//             Keep the analysis concise but informative.`;

//         const completion = await openai.chat.completions.create({
//             messages: [{ role: "user", content: prompt }],
//             model: "gpt-3.5-turbo",
//         });

      //  AIzaSyCIOzoWD59mXqkcyD11xdp0cwBMedCO9SM
// x
//         return completion.choices[0].message.content;
//     }  
// }


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
 
        let found = await Student.findOne({ emailId });
        if (found) {
            return res.status(400).send("You are already registered, please sign in");
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
    ls.set("name", fullName);
    res.json({ "msg": "successfully sent the mail" });

    } 
);


router.post("/verify-otp", async (req, res) => {
    const userOtp = req.body.userOtp;
    let Fullname = ls.get("name");
    let emailId = ls.get("email");
    let password = ls.get("pass");

    if (userOtp == ls.get("otp")) {
        await Student.create({ Fullname, emailId, password });
        ls.remove("otp");
        res.status(201).json({ msg: "Student created successfully" });
    } else {
        res.status(411).send({
            "msg": "OTP is wrong please check again"
        });
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

    const token = jwt.sign({ id: response._id }, process.env.jwt_pass);
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


router.get("/course/:courseId/tests", studentauth, async (req, res) => {
    try {
        const { courseId } = req.params;

        const course = await Course.findOne({
            _id: courseId,
            students: req.studentId
        });

        if (!course) {
            return res.status(404).json({ error: "Course not found or not enrolled" });
        }

       
       
        const tests = await Test.find({
            courseId,
           
        });

       
        const testsWithStatus = await Promise.all(tests.map(async (test) => {
            const submission = await TestSubmission.findOne({
                testId: test._id,
                studentId: req.studentId
            });
            return {
                ...test.toObject(),
                submitted: !!submission,
                score: submission?.score
            };
        }));

        res.json(testsWithStatus);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch tests" });
    }
});


router.get("/test/:testId", studentauth, async (req, res) => {
    try {
        const { testId } = req.params;
        const test = await Test.findById(testId);

        if (!test) {
            return res.status(404).json({ error: "Test not found" });
        }

        // Verify student is enrolled in the course
        const course = await Course.findOne({
            _id: test.courseId,
            students: req.studentId
        });

        if (!course) {
            return res.status(403).json({ error: "Not enrolled in this course" });
        }

      
        let now = new Date();
           now = now.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
        if (test.startTime > now) {
            return res.status(403).json({ error: "Test has not started yet" });
        }

        const testEndTime = new Date(test.startTime.getTime() + test.duration * 60000);
        if (now > testEndTime) {
            return res.status(403).json({ error: "Test has expired" });
        }
        const existingSubmission = await TestSubmission.findOne({
            testId,
            studentId: req.studentId
        });

        if (existingSubmission) {
            return res.status(403).json({ error: "Test already submitted" });
        }

        const testData = test.toObject();
        testData.questions = testData.questions.map(q => ({
            question: q.question,
            options: q.options
        }));

        res.json(testData);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch test" });
    }
});


router.post("/test/:testId/submit", studentauth, async (req, res) => {
    try {
        const { testId } = req.params;
        const { answers } = req.body;

        const test = await Test.findById(testId);
        if (!test) {
            return res.status(404).json({ error: "Test not found" });
        }
        const course = await Course.findOne({
            _id: test.courseId,
            students: req.studentId
        });

        if (!course) {
            return res.status(403).json({ error: "Not enrolled in this course" });
        }

        const existingSubmission = await TestSubmission.findOne({
            testId,
            studentId: req.studentId
        });

        if (existingSubmission) {
            return res.status(403).json({ error: "Test already submitted" });
        }


        let score = 0;
        answers.forEach((answer, index) => {
            if (test.questions[index] && answer.selectedAnswer === test.questions[index].correctAnswer) {
                score++;
            }
        });


        const submission = await TestSubmission.create({
            testId,
            studentId: req.studentId,
            answers,
            score,
            submittedAt: new Date()
        });

        res.json({
            message: "Test submitted successfully",
            score,
            totalQuestions: test.questions.length
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to submit test" });
    }
});


router.get("/course/:courseId/:testId", studentauth, async (req, res) => {
    try {
        const { courseId, testId } = req.params;
        const studentId = req.studentId;

        const test = await Test.findOne({ _id: testId, courseId: courseId }).populate('questions');
        if (!test) return res.status(404).json({ message: "Test not found" });

        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ message: "Course not found" });

        const submission = await TestSubmission.findOne({ testId: testId, studentId: studentId });
        if (!submission) return res.status(404).json({ message: "No submission found for this test" });

        const student = await Student.findById(studentId);

        const aiAnalysis = await generateAnalysis(test, submission);

        const PDFDocument = require('pdfkit');
        const moment = require('moment-timezone');

        const doc = new PDFDocument({ margin: 50 });
        const chunks = [];

        doc.on('data', chunk => chunks.push(chunk));
        doc.on('end', () => {
            const pdfBuffer = Buffer.concat(chunks);
            const pdfBase64 = pdfBuffer.toString('base64');
            res.json({
                pdfData: pdfBase64,
                testInfo: {
                    title: test.title,
                    score: submission.score,
                    totalQuestions: test.questions.length,
                    percentage: ((submission.score / test.questions.length) * 100).toFixed(2)
                }
            });
        });

        const headingFont = { size: 20 };
        const subheadingFont = { size: 14 };
        const bodyFont = { size: 12 };
        const listItemIndent = 20;
        const pageWidth = doc.page.width - 2 * doc.options.margin;
        const BOTTOM_MARGIN = doc.page.height - doc.options.margin;
        const LINE_HEIGHT_FACTOR = 1.3;

        // Header
        doc.font("Helvetica-Bold").fontSize(headingFont.size).text('Test Performance Report', { align: 'center' });
        doc.moveDown();

        // Student Info
        doc.font("Helvetica-Bold").fontSize(subheadingFont.size).text('Student Information', { underline: true });
        doc.font("Times-Roman").fontSize(bodyFont.size).text(`Email: ${student.emailId}`).moveDown();

        // Course Info
        doc.font("Helvetica-Bold").fontSize(subheadingFont.size).text('Course Information', { underline: true });
        doc.font("Times-Roman").fontSize(bodyFont.size)
            .text(`Course: ${course.courseName}`)
            .text(`Course Description: ${course.courseTitle}`, {
                width: pageWidth,
                lineGap: bodyFont.size * (LINE_HEIGHT_FACTOR - 1)
            })
            .moveDown();

        // Test Info
        doc.font("Helvetica-Bold").fontSize(subheadingFont.size).text('Test Details', { underline: true });
        doc.font("Times-Roman").fontSize(bodyFont.size)
            .text(`Test Title: ${test.title}`)
            .text(`Date: ${moment(test.startTime).tz('Asia/Kolkata').format('DD-MM-YYYY hh:mm A')}`)
            .text(`Duration: ${test.duration} minutes`)
            .text(`Total Questions: ${test.questions.length}`)
            .text(`Score: ${submission.score} out of ${test.questions.length}`)
            .text(`Percentage: ${((submission.score / test.questions.length) * 100).toFixed(2)}%`)
            .moveDown();

        // AI Analysis
        doc.font("Helvetica-Bold").fontSize(subheadingFont.size).text('AI Analysis', { underline: true });
        doc.moveDown(0.5);

        const analysisLines = aiAnalysis.split('\n');
        analysisLines.forEach(line => {
            if (doc.y > BOTTOM_MARGIN) doc.addPage();

            const cleanText = line
                .replace(/^#+\s*/, '')              // Markdown header cleanup
                .replace(/^\*\s*/, '')              // Bullet cleanup
                .replace(/\*\*(.*?)\*\*/g, '$1')    // Bold
                .replace(/_(.*?)_/g, '$1')          // Italics
                .trim();

            if (line.startsWith("##")) {
                doc.font("Helvetica-Bold").fontSize(16).text(cleanText, { lineGap: 4 });
            } else if (line.startsWith("#")) {
                doc.font("Helvetica-Bold").fontSize(18).text(cleanText, { lineGap: 6 });
            } else if (line.startsWith("* ")) {
                doc.font("Times-Roman").fontSize(12).text("• " + cleanText, { indent: 20 });
            } else {
                doc.font("Times-Roman").fontSize(12).text(cleanText);
            }

            doc.moveDown(LINE_HEIGHT_FACTOR);
        });

        doc.addPage();
        doc.end();

    } catch (error) {
        console.error('Error generating report:', error);
        res.status(500).json({
            message: "Error generating test report",
            error: error.message
        });
    }
});







// Add these routes to the existing file, before the module.exports line

router.get("/profile", studentauth, async (req, res) => {
    try {
      const student = await Student.findById(req.studentId);
      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }
      res.json(student);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch profile" });
    }
  });
  
  router.put("/settings", studentauth, async (req, res) => {
    try {
      const { firstName, lastName, currentPassword, newPassword } = req.body;
      
      const student = await Student.findById(req.studentId);
      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }
  
      // Verify current password
      if (currentPassword && currentPassword !== student.password) {
        return res.status(401).json({ error: "Current password is incorrect" });
      }
  
      // Update fields
      if (firstName || lastName) {
        student.Fullname = `${firstName} ${lastName}`.trim();
      }
      if (newPassword) {
        student.password = newPassword;
      }
  
      await student.save();
      res.json({ message: "Settings updated successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to update settings" });
    }
  });


module.exports = router;