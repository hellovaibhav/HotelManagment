import Bookings from "../models/bookingsModel.js";
import Room from "../models/roomsModel.js";

const parseDateTime = (dateString, timeString) => {
    const [day, month, year] = dateString.split('/').map(Number);
    const [hours, minutes] = timeString.split(':').map(Number);
    return new Date(year, month - 1, day, hours, minutes);
};

const bookingController = {
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
    updateBooking: async (req, res) => {
        try {

            const bookingId = req.params.bookingId;

            const foundBooking = await Bookings.findById(bookingId);

            const roomId = foundBooking.roomId;

            const foundRoom = await Room.findById(roomId);
            

            if (!foundBooking) {
                return res.status(404).json({ message: `no booking with this id exists` });
            }

            const startDate = req.body.startDate;
            const endDate = req.body.endDate;
            const startTime = req.body.startTime;
            const endTime = req.body.endTime;

            const parsedStartDateTime = parseDateTime(startDate, startTime);
            const parsedEndDateTime = parseDateTime(endDate, endTime);


            const overlappingBookings = await Bookings.find({
                roomId: roomId,
                _id: { $ne: bookingId },
                status: { $nin: ["Cancelled", "Checked-Out"] },
                $or: [
                    { startDateTime: { $lt: parsedEndDateTime }, endDateTime: { $gt: parsedStartDateTime } },
                    { startDateTime: { $gte: parsedStartDateTime, $lte: parsedEndDateTime } }
                ]
            });

            if (overlappingBookings.length === 0) {
                const newBooking = new Bookings({
                    ...req.body,
                    startDateTime: parsedStartDateTime,
                    endDateTime: parsedEndDateTime,
                    roomId: roomId,
                    roomNumber: foundRoom.roomNumber,
                    amountRecived: foundRoom.price || req.body.amountRecived
                });

                await newBooking.save();

                res.status(200).json({message:"Booking details edited",Data:{...newBooking._doc}});

            } else {
                res.status(400).json({ message: "Room is already booked during the specified time range" });
            }

            

        } catch (err) {
            return res.status(404).json({ message: `there was some error updating details of this booking`, data: `${err}` });
        }
    }
}
export default bookingController;