import { UserResolver } from '../modules/user/resolver';
import { AuthResolver } from '../modules/auth/resolver';
import { MenuResolver } from '../modules/menu/resolver';
import { CategoryResolver } from '../modules/category/resolver';
import { ItemResolver } from '../modules/item/resolver';
import { TableResolver } from '../modules/table/resolver';
import { OrderResolver } from '../modules/order/resolver';
import { TableSessionResolver } from '../modules/table-session/resolvers';

export {
  UserResolver,
  AuthResolver,
  MenuResolver,
  CategoryResolver,
  ItemResolver,
  TableResolver,
  OrderResolver,
  TableSessionResolver
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const resolvers: any = [
  UserResolver,
  AuthResolver,
  MenuResolver,
  CategoryResolver,
  ItemResolver,
  TableResolver,
  OrderResolver,
  TableSessionResolver
];

export default resolvers;
