import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getComment, createcomment, deleteComment } from "../controllers/comment.controller.js";

const router = express.Router();

router.get("/post/:postId", getComment);

router.post("/post/:postId", protectRoute, createcomment);
router.delete("/:commentId", protectRoute, deleteComment);

export default router;