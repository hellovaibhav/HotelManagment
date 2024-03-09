import Bookings from "../models/bookingsModel.js";
import Room from "../models/roomsModel.js";
import { sendCancellationMail } from "../utils/mail.util.js";

// function to convert date from string to javascript format
const parseDateTime = (dateString, timeString) => {
    const [day, month, year] = dateString.split('/').map(Number);
    const [hours, minutes] = timeString.split(':').map(Number);
    return new Date(year, month - 1, day, hours, minutes);
};

const bookingController = {
    // to get booking details using a particular bookingId
    bookingDetails: async (req, res) => {
        try {

            const bookingId = req.params.bookingId;

            const foundBooking = await Bookings.findById(bookingId);

            if (!foundBooking) {
                return res.status(404).json({ message: `no booking with this id exists` });
            }

            return res.status(200).json({ message: "found booking details", data: { ...foundBooking._doc } });

        } catch (err) {
            return res.status(404).json({ message: `there was some error getting details of the booking`, data: `${err}` });
        }
    },
    // to list all the bookings which have been done and applying filters accordingly
    bookingsList: async (req, res) => {
        try {
            // Extract filter parameters from the request query
            const startDate = req.body.startDate;
            const endDate = req.body.endDate;
            let startTime = req.body.startTime;
            let endTime = req.body.endTime;
            const roomNumber = req.query.roomNumber;
            const status = req.query.status;
            const roomType = req.query.roomType;

            // Build the filter object based on the provided parameters
            const filter = {};

            let parsedStartDateTime;
            let parsedEndDateTime;

            if (startDate) {
                if (!startTime) {
                    startTime = "00:00"
                }
                parsedStartDateTime = parseDateTime(startDate, startTime);

                filter.startDateTime = { $gte: parsedStartDateTime };
            }
            if (endDate) {
                if (!endTime) {
                    endTime = "23:59"
                }
                parsedEndDateTime = parseDateTime(endDate, endTime);

                filter.endDateTime = { $lte: parsedEndDateTime };
            }

            if (parsedStartDateTime >= parsedEndDateTime) {
                return res.status(403).json({ message: "start date and time can't be equal to or greater than end date and time" });
            }

            if (roomNumber) {
                filter.roomNumber = roomNumber;
            }

            if (status) {
                filter.status = status;
            }


            // Fetch bookings based on the filter
            const bookings = await Bookings.find({ ...filter })
                .populate({
                    path: "roomId",
                    model: "Rooms",
                    match: { roomType: roomType }
                })
                .exec();

            res.status(200).json({ message: "Found bookings", data: bookings });
        } catch (err) {
            res.status(500).json({ message: "There was an error fetching bookings", data: `${err}` });
        }
    },
    // to make changes in any of the booking
    updateBooking: async (req, res) => {
        try {

            const bookingId = req.params.bookingId;

            const foundBooking = await Bookings.findById(bookingId);

            const roomId = foundBooking.roomId;

            const foundRoom = await Room.findById(roomId);

            const inputRoomNumber = req.body.roomNumber || foundRoom.roomNumber;


            if (!foundBooking) {
                return res.status(404).json({ message: `no booking with this id exists` });
            }

            const startDate = req.body.startDate;
            const endDate = req.body.endDate;
            const startTime = req.body.startTime;
            const endTime = req.body.endTime;

            const parsedStartDateTime = parseDateTime(startDate, startTime);
            const parsedEndDateTime = parseDateTime(endDate, endTime);

            // console.log(inputRoomNumber);

            if (parsedStartDateTime >= parsedEndDateTime) {
                return res.status(403).json({ message: "start date and time can't be equal to or greater than end date and time" });
            }

            const overlappingBookings = await Bookings.find({
                roomNumber: inputRoomNumber,
                _id: { $ne: bookingId },
                status: { $nin: ["Cancelled", "Checked-Out"] },
                $or: [
                    { startDateTime: { $lt: parsedEndDateTime }, endDateTime: { $gt: parsedStartDateTime } },
                    { startDateTime: { $gte: parsedStartDateTime, $lte: parsedEndDateTime } }
                ]
            });

            const newRoom = await Room.findOne({ roomNumber: inputRoomNumber });

            if (overlappingBookings.length === 0) {

                // Calculate total hours
                const totalHours = Math.floor((parsedEndDateTime - parsedStartDateTime) / (60 * 60 * 1000));

                // Round down start and end times to the nearest whole hour
                const roundedStartDateTime = new Date(parsedStartDateTime);
                roundedStartDateTime.setMinutes(0, 0, 0);

                const roundedEndDateTime = new Date(parsedEndDateTime);
                roundedEndDateTime.setMinutes(0, 0, 0);

                // Calculate total whole hours
                const totalWholeHours = Math.floor((roundedEndDateTime - roundedStartDateTime) / (60 * 60 * 1000));

                // Multiply total whole hours with the price
                const totalPrice = totalWholeHours * foundRoom.price;

                const updateBooking = await Bookings.findByIdAndUpdate(bookingId, {
                    ...req.body,
                    startDateTime: parsedStartDateTime,
                    endDateTime: parsedEndDateTime,
                    roomId: newRoom._id,
                    roomNumber: newRoom.roomNumber,
                    amountRecived: totalPrice
                }, { new: true });

                // console.log(JSON.stringify(updateBooking));

                res.status(200).json({ message: "Booking details edited", Data: updateBooking });

            } else {
                res.status(400).json({ message: "Room is already booked during the specified time range" });
            }



        } catch (err) {
            return res.status(404).json({ message: `there was some error updating details of this booking`, data: `${err}` });
        }
    },
    // to cancel a booking
    cancelBooking: async (req, res) => {
        try {

            const bookingId = req.params.bookingId;

            const foundBooking = await Bookings.findById(bookingId);


            if (foundBooking.status == "Cancelled" || foundBooking.status == "Checked-Out") {
                return res.status(403).json({ message: "Can't cancel booking for already cancelled or checked-out booking" });
            }


            if (!foundBooking) {
                return res.status(404).json({ message: `no booking with this id exists` });
            }

            const roomId = foundBooking.roomId;
            const foundRoom = await Room.findById(roomId);

            const currentTime = new Date();
            const bookingStartTime = foundBooking.startDateTime;

            // Calculate the time difference in hours
            const timeDifferenceHours = (bookingStartTime - currentTime) / (60 * 60 * 1000);

            console.log(timeDifferenceHours);

            let refundPercentage = 0;

            // Determine refund percentage based on the time difference
            if (timeDifferenceHours > 48) {
                refundPercentage = 100;
            } else if (timeDifferenceHours >= 24 && timeDifferenceHours <= 48) {
                refundPercentage = 50;
            }
            if (timeDifferenceHours <= 0) {
                res.status(404).json({ message: "Cant cancel bookings which are booked in past" })
            }

            // Calculate the refund amount
            const refundAmount = (refundPercentage / 100) * foundBooking.amountRecived;
            console.log(`refund amount is ${refundAmount}`);
            // Update the booking status and refund details
            foundBooking.status = "Cancelled";
            foundBooking.refund = refundAmount;
            foundBooking.amountRecived = foundBooking.amountRecived - refundAmount;
            foundBooking.checkoutTime = currentTime;

            await foundBooking.save();

            // to send a mail to the guest regarding cancellation of his/her booking and refunded amount
            await sendCancellationMail(foundBooking);

            res.status(200).json({ message: "Booking cancelled successfully", Data: { ...foundBooking._doc } });


        } catch (err) {
            return res.status(404).json({ message: `there was some error cancelling this booking`, data: `${err}` });
        }
    },
    // to mark a booking as checkd-out  by the guest
    checkoutBooking: async (req, res) => {
        try {

            const bookingId = req.params.bookingId;

            const foundBooking = await Bookings.findById(bookingId);


            if (foundBooking.status == "Cancelled" || foundBooking.status == "Checked-Out") {
                return res.status(403).json({ message: "Can't checkout for already cancelled or checked-out booking" });
            }


            if (!foundBooking) {
                return res.status(404).json({ message: `no booking with this id exists` });
            }

            const roomId = foundBooking.roomId;

            const currentTime = new Date();


            // Update the booking status and refund details
            foundBooking.status = "Checked-Out";
            foundBooking.checkoutTime = currentTime;

            await foundBooking.save();

            res.status(200).json({ message: "Checked-Out successfully", Data: { ...foundBooking._doc } });


        } catch (err) {
            return res.status(404).json({ message: `there was some error cancelling this booking`, data: `${err}` });
        }
    }
}
export default bookingController;