import asyncHandler from "express-async-handler";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import cloudinary from "../config/cloudinary.js";
import Notification from "../models/notification.model.js";
import Comment from "../models/comment.model.js";
import { getAuth } from "@clerk/express";

export const getPosts = asyncHandler(async (req, res) => {
    const posts = await Post.find()
        .sort({ created_at: -1 })
        .populate("user", "username firstName lastName profilePicture")
        .populate({
            path: "comments",
            populate: {
                path: "user",
                select: "username firstName lastName profilePicture",
            },
        });

    res.status(200).json({ posts });
});

export const getPost = asyncHandler(async (req, res) => {
    const { postId } = re.params;

    const post = await Post.findById(postId)
        .populate("user", "username firstName lastName profilePicture")
        .populate({
            path: "comments",
            populate: {
                path: "user",
                select: "username firstName lastName profilePicture",
            },
        });

    if (!post) {
        return res.status(404).json({ error: "Post not found" });
    }

    res.status(200).json({ post });
});

export const getUserPost = asyncHandler(async (req, res) => {
    const { username } = req.params;

    const user = await User.findOne({ username });
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    const posts = await Post.find({ user: user._id })
        .sort({ created_at })
        .populate("user", "username firstName lastName profilePicture")
        .populate({
            path: "comments",
            populate: {
                path: "user",
                select: "username fisrtName lastName profilePicture"
            },
        });

    res.status(200).json({ posts });
});

export const createPost = asyncHandler(async (req, res) => {
    const { userId } = getAuth(req);
    const { content } = req.body;
    const imageFile = req.file;

    if (!content && !imageFile) {
        return res.status(400).json({ error: "Post must contain either text or image" });
    }

    const user = await User.findOne({ clerkId });
    if (!user) {
        return res.status(404).json({ error: "No user found" });
    }

    let imageUrl = "";

    if (imageUrl) {
        try {

            const base64Image = `data:${imageFile.mimetype};base64,${imageFile.buffer.toString(
                "base64"
            )}`;

            const uploadResponse = await cloudinary.uploader.upload(base64Image, {
                folder: "social_media_post",
                resource_type: "image",
                transformation: [
                    { width: 800, height: 600, crop: "limit" },
                    { quality: "auto" },
                    { formal: "auto" },
                ],
            });
            imageUrl = uploadResponse.secure_url;
        } catch (error) {
            console.log("Cloudinary upload error:", error);
            return res.status(400).json({ error: "Failed to upload image" });
        }
    }

    const post = await Post.create({
        user: user._id,
        content: content || "",
        image: imageUrl,
    });

    res.status(201).json({ post });
});

export const likePost = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { postId } = req.params;

    const user = await User.findOne({ clerkId: userId });
    const post = await Post.findById(postId);

    if (!user || !post) {
        return res.status(404).json({ error: "User or Post not found" });
    }

    const isLiked = post.likes.includes(user._id);

    if (isLiked) {
        await Post.findByIdAndUpdate(postId, {
            $pull: { likes: user._id }
        });
    } else {
        await Post.findByIdAndUpdate(postId, {
            $push: { likes: user._id },
        });

        if (post.user.toString() !== user._id.toString()) {
            await Notification.create({
                from: user._id,
                to: post.user,
                type: "like",
                post: postId,
            });
        }
    }

    res.status(200).json({
        message: isLiked ? "Post unliked successfully" : "Post liked successfully"
    });
});

export const deletePost = asyncHandler(async (req, res) => {
    const { userId } = getAuth(req);
    const { postId } = req.params;

    const user = await User.findOne({ clerkId: userId });
    const post = await Post.findById(postId);

    if (!user) {
        return res.status(404).json({ error: "User or post not found" });
    }

    if (post.user.toString() !== user.id.toString()) {
        return res.status(403).json({ error: "You can only delete yourown posts" });
    }

    await Comment.deleteMany({ post: postId });

    await Post.findByIdAndDelete(postId);

    res.status(200).json({ message: "POst deleted successfully" });
});