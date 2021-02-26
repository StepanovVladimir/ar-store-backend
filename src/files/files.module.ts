import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { AuthModule } from 'src/auth/auth.module';
import { FilesController } from './files.controller';

@Module({
  imports: [MulterModule.register(), AuthModule],
  controllers: [FilesController]
})
export class FilesModule {}
