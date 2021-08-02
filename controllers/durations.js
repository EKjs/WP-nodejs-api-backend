import pool from '../pgPool.js';
import validateWithJoi from '../utils/schemas.js';
import asyncHandler from '../middlewares/asyncHandler.js';
import ErrorResponse from '../utils/ErrorResponse.js';

export const getAllDurations = asyncHandler(async (req, res) => {
  const skip = req.query.skip ? parseInt(req.query.skip) : 0;
  const limit = req.query.limit ? parseInt(req.query.limit) : 0;
  //Check for bad LIMIT or SKIP values
  if (!Number.isInteger(skip))throw new ErrorResponse('Bad skip value',400)
  else if (!Number.isInteger(limit))throw new ErrorResponse('Bad limit value',400);

  const runQuery=`SELECT id, durationtext AS "durationText" FROM duration ORDER BY id`;
  const { rowCount: total, rows: allItems } = await pool.query(runQuery);
  const items = skip===0 && limit===0 ? allItems : limit===0 ? allItems.splice(skip) : allItems.splice(skip,limit);
  res.status(200).json({ total, items });
});

export const getOneDuration = asyncHandler(async (req, res) => {
  const durationId=parseInt(req.params.id);
  if (!Number.isInteger(durationId))throw new ErrorResponse('Bad request',400);
  const runQuery='SELECT * FROM duration WHERE id=$1';
  const {rowCount, rows } = await pool.query(runQuery,[durationId]);
  if(rowCount===0)throw new ErrorResponse('Id not found',404)
  res.status(200).json(rows[0]);
});

export const createDuration = asyncHandler(async (req, res) => {
  const {error} = validateWithJoi(req.body,'createDuration');
  if (error)throw new ErrorResponse(error.details[0].message,400);
  const {durationText}=req.body;

  const runQuery='INSERT INTO duration (durationtext) VALUES ($1) RETURNING *';
  const { rows } = await pool.query(runQuery,[durationText]);
  console.log(rows[0]);
  res.status(201).json(rows[0]);
});

export const updateDuration = asyncHandler(async (req, res) => {
  const {error} = validateWithJoi(req.body,'updateDuration');
  if (error)throw new ErrorResponse(error.details[0].message,400);
  const durationId=parseInt(req.params.id);
  if (!Number.isInteger(durationId))throw new ErrorResponse('Bad request',400);
  const {durationText}=req.body;
  const runQuery='UPDATE ONLY duration SET durationtext=$1 WHERE id=$2 RETURNING *';
  const { rows } = await pool.query(runQuery,[durationText,durationId]);
  res.status(200).json(rows[0]);
});

export const deleteDuration = asyncHandler(async (req, res) => {
  const durationId=parseInt(req.params.id);
  if (!Number.isInteger(durationId))throw new ErrorResponse('Bad request',400);
  const runQuery='DELETE FROM ONLY duration WHERE id=$1 RETURNING *';
  const { rows } = await pool.query(runQuery,[durationId]);
  res.status(200).json(rows[0]);
});