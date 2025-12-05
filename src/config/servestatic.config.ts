import { DynamicModule } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import path from 'path';

export const getServeStaticConfig = (): DynamicModule => {
  return ServeStaticModule.forRoot({
    rootPath: path.join(process.cwd(), '..', 'uploads'),
    serveRoot: '/static',
  });
};
