import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common'
import { AuthService } from './auth.service'
import { ZodSerializerDto } from 'nestjs-zod'
import { RegisterBodyDTO, RegisterResDTO, SendOTPBodyDTO } from '../auth/auth.dto'
import { SendOTPBodyType } from './auth.model'
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ZodSerializerDto(RegisterResDTO)
  @Post('register')
  async register(@Body() body: RegisterBodyDTO) {
    return await this.authService.register(body)
  }

  @Post('send-otp')
  sendOTP(@Body() body: SendOTPBodyDTO) {
    return this.authService.sendOTP(body as SendOTPBodyType)
  }

  // @Post('login')
  //async login(@Body() body: any) {
  //return this.authService.login(body)
  // }

  //@Post('refresh-token')
  //@HttpCode(HttpStatus.OK)
  //async refreshToken(@Body() body: any) {
  //return this.authService.refreshToken(body.refreshToken)
  //}

  //@Post('logout')
  //async logout(@Body() body: any) {
  //return this.authService.logout(body.refreshToken)
  //}
}
