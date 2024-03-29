import Bookings from "../models/bookingsModel.js";
import Room from "../models/roomsModel.js";
import { sendMail } from "../utils/mail.util.js";

const parseDateTime = (dateString, timeString) => {
    const [day, month, year] = dateString.split('/').map(Number);
    const [hours, minutes] = timeString.split(':').map(Number);
    return new Date(year, month - 1, day, hours, minutes);
};

const roomsController = {
    //  to add a room in the hotel management system
    createRoom: async (req, res) => {
        try {
            const newRoom = new Room({
                ...req.body
            });

            await newRoom.save();

            return res.status(200).json({ message: `room has been added successfully`, data: { ...newRoom._doc } });
        } catch (err) {

            return res.status(404).json({ message: `there was some error adding room`, data: `${err}` });
        }
    },
//  to find rooms which are available in the input date day range
    findRooms: async (req, res) => {
        try {
            const startDate = req.body.startDate;
            const endDate = req.body.endDate;
            const startTime = req.body.startTime;
            const endTime = req.body.endTime;

            const parsedStartDateTime = parseDateTime(startDate, startTime);
            const parsedEndDateTime = parseDateTime(endDate, endTime);


            if (parsedStartDateTime >= parsedEndDateTime) {
                return res.status(403).json({ message: "start date and time can't be equal to or greater than end date and time" });
            }
            // console.log(parsedEndDateTime);

            const overlappingBookings = await Bookings.find({
                status: { $nin: ["Cancelled", "Checked-Out"] },
                $or: [
                    { startDateTime: { $lt: parsedEndDateTime }, endDateTime: { $gt: parsedStartDateTime } },
                    { startDateTime: { $gte: parsedStartDateTime, $lte: parsedEndDateTime } }
                ]
            });


            // console.log(overlappingBookings);
            const bookedRoomNumbers = overlappingBookings.map(booking => booking.roomNumber);
            // console.log(bookedRoomNumbers);

            const availableRooms = await Room.find({
                roomNumber: { $nin: bookedRoomNumbers }
            });

            res.status(200).json({ message: "found rooms", availableRooms });


        } catch (err) {
            res.status(404).json({ message: "There was an error finding rooms" });
        }
    },
    // to book a room with provided details
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

            const currDate = new Date();

            console.log(currDate);



            if (currDate > parsedStartDateTime) {
                return res.status(403).json({ message: "You can't book room in past" });
            }

            if (parsedStartDateTime >= parsedEndDateTime) {
                return res.status(403).json({ message: "start date and time can't be equal to or greater than end date and time" });
            }

            const overlappingBookings = await Bookings.find({
                roomId: roomId,
                status: { $nin: ["Cancelled", "Checked-Out"] },
                $or: [
                    { startDateTime: { $lt: parsedEndDateTime }, endDateTime: { $gt: parsedStartDateTime } },
                    { startDateTime: { $gte: parsedStartDateTime, $lte: parsedEndDateTime } }
                ]
            });

            if (overlappingBookings.length === 0) {
                // Calculate total hours
                const roundedUserStartTime = new Date(parsedStartDateTime);
                roundedUserStartTime.setMinutes(0, 0, 0);

                const roundedUserEndTime = new Date(parsedEndDateTime);
                roundedUserEndTime.setMinutes(0, 0, 0);

                // Calculate total whole hours for user input
                const totalWholeHoursUser = Math.floor((roundedUserEndTime - roundedUserStartTime) / (60 * 60 * 1000));

                // Multiply total whole hours with the price
                const totalPrice = totalWholeHoursUser * foundRoom.price;

                const newBooking = new Bookings({
                    ...req.body,
                    startDateTime: parsedStartDateTime,
                    endDateTime: parsedEndDateTime,
                    roomId: roomId,
                    roomNumber: foundRoom.roomNumber,
                    amountRecived: totalPrice
                });
                // console.log(newBooking);
                const savedBooking = await newBooking.save();

                // send a confirmation mail to the guest regarding his/her booking
                await sendMail(startTime, startDate, endTime, endDate, newBooking);

                res.status(200).json({ message: "Room booked successfully", data: { ...savedBooking._doc } });
            } else {
                res.status(400).json({ message: "Room is already booked during the specified time range" });
            }


        } catch (err) {
            res.status(404).json({ message: "There was an error booking this room", data: `${err}` });
        }
    },
    // to fetch detials regarding a single room using roomId
    findRoom: async (req, res) => {
        try {
            const roomId = req.params.roomId;

            const foundRoom = await Room.findById(roomId);

            if (!foundRoom)
                res.status(404).json({ message: "No room with such id found" });

            res.status(200).json({ message: "Found room Details", data: { ...foundRoom._doc } });
        } catch (err) {
            res.status(404).json({ message: "There was an error booking this room", data: `${err}` });
        }
    }
}
export default roomsController;