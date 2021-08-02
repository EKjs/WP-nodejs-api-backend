import express from 'express';
import { getAllCategories, getOneCategory, createCategory, updateCategory, deleteCategory } from '../controllers/categories.js';

const categoriesRouter = express.Router();

categoriesRouter.get('/', getAllCategories); //?skip=0&limit=10
categoriesRouter.get('/:id', getOneCategory);
categoriesRouter.post('/', createCategory);
categoriesRouter.put('/:id', updateCategory);
categoriesRouter.delete('/:id', deleteCategory);

export default categoriesRouter;