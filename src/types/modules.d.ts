declare module '@/lib/shared/kliv-auth.js' {
  import type { User, KlivAuth } from './kliv';
  const auth: KlivAuth;
  export default auth;
}
declare module '@/lib/shared/kliv-database.js' {
  import type { KlivDatabase } from './kliv';
  const db: KlivDatabase;
  export default db;
}
