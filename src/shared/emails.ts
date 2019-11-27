import * as nodemailer from 'nodemailer'
import * as nodemailerSG from 'nodemailer-sendgrid'

const config = require('config')

export class SendEmail {
  private sgKey = process.env.SENDGRID_API_KEY
  private emailConfig = config.get('email')
  private transport = nodemailer.createTransport(
    nodemailerSG({ apiKey: this.sgKey })
  )
  private fromField = `${this.emailConfig.fromName} <${this.emailConfig.fromAddress}>`

  async accountVerificationCode(email: string, code: string): Promise<string> {
    const mailOptions = {
      to: email,
      from: this.fromField,
      subject: 'Please Confirm Your Account',
      text: `Your account was successfully created, and we must confirm that you own this email address.
      Please click on the following link, or paste this into your browser to complete the process:
      ${this.emailConfig.siteUrl}/confirm-email/${code}
      If you did not create this account, please ignore this message and you won't be emailed again.`,
    }
    await this.transport.sendMail(mailOptions)
    return `We just sent an email to ${email}. Please click the link inside to confirm you own this email address`
  }

  async accountVerificationSuccess(email: string): Promise<string> {
    const mailOptions = {
      to: email,
      from: this.fromField,
      subject: 'Account confirmation successful!',
      text: `Congrats! Your account has been successfully confirmed!
      You can now log in: ${this.emailConfig.siteUrl}/login`,
    }
    await this.transport.sendMail(mailOptions)
    return `Account with email ${email} successfully verified!`
  }

  async resetPasswordRequest(email: string, code: string): Promise<string> {
    const mailOptions = {
      to: email,
      from: this.fromField,
      subject: 'Reset your password',
      text: `You are receiving this because you (or someone else) requested the reset of the password for your account.
      Please click on the following link, or paste this into your browser to complete the process:
      ${this.emailConfig.siteUrl}/reset-password/${code}
      If you did not request this, please ignore this email and your password will remain unchanged.`
    };
    await this.transport.sendMail(mailOptions)
    return `An email has been sent to ${email} with further instructions`
  }

  async resetPasswordSuccess(email: string): Promise<string> {
    const mailOptions = {
      to: email,
      from: this.fromField,
      subject: 'Your password was reset',
      text: `This is a confirmation that your password has been successfully reset.`
    }
    await this.transport.sendMail(mailOptions) 
    return `Password for ${email} successfully reset!`
  }
}
