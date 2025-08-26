import { Module } from '@nestjs/common';
import { LanguageService } from './language.service'
import { LanguageRepo } from './language.repo'
import { LanguageController } from './language.controller'

@Module({
    providers: [LanguageService, LanguageRepo],
    controllers: [LanguageController],
  })
  export class LanguageModule {}