import express from "express";

import bookingController from "../controllers/bookingController.js"

const router = express.Router();

router.
route("/details/:bookingId")
.get(bookingController.bookingDetails);

router.
route("/update/:bookingId")
.patch(bookingController.updateBooking);

router.
route("/")
.post(bookingController.bookingsList);

router.
route("/cancel/:bookingId")
.patch(bookingController.cancelBooking);

export default router;