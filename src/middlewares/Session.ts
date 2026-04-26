import { NextFunction, Request, Response } from 'express';
import { virifyToken } from '../utils/jdt.handler';

export const checkSession = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const isUser = virifyToken(`${req.headers.clientsecret}`);

        if (isUser) {
            next();
        } else {
            throw new Error('Usuario Invalido');
        }
    } catch (error) {
        res.statusCode = 401;
        res.send({ error: 'Sesion no valida' });
    }
};
