import * as nodemailer from 'nodemailer';

export const sendEmail = async (email: string, link: string) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS
    }
  })

  const info = await transporter.sendMail({
    to: email,
    subject: 'Confirm Email',
    text: 'Hello world?',
    html: `Please click this email to confirm your email: <a href="${link}">Confirm email</a>`
  })
}
