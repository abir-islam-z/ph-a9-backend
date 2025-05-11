export type DecodedJWTPayload = {
  id: string;
  role: 'USER' | 'ADMIN';
  iat: number;
  exp: number;
};
