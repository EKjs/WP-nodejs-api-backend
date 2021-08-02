import pool from '../pgPool.js';
import validateWithJoi from '../utils/schemas.js';
import asyncHandler from '../middlewares/asyncHandler.js';
import ErrorResponse from '../utils/ErrorResponse.js';

export const getAllSubCategories = asyncHandler(async (req, res) => {
  const skip = req.query.skip ? parseInt(req.query.skip) : 0;
  const limit = req.query.limit ? parseInt(req.query.limit) : 0;
  //Check for bad LIMIT or SKIP values
  if (!Number.isInteger(skip))throw new ErrorResponse('Bad skip value',400)
  else if (!Number.isInteger(limit))throw new ErrorResponse('Bad limit value',400);
  const runQuery=`SELECT id,catid AS "catId",subcategory AS "subCategory" FROM subcategories ORDER BY id`;
  const { rowCount: total, rows: allItems } = await pool.query(runQuery);
  const items = skip===0 && limit===0 ? allItems : limit===0 ? allItems.splice(skip) : allItems.splice(skip,limit);
  res.status(200).json({ total, items });
});

export const getOneSubCategory = asyncHandler(async (req, res) => {
  const subCatId=parseInt(req.params.id);
  if (!Number.isInteger(subCatId))throw new ErrorResponse('Bad request',400);
  const runQuery='SELECT * FROM subcategories WHERE id=$1';
  const {rowCount, rows } = await pool.query(runQuery,[subCatId]);
  if(rowCount===0)throw new ErrorResponse('Id not found',404)
  res.status(200).json(rows[0]);
});

export const createSubCategory = asyncHandler(async (req, res) => {
  const {error} = validateWithJoi(req.body,'createSubCategory');
  if (error)throw new ErrorResponse(error.details[0].message,400);
  
  const {subCategoryName,catId}=req.body;
  const runQuery='INSERT INTO subcategories (subcategory,catid) VALUES ($1,$2) RETURNING id,catid AS "catId",subcategory AS "subCategory"';
  const { rows } = await pool.query(runQuery,[subCategoryName,catId]);
  console.log(rows[0]);
  res.status(201).json(rows[0]);
});

export const updateSubCategory = asyncHandler(async (req, res) => {
  const {error} = validateWithJoi(req.body,'updateSubCategory');
  if (error)throw new ErrorResponse(error.details[0].message,400);
  const subCatId=parseInt(req.params.id);
  if (!Number.isInteger(subCatId))throw new ErrorResponse('Bad request',400);
  const {subCategoryName,catId}=req.body;
  const runQuery='UPDATE ONLY subcategories SET subcategory=$1,catid=$2 WHERE id=$3 RETURNING id,catid AS "catId",subcategory AS "subCategory"';
  const { rows } = await pool.query(runQuery,[subCategoryName,catId,subCatId]);
  res.status(200).json(rows[0]);
});

export const deleteSubCategory = asyncHandler(async (req, res) => {
  const subCatId=parseInt(req.params.id);
  if (!Number.isInteger(subCatId))throw new ErrorResponse('Bad request',400);
  const runQuery='DELETE FROM ONLY subcategories WHERE id=$1 RETURNING id,catid AS "catId",subcategory AS "subCategory"';
  const { rows } = await pool.query(runQuery,[subCatId]);
  res.status(200).json(rows[0]);
});