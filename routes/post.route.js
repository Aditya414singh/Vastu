import express from"express"
import { verifyToken } from "../Middlewares/verifyToken.js";
import { addPosts, deletePosts, updatePosts } from "../Controllers/post.controller.js";


    const { getPost, getPosts } = await import("../Controllers/post.controller.js");
    

const router=express.Router();

router.get("/",getPosts);
router.get("/:id",getPost);
router.post("/",verifyToken, addPosts);
router.put("/:id",verifyToken, updatePosts);
router.delete("/:id",verifyToken, deletePosts);

export default router;