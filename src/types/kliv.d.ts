export interface User {
  userUuid: string;
  email: string;
  firstName?: string;
  lastName?: string;
  groups?: Array<{ key: string; name: string }>;
  isPrimaryTeam: boolean;
  userMetadata: Record<string, unknown>;
}
export class KlivAuth {
  signUp(email: string, password: string, name?: string, locale?: string, metadata?: Record<string, unknown>): Promise<User>;
  signIn(email: string, password: string): Promise<User>;
  signOut(): Promise<void>;
  getUser(): Promise<User | null>;
  requestPasswordReset(email: string): Promise<void>;
  resetPassword(resetToken: string, newPassword: string): Promise<void>;
}
export class KlivDatabase {
  query(table: string, params?: Record<string, string>): Promise<any[]>;
  get(table: string, id: number | string): Promise<any | null>;
  insert(table: string, data: Record<string, unknown>): Promise<any>;
  update(table: string, filterParams: Record<string, string>, data: Record<string, unknown>): Promise<any[]>;
  delete(table: string, filterParams: Record<string, string>): Promise<any[]>;
  count(table: string, params?: Record<string, string>): Promise<number>;
}
