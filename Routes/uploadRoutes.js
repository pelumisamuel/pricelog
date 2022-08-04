import multer from 'multer'
import { Router } from 'express'

// import path from 'path'
//import { v2 as cloudinary } from 'cloudinary'
import { uploads } from '../Utils/cloudinary.js'
import { upload } from '../Utils/multer.js'

//import cloudinary from '../Utils/cloudinary.js'

const router = Router()

router.post('/', upload.single('image'), async (req, res) => {
  try {
    const result = await uploads(req.file.path)

    //const result = await cloudinary.uploader.upload(req.file.path)

    res.send({ message: 'upload successful', result })
    console.log(req.file.path, result)
  } catch (error) {
    res.send(error)
  }
})

export default router
