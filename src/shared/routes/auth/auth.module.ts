import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { RolesService } from '../auth/roles.service'

@Module({
  providers: [AuthService, RolesService],
  controllers: [AuthController],
})
export class AuthModule {}