import express from "express";
import { checkAuth, login, signup, updateProfile } from "../controllers/userController.js";
import { protectRoute } from "../middleware/auth.js";


// create new user router and  this userRouter will create different  end points
const userRouter = express.Router();

userRouter.post("/signup" , signup);
userRouter.post("/login" , login);
//update the data , protect the route using thr middleware , then provide controller function i.e., updateProfile:-
userRouter.put("/update-profile" , protectRoute , updateProfile);
//check if user is authenticated or not
userRouter.get("/check" , protectRoute , checkAuth);

export default userRouter;

//know we will add this userRouter in our main file i.e. , server.js