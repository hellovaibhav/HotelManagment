import mongoose from "mongoose";
import Rooms from "./roomsModel.js";

const bookingSchema = new mongoose.Schema({
    guestName:{
        type:String,
        required:true
    },
    guestEmail:{
        type:String,
        required:true
    },
    roomId:{
        type:mongoose.Schema.ObjectId,
        ref:"Rooms",
        required:true,
    },
    roomNumber:{
        type:Number,
        required:true
    },
    status:{
        type:String,
        enum:["Booked","Cancelled","Checked-Out"],
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
    },
    checkoutTime:{
        type:Date,
        default:null
    }
});

export default mongoose.model("Bookings",bookingSchema);