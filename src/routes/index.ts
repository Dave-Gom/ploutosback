import { Router } from 'express';
import { readdirSync } from 'fs';
import { cleanFileName } from '../utils/helpers';

export const loadRoutes = async () => {
    const router = Router();
    const PATH_ROUTER = `${__dirname}`;

    readdirSync(PATH_ROUTER).forEach(filename => {
        const cleanName = cleanFileName(filename);
        if (cleanName !== 'index') {
            const moduleRouter = require(`./${cleanName}`);
            router.use(`/${cleanName}`, moduleRouter.router);
        }
    });

    return router;
};
