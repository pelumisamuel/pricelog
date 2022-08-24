import pool from '../Config/db.js'

const getAllUsers = (pageSize, page) => {
  // should have order by created date but I forgot that in the schema
  // order by createdAt date now works, still keeping the old one because of the previous data
  return pool.query(
    'SELECT * FROM users ORDER BY idusers DESC LIMIT ? OFFSET ? ',
    [pageSize, pageSize * (page - 1)]
  )
}
const countAllUsers = () => {
  return pool.query(`SELECT COUNT(*) FROM users`)
}
const newUsers = () => {
  return pool.query(
    'SELECT * FROM users where isEmailVerified and !isVerified and !isDisabled and !isAdmin ORDER BY idusers DESC'
  )
}
const countNewUsers = () => {
  return pool.query(
    'SELECT COUNT(*) FROM users where isEmailVerified and !isVerified and !isDisabled and !isAdmin'
  )
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
const addOneUser = (name, email, harshedPassword, created) => {
  return pool.query(
    'INSERT into users SET name=?, email=?, password=?, createdAt=?',
    [name, email, harshedPassword, created]
  )
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
  newUsers,
  countNewUsers,
  countAllUsers,
  getOneUser,
  getOneUserEmail,
  verifyUserEmail,
  addOneUser,
  getOneUserById,
  verifyUserAccount,
  disableUserAccount,
  createAdminAccount,
}
