import { Request } from 'express';

export interface IUser {
  id: number;
  username: string;
  displayName: string;
}

export interface IUserQueryParams {
  filter?: 'username' | 'displayName';
  value?: string;
}

export interface ICreateUserBody {
  username: string;
  displayName: string;
}

export interface RequestFindUserIndex extends Request {
  findUserIndex?: number; // Agora é uma propriedade que você espera que exista
}