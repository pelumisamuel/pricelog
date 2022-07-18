import express from 'express'

import cors from 'cors'
import userRoutes from './Routes/userRoutes.js'
import { errorHandler, notFound } from './middlewares/errorMiddlewares.js'

// initiallise express server
const app = express()
app.use(express.json())

app.use(cors())

//used Routes
//USER
app.use('/api/users', userRoutes)

//Error middilewares
app.use(notFound)
app.use(errorHandler)
// server and port
const port = process.env.PORT || 8000
app.listen(port, () => console.log(`Listening on port ${port}...`))
