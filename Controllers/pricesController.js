import asyncHandler from 'express-async-handler'
import pool from '../Config/db.js'

const getItemPrices = asyncHandler(async (req, res) => {
  try {
    let keyword = req.query.keyword ? req.query.keyword : 'createdAt'
    let order = req.query.order ? req.query.order : 'desc'
    //order = order.replace(/\'/g, '')

    const id = req.params.id

    let prices = await pool.query(
      `SELECT * FROM prices WHERE itemId = ? AND isVerified=true AND isDeclined = false ORDER BY ?? ${order}`,
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

const getPendingPrices = asyncHandler(async (req, res) => {
  try {
    let pendingPrices = await pool.query(
      'SELECT prices.*, users.name, items.name, items.description, items.image FROM prices INNER JOIN users ON users.idusers = prices.userId JOIN items ON prices.itemId = items.itemId WHERE prices.isverified=false AND prices.isDeclined=false ORDER BY createdAt DESC'
    )
    res.status(200).send(pendingPrices[0])
    // ;('SELECT P.*, U.name, I.name, I.description, I.image FROM heroku_a2ed19b42d16203.prices P INNER JOIN heroku_a2ed19b42d16203.users U ON U.idusers = P.userId JOIN heroku_a2ed19b42d16203.items I ON P.itemId =I.itemId WHERE P.isVerified =false AND P.isDeclined = false ORDER BY createdAt DESC;')
  } catch (error) {
    throw new Error(error)
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
    const userId = req.user.idusers

    const itemId = req.params.id
    // itemId should be added and gotten from the req.body
    const {
      price,
      quantity,
      phoneNumber,
      vendorName,
      vendorAddress,
      vendorUrl,
    } = req.body

    if (!price) {
      res.status(403).json({ status: 403, message: 'price needs to be added' })
      return
    }

    await pool.query(
      'INSERT INTO prices SET price=?, itemId=?, userId=?, quantity=?, phoneNumber=?, vendorName=?, vendorAddress=?, vendorUrl=?, createdAt=?',
      [
        price,
        itemId,
        userId,
        quantity,
        phoneNumber,
        vendorName,
        vendorAddress,
        vendorUrl,
        date,
      ]
    )
    res.send({
      status: 201,
      message: 'New Price created Successfully, Please wait for approval',
    })
  } catch (error) {
    //res.status(401).send(error)
    throw new Error({ status: 401, message: 'One or More Input is Disallowed' })
  }
})

const verifyPrice = asyncHandler(async (req, res) => {
  try {
    const { priceId } = req.body
    const action = req.params.decline ? 'isDeclined' : 'isVerified'

    await pool.query(`UPDATE prices set ${action}=? WHERE priceID=?`, [
      true,
      priceId,
    ])

    res
      .status(200)
      .json({ status: 200, message: 'Price verified successfully' })
  } catch (error) {
    res.status(404).send('Price not found')
    throw new Error(error)
  }
})

export { getItemPrices, addPrice, addVendor, verifyPrice, getPendingPrices }
