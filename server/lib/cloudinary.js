import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name : process.env.ClOUDINARY_CLOUD_NAME,
  api_key : process.env.ClOUDINARY_API_KEY,
  api_secret : process.env.ClOUDINARY_API_SECRET,
});

export default cloudinary;