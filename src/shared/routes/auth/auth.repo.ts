import { Injectable } from '@nestjs/common'
import { RegisterBodyType, VerificationCodeType } from './auth.model'
import { PrismaService } from 'src/shared/services/prisma.service'
import { UserType } from 'src/shared/models/shared-user.model'
import { TypeOfVerificationCodeType } from '../../constants/auth.constant'
@Injectable()
export class AuthRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createUser(
    user: Omit<RegisterBodyType, 'confirmPassword' | 'code'> & Pick<UserType, 'roleId'>,
  ): Promise<Omit<UserType, 'password' | 'totpSecret'>> {
    return this.prismaService.user.create({
      data: user,
      omit: {
        password: true,
        totpSecret: true,
      },
    })
  }
  async createVerificationCode(
    payload: Pick<VerificationCodeType, 'email' | 'type' | 'code' | 'expiresAt'>,
  ): Promise<VerificationCodeType> {
    return this.prismaService.verificationCode.upsert({
      where: {
        email_type: {
          email: payload.email,
          type: payload.type,
        },
      },
      update: {
        code: payload.code,
        expiresAt: payload.expiresAt,
      },
      create: payload,
    })
  }

  async findUniqueVerificationCode(
    uniqueValue:
      | { id: number }
      | { email_type: { email: string; type: TypeOfVerificationCodeType } }
      | { email: string; code: string; type: TypeOfVerificationCodeType },
  ): Promise<VerificationCodeType | null> {
    if ('email' in uniqueValue && 'code' in uniqueValue && 'type' in uniqueValue) {
      return this.prismaService.verificationCode.findFirst({
        where: {
          email: uniqueValue.email,
          code: uniqueValue.code,
          type: uniqueValue.type,
        },
      })
    }
    return this.prismaService.verificationCode.findUnique({
      where: uniqueValue as any,
    })
  }
}
