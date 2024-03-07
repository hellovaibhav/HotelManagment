import mongoose from "mongoose";
import dotenv from "dotenv";
import express from "express";

import roomsRoute from "./routes/roomsRoute.js"

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

const connect = () => {
    try {
        mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to database");
    } catch (err) {
        throw err;
    }
};

mongoose.connection.on("disconnected", () => {
    console.log("Database is disconnected");
});

// all routes
app.get("/",(req,res)=>{res.status(200).send("Server is up and running")});
app.use("/api/v1/rooms",roomsRoute);



app.listen(PORT, () => {
    connect();
    console.log(`Server is up and runnning on port ${PORT}`);
});