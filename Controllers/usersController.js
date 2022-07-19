import asyncHandler from 'express-async-handler'
import generateToken from '../Utils/generateToken.js'

import {
  matchPassword,
  hashPassword,
  validateUsers,
} from '../Utils/validate.js'
import {
  addOneUser,
  getAllUsers,
  getOneUser,
  getOneUserById,
  getOneUserEmail,
} from '../Models/userModel.js'
import pool from '../config/db.js'

//LOGIN USER
const LogIn = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  let user = await getOneUser(email)
  user = user[0][0]

  if (user && (await matchPassword(password, user.password))) {
    if (!user.isVerified && !user.isAdmin) {
      res.status(401).send({
        status: 401,
        message: 'Not Authorized, You Have Not Been Verified',
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

//ADMIN FUNCTION

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

//ADMIN--VERIFY A USER
// 1. From route put api/users/verify/:id
// 2. Access = Private/Admin
const verifyUser = asyncHandler(async (req, res) => {
  try {
    let user = await pool.query('SELECT * FROM users WHERE idusers=?', [
      req.params.id,
    ])
    if (user[0].length === 0) {
      res
        .status(404)
        .json({ status: 404, message: 'Invalid User Id, User is not found' })
      return
    }
    req.user = user[0][0]

    await pool.query('UPDATE users SET isVerified=? WHERE idusers=?', [
      true,
      req.user.idusers,
    ])

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
    let user = await pool.query('SELECT * FROM users WHERE idusers=?', [
      req.params.id,
    ])
    if (user[0].length === 0) {
      res
        .status(404)
        .json({ status: 404, message: 'Invalid  User Id, User is not found' })
      return
    }
    req.user = user[0][0]

    await pool.query('UPDATE users SET isDisabled=? WHERE idusers=?', [
      true,
      req.user.idusers,
    ])

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
    let user = await pool.query('SELECT * FROM users WHERE idusers=?', [
      req.params.id,
    ])
    if (user[0].length === 0) {
      res
        .status(404)
        .json({ status: 404, message: 'Invalid  User Id, User is not found' })
      return
    }

    req.user = user[0][0]
    console.log(req.user.idusers)
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
}
