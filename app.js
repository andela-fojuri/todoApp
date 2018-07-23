import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import routes from './routes/routes';

dotenv.config();
const app = express();

app.use(morgan('tiny'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

routes(app);

export default app;
