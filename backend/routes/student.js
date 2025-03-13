const express = require('express');
const router=express.Router();
const middleWare=require("../middlewares/studentauth");
const {Student} =require("../db/index");
const jwt=require("jsonwebtoken");
const {jwt_pass} =require("./secret.js") ;

const zod=require("zod");

const nameSchema=zod.string();
const mailSchema=zod.string().email();

router.post("/signup",async (req,res)=>{
    let firstName=req.body.firstName;
    let lastName=req.body.lastName;
    let fullName=firstName+" "+lastName;
    const nameExc=nameSchema.safeParse(fullName);
    if(!nameExc.success)
    {
        res.status(411).json({
            "msg": "Name is invalid"
        })
    }
    
    let {emailId,password,confirmPass}=req.body;
   const response=mailSchema.safeParse(emailId);
    if(!response.success)
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
    try{
        let found=await Student.findOne({fullName});
        if(found)
        {
            res.status(400).send("You are already registered, please sign in ");
        } 
            let newstudent=new Student({fullName,emailId,password});
            await newstudent.save();
            res.status(201).json({ msg: "student created successfully" });
    }catch(err)
    {
        res.status(500).send("Server error");
    }
});


router.post("/signin",async (req,res)=>{
    let {emailId,password}=req.body;
    let response=await Student.find({emailId,password});
    if(!response)
    {
        res.status(411).send({
            "msg" : "You are not registered..please register"
        });
    }
    else 
    {
       const token= jwt.sign({id:response._id},jwt_pass);
       res.json({token});
    }
});
module.exports=router;