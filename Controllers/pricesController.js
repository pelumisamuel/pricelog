import asyncHandler from 'express-async-handler'
import pool from '../Config/db.js'

const getItemPrices = asyncHandler(async (req, res) => {
  try {
    let keyword = req.query.keyword ? req.query.keyword : 'createdAt'
    let order = req.query.order ? req.query.order : 'desc'
    //order = order.replace(/\'/g, '')

    const id = req.params.id
    let prices = await pool.query(
      `SELECT * FROM prices WHERE itemId = ? AND isDeclined = false ORDER BY ?? ${order}`,
      [id, keyword]
    )

    //prices = prices[0]
    if (prices[0].length === 0) {
      res.status(404).json('This Item Has No Prices yet')
      return
    }
    // console.log(prices[0])
    res.status(200).send(prices[0])
  } catch (error) {
    res.status(404).send(error)
  }
})

const addVendor = asyncHandler(async (req, res) => {
  try {
    const { name, address, state, city, country, url } = req.body

    const vendorExist = await pool.query(
      'SELECT vendorName FROM vendors WHERE vendorName =?',
      [name]
    )
    if (vendorExist[0].length > 0) {
      return res
        .status(400)
        .send({ status: 400, message: 'Vendor already exist' })
    }
    const vendor = await pool.query(
      'INSERT INTO vendors SET vendorName = ?, vendorAddr = ?, state = ?, city=?, country=? url=?',
      [name, address, state, city, country, url]
    )
    res.send({
      status: 201,
      message: 'Vendor created Successfully',
      vendorId: vendor[0].insertId,
    })
  } catch (error) {
    res.status(500).send(error)
  }
})

const addPrice = asyncHandler(async (req, res) => {
  try {
    const date = new Date()

    const itemId = req.params.id
    const { price, quantity, vendorId } = req.body

    const newPrice = await pool.query(
      'INSERT INTO prices SET price=?,itemId=?, quantity=?, vendorId=?, createdAt=?',
      [price, itemId, quantity, vendorId, date]
    )
    res.send({
      status: 201,
      message: 'New Price created Successfully, Please wait for approval',
    })
  } catch (error) {
    res.status(500).send(error)
  }
})

export { getItemPrices, addPrice, addVendor }
