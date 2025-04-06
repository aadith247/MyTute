const express = require('express');
const router = express.Router();
const studentauth = require("../middlewares/studentauth");
const { Student, Course, Test, TestSubmission } = require("../db/index");
const jwt = require("jsonwebtoken");
const { GoogleGenAI } =require("@google/genai") ;
require('dotenv').config("../");
const moment = require('moment-timezone');
const zod = require("zod");

const PDFDocument = require('pdfkit');

 
const nameSchema = zod.string();
const mailSchema = zod.string().email();


const ai = new GoogleGenAI({ apiKey: " AIzaSyCIOzoWD59mXqkcyD11xdp0cwBMedCO9SM" });

async function generateAnalysis(testData, submissionData) {
  const response = await ai.models.generateContent(
    {
    model: "gemini-2.0-flash",
    contents:` Analyze this test performance:
                Test Title: ${testData.title}
                Score: ${submissionData.score} out of ${testData.questions.length}
                Time Taken: ${moment(submissionData.submittedAt).diff(testData.startTime, 'minutes')} minutes
                Total Questions: ${testData.questions.length} 
    Please provide:
              1. Overall performance assessment
              2. Areas of strength
              3. Areas needing improvement
              4. Recommendations for future improvement
                
              Keep the analysis concise but informative.`
    
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

        // Fetch test, course, and submission details
        const test = await Test.findOne({ _id: testId, courseId: courseId });
        if (!test) {
            return res.status(404).json({ message: "Test not found" });
        }

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        const submission = await TestSubmission.findOne({ 
            testId: testId,
            studentId: studentId
        });
        if (!submission) {
            return res.status(404).json({ message: "No submission found for this test" });
        }

        const student = await Student.findById(studentId);

        // Generate AI analysis
        const aiAnalysis = await generateAnalysis(test, submission);

        // Create PDF
        const doc = new PDFDocument();
        const chunks = [];

        // Collect PDF data chunks
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

        // Add content to PDF
        doc.fontSize(20).text('Test Performance Report', { align: 'center' });
        doc.moveDown();

        doc.fontSize(14).text('Student info');
        doc.fontSize(12)
           
           .text(`Email: ${student.emailId}`)
           .moveDown();

        doc.fontSize(14).text('Course info');
        doc.fontSize(12)
           .text(`Course: ${course.courseName}`)
           .text(`Course Description: ${course.courseTitle}`)
           .moveDown();

        doc.fontSize(14).text('Test Information');
        doc.fontSize(12)
           .text(`Test Title: ${test.title}`)
           .text(`Date: ${moment(test.startTime).tz('Asia/Kolkata').format('DD-MM-YYYY hh:mm A')}`)
           .text(`Duration: ${test.duration} minutes`)
           .text(`Total Questions: ${test.questions.length}`)
           .text(`Score: ${submission.score} out of ${test.questions.length}`)
           .text(`Percentage: ${((submission.score / test.questions.length) * 100).toFixed(2)}%`)
           .moveDown();

        doc.fontSize(14).text('AI Analysis');
        doc.fontSize(12).text(aiAnalysis);
        
        // Question-wise analysis
        doc.addPage();
        doc.fontSize(14).text('Question-wise Analysis');
        doc.moveDown();

        test.questions.forEach((question, index) => {
            const userAnswer = submission.answers.find(a => a.questionIndex === index);
            const isCorrect = userAnswer && userAnswer.selectedOption === question.answer;

            doc.fontSize(12)
               .text(`Question ${index + 1}: ${question.question}`)
               .text(`Your Answer: Option ${userAnswer ? userAnswer.selectedOption : 'Not answered'}`)
               .text(`Correct Answer: Option ${question.answer}`)
               .text(`Result: ${isCorrect ? '✓ Correct' : '✗ Incorrect'}`)
               .moveDown();
        });

        // Finalize PDF
        doc.end();

    } catch (error) {
        console.error('Error generating report:', error);
        res.status(500).json({
            message: "Error generating test report",
            error: error.message
        });
    }
});


module.exports = router;