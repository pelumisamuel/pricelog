import mysql from 'mysql2/promise'
import dotenv from 'dotenv'
dotenv.config()

const pool = mysql.createPool({
  host: process.env.HOST,
  user: 'root',
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  waitForConnections: process.env.WAITFORCONNECTIONS,
  connectionLimit: process.env.CONNECTIONLIMIT,
  queueLimit: process.env.QUEUELIMIT,
})

if (pool.state === 'disconnected') {
  console.log('Server Down')
} else {
  console.log('Connected to database')
}

export default pool
