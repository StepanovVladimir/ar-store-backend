import * as nodemailer from 'nodemailer';

export const sendEmail = async (email: string, link: string) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS
    }
  })

  await transporter.sendMail({
    to: email,
    subject: 'Подтвердите email',
    html: `Пожалуйста кликните по этой ссылке, чтобы подтвердить свой email: <a href="${link}">Подтвердить email</a>`
  })
}
