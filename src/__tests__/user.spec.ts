import { UsersController } from '../controllers/users';
import { User } from '../mongoose/schemas/user';
import { Request, Response } from 'express';

jest.mock('../mongoose/schemas/user', () => ({
  User: {
    findById: jest.fn(),
    base: {
      Types: {
        ObjectId: {
          isValid: jest.fn(),
        },
      },
    },
  },
}));

describe('UsersController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
  });

  describe('getUserById', () => {
    it('should return 400 if the user ID is invalid', async () => {
      mockRequest.params = { id: 'invalid-id' };
      (User.base.Types.ObjectId.isValid as jest.Mock).mockReturnValue(false);

      await UsersController.getUserById(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.send).toHaveBeenCalledWith({ message: 'Invalid User ID format' });
    });

    it('should return 404 if the user is not found', async () => {
      mockRequest.params = { id: '684c207f0a7e846b0fdbcf62' };
      (User.base.Types.ObjectId.isValid as jest.Mock).mockReturnValue(true);
      (User.findById as jest.Mock).mockResolvedValue(null);

      await UsersController.getUserById(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.send).toHaveBeenCalledWith({ message: 'User not found' });
    });

    it('should return 200 and user data if found', async () => {
      const mockUser = {
        _id: '684c207f0a7e846b0fdbcf62',
        username: 'testuser',
        email: 'test@example.com',
      };
      mockRequest.params = { id: '684c207f0a7e846b0fdbcf62' };
      (User.base.Types.ObjectId.isValid as jest.Mock).mockReturnValue(true);
      (User.findById as jest.Mock).mockResolvedValue(mockUser);

      await UsersController.getUserById(mockRequest as Request, mockResponse as Response);

      expect(User.findById).toHaveBeenCalledWith(mockRequest.params.id, { password: 0 });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.send).toHaveBeenCalledWith(mockUser);
    });

    it('should handle internal server errors', async () => {
      mockRequest.params = { id: '684c207f0a7e846b0fdbcf62' };
      (User.base.Types.ObjectId.isValid as jest.Mock).mockReturnValue(true);
      const errorMessage = 'Database error';
      (User.findById as jest.Mock).mockRejectedValue(new Error(errorMessage));

      await expect(UsersController.getUserById(mockRequest as Request, mockResponse as Response))
        .rejects.toThrow(errorMessage);
    });
  });
});