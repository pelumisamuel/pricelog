import nodemailer from 'nodemailer'
import { emailToken } from './generateToken.js'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 465,

  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASSWORD,
  },
})

const sendVerificationLink = async (email, id) => {
  try {
    const url = `http://localhost:3000/api/users/confirmation/${emailToken(id)}`
    await transporter.sendMail({
      from: 'price log <priceloggger@gmail.com>',
      to: email,
      subject: 'Verify your Email',
      html: `Please click this link to confirm your email: <a href="${url}">${url}</a>`,
    })
  } catch (error) {
    res.send(error)
    throw new Error('Verification Link Could not be sent')
  }
}

export { sendVerificationLink }
