import { Controller, Post, Body, HttpCode, HttpStatus, Ip } from '@nestjs/common'
import { AuthService } from './auth.service'
import { ZodSerializerDto } from 'nestjs-zod'
import { LoginBodyDTO, RegisterBodyDTO, RegisterResDTO, SendOTPBodyDTO, RefreshTokenBodyDTO, RefreshTokenResDTO, LoginResDTO , LogoutBodyDTO } from '../auth/auth.dto'
import { SendOTPBodyType } from './auth.model'
import { UserAgent } from 'src/shared/decorators/user-agent.decorator'
import { MessageResDTO } from 'src/shared/dtos/response.dto'
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ZodSerializerDto(RegisterResDTO)
  @Post('register')
   register(@Body() body: RegisterBodyDTO) {
    return  this.authService.register(body)
  }

  @Post('send-otp')
  sendOTP(@Body() body: SendOTPBodyDTO) {
    return this.authService.sendOTP(body as SendOTPBodyType)
  }

  @Post('login')
  @ZodSerializerDto(LoginResDTO)
   login(@Body() body: LoginBodyDTO, @UserAgent() userAgent: string, @Ip() ip: string) {
    return this.authService.login({
      ...body,
      userAgent,
      ip,
    })
  }

  // @Post('login')
  //async login(@Body() body: any) {
  //return this.authService.login(body)
  // }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  @ZodSerializerDto(RefreshTokenResDTO)
  refreshToken(@Body() body: RefreshTokenBodyDTO, @UserAgent() userAgent: string, @Ip() ip: string) {
    return this.authService.refreshToken({
      refreshToken: body.refreshToken,
      userAgent,
      ip,
    })
  }

  @Post('logout')
  @ZodSerializerDto(MessageResDTO)
  logout(@Body() body: LogoutBodyDTO) {
    return this.authService.logout(body.refreshToken)
  }
}
