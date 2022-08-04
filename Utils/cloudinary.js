import { v2 as cloudinary } from 'cloudinary'
import expressAsyncHandler from 'express-async-handler'
import dotenv from 'dotenv'
dotenv.config()

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
})

const uploads = (filePath) => {
  return cloudinary.uploader.upload(filePath)
  //cloudinary.uploader.upload(filePath,)
  // res.send({ message: 'upload successful', result })
}

// const getOneUserById = (id) => {
//   return pool.query('SELECT * FROM users WHERE idusers=?', [id])
// }
export { uploads }
