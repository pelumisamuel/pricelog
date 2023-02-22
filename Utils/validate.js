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
    name: Joi.string()
      .min(3)
      .required()
      .messages({ 'any.required': 'A name is required' }),
    email: Joi.string().min(15).required().email().messages({
      'string.min': 'email should be a maximum of 15 characters',
      'string.email': 'The email should be a valid email',
    }),
    password: joiPassword
      .string()
      .minOfSpecialCharacters(1)
      .minOfNumeric(1)
      .noWhiteSpaces()
      .required(),

    confirm_password: Joi.string()
      .required()
      .valid(Joi.ref('password'))
      .messages({
        'any.required': 'You need to add a confirm password',
        'any.only': 'passwords do not match',
      }),
  })
  return schema.validate(user)
}
export { hashPassword, matchPassword, validateUsers }
