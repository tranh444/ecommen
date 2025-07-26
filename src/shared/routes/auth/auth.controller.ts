import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ZodSerializerDto } from 'nestjs-zod';
import { RegisterBodyDTO, RegisterResDTO } from '../auth/auth.dto'
@Controller('auth')

export class AuthController {
    constructor(private readonly authService: AuthService) {}

  @ZodSerializerDto(RegisterResDTO)
  @Post('register')
  async register(@Body() body: RegisterBodyDTO) {
    return await this.authService.register(body)
  }

  @Post('login')
  async login(@Body() body: any) {
    return this.authService.login(body)
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Body() body: any) {
    return this.authService.refreshToken(body.refreshToken)
  }

  @Post('logout')
  async logout(@Body() body: any) {
    return this.authService.logout(body.refreshToken)
  }
}
