import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import config from '../../config';
import prisma from '../../config/prisma';
import AppError from '../../errors/AppError';
import { TLoginUser } from './auth.interface';
import { createToken, verifyToken } from './auth.utils';
import { TRegister } from './auth.validation';

const registerUser = async (payload: TRegister) => {
  // Hash the password
  const hashedPassword = await bcrypt.hash(
    payload.password,
    Number(config.bcrypt_salt_rounds),
  );

  // Create the user with Prisma
  await prisma.user.create({
    data: {
      ...payload,
      password: hashedPassword,
    },
  });
};

const loginUser = async (
  payload: TLoginUser,
): Promise<{
  accessToken: string;
  refreshToken: string;
}> => {
  // Find user by email
  const user = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }

  const isBlocked = user.isBlocked;

  if (isBlocked) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'Your account has been deactivated. Please contact support !',
    );
  }

  // Verify password
  const isPasswordMatched = await bcrypt.compare(
    payload.password,
    user.password,
  );

  if (!isPasswordMatched) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid Credentials');
  }

  const jwtPayload = {
    userId: user.id,
    role: user.role,
    name: user.name,
    email: user.email,
  };

  const accessToken = createToken({
    jwtPayload,
    secret: config.jwt.access_secret as string,
    expiresIn: config.jwt.access_expires_in as string,
  });

  const refreshToken = createToken({
    jwtPayload,
    secret: config.jwt.refresh_secret as string,
    expiresIn: config.jwt.refresh_expires_in as string,
  });

  return {
    accessToken,
    refreshToken,
  };
};

const changePassword = async (payload: {
  userId: string;
  oldPassword: string;
  newPassword: string;
}): Promise<void> => {
  // Find user by ID
  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Verify old password
  const isPasswordMatched = await bcrypt.compare(
    payload.oldPassword,
    user.password,
  );

  if (!isPasswordMatched) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid Credentials');
  }

  // Hash the new password
  const hashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  // Update the user
  await prisma.user.update({
    where: { id: payload.userId },
    data: {
      password: hashedPassword,
      passwordChangedAt: new Date(),
    },
  });

  return;
};

const refreshToken = async (token: string) => {
  // checking if the given token is valid
  const decoded = verifyToken(token, config.jwt.refresh_secret as string);

  const { email, iat } = decoded;

  // checking if the user exists
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }

  // checking if the user is already blocked
  const isBlocked = user?.isBlocked;

  if (isBlocked) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked !');
  }

  // Check if password was changed after token was issued
  if (
    user.passwordChangedAt &&
    new Date(user.passwordChangedAt).getTime() / 1000 > (iat as number)
  ) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized !');
  }

  const jwtPayload = {
    userId: user.id,
    role: user.role,
    name: user.name,
    email: user.email,
  };

  const accessToken = createToken({
    jwtPayload,
    secret: config.jwt.access_secret as string,
    expiresIn: config.jwt.access_expires_in as string,
  });

  return {
    accessToken,
  };
};

export const AuthService = {
  registerUser,
  loginUser,
  changePassword,
  refreshToken,
};
