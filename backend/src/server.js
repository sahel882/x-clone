import express from 'express';
import {ENV} from "./config/env.js";
import {connectDB} from "./config/db.js";
import "dotenv/config";

const app = express();
app.use(express.json());

app.get("/", (req, res)=>{
   res.send("Hello from API");
});

app.listen(ENV.PORT, () => {
    connectDB();
    console.log('Server is running on port: ', ENV.PORT);
})