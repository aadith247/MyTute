const express = require('express');
const router=express.Router();
const {teacherauth} =require("../middlewares/teacherauth");
const {Teacher} =require("../db/index");
const {Course}=require("../db/index");

const zod=require("zod");
const nodemailer=require("nodemailer");
const ls=require("local-storage");
require('dotenv').config("../"); 
const {jwt_pass}=require("./secret");
const jwt=require("jsonwebtoken");
const nameSchema=zod.string();
const mailIdSchema=zod.string().email();

// const transporter = nodemailer.createTransport({
//     host: "smtp.ethereal.email",
//     port: 587,
//     secure: false, // true for port 465, false for other ports
//     auth: {
//       user: "kian.cummerata@ethereal.email",
//       pass: "D47eSQncyZywZjAYRy",
//     },
//   });
console.log(process.env.EMAIL_USER);
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,    
    },
});


router.post("/signup",async (req,res)=>{

    let firstName=req.body.firstName;
    let lastName=req.body.lastName;
    let Fullname=firstName+" "+lastName;

    const nameExc=nameSchema.safeParse(Fullname);
    if(!nameExc.success)
    {
        res.status(411).json({
            "msg": "Name is invalid"
        })
    }
    let {emailId,password,confirmPass}=req.body;

    const mail=mailIdSchema.safeParse(emailId);

    if(!mail.success)
    {
        res.status(411).json({
            "msg" : "Email is invalid"
        })
    }

    if(password!=confirmPass)
    {
        res.status(411).json({
            "msg" : "The passwords do not match"
        });
    }
    let found=await Teacher.findOne({emailId});
        console.log("awaiting completes");
        if(found)
        {
            res.status(400).send("This emailID is already registered, please sign in ");
        } 
  
   let otp=Math.floor(1000+Math.random()*9000).toString();
   
await transporter.sendMail({
    from: '"From Team myTute" <mytute05@gmail.com>',
    to: emailId,
    subject: "OTP Verification",
    text: `Your OTP is: ${otp}`,
});

   console.log("Email sent to : " +emailId);

      ls.set("otp", otp);
      ls.set("email",emailId);
      ls.set("pass", password);
      ls.set("name",Fullname);
      res.json({"msg" : "successfully sent the mail"});
    }
           
);


router.post("/verify-otp",async(req,res)=>{
      const userOtp=req.body.userOtp;

      let Fullname=ls.get("name");
      let emailId=ls.get("email");
      let password=ls.get("pass");
     
      if(userOtp==ls.get("otp"))
      {
        await Teacher.create({Fullname,emailId,password});
        ls.remove("otp");
        res.status(201).json({ msg: "Teacher created successfully" });
      } 
      else {
        res.status(411).send({
            "msg" : "OTP is wrong please check again"
         });

      }    

});


router.post("/signin",async (req,res)=>{
    let {emailId,password}=req.body;
    let response=await Teacher.findOne({emailId});
    if(!response)
    {
        res.status(411).send({
            "msg" : "Incorrect credentials....try again.."
        });
    }
    else 
    {
        
        const token=jwt.sign({id:response._id},jwt_pass);
        res.json({token});
    }
    
    ls.set("mail",emailId);

});


router.post("/course",teacherauth, async(req,res)=>{
    // let cname=req.body.courseName;
    // let title=req.body.title;

    let courseName=req.body.courseName;
    let courseTitle=req.body.courseTitle;
    
   console.log(courseName);
   console.log(courseTitle);

    try{
        await Course.create({
            courseName:courseName,
            courseTitle:courseTitle,
            teacherId:req.teacherId
        });
        res.json({message : "success"});

    }
    catch(e)
    {
        res.json({e});
    }
 });


router.post("/test",teacherauth,async (req,res)=> {

    
    /* {
        test:
        [{
            "question":"What is mongoDb?",
           "options": {
          "1":"Database",
           "2":"Company",
           "3": "Nothing",
           "4": "Don't know" },  
        "answer":"1"
        },
        {
            "question":"what is React"
        }
    ]
        
        
        
    } */

});

module.exports=router;