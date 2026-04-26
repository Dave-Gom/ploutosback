import { Response } from 'express';

export const handleHttp = (res: Response, error: string | any, statusCode: number = 500) => {
    res.statusCode = statusCode;
    if (typeof error === 'string') {
        res.send({ error: error });
    } else {
        res.send(error);
    }
};
