import jwt from 'jsonwebtoken'

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  })
}

const emailToken = (id) => {
  return jwt.sign({ id }, process.env.EMAIL_SECRET, {
    expiresIn: '24h',
  })
}

export { generateToken, emailToken }
