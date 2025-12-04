import { ApolloDriver } from '@nestjs/apollo';
import { join } from 'path';

/**
 * Конфигурация GraphQL модуля
 * 
 * ВАЖНО: context необходим для работы guards
 * Он пробрасывает Express request в GraphQL контекст,
 * что позволяет GqlAuthGuard извлечь заголовки с токеном
 */
export const getGraphQlConfig = () => {
  return {
    driver: ApolloDriver,
    autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    sortSchema: true,
    playground: true,
    // Передаём Express request в GraphQL контекст
    context: ({ req, res }: { req: Request; res: Response }) => ({
      req,
      res,
    }),
  };
};
