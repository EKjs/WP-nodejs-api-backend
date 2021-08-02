import express from 'express';
import { getAllCities, getOneCity, createCity, updateCity, deleteCity } from '../controllers/cities.js';

const citiesRouter = express.Router();

citiesRouter.get('/', getAllCities); //?skip=0&limit=10
citiesRouter.get('/:id', getOneCity);
citiesRouter.post('/', createCity);
citiesRouter.put('/:id', updateCity);
citiesRouter.delete('/:id', deleteCity);

export default citiesRouter;