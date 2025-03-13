
const express=require("express");



const teacherRouter=require("./routes/teacher.js");
const  studentRouter=require("./routes/student");

const port=3000;
const app=express();
app.use(express.json());
app.use("/teacher",teacherRouter);
app.use("/student",studentRouter);

app.listen(port);






