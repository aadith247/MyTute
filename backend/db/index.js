const mongoose=require("mongoose");

mongoose.connect("mongodb+srv://Aadithhya:Venkat%40123@cluster0.7lvh3qz.mongodb.net/myTute")
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch(err => {
        console.error("MongoDB coihnnection error:", err);
    });

const teacherSchema = new mongoose.Schema({
    Fullname: String,
    emailId: String,
    password: String,
    
});

const Teacher = mongoose.model("Teachers",teacherSchema );

const studentSchema = new mongoose.Schema({
    Fullname: String,
    emailId: String,
    password: String
});

const courseSchema=new mongoose.Schema({
    courseName: String,
    courseTitle : String,
    teacherId : {type:mongoose.Types.ObjectId,ref:"Teachers"}
});

const Course=mongoose.model("Courses",courseSchema);
const Student = mongoose.model("Students", studentSchema);
// Mongoose creates a table named "plurals" of what we enter here like "course"... it is the singular form of collection name to be created...

const testSchema=new mongoose.Schema({
    question:String,
    options:
    {
        "1":String,
        "2":String,
        "3":String,
        "4":String

    }
    , 
    answer:String
})

module.exports={Course,Student,Teacher};