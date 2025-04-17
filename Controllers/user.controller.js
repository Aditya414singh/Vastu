import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";
export const getUsers=async (req,res)=>{

    
    try{

        const users=await prisma.user.findMany();
        res.status(200).json(users);

    }
    catch(err){
        
        res.status(500).json({message: "failed to get users"});

    }
}
export const getUser=async (req,res)=>{
    // 
    const id=req.params.id;
console.log(id);
    try{
        const user=await prisma.user.findUnique({
            where:{id},
            include:{
               post:true,
               savedPosts:{
                include:{
                    post:true
                }
               }
            }
        });
        res.status(200).json(user);


    }
    catch(err){
        
        res.status(500).json({message: "failed to get user"});

    }
}
export const updateUser=async (req,res)=>{
     
    const id=req.params.id;
    const tokenUserId=req.userId;
    const {password, avatar,...input}=req.body;
    // 

    if(id !== tokenUserId){
        return res.status(403).json({message:"Not Authorized"});
    }

    let updatedPassword=null;
    try{


        if(password){
            updatedPassword= await bcrypt.hash(password,10);
        }
        const updatedUser=await prisma.user.update({
            where:{id},
            data:{
                ...input,
                ...(updatedPassword && {password:updatedPassword}),
                ...(avatar && {avatar}),
            }
        })

        const {password:userPassword,...rest}=updatedUser;

        res.status(200).json(rest);

    }
    catch(err){
        
        res.status(500).json({message: "failed to upadte user"});

    }
}
export const deleteUser=async (req,res)=>{
    const id=req.params.id;
    const tokenUserId=req.userId;
    const {password, avatar,...input}=req.body;
    // 

    if(id !== tokenUserId){
        return res.status(403).json({message:"Not Authorized"});
    }

    try{
        await prisma.user.delete({
            where:{id}
        })
        res.status(200).json({message:"user deleted"});

    }
    catch(err){
        
        res.status(500).json({message: "failed to delet user"});

    }
}
export const savePost=async(req,res)=>{
    const postId=req.body.postId;
    const tokenUserId=req.userId;
    

    try{
        const savedPost= await prisma.savedPost.findUnique({
            where:{
                userId_postId:{
                    userId:tokenUserId,
                    postId
                },
            }
        });

        

        if(savedPost){
            await prisma.savedPost.delete({
                where:{
                    id:savedPost.id,

                },
            
            })
            res.status(200).json({message:"post remved from saved list"})
        }
        else{
            await prisma.savedPost.create({
                data:{
                    userId:tokenUserId,
                    postId
                }
            })

            res.status(200).json({message:"post saved"})
        }
       
        
    }
    catch(err){
        
        res.status(500).json({message:"failed to delete Posts"})

    }
}
export const getNotificationNumber = async (req, res) => {
    const tokenUserId = req.userId;
    try {
      const number = await prisma.chat.count({
        where: {
          userIDs: {
            hasSome: [tokenUserId],
          },
          NOT: {
            seenBy: {
              hasSome: [tokenUserId],
            },
          },
        },
      });
      
      res.status(200).json(number);
    } catch (err) {
      
      res.status(500).json({ message: "Failed to get profile posts!" });
    }
  };