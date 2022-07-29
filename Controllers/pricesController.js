import asyncHandler from 'express-async-handler'
import pool from '../Config/db.js'

const getItemPrices = asyncHandler(async (req, res) => {
  try {
    let keyword = req.query.keyword ? req.query.keyword : 'createdAt'
    let order = req.query.order ? req.query.order : 'desc'
    //order = order.replace(/\'/g, '')

    const id = req.params.id
    let prices = await pool.query(
      `SELECT * FROM prices WHERE itemID = ? ORDER BY ?? ${order}`,
      [id, keyword]
    )

    //prices = prices[0]
    if (prices[0].length === 0) {
      res.status(404).send('This Item Has No Prices yet')
      return
    }
    // console.log(prices[0])
    res.status(200).send(prices[0])
  } catch (error) {
    res.status(404).send(error)
  }
})

export { getItemPrices }
