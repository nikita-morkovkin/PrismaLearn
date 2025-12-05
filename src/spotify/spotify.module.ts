import { HttpModule } from '@nestjs/axios';
import { DynamicModule, Module } from '@nestjs/common';
import {
  SpotifyAsyncOptions,
  SpotifyOptionsSymbol,
  type SpotifyOptions,
} from './interfaces/spotify-options.interface.js';
import { SpotifyService } from './spotify.service.js';

@Module({})
export class SpotifyModule {
  static forRoot(options: SpotifyOptions): DynamicModule {
    return {
      module: SpotifyModule,
      imports: [HttpModule],
      providers: [
        {
          provide: SpotifyOptionsSymbol,
          useValue: options,
        },
        SpotifyService,
      ],
      exports: [SpotifyService],
      global: true,
    };
  }

  static forRootAsync(options: SpotifyAsyncOptions): DynamicModule {
    return {
      module: SpotifyModule,
      imports: [HttpModule, ...(options.imports ?? [])],
      providers: [
        {
          provide: SpotifyOptionsSymbol,
          useFactory: options.useFactory,
          inject: options.inject ?? [],
        },
        SpotifyService,
      ],
      exports: [SpotifyService],
      global: true,
    };
  }
}
