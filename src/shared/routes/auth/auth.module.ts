import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { RolesService } from '../auth/roles.service'
import { AuthRepository } from './auth.repo'
import { GoogleService } from './google.service'

@Module({
  providers: [AuthService, RolesService, AuthRepository, GoogleService],
  controllers: [AuthController],
})
export class AuthModule {}
