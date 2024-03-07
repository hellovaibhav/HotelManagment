import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    guestName:{
        type:String,
        required:true
    },
    guestEmail:{
        type:String,
        required:true
    },
    roomNumber:{
        type:mongoose.Schema.ObjectId,
        ref:"roomsDB",
        required:true,
    },
    status:{
        type:String,
        enum:["Booked","Cancelled"],
        default:"Booked"
    },
    startDateTime:{
        type:Date,
        required:true
    },
    endDateTime:{
        type:Date,
        required:true
    },
    amountRecived:{
        type:Number,
        required:true
    },
    refund:{
        type:Number,
        default:0
    }
});

export default mongoose.model("Bookings",bookingSchema);