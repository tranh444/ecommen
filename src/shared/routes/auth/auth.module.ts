import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RolesService } from '../auth/roles.service';
@Module({})
export class AuthModule {
  providers: [AuthService, RolesService]
  controllers: [AuthController]

}
