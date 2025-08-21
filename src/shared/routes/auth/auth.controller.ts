import { Controller, Post, Body, Get, HttpCode, HttpStatus, Ip , Query , Res } from '@nestjs/common'
import { AuthService } from './auth.service'
import { ZodSerializerDto } from 'nestjs-zod'
import { Response } from 'express'
import { LoginBodyDTO, RegisterBodyDTO, RegisterResDTO, SendOTPBodyDTO, RefreshTokenBodyDTO, RefreshTokenResDTO, LoginResDTO , LogoutBodyDTO , GetAuthorizationUrlResDTO  } from '../auth/auth.dto'
import { SendOTPBodyType } from './auth.model'
import { UserAgent } from 'src/shared/decorators/user-agent.decorator'
import { IsPublic } from 'src/shared/decorators/auth.decorator'
import { MessageResDTO } from 'src/shared/dtos/response.dto'
import { GoogleService } from 'src/shared/routes/auth/google.service'
import envConfig from 'src/shared/config'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService,
    private readonly googleService: GoogleService,
  ) {}

  @ZodSerializerDto(RegisterResDTO)
  @Post('register')
  @IsPublic()
   register(@Body() body: RegisterBodyDTO) {
    return  this.authService.register(body)
  }
  @IsPublic()
  @Post('send-otp')
  @ZodSerializerDto(MessageResDTO)
  sendOTP(@Body() body: SendOTPBodyDTO) {
    return this.authService.sendOTP(body as SendOTPBodyType)
  }

  @IsPublic() 
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
  @IsPublic()
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
  @Get('google-link')
  @IsPublic()
  @ZodSerializerDto(GetAuthorizationUrlResDTO)
  getAuthorizationUrl(@UserAgent() userAgent: string, @Ip() ip: string) {
    return this.googleService.getAuthorizationUrl({
      userAgent,
      ip,
    })
  }
  @Get('google/callback')
  @IsPublic()
  async googleCallback(@Query('code') code: string, @Query('state') state: string, @Res() res: Response) {
    try {
      const data = await this.googleService.googleCallback({
        code,
        state,
      })
      return res.redirect(
        `${envConfig.GOOGLE_CLIENT_REDIRECT_URI}?accessToken=${data.accessToken}&refreshToken=${data.refreshToken}`,
      )
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Đã xảy ra lỗi khi đăng nhập bằng Google, vui lòng thử lại bằng cách khác'
      return res.redirect(`${envConfig.GOOGLE_CLIENT_REDIRECT_URI}?errorMessage=${message}`)
    }
  }
}
