export interface UserService {
  getUserIdByEmail(email: string): Promise<string | null>;
  signupUser(email: string, firstName: string, lastName: string, password: string): Promise<void>;
}
