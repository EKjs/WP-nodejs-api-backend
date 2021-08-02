import pool from '../pgPool.js';
import validateWithJoi from '../utils/schemas.js';
import asyncHandler from '../middlewares/asyncHandler.js';
import ErrorResponse from '../utils/ErrorResponse.js';


export const getAllCities = asyncHandler(async (req, res) => {
  const skip = req.query.skip ? parseInt(req.query.skip) : 0;
  const limit = req.query.limit ? parseInt(req.query.limit) : 0;
  //Check for bad LIMIT or SKIP values
  if (!Number.isInteger(skip))throw new ErrorResponse('Bad skip value',400)
  else if (!Number.isInteger(limit))throw new ErrorResponse('Bad limit value',400);

  const runQuery=`SELECT id, name,regionid as "regionId" FROM cities ORDER BY id`;
  /* const { rowCount: total, rows: items } = await pool.query(runQuery); */
  const { rowCount: total, rows: allItems } = await pool.query(runQuery);
    
  const items = skip===0 && limit===0 ? allItems : limit===0 ? allItems.splice(skip) : allItems.splice(skip,limit);
  res.status(200).json({ total, items });
});

export const getOneCity = asyncHandler(async (req, res) => {
  const cityId=parseInt(req.params.id);
  if (!Number.isInteger(cityId))throw new ErrorResponse('Bad request',400);
  const runQuery='SELECT id, name,regionid as "regionId" FROM cities WHERE id=$1';

  const {rowCount, rows } = await pool.query(runQuery,[cityId]);
  if(rowCount===0)throw new ErrorResponse('Id not found',404)
  res.status(200).json(rows[0]);
});

export const createCity = asyncHandler(async (req, res) => {
  const {error} = validateWithJoi(req.body,'createCity');
  if (error)throw new ErrorResponse(error.details[0].message,400);
  const {cityName,regionId}=req.body;
  const runQuery='INSERT INTO cities (name,regionid) VALUES ($1,$2) RETURNING id, name,regionid as "regionId"';
  const { rows } = await pool.query(runQuery,[cityName,regionId]);
  console.log(rows[0]);
  res.status(201).json(rows[0]);
});

export const updateCity = asyncHandler(async (req, res) => {
  const {error} = validateWithJoi(req.body,'updateCity');
  if (error)throw new ErrorResponse(error.details[0].message,400);
  const cityId=parseInt(req.params.id);
  if (!Number.isInteger(cityId))throw new ErrorResponse('Bad request',400);
  const {cityName,regionId}=req.body;
  const runQuery='UPDATE ONLY cities SET name=$1,regionid=$2 WHERE id=$3 RETURNING id, name,regionid as "regionId"';
  const { rows } = await pool.query(runQuery,[cityName,regionId,cityId]);
  res.status(200).json(rows[0]);
});

export const deleteCity = asyncHandler(async (req, res) => {
  const cityId=parseInt(req.params.id);
  if (!Number.isInteger(cityId))throw new ErrorResponse('Bad request',400);
  const runQuery='DELETE FROM ONLY cities WHERE id=$1 RETURNING *';
  const { rows } = await pool.query(runQuery,[cityId]);
  res.status(200).json(rows[0]);
});