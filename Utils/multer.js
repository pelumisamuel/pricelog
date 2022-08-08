import multer from 'multer'
import { Router } from 'express'
import path from 'path'

//import cloudinary from '../Utils/cloudinary.js'

/// save Image to a folder

// const storage = multer.diskStorage({
//   destination(req, file, cb) {
//     cb(null, './uploads/')
//   },
//   filename(req, file, cb) {
//     cb(
//       null,
//       `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
//     )
//   },
// })

const storage = multer.diskStorage({})

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true)
  } else {
    cb({ message: 'Unsupported file Format' }, true)
  }
}

const upload = multer({
  storage: storage,
  limits: { fieldSize: 1024 * 1024 },
  fileFilter: fileFilter,
})

export { upload }
