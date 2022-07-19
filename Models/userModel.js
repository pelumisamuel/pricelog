// import pool from '../config/db'
import pool from '../config/db.js'

const getAllUsers = () => {
  return pool.query('SELECT * FROM users')
}
const getOneUser = (email) => {
  return pool.query('select * from users where email=?', [email])
}
const getOneUserById = (id) => {
  return pool.query('SELECT * FROM users WHERE id=?', [id])
}
const getOneUserEmail = (email) => {
  return pool.query('select email from users where email=?', [email])
}
const addOneUser = (name, email, harshedPassword) => {
  return pool.query('INSERT into users SET name=?, email=?, password=?', [
    name,
    email,
    harshedPassword,
  ])
}
export { getAllUsers, getOneUser, getOneUserEmail, addOneUser, getOneUserById }
