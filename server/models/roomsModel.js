import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
    roomNumber:{
        type:Number,
        required: true,
        unique:true
    },
    roomType:{
        type:String,
        enum : ["Non-AC","AC","Delux"],
        required:true
    },
    price:{
        type:Number,
        required:true
    }
});

export default mongoose.model("Rooms",roomSchema);