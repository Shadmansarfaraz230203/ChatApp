import mongoose from "mongoose";


// Define the User schema , here we will have fullName, email, password and profilePic and in profilePic we will add type string and in this type string we will store the url of the profile picture and also add the default value of profilePic to an empty string and also add bio field  and also add timestamps , timestamps will automatically add createdAt and updatedAt fields to the schema(it will add the data and time when the user is created and updated)

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  profilePic: {
    type: String,
    default: ""
  },
  bio: {
    type: String
  }  
}, { timestamps: true });

// Create the User model

const User = mongoose.model("User", userSchema);

// Export the User model

export default User ;


// Now we can use this User model in we can store and retrieve user data from the MongoDB database.