import { Router } from 'express';
import {
    getUserInfo,
    changeUserInfo,
    deleteUser,
    changeUserPassword,
} from '../controllers/usersController';
import { JWTAuth } from '../middleware/auth';

const usersRouter = Router();

usersRouter.get('/me', JWTAuth, getUserInfo);
usersRouter.patch('/me', JWTAuth, changeUserInfo);
usersRouter.delete('/me', JWTAuth, deleteUser);
usersRouter.patch('/me/password', JWTAuth, changeUserPassword);

export default usersRouter;
