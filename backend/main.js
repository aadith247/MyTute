
const express=require("express");
const cors=require("cors");
const app=express();
app.use(cors());
const teacherRouter=require("./routes/teacher.js");
const  studentRouter=require("./routes/student");

const port=3000;

const authRoutes = require("./routes/auth.js");
app.use("/auth", authRoutes);



app.use(express.json());
app.use("/teacher",teacherRouter);
app.use("/student",studentRouter);

app.listen(port);






