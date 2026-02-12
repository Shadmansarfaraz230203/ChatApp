import jwt from "jsonwebtoken";
import User from "../models/User.js";


//Middleware to protect the route

//next will execute the next function , i.e. controller function
export const protectRoute = async(req , res , next)=> {
  try{
    //const token = req.headers.token;
    const authHeader = req.headers.authorization;
if (!authHeader) {
  return res.json({ success: false, message: "No token provided" });
}

const token = authHeader.split(" ")[1];


    const decoded = jwt.verify(token , process.env.JWT_SECRET)

 //know we will get the user data and from this we have to remove the password from the user data

    const user = await User.findById(decoded.userId).select("-password")

// check wether the user is available or not

  if(!user) return res.json({success : false , message : "User not found"});

  //if the user is available , this will add the user data in the request and know we can access the user data in the controller function 

  req.user = user;
  //it will execute the next function that will execute the controller function 
  next();

  //if any error occur then catch block will execute
  } catch (error) {

    console.log(error.message);
    res.json({success : false , message : "error.message"});

  }
}

//so we have created the middleware to protect the routes