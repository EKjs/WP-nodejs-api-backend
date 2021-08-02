import pool from '../pgPool.js';
import validateWithJoi from '../utils/schemas.js';
import asyncHandler from '../middlewares/asyncHandler.js';
import ErrorResponse from '../utils/ErrorResponse.js';

export const getAllActivities = asyncHandler(async (req, res) => {
  console.log('req.params=',req.query);
  const allowedParams=['subcategory', 'category', 'city', 'region', 'duration'];
  let whereParams='';
    for (let q in req.query){
      console.log('ok',q,req.query[q]);
      if (allowedParams.includes(q)){
        const columnID = q==='subcategory' ? 'subcategories.id' : q==='category' ? 'categories.id' : q==='city' ? 'cities.id' : q==='region' ? 'region.id' : 'duration.id';
        if (whereParams.length==0){
          whereParams=`WHERE ${columnID}=${req.query[q]} ` 
        }else whereParams+=`AND ${columnID}=${req.query[q]} `;
        //console.log('ok',q,req.query[q]);
      }else console.log('bad query parameter',q);
    }
    const skip = req.query.skip ? parseInt(req.query.skip) : 0;
    const limit = req.query.limit ? parseInt(req.query.limit) : 0;

    //Check for bad LIMIT or SKIP values
    if (!Number.isInteger(skip))throw new ErrorResponse('Bad skip value',400)
    else if (!Number.isInteger(limit))throw new ErrorResponse('Bad limit value',400);

    const runQuery=`SELECT activities.activityname AS "activityName",
    activities.id,
    activities.description, 
    activities.address,
    activities.coords,
    activities.picture,
    activities.time,
    activities.age,
    subcategories.id AS "subCategoryId",
    subcategories.subcategory AS "subCategory",
    categories.id AS "categoryId",
    categories.category AS category,
    cities.id AS "cityId",
    cities.name AS "cityName",
    region.id AS "regionId",
    region.regionname AS "regionName",
    duration.id AS "durationId",
    duration.durationtext AS "durationText" 
    FROM activities 
    JOIN cities ON activities.city=cities.id
    JOIN region ON cities.regionid=region.id
    JOIN duration ON activities.duration=duration.id
    JOIN subcategories ON activities.subcategory=subcategories.id
    JOIN categories ON subcategories.catid=categories.id 
    ${whereParams} 
    ORDER BY activities.id 
    `;
    const { rowCount: total, rows: allItems } = await pool.query(runQuery);
    const items = skip===0 && limit===0 ? allItems : limit===0 ? allItems.splice(skip) : allItems.splice(skip,limit);
    res.status(200).json({ total, items });
});

export const getOneActivity = asyncHandler(async (req, res) => {
  const activityId=parseInt(req.params.id);
  if (!Number.isInteger(activityId)){
    throw new ErrorResponse('Bad request',400)
  }
  const runQuery=`SELECT activities.activityname AS "activityName",
  activities.description, 
  activities.address,
  activities.coords,
  activities.picture,
  activities.time,
  activities.age,
  subcategories.id AS "subCategoryId",
  subcategories.subcategory AS "subCategory",
  categories.id AS "categoryId",
  categories.category AS category,
  cities.id AS "cityId",
  cities.name AS "cityName",
  region.id AS "regionId",
  region.regionname AS "regionName",
  duration.id AS "durationId",
  duration.durationtext AS "durationText" 
  FROM activities 
  JOIN cities ON activities.city=cities.id
  JOIN region ON cities.regionid=region.id
  JOIN duration ON activities.duration=duration.id
  JOIN subcategories ON activities.subcategory=subcategories.id
  JOIN categories ON subcategories.catid=categories.id 
  WHERE activities.id=$1
  `;
  const {rowCount, rows } = await pool.query(runQuery,[activityId]);
  if(rowCount===0)throw new ErrorResponse('Id not found',404)
  res.status(200).json(rows[0]);
});


export const createActivity = asyncHandler(async (req, res) => {
  const {error} = validateWithJoi(req.body,'createActivity');
  if (error)throw new ErrorResponse(error.details[0].message,400);
  const {activityName,description,address,city,coords,picture,subCategory,duration,time,age}=req.body;
  const runQuery='INSERT INTO activities (activityname,description, address,city,coords,picture,subcategory,duration,time,age) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING id, activityname AS "activityName"';
  const { rows } = await pool.query(runQuery,[activityName,description,address,city,coords,picture,subCategory,duration,time,age]);
  console.log(rows[0]);
  res.status(201).json(rows[0]);
});

export const updateActivity = asyncHandler(async (req, res) => {
  const {error} = validateWithJoi(req.body,'updateActivity');
  if (error)throw new ErrorResponse(error.details[0].message,400);
  const activityId=parseInt(req.params.id);
  if (!Number.isInteger(activityId))throw new ErrorResponse('Bad request',400);
  const {activityName,description,address,city,coords,picture,subCategory,duration,time,age}=req.body;
  const runQuery='UPDATE ONLY activities SET activityname=$1,description=$2,address=$3,city=$4,coords=$5,picture=$6,subcategory=$7,duration=$8,time=$9,age=$10 WHERE id=$11 RETURNING id, activityname AS "activityName"';
  const { rows } = await pool.query(runQuery,[activityName,description,address,city,coords,picture,subCategory,duration,time,age,activityId]);
  res.status(200).json(rows[0]);
});

export const deleteActivity = asyncHandler(async (req, res) => {
  const activityId=parseInt(req.params.id);
  if (!Number.isInteger(activityId))throw new ErrorResponse('Bad request',400);
  const runQuery='DELETE FROM ONLY activities WHERE id=$1 RETURNING id, activityname AS "activityName"';
  const { rows } = await pool.query(runQuery,[activityId]);
  res.status(200).json(rows[0]);
});