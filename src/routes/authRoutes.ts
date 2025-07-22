import { Router } from 'express';
import {
    createUser,
    loginUser,
    refreshLogin,
} from '../controllers/authController';

const authRouter = Router();

authRouter.post('/signup', createUser);
authRouter.post('/login', loginUser);
authRouter.post('/refresh', refreshLogin);

export default authRouter;
