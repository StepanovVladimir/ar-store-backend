import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRepository } from 'src/repositories/users.repository';
import { AuthController } from './auth.controller';
import { AuthInterface } from './auth.interface';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { PermissionGuard } from './permission.guard';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: async () => ({
        secret: process.env.JWT_SECRET,
        signOptions: {
          expiresIn: 86400
        }
      })
    }),
    TypeOrmModule.forFeature([UsersRepository])
  ],
  controllers: [AuthController],
  providers: [
    { provide: AuthInterface, useClass: AuthService },
    JwtStrategy,
    PermissionGuard
  ],
  exports: [JwtStrategy, PassportModule]
})
export class AuthModule {}
