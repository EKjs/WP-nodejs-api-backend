import pool from '../pgPool.js';
import validateWithJoi from '../utils/schemas.js';
import asyncHandler from '../middlewares/asyncHandler.js';
import ErrorResponse from '../utils/ErrorResponse.js';

export const getAllRegions = asyncHandler(async (req, res) => {
  const skip = req.query.skip ? parseInt(req.query.skip) : 0;
  const limit = req.query.limit ? parseInt(req.query.limit) : 0;
  //Check for bad LIMIT or SKIP values
  if (!Number.isInteger(skip))throw new ErrorResponse('Bad skip value',400)
  else if (!Number.isInteger(limit))throw new ErrorResponse('Bad limit value',400);
  const runQuery=`SELECT id,regionname AS "regionName" FROM region ORDER BY id`;
  const { rowCount: total, rows: allItems } = await pool.query(runQuery);
    
  const items = skip===0 && limit===0 ? allItems : limit===0 ? allItems.splice(skip) : allItems.splice(skip,limit);
  res.status(200).json({ total, items });
});

export const getOneRegion = asyncHandler(async (req, res) => {
  const regionId=parseInt(req.params.id);
  if (!Number.isInteger(regionId))throw new ErrorResponse('Bad request',400);
  const runQuery='SELECT * FROM region WHERE id=$1';
  const {rowCount, rows } = await pool.query(runQuery,[regionId]);
  if(rowCount===0)throw new ErrorResponse('Id not found',404)
  res.status(200).json(rows[0]);
});

export const createRegion = asyncHandler(async (req, res) => {
  const {error} = validateWithJoi(req.body,'createRegion');
  if (error)throw new ErrorResponse(error.details[0].message,400);
  const {regionName}=req.body;
  const runQuery='INSERT INTO region (regionname) VALUES ($1) RETURNING id,regionname AS "regionName"';
  const { rows } = await pool.query(runQuery,[regionName]);
  console.log(rows[0]);
  res.status(201).json(rows[0]);
});

export const updateRegion = asyncHandler(async (req, res) => {
  const {error} = validateWithJoi(req.body,'updateRegion');
  if (error)throw new ErrorResponse(error.details[0].message,400);
  const regionId=parseInt(req.params.id);
  if (!Number.isInteger(regionId))throw new ErrorResponse('Bad request',400);
  const {regionName}=req.body;
  const runQuery='UPDATE ONLY region SET regionname=$1 WHERE id=$2 RETURNING id,regionname AS "regionName"';
  const { rows } = await pool.query(runQuery,[regionName,regionId]);
  res.status(200).json(rows[0]);
});

export const deleteRegion = asyncHandler(async (req, res) => {
  const regionId=parseInt(req.params.id);
  if (!Number.isInteger(regionId))throw new ErrorResponse('Bad request',400);
  const runQuery='DELETE FROM ONLY region WHERE id=$1 RETURNING *';
  const { rows } = await pool.query(runQuery,[regionId]);
  res.status(200).json(rows[0]);
});