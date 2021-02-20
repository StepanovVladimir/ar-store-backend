import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRepository } from 'src/repositories/users.repository';
import { AuthController } from './auth.controller';
import { AuthInterface } from './auth.interface';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'qwerty1234567890',
      signOptions: {
        expiresIn: 86400
      }
    }),
    TypeOrmModule.forFeature([UsersRepository])
  ],
  controllers: [AuthController],
  providers: [
    {provide: AuthInterface, useClass: AuthService},
    JwtStrategy
  ],
  exports: [JwtStrategy, PassportModule]
})
export class AuthModule {}
