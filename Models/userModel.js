const getAllUsers = () => {
  return 'SELECT * FROM users'
}
const getOneUser = () => {
  return 'select * from users where email=?'
}
const getOneUserEmail = () => {
  return 'select email from users where email=?'
}
export { getAllUsers, getOneUser, getOneUserEmail }
