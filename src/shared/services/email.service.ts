import { Injectable } from '@nestjs/common'
import { Resend } from 'resend'
import envConfig from 'src/shared/config'
import * as React from 'react'
import OTPEmail from 'emails/otp'
@Injectable()
export class EmailService {
  private resend: Resend
  constructor() {
    this.resend = new Resend(envConfig.RESEND_API_KEY)
  }

  async sendOTP(payload: { email: string; code: string }) {
    const subject = 'Mã OTP'
    return this.resend.emails.send({
      from: 'Ecommerce <onboarding@ducmanh204584.io.vn>',
      to: [payload.email],
      subject,
      react: React.createElement(OTPEmail, { otpCode: payload.code, title: subject }),
    })
  }
}
