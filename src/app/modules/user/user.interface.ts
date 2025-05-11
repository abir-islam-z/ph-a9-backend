import { User, UserRole } from '@prisma/client';

export type TUser = User;

export type IUserFilterRequest = {
  searchTerm?: string;
  role?: UserRole;
  isBlocked?: boolean;
  isPremium?: boolean;
};

export interface IJwtPayload {
  id: string;
  role: string;
  email: string;
}

export interface IPasswordChange {
  oldPassword: string;
  newPassword: string;
}

export interface IPasswordReset {
  email: string;
}

export interface ILoginUser {
  email: string;
  password: string;
}

export interface IDecodedToken {
  id: string;
  role: string;
  email: string;
  iat: number;
  exp: number;
}
