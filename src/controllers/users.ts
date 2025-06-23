import { Request, Response, Router } from 'express';
import { User } from '../mongoose/schemas/user';
import { createUserValidatorSchema } from '../validators/user';
import { hashPassword } from '../utils/helper';
export const usersRouter = Router()

class UsersControllerClass {
  async getUserById(req: Request, res: Response) {
    const { id } = req.params;

    if (!User.base.Types.ObjectId.isValid(id)) {
      return res.status(400).send({ message: 'Invalid User ID format' });
    }

    const user = await User.findById(id, { password: 0 })

    if (!user) res.status(404).send({ message: 'User not found' });

    res.status(200).send(user);
  }

  async createUser(req: Request, res: Response) {
    const result = createUserValidatorSchema.safeParse(req.body);
  
    if (!result.success) {
      return res.status(400).json({ errors: result.error.format() });
    }
  
    const { username, displayName, password } = result.data;
  
    const hashedPassword = hashPassword(password)
  
    if (!username) {
      res.status(400).json({ message: 'Username is required' });
    }
  
    try {
      const newUser = await new User({
        username,
        displayName: (displayName ? displayName : undefined),
        password: hashedPassword,
      }).save()
      return res.status(201).send(newUser)
    } catch (error) {
      return res.status(400).send({
        error
      })
    }
  }
}

export const UsersController = new UsersControllerClass()