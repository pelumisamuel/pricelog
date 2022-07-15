import bcrypt from 'bcryptjs'
import Joi from 'joi'
import { joiPassword } from 'joi-password'

// hash password from bcrpyt
const hashPassword = async (userPassword) => {
  const convertedUserPassword = userPassword.toString()
  const harshPassword = await bcrypt.hash(convertedUserPassword, 10)
  return harshPassword
}
// comapare password function from bcrypt
const matchPassword = async (newPassword, existingHashedPassword) => {
  return await bcrypt.compare(newPassword, existingHashedPassword)
}

const validateUsers = (user) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().min(3).required(),
    password: joiPassword
      .string()
      .minOfSpecialCharacters(1)
      .minOfNumeric(1)
      .noWhiteSpaces()
      .required(),
  })
  return schema.validate(user)
}
export { hashPassword, matchPassword, validateUsers }
