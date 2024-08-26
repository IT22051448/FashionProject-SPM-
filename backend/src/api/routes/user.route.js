import {Router} from 'express';
import userController from '../controllers/user.controller';
import authMiddleware from '../middleware/authMiddleware';

const userRouter = Router();

userRouter.get('/', authMiddleware(['admin']),  userController.getAllUsers);
userRouter.get('/:id', authMiddleware(['admin', 'user']), userController.getUserById);
userRouter.put('/:id', authMiddleware(['admin', 'user']), userController.updateUser);
userRouter.delete('/:id', authMiddleware(['admin', 'user']), userController.deleteUser);

export default userRouter;