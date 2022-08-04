import express from 'express'

import cors from 'cors'
import userRoutes from './Routes/userRoutes.js'
import itemRoutes from './Routes/itemRoutes.js'
import priceRoutes from './Routes/priceRoutes.js'
import categoryRoutes from './Routes/categoryRoutes.js'
import uploadRoutes from './Routes/uploadRoutes.js'
import fs from 'fs'
import multer from 'multer'
import { errorHandler, notFound } from './Middlewares/errorMiddlewares.js'

// initiallise express server
const app = express()
app.use(express.json())

app.use(cors())
app.get('/', (req, res) => {
  res.send('Api is running')
  //   console.log(res.headersSent)
  //   console.log(req.params)
})

//used Routes
//USER
app.use('/api/users', userRoutes)

// Items
app.use('/api/items', itemRoutes)

app.use('/api/prices', priceRoutes)

app.use('/api/categories', categoryRoutes)

app.use('/api/uploads', uploadRoutes)

//Error middilewares
app.use(notFound)
app.use(errorHandler)
// server and port

const port = process.env.PORT || 8000
app.listen(port, () => console.log(`Listening on port ${port}...`))
