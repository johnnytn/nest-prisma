import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { UserService } from 'src/user/user.service';

import { AuthController } from './auth.controller';
import { PrismaModule } from 'nestjs-prisma';
import { jwtConstants } from './constants';

import { LocalStrategy } from './strategy/local.strategy';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
    PrismaModule.forRoot(),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    // Add JwtAuthGuard to whole project
    /* {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    }, */
    UserService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}