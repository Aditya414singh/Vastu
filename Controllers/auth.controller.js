import express from "express";
import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";
import cookie from 'cookie-parser';
// import dotenv from "dotenv";
// dotenv.config();

export const register = async (req, res) => {
    try {
      const { username, email, password } = req.body;
  
      
      const hashpassword = await bcrypt.hash(password, 10);

      const existingUserEmail = await prisma.user.findFirst({
        where: {
          email,
        },
      });
      
      if (existingUserEmail) {
        return res.status(400).send("Email is already registered");
      }

      const existingUserName = await prisma.user.findFirst({
        where: {
          username,
        },
      });
      
      if (existingUserName) {
        return res.status(400).error("Username is already registered");
      }
  
   
      const newUser = await prisma.user.create({
        data: {
          username,
          email,
          password: hashpassword,
        },
      });
  
   
      res.status(200).send("User registered successfully");
    } catch (e) {
      if (e.code === 'P2002') {
        // Unique constraint violation
        res.status(400).send(`Unique constraint failed on the ${e.meta.target} field`);
      } else {
        // Log and send generic error
        console.error(e);
        res.status(500).send("An error occurred while registering the user");
      }
    }
  };
  export const login = async (req, res) => {

    try{
    const { username, password } = req.body;
  
    const user = await prisma.user.findUnique({
      where: { username },
    });

    
  
    if (!user) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }
  
    // Compare the stored hashed password with the plaintext password
    const isPasswordValid = await bcrypt.compare(password, user.password);
  
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    const {password:userPassword,...userInfo}=user
    
    const age=1000*60*60*24*7;
    const token =jwt.sign({
        id:user.id,
    },process.env.JWT_SECRETE_KEY,
    {expiresIn:age}
  )

  console.log(token);
  
  res.cookie("token",token,{
    httpOnly:true,
    maxAge:age
  }).status(200).json(userInfo)
}
catch(e) {
  
    // Log and send generic error
    console.error(e);
    res.status(500).send("Invalid Credentials");
  
}
  
   
  };
export const logout =(req,res)=>{
  res.clearCookie("token").status(200).json({message:"logout successful"})
}
