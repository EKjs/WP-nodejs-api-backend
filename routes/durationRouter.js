import express from 'express';
import { getAllDurations, getOneDuration, createDuration, updateDuration, deleteDuration } from '../controllers/durations.js';

const durationRouter = express.Router();

durationRouter.get('/', getAllDurations); //?skip=0&limit=10
durationRouter.get('/:id', getOneDuration);
durationRouter.post('/', createDuration);
durationRouter.put('/:id', updateDuration);
durationRouter.delete('/:id', deleteDuration);

export default durationRouter;