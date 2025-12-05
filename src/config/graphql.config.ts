import { ApolloDriver } from '@nestjs/apollo';
import { join } from 'path';

export const getGraphQlConfig = () => {
  return {
    driver: ApolloDriver,
    autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    sortSchema: true,
    playground: true,
    context: ({ req, res }: { req: Request; res: Response }) => ({
      req,
      res,
    }),
  };
};
