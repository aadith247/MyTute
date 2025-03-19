
const  {jwt_pass} =process.env.jwt_pass
const jwt=require("jsonwebtoken")


 function teacherauth(req,res,next){

     const headers=req.headers["authorization"];
    const result=jwt.verify(headers,jwt_pass);

    if(result)
    {
        req.teacherId=result.id;

        next();
    }
    else {
        res.json({message : "User not signed in"});
    }

}

module.exports={teacherauth}