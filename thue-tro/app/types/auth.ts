import type { Users } from "./prisma-models";

export interface AuthSession {
  access_token: string;
  token_type: "Bearer";
  expires_in: number; // giây
  user: Users;
}

export interface LoginInput {
  phone: string;
  password: string;
}

export interface RegisterInput {
  fullName: string;
  phone: string;
  password: string;
  referrerPhone: string;
  accountType: string;
}