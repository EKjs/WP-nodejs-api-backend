import Pool from "pg-pool";
import dotenv from 'dotenv';

dotenv.config();
const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,

  max: 3,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 3000,
});

export default pool