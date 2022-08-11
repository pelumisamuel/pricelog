import pool from '../Config/db.js'

const PriceRequests = () => {
  return pool.query(
    'SELECT prices.*, users.name AS poster, items.name, items.description, items.image FROM prices INNER JOIN users ON users.idusers = prices.userId JOIN items ON prices.itemId = items.itemId WHERE prices.isverified=false AND prices.isDeclined=false ORDER BY createdAt DESC'
  )
}

export { PriceRequests }
