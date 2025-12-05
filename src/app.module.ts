import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { getServeStaticConfig } from './config/servestatic.config.js';
import { getSpotifyConfig } from './config/spotify.config.js';
import { FileModule } from './file/file.module.js';
import { PrismaModule } from './prisma.module.js';
import { SpotifyModule } from './spotify/spotify.module.js';
import { UserModule } from './user/user.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    UserModule,
    SpotifyModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getSpotifyConfig,
      inject: [ConfigService],
    }),
    getServeStaticConfig(),
    FileModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
