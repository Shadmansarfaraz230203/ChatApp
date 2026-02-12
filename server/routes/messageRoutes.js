import express from "express";
import { protectRoute } from "../middleware/auth.js";
import { getMessages, getUsersForSidebar, markMessageAsSeen, sendMessage } from "../controllers/messageController.js";

//in the below messageRouter we have to create different end point

const messageRouter = express.Router();


//path-"/users" --- will display all the users list , so where we will protect the route using middleware protectRoute , then add controller function-getUsersForSidebar
//path-"/:id" --- we will paas /:id id in the params , so where we will protect the route using middleware protectRoute , then add controller function -getMessages
//path-"mark/:id" ----we will create route for controller function-markMessageAsSeen , in this id -"mark/:id" we will send individual message id and here also we will protect the route using middleware protectRoute and here we will use put because we will use this route to update the data
//path "/send/:id" ----- so where we will protect the route using middleware protectRoute , then add controller function-sendMessage , using this route we can send new message to other user  and the other user will see the message instantly using socket.io
messageRouter.get("/users", protectRoute , getUsersForSidebar);
messageRouter.get("/:id", protectRoute , getMessages);
messageRouter.put("/mark/:id", protectRoute , markMessageAsSeen);
messageRouter.post("/send/:id" , protectRoute  , sendMessage);

export  default messageRouter;

//next we will add this  messageRouter in the server.js file
