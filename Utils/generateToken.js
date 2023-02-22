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
const otpToken = () => {
  const otp = Math.floor(1000 + Math.random() * 9000)
  const expiryTime = new Date()
  expiryTime.setTime(new Date().getTime() + 30 * 60 * 1000)
  return { otp, expiryTime }
}

export { generateToken, emailToken, otpToken }
