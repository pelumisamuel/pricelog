import express from 'express'

import cors from 'cors'
import userRoutes from './Routes/userRoutes.js'
import itemRoutes from './Routes/itemRoutes.js'
import { errorHandler, notFound } from './middlewares/errorMiddlewares.js'

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

app.use('/api/items', itemRoutes)

//Error middilewares
app.use(notFound)
app.use(errorHandler)
// server and port

const port = process.env.PORT || 8000
app.listen(port, () => console.log(`Listening on port ${port}...`))
