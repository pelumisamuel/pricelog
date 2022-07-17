import asyncHandler from 'express-async-handler'
import generateToken from '../Utils/generateToken.js'
import pool from '../config/db.js'
import {
  matchPassword,
  hashPassword,
  validateUsers,
} from '../Utils/validate.js'
import {
  addOneUser,
  getAllUsers,
  getOneUser,
  getOneUserEmail,
} from '../Models/userModel.js'

//LOGIN USER
const LogIn = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  let user = await getOneUser(email)
  user = user[0][0]

  if (user && (await matchPassword(password, user.password))) {
    res.status(200)

    //if passed login in

    res.json({
      status: 200,
      message: 'Login is successful',
      data: {
        id: user.idusers,
        name: user.name,
        email: user.email,
        isAdmin: user.admin,
        token: generateToken(user.idusers),
      },
    })
  } else {
    res.status(401).send('email or username is invalid')
  }
})

// REGISTER USER
const registerUser = asyncHandler(async (req, res) => {
  const { error } = validateUsers(req.body)
  if (error) return res.status(400).send({ error: error.details[0].message })
  const { name, email, password } = req.body
  try {
    const harshedPassword = await hashPassword(password)
    const userExist = await getOneUserEmail(email)
    if (userExist[0].length > 0) {
      res.status(400).send({ status: 400, message: 'User already exist' })
    } else {
      const result = await addOneUser(name, email, harshedPassword)
      //console.log(result)

      res.send({
        status: 201,
        message: 'Registration is successful',
        data: {
          name,
          email,
          id: result[0].insertId,
          token: generateToken(result[0].insertId),
        },
      })
    }
  } catch (error) {
    console.log(error)
    res
      .status(500)
      .send({ status: 500, message: 'An error occur', data: error })
  }
})

//GET ALL USERS FROM ADMIN

const getUsers = asyncHandler(async (req, res) => {
  try {
    const allUsers = await getAllUsers()
    // console.log(req)

    res.status(200).json(allUsers[0])
  } catch (error) {
    throw new Error()
  }
})
export { LogIn, registerUser, getUsers }
