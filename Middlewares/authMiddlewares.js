import pool from '../config/db.js'

const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next()
  } else {
    res.status(401)
    throw new Error('Not authorized; you are not an admin')
  }
}

export { admin }
