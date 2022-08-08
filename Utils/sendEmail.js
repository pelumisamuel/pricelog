import nodemailer from 'nodemailer'
import { emailToken } from './generateToken.js'

import dotenv from 'dotenv'
dotenv.config()

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
    const url = `https://${
      process.env.DOMAIN
    }/api/users/confirmation/${emailToken(id)}`
    /**
    I neeed to refactor the the transporter to accomadate various url , subject and html body 
    **/
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
