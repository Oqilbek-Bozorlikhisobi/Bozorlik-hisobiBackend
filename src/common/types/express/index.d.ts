import 'express';

declare module 'express' {
  export interface Request {
    user?: any; // yoki aniqroq interface (masalan: JwtPayload)
  }
}
