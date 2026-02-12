import express from 'express';
import "dotenv/config";
import cors from 'cors';
import http from 'http';
//import { connect } from 'http2';
import { connectDB } from './lib/db.js';
import userRouter from './routes/userRoutes.js';
import messageRouter from './routes/messageRoutes.js';
import { Server } from 'socket.io';
import jwt from "jsonwebtoken"

//create express app and http server , we are using http server because socket.io supports http server 
const app = express();
const server = http.createServer(app);

//Initilize socket.io server

export const io = new Server(server, {
  cors : {origin: "*"} ,  // "*"-will allow all the origins
});

//Store online users
//in this {} object we will store the data of all the online user and here we will add the data in the form of userId and socketId
export const userSocketMap ={}; //{userId : socketId}
//now we will create a function i.e. socketHandler
//Socket.io connection handler
io.on("connection", (socket) =>{
  const userId = socket.handshake.query.userId;
  console.log("User Connected" , userId);

  //if userId available then we will add the data in this userSocketMap
  if (userId) userSocketMap[userId] = socket.id ;

  //Emit online users to connect clients
  io.emit("getOnlineUsers" , Object.keys(userSocketMap));

  //add disconnect event , 
  socket.on("disconnect" , () => {
    console.log("User Disconnected" , userId);
    delete userSocketMap[userId];   // this userId will be deleted or removed from the userSocketMap
    io.emit("getOnlineUsers" , Object.keys(userSocketMap)); //using this we will get the list of Online users and all the online users will be stored in userSocketMap
  });

});

//middlewares
app.use(cors());   //cors allows to connect all the URLs to our server/backend
app.use(express.json({limit: '4mb'}));

//Routes setup 
app.get('/api/status', (req, res) => res.send(
  "Server is running successfully"
));
app.use("/api/auth" , userRouter);
app.use("/api/messages" , messageRouter)

const PORT = process.env.PORT || 5000;

server.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  
  try {
    await connectDB();
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
  }
});
