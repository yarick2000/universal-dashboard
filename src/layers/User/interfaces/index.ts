export interface UserService {
  getUserIdByEmail(email: string): Promise<string | null>;
}
