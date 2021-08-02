import express from 'express';
import { getAllRegions, getOneRegion, createRegion, updateRegion, deleteRegion } from '../controllers/regions.js';

const regionsRouter = express.Router();

regionsRouter.get('/', getAllRegions); //?skip=0&limit=10
regionsRouter.get('/:id', getOneRegion);
regionsRouter.post('/', createRegion);
regionsRouter.put('/:id', updateRegion);
regionsRouter.delete('/:id', deleteRegion);

export default regionsRouter;