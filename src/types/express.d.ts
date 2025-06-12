// src/types/express.d.ts (or wherever you placed this declaration)
import { IUser } from "./users"; // Adjust path as needed

/* eslint-disable @typescript-eslint/no-empty-object-type */
declare global {
  namespace Express {
    interface User extends IUser {}
  }
}