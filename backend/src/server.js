import express from 'express';
import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";
import "dotenv/config";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";

const app = express();
app.use(express.json());

app.use(cors());
app.use(clerkMiddleware());

app.get("/", (req, res) => {
    res.send("Hello from API");
});

app.use("/api/users", userRoutes);
app.use("/api/post", postRoutes);

app.use((err, req, res) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ error: err.message || "Internal server error" });
});

const startServer = async () => {
    try {
        await connectDB();

        app.listen(ENV.PORT, () => console.log('Server is running on port: ', ENV.PORT));
    } catch (error) {
        console.log("Failed to start server: ", error.message);
        process.exit(1);
    }
};

startServer();