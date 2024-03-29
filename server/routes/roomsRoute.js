import express from "express";

import roomsController from "../controllers/roomsController.js"

const router = express.Router();

router.
route("/findRooms")
.post(roomsController.findRooms);

router
.route("/addRoom")
.post(roomsController.createRoom);

router
.route("/bookRoom/:roomId")
.post(roomsController.bookRoom);

router
.route("/findRoom/:roomId")
.get(roomsController.findRoom);

export default router;