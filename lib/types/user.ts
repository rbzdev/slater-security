export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  username?: string;
  date_joined: string;

}

export interface UserSession {
  userId: string;
  token: string;
}