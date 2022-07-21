import pool from '../config/db.js'
import asyncHandler from 'express-async-handler'
import jwt from 'jsonwebtoken'

const protect = asyncHandler(async (req, res, next) => {
  let token

  //console.log(req.headers.authorization)
  //   if (
  //     req.headers.authorization &&
  //     req.headers.authorization.startsWith('Bearer')
  //   ) {
  //     console.log('Token found')
  //   } else if (!token) {
  //     res.status(401)
  //     throw new Error('Not authorized, no token')
  //   }

  // if (token) token = req.headers.authorization.split(' ')[1]
  if (req.headers.authorization) token = req.headers.authorization.split(' ')[1]
  // console.log(token)

  if (!token) {
    res.status(401)
    throw new Error('Not authorized, you have no access token')
  }
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      let user = await pool.query('select * from users where idusers=?', [
        decoded.id,
      ])
      req.user = user[0][0]

      next()
    } catch (error) {
      console.log(error)
      res.status(401)
      throw new Error('Not Authorized, token failed')
    }
    console.log('Token found')
  }
})

const verified = (req, res, next) => {
  if ((req.user && req.user.isVerified) || req.user.isAdmin) {
    next()
  } else {
    res.status(401)
    throw new Error('Not Authorized; You are not verified')
  }
}
const notDisabled = (req, res, next) => {
  if (req.user && !req.user.isDisabled) {
    next()
  } else {
    res.status(401)
    throw new Error('Not Authorized; Your Account Has Been Disabled')
  }
}

const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next()
  } else {
    res.status(401)
    throw new Error('Not authorized; you are not an admin')
  }
}

export { admin, protect, verified, notDisabled }
