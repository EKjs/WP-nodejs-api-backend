import pool from '../pgPool.js';
import asyncHandler from '../middlewares/asyncHandler.js';
import ErrorResponse from '../utils/ErrorResponse.js';

export const getSearchQuery = asyncHandler(async (req, res) => {
  console.log('req.params=',req.query.q);
  
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
    WHERE activities.activityname ILIKE $1
    OR activities.description ILIKE $1
    OR cities.name  ILIKE $1
    OR region.regionname ILIKE $1
    ORDER BY activities.id 
    `;
    const searchString = `%${req.query.q}%`
    const { rowCount: total, rows: allItems } = await pool.query(runQuery,[searchString]);
    const items = skip===0 && limit===0 ? allItems : limit===0 ? allItems.splice(skip) : allItems.splice(skip,limit);
    res.status(200).json({ total, items });
});
