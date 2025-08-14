import { Injectable } from '@nestjs/common'
import { DeviceType, RefreshTokenType, RegisterBodyType, RoleType, VerificationCodeType } from './auth.model'
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

  createRefreshToken(data: { token: string; userId: number; expiresAt: Date; deviceId: number }) {
    return this.prismaService.refreshToken.create({
      data,
    })
  }

  createDevice(
    data: Pick<DeviceType, 'userId' | 'userAgent' | 'ip'> & Partial<Pick<DeviceType, 'lastActive' | 'isActive'>>,
  ) {
    return this.prismaService.device.create({
      data,
    })
  }

  async findUniqueUserIncludeRole(
    uniqueObject: { email: string } | { id: number },
  ): Promise<(UserType & { role: RoleType }) | null> {
    return this.prismaService.user.findUnique({
      where: uniqueObject,
      include: {
        role: true,
      },
    })
  }

  async findUniqueRefreshTokenIncludeUserRole(uniqueObject: {
    token: string
  }): Promise<(RefreshTokenType & { user: UserType & { role: RoleType } }) | null> {
    return this.prismaService.refreshToken.findUnique({
      where: uniqueObject,
      include: {
        user: {
          include: {
            role: true,
          },
        },
      },
    })
  }

  updateDevice(deviceId: number, data: Partial<DeviceType>): Promise<DeviceType> {
    return this.prismaService.device.update({
      where: {
        id: deviceId,
      },
      data,
    })
  }

  deleteRefreshToken(uniqueObject: { token: string }): Promise<RefreshTokenType> {
    return this.prismaService.refreshToken.delete({
      where: uniqueObject,
    })
  }
}
