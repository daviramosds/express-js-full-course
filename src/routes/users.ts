import { Request, Response } from 'express';
import { Router } from "express";
import { body, query, validationResult } from 'express-validator'
import { fakeUsers } from "../utils/constants";
import { ICreateUserBody, IUser, IUserQueryParams } from '../types/users';
import {resolveIndexByUserId} from '../utils/middleware'
export const usersRouter = Router()

usersRouter.get('/', query('filter').isString(), (req: Request, res: Response) => {

  // @ts-ignore aaa
  const { errors } = validationResult(req)
  if (errors.length > 0) res.sendStatus(400)

  const { filter, value } = req.query as IUserQueryParams

  let filteredUsers: IUser[] = [...fakeUsers]

  if (filter && value) {
    switch (filter) {
      case 'username':
        filteredUsers = fakeUsers.filter(user => user.username.toLocaleLowerCase().includes(value.toLowerCase()))
        break;
      case 'displayName':
        filteredUsers = fakeUsers.filter(user => user.displayName.toLocaleLowerCase().includes(value.toLowerCase()))
        break;
      default:
        break
    }
  }

  res.status(200).send(filteredUsers);
});

usersRouter.get('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const parsedId = parseInt(id);

  const user = fakeUsers.find((user: IUser) => user.id === parsedId);

  if (!user)  res.status(404).send({ message: 'User not found' });

  res.status(200).send(user);
});

usersRouter.post('', body('username').notEmpty(), (req: Request<object, object, ICreateUserBody>, res: Response) => {

  // @ts-ignore aaa
  const { errors } = validationResult(req)
  if (errors.length > 0) res.sendStatus(400)
    console.log(errors)
    
  const { username, displayName } = req.body;

  if (!username) {
    res.status(400).json({ message: 'Username is required' });
  }

  const newUser: IUser = {
    id: fakeUsers.length > 0 ? Math.max(...fakeUsers.map(u => u.id)) + 1 : 1,
    username,
    displayName
  };

  fakeUsers.push(newUser);

  res.status(201).json(newUser);
})

// @ts-ignore i dont really know
usersRouter.put('/:id', resolveIndexByUserId, (req: RequestFindUserIndex, res: Response) => {
  const { findUserIndex, body} = req

  const updatedUser = fakeUsers[findUserIndex] = { id: fakeUsers[findUserIndex].id, ...body }

  res.status(200).json(updatedUser)
  
})

// @ts-ignore i dont really know
usersRouter.patch('/:id', resolveIndexByUserId, (req: resolveIndexByUserId, res: Response) => {
  const { findUserIndex, body} = req
  
  const updatedUser = fakeUsers[findUserIndex] = { ...fakeUsers[findUserIndex], ...body }

  res.status(200).json(updatedUser)
  
})

// @ts-ignore i dont really know
usersRouter.delete('/:id', resolveIndexByUserId, (req: resolveIndexByUserId, res: Response) => {

  fakeUsers.splice(req.resolveIndexByUserId, 1)

  res.status(200).json({
    msg: 'User removed'
  })
  
})
