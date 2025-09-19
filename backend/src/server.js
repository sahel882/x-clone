import express from 'express';
import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";
import "dotenv/config";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello from API");
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