import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { RolesService } from '../auth/roles.service'
import { AuthRepository } from './auth.repo'

@Module({
  providers: [AuthService, RolesService, AuthRepository],
  controllers: [AuthController],
})
export class AuthModule {}
