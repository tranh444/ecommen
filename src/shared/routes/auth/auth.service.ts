import { Injectable } from '@nestjs/common'
import {  UnprocessableEntityException } from '@nestjs/common/exceptions'
import { HashingService } from 'src/shared/services/hashing.service'
import { RolesService } from './roles.service'
import { isUniqueConstraintPrismaError } from 'src/shared/helpers'
import { AuthRepository } from './auth.repo'
import { SendOTPBodyType } from './auth.model'
import { SharedUserRepository } from 'src/shared/repositories/share-user.repo'
import { generateOTP } from 'src/shared/helpers'
import { addMilliseconds } from 'date-fns'
import ms from 'ms'
import envConfig from 'src/shared/config'
import { TypeOfVerificationCode } from '../../constants/auth.constant'
import { EmailService } from 'src/shared/services/email.service'

@Injectable()
export class AuthService {
  constructor(
    private readonly hashingService: HashingService,
    private readonly rolesService: RolesService,
    private readonly authRepository: AuthRepository,
    private readonly sharedUserRepository: SharedUserRepository,
    private readonly emailService: EmailService
  ) {}
  async register(body: any) {
    try {
      const vevificationCode = await this.authRepository.findUniqueVerificationCode({
        email: body.email,
        code: body.code,
        type: TypeOfVerificationCode.REGISTER,
      })
      if (!vevificationCode) {
        throw new UnprocessableEntityException([
          {
            message: 'Mã OTP không hợp lệ',
            path: 'code',
          },
        ])
      }
      if (vevificationCode.expiresAt < new Date()) {
        throw new UnprocessableEntityException([
          {
            message: 'Mã OTP đã hết hạn',
            path: 'code',
          },
        ])
      }
      const clientRoleId = await this.rolesService.getClientRoleId()
      const hashedPassword = await this.hashingService.hash(body.password)
      return await this.authRepository.createUser({
        email: body.email,
        password: hashedPassword,
        name: body.name,
        phoneNumber: body.phoneNumber,
        roleId: clientRoleId,
      })
    } catch (error) {
      console.log('Register error:', error)
      if (isUniqueConstraintPrismaError(error))
        throw new UnprocessableEntityException([
          {
            message: 'Email đã tồn tại',
            path: 'email',
          },
        ])
      throw error
    }
  }
  async sendOTP(body: SendOTPBodyType) {
    // 1. Kiểm tra email đã tồn tại trong database chưa
    const user = await this.sharedUserRepository.findUnique({
      email: body.email,
    })
    if (user) {
      throw new UnprocessableEntityException([
        {
          message: 'Email đã tồn tại',
          path: 'email',
        },
      ])
    }
    // 2. Tạo mã OTP
    const code = generateOTP()
    const verificationCode = this.authRepository.createVerificationCode({
      email: body.email,
      code,
      type: body.type,
      expiresAt: addMilliseconds(new Date(), ms(envConfig.OTP_EXPIRES_IN)),
    })
    // 3. Gửi mã OTP
    const { error } = await this.emailService.sendOTP({
      email: body.email,
      code,
    })
    if (error) {
      throw new UnprocessableEntityException([
        {
          message: 'Gửi mã OTP thất bại',
          path: 'code',
        },
      ])
    }
    
    return verificationCode
  }
}
