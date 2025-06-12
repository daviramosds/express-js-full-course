// types/express-session.d.ts
import 'express-session';
import { IUser } from '../types/User'; // ajuste o caminho do tipo conforme seu projeto

interface IPassport {
  user: number
}

declare module 'express-session' {
  interface SessionData {
    user?: IUser;
    visited?: boolean;
    passport?: IPassport
  }
}
