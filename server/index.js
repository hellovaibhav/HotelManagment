import mongoose from "mongoose";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";

import roomsRoute from "./routes/roomsRoute.js"
import bookingsRoute from "./routes/bookingsRoute.js"

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

var allowedOrigins = ['http://localhost:3000','https://hotelmanagment-1.onrender.com'];

const options = {
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            var msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    useSuccessStatus: true
};


app.use(cors(options));

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
app.get("/", (req, res) => { res.status(200).send("Server is up and running") });
app.use("/api/v1/rooms", roomsRoute);
app.use("/api/v1/bookings", bookingsRoute);



app.listen(PORT, () => {
    connect();
    console.log(`Server is up and runnning on port ${PORT}`);
});