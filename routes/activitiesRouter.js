import express from 'express';
import { getAllActivities, getOneActivity, createActivity, updateActivity, deleteActivity } from '../controllers/activities.js';

const activitiesRouter = express.Router();

activitiesRouter.get('/', getAllActivities);
activitiesRouter.get('/:id', getOneActivity);
activitiesRouter.post('/', createActivity);
activitiesRouter.put('/:id', updateActivity);
activitiesRouter.delete('/:id', deleteActivity);

export default activitiesRouter;