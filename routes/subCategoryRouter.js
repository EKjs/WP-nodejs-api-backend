import express from 'express';
import { getAllSubCategories, getOneSubCategory, createSubCategory, updateSubCategory, deleteSubCategory } from '../controllers/subcategories.js';

const subCategoryRouter = express.Router();

subCategoryRouter.get('/', getAllSubCategories); //?skip=0&limit=10
subCategoryRouter.get('/:id', getOneSubCategory);
subCategoryRouter.post('/', createSubCategory);
subCategoryRouter.put('/:id', updateSubCategory);
subCategoryRouter.delete('/:id', deleteSubCategory);

export default subCategoryRouter;