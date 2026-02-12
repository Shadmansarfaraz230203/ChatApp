// we will define utility functions for the application to generate tokens and handle common tasks , so we will generate a function using jsonwebtoken library to generate a token for the user after signup and login

import jwt from "jsonwebtoken";

//function to generate token for user

export const generateToken = (userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET);
  return token;
}

