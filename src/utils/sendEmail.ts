import nodemailer from 'nodemailer'
import type SMTPTransport from 'nodemailer/lib/smtp-transport'
interface ISentEmailOption {
  email: string
  subject: string
  message: string
}
export const sendEmail = async (option: ISentEmailOption): Promise<void> => {
  const transportOption: SMTPTransport.Options = {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT as string, 10),
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.PASSWORD
    }
  }
  console.log(transportOption)
  console.log(process.env.SMTP_EMAIL)
  console.log(process.env.PASSWORD)
  const transporter = nodemailer.createTransport(transportOption)

  const message = {
    form: `${process.env.FROM_NAME} <${process.env.EMAIL}>`,
    to: option.email,
    subject: option.subject,
    text: option.message
  }
  const info = await transporter.sendMail(message)
  console.log('Message sent: ', info.messageId)
}
