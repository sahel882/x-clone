import express from "express";
import { followUser, getCurrentUser, getUserProfile, syncUser, updateProfile } from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/profile/username", getUserProfile);

router.post("/sync".protectRoute, syncUser);

router.put("/profile", protectRoute, updateProfile);

router.post("/me", protectRoute, getCurrentUser);

router.post("/follow/:tragetUserId", protectRoute, followUser);

export default router;