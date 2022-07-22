// import pool from '../config/db'
import pool from '../Config/db.js'

const getAllUsers = () => {
  return pool.query('SELECT * FROM users')
}
const getOneUser = (email) => {
  return pool.query('SELECT * FROM users WHERE email=?', [email])
}
const getOneUserById = (id) => {
  return pool.query('SELECT * FROM users WHERE idusers=?', [id])
}
const getOneUserEmail = (email) => {
  return pool.query('SELECT email FROM users WHERE email=?', [email])
}
const addOneUser = (name, email, harshedPassword) => {
  return pool.query('INSERT into users SET name=?, email=?, password=?', [
    name,
    email,
    harshedPassword,
  ])
}

const verifyUserEmail = (id) => {
  return pool.query('UPDATE users SET isEmailVerified=? WHERE idusers=?', [
    true,
    id,
  ])
}
const verifyUserAccount = (id) => {
  return pool.query('UPDATE users SET isVerified=? WHERE idusers=?', [true, id])
}
const disableUserAccount = (id) => {
  return pool.query('UPDATE users SET isDisabled=? WHERE idusers=?', [true, id])
}
const createAdminAccount = (id) => {
  return pool.query('UPDATE users SET isAdmin=? WHERE idusers=?', [true, id])
}

export {
  getAllUsers,
  getOneUser,
  getOneUserEmail,
  verifyUserEmail,
  addOneUser,
  getOneUserById,
  verifyUserAccount,
  disableUserAccount,
  createAdminAccount,
}
