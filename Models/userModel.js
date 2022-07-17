const getAllUsers = () => {
  return 'SELECT * FROM users'
}
const getOneUser = (email) => {
  return 'select email from users where email=?', [email]
}
export { getAllUsers, getOneUser }
