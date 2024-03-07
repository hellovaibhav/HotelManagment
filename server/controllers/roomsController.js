import Bookings from "../models/bookingsModel.js";
import Room from "../models/roomsModel.js";

const parseDateTime = (dateString, timeString) => {
    const [day, month, year] = dateString.split('/').map(Number);
    const [hours, minutes] = timeString.split(':').map(Number);
    return new Date(year, month - 1, day, hours, minutes);
};

const roomsController = {
    createRoom: async (req, res) => {
        try {
            const newRoom = new Room({
                ...req.body
            });

            await newRoom.save();

            return res.status(200).json({ message: `room has been added successfully`, data: `${newRoom}` });
        } catch (err) {

            return res.status(404).json({ message: `there was some error adding room`, data: `${err}` });
        }
    },

    findRooms: async (req, res) => {
        try {
            const startDate = req.body.startDate;
            const endDate = req.body.endDate;
            const startTime = req.body.startTime;
            const endTime = req.body.endTime;

            const parsedStartDateTime = parseDateTime(startDate, startTime);
            const parsedEndDateTime = parseDateTime(endDate, endTime);

            console.log(parsedEndDateTime);

            const overlappingBookings = await Bookings.find({
                roomNumber: req.query.roomNumber,
                status: { $ne: "Cancelled" },
                $or: [
                    { startDateTime: { $gte: parsedStartDateTime, $lte: parsedEndDateTime } },
                    { endDateTime: { $gte: parsedStartDateTime, $lte: parsedEndDateTime } },
                    { $and: [{ startDateTime: { $lte: parsedStartDateTime } }, { endDateTime: { $gte: parsedEndDateTime } }] },
                    { $and: [{ startDateTime: { $gte: parsedStartDateTime } }, { endDateTime: { $lte: parsedEndDateTime } }] }
                ]
            });

            console.log(overlappingBookings);
            const bookedRoomNumbers = overlappingBookings.map(booking => booking.roomNumber);

            const availableRooms = await Room.find({
                roomNumber: { $nin: bookedRoomNumbers }
            });

            res.status(200).json({ availableRooms });


        } catch (err) {
            res.status(404).json({ message: "There was an error finding rooms" });
        }
    },
    bookRoom: async (req, res) => {
        try {

            const roomId = req.params.roomId;

            const foundRoom = await Room.findById(roomId);

            console.log(foundRoom);

            if (!foundRoom) {
                res.status(404).json({ message: "No such room exists" });
            }

            const startDate = req.body.startDate;
            const endDate = req.body.endDate;
            const startTime = req.body.startTime;
            const endTime = req.body.endTime;

            const parsedStartDateTime = parseDateTime(startDate, startTime);
            const parsedEndDateTime = parseDateTime(endDate, endTime);


            const overlappingBookings = await Bookings.find({
                roomNumber: roomId,
                status: { $ne: "Cancelled" },
                $or: [
                    { startDateTime: { $lt: parsedEndDateTime }, endDateTime: { $gt: parsedStartDateTime } },
                    { startDateTime: { $gte: parsedStartDateTime, $lte: parsedEndDateTime } }
                ]
            });

            console.log(overlappingBookings)

            // if amount is not entered by the user the original set amount is being used

            if (overlappingBookings.length === 0) {
                const newBooking = new Bookings({
                    ...req.body,
                    startDateTime: parsedStartDateTime,
                    endDateTime: parsedEndDateTime,
                    roomNumber: roomId,
                    amountRecived: req.body.amountRecived || foundRoom.price
                })
                console.log(newBooking);
                const savedBooking = await newBooking.save();

                res.status(200).json({ message: "Room booked successfully", Data: `${savedBooking}` });
            } else {
                res.status(400).json({ message: "Room is already booked during the specified time range" });
            }


        } catch (err) {
            res.status(404).json({ message: "There was an error booking this room", data: `${err}` });
        }
    }
}
export default roomsController;