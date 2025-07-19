import { Router } from 'express';
import {
    createUser,
    loginUser,
} from '../controllers/authController';

const authRouter = Router();

authRouter.post('/signup', createUser);
authRouter.post('/login', loginUser);

export default authRouter;
