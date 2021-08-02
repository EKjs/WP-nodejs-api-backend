import express from 'express';
import cors from 'cors';
import activitiesRouter from './routes/activitiesRouter.js';
import citiesRouter from './routes/citiesRouter.js';
import regionsRouter from './routes/regionsRouter.js';
import categoriesRouter from './routes/categoriesRouter.js';
import subCategoryRouter from './routes/subCategoryRouter.js';
import durationRouter from './routes/durationRouter.js';
import searchRouter from './routes/searchRouter.js';
import 'dotenv/config.js'
import errorHandler from './middlewares/errorHandler.js';

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());

app.use(express.json());
app.use('/activities',activitiesRouter);
app.use('/cities',citiesRouter);
app.use('/regions',regionsRouter);
app.use('/categories',categoriesRouter);
app.use('/subcategories',subCategoryRouter);
app.use('/duration',durationRouter);
app.use('/search',searchRouter);
app.all('*',(req,res)=>res.status(404).json({error:'Not found'}));
app.use(errorHandler);
app.listen(port,()=>console.log(`Server is listening on port ${port}`));