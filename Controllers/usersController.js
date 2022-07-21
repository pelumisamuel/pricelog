import asyncHandler from 'express-async-handler'
// import generateToken from '../Utils/generateToken.js'

import { generateToken } from '../Utils/generateToken.js'
import jwt from 'jsonwebtoken'

import {
  matchPassword,
  hashPassword,
  validateUsers,
} from '../Utils/validate.js'
import {
  addOneUser,
  disableUserAccount,
  getAllUsers,
  getOneUser,
  getOneUserById,
  getOneUserEmail,
  verifyUserAccount,
  verifyUserEmail,
} from '../Models/userModel.js'
import pool from '../config/db.js'
import { sendVerificationLink } from '../Utils/sendEmail.js'

// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   host: 'smtp.gmail.com',
//   port: 465,

//   auth: {
//     user: process.env.EMAIL_ADDRESS,
//     pass: 'vuzujstbquzgvyak',
//   },
// })

//LOGIN USER
const LogIn = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  console.log(process.env.USERR)
  let user = await getOneUser(email)
  user = user[0][0]

  if (user && (await matchPassword(password, user.password))) {
    if (!user.isEmailVerified) {
      res.status(401).send({
        status: 401,
        message: 'Not Authorized, Check Your Email to Verify First',
      })
      await sendVerificationLink(email, user.idusers)
    }
    if (!user.isVerified && !user.isAdmin) {
      res.status(401).send({
        status: 401,
        message:
          'Not Authorized, You Have Not Been Verified. Please, Contact The Admin',
      })

      return
    }
    if (user.isDisabled) {
      res.status(401).send({
        status: 401,
        message: 'Not Authorized, Your Account Has Been Disabled',
      })
      return
    }

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
    res
      .status(401)
      .send({ status: 401, message: 'email or username is invalid' })
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
      await sendVerificationLink(email, result[0].insertId)
      //console.log(result)

      // const url = `http://localhost:3000/api/users/confirmation/${emailToken(
      //   result[0].insertId
      // )}`
      // await transporter.sendMail({
      //   from: 'price log <priceloggger@gmail.com>',
      //   to: email,
      //   subject: 'Verify your Email',
      //   html: `Please click this email to confirm your email: <a href="${url}">${url}</a>`,
      // })
      // console.log(url)
      // res.send('sent')
      res.send({
        status: 201,
        message:
          'Registration is successful; Check your Email to start your Verification',
      })
    }
  } catch (error) {
    console.log(error)
    res
      .status(500)
      .send({ status: 500, message: 'A server error occur', data: error })
  }
})

//GET USER PROFILE WITH LOGGED IN TOKEN

const getUserProfile = asyncHandler(async (req, res) => {
  try {
    res.send({
      idusers: req.user.idusers,
      name: req.user.name,
      email: req.user.email,
    })
  } catch (error) {
    throw new Error('profile not found')
  }
  //console.log(req.user.email)
})

// VERIFY USER EMAIL
// verify email based on link sent to the User's email
const verifyEmail = asyncHandler(async (req, res) => {
  try {
    const decoded = jwt.verify(req.params.token, process.env.EMAIL_SECRET)
    // await pool.query('select * from users where idusers=?', [
    //   decoded.id,
    // ])

    let user = await getOneUserById(decoded.id)

    req.user = user[0][0]

    if (req.user.isEmailVerified) {
      return res.send({
        status: 406,
        message: 'you have already being verified',
      })
    }

    await verifyUserEmail(req.user.idusers)

    res
      .status(200)
      .json({ status: 200, message: 'Your Email has been Verified' })
  } catch (error) {
    throw new Error('This is link is invalid, or has expired')
  }
})
//const changePassword = () => {}

const resetPassword = asyncHandler(async (req, res) => {
  try {
    const { email } = req.body

    // Sql query in user model that fetch one user by email
    let user = await getOneUser(email)
    user = user[0][0]
    if (!user) {
      throw new Error('Your email does not exist with us')
    } else {
    }
  } catch (error) {
    console.log(error)
  }
})

//ADMIN FUNCTION

//GET ALL USERS FROM ADMIN

const getUsers = asyncHandler(async (req, res) => {
  try {
    const allUsers = await getAllUsers()
    // console.log(req)

    res.status(200).json(allUsers[0])
  } catch (error) {
    throw new Error('something is wrong')
  }
})

//ADMIN--VERIFY A USER
// 1. From route put api/users/verify/:id
// 2. Access = Private/Admin
const verifyUser = asyncHandler(async (req, res) => {
  try {
    // Sql query in user model that fetch one user
    let user = await getOneUserById(req.params.id)
    if (user[0].length === 0) {
      res
        .status(404)
        .json({ status: 404, message: 'Invalid User Id, User is not found' })
      return
    }
    req.user = user[0][0]

    // await pool.query('UPDATE users SET isVerified=? WHERE idusers=?', [
    //   true,
    //   req.user.idusers,
    // ])

    // Sql query in user model that update the user account to verify
    await verifyUserAccount(req.user.idusers)

    res.status(200).json({ status: 200, message: 'User has been verified' })
  } catch (error) {
    throw new Error()
  }
})

//ADMIN--DISABLE A USER
// 1. From route put api/users/disable/:id
// 2. Access = Private/Admin
const disableUser = asyncHandler(async (req, res) => {
  try {
    // Sql query in user model that fetch one user
    let user = await getOneUserById(req.params.id)
    if (user[0].length === 0) {
      res
        .status(404)
        .json({ status: 404, message: 'Invalid  User Id, User is not found' })
      return
    }
    req.user = user[0][0]

    // Sql query in user model that disable the account
    await disableUserAccount(req.user.idusers)

    res.status(200).json({ status: 200, message: 'User has been disabled' })
  } catch (error) {
    throw new Error()
  }
})

//ADMIN--UPGRADE USER TO ADMIN
// 1. From route put api/users/:id
// 2. Access = Private/Admin

const upgradeUser = asyncHandler(async (req, res) => {
  try {
    let user = await getOneUserById(req.params.id)
    if (user[0].length === 0) {
      res
        .status(404)
        .json({ status: 404, message: 'Invalid  User Id, User is not found' })
      return
    }

    req.user = user[0][0]

    if (!req.user.isVerified) {
      res
        .status(406)
        .send({ status: 406, message: 'Please verify the user first' })
    }
    await pool.query('UPDATE users SET isAdmin=? WHERE idusers=?', [
      true,
      req.user.idusers,
    ])

    res
      .status(200)
      .json({ status: 200, message: 'User has been Upgraded to Admin' })
  } catch (error) {
    throw new Error()
  }
})

export {
  LogIn,
  registerUser,
  getUsers,
  verifyUser,
  getUserProfile,
  disableUser,
  upgradeUser,
  verifyEmail,
  resetPassword,
}
