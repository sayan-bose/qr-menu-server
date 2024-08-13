import jwt, { JwtPayload } from 'jsonwebtoken';

export const generateJWT = (
  data: Record<string, any>,
  options: jwt.SignOptions = {}
): string => {
  const privateKey = process.env.JWT_KEY;

  if (privateKey) {
    const token = jwt.sign(data, privateKey, options);

    return token;
  }

  throw new Error('Failed to sign token: Unable to parse jwt key');
};

export const generateAdminToken = (data: Record<string, any>) => {
  return generateJWT({ ...data, isAdmin: true });
};

export const generateGuestToken = (data: Record<string, any>) => {
  return generateJWT({ ...data, isAdmin: false });
};

export const validateToken = (
  token: string
): string | JwtPayload | undefined => {
  const privateKey = process.env.JWT_KEY;

  if (privateKey) {
    const decoded = jwt.verify(token, privateKey);

    return decoded;
  }

  throw new Error('Failed to verify token: Unable to parse jwt key');
};
