import jwt from "jsonwebtoken";

export function signJwt(payload: string | Buffer | object) {
  return jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
}

export function verifyJwt(token: string) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    return decoded;
  } catch (e) {
    return null;
  }
}
