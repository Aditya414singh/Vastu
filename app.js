import express from "express";
import authRouter from "./routes/auth.route.js";
import cors from "cors";
import userRouter from "./routes/user.route.js"
import postRouter from "./routes/post.route.js"
import chatRouter from "./routes/chat.route.js"
import messageRouter from "./routes/message.route.js"

import cookieParser from 'cookie-parser';
import dotenv from "dotenv";
dotenv.config();

const app=express();
app.use(cookieParser());
app.use(express.json());
app.use(cors({origin:process.env.CLIENT_URL,credentials:true}));





app.use("/api/auth",authRouter)
app.use("/api/users",userRouter)
app.use("/api/posts",postRouter)
app.use("/api/chats",chatRouter)
app.use("/api/messages",messageRouter)




app.listen(3000,()=>{
    console.log("hii");
    
})