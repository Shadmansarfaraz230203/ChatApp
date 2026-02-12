import mongoose from "mongoose";
import { type } from "os";

// Define the Message schema , here we will have senderId , receiverId , text , image , seen , by default all messages is created by the seen property : false ,and we also have timestamps


const messageSchema = new mongoose.Schema({
    senderId : {
      type : mongoose.Schema.Types.ObjectId , 
      ref : "User" ,
      required : true
    },
     receiverId : {
      type : mongoose.Schema.Types.ObjectId , 
      ref : "User" ,
      required : true
    } ,
    text : {
      type : String,
    },
    image : {
      type : String,
    },
    seen : {
      type: Boolean, 
      default: false
    }
}, { timestamps: true });

// Create the message model

const Message = mongoose.model("Message", messageSchema);

// Export the message model
export default Message;


// now using this message model , we can store the message data in the database , for that create a new file in controller folder i.e., messageController.js