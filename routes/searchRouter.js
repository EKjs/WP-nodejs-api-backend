import express from 'express';
import { getSearchQuery } from '../controllers/search.js';

const searchRouter = express.Router();

searchRouter.get('/', getSearchQuery);

export default searchRouter;