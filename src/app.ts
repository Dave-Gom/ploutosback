import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import { loadRoutes } from './routes/index';

const main = async () => {
    try {
        const router = await loadRoutes();
        const PORT = process.env.PORT || 925;
        const app = express();
        app.use(
            express.urlencoded({
                extended: true,
            })
        );
        app.use(express.json());
        app.use(cors());

        app.use(router);

        app.listen(PORT, () => {
            console.log(`listo por el puerto ${PORT}`);
        });
    } catch (error) {
        console.error('Ha ocurrido un error', error);
    }
};

main();
