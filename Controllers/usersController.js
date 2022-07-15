import asyncHandler from 'express-async-handler'
import generateToken from '../Utils/generateToken.js'
import pool from '../config/db.js'
import {
  matchPassword,
  hashPassword,
  validateUsers,
} from '../Utils/validate.js'

//LOGIN USER
const LogIn = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  let user = await pool.query('select * from customer where email=?', [email])
  user = user[0][0]

  if (user && (await matchPassword(password, user.password))) {
    res.status(200)

    //if passed login in

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.admin,
      token: generateToken(user.id),
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
    const userExist = await pool.query(
      'select email from users where email=?',
      [email]
    )
    if (userExist[0].length > 0) {
      res.status(400).send('User already exist')
    } else {
      const result = await pool.query(
        'INSERT into users SET name=?, email=?, password=?',
        [name, email, harshedPassword]
      )
      console.log(result)

      res.send({
        name,
        email,
        id: result[0].insertId,
        token: generateToken(result[0].insertId),
      })
    }
  } catch (error) {
    console.log(error)
    res.status(500).send(error)
  }
})

//GET ALL USERS FROM ADMIN

const getUsers = asyncHandler(async (req, res) => {
  try {
    const allUsers = await pool.query('SELECT * FROM users')
    // console.log(req)

    res.status(200).json(allUsers[0])
  } catch (error) {
    throw new Error()
  }
})
export { LogIn, registerUser, getUsers }
