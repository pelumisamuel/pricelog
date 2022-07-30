import asyncHandler from 'express-async-handler'
import pool from '../Config/db.js'
import { getAllItems, getOneItem } from '../Models/itemModel.js'

const getItems = asyncHandler(async (req, res) => {
  try {
    const pageSize = 10
    // get the current Page number from the url i.e GET/api/items?pageNumber=2
    // where pagenumber is the identifier and 2 the value
    const page = Number(req.query.pageNumber) || 1
    //console.log(req.query.pageNumber, req.query.keyword)
    let keyword = req.query.keyword ? '%' + req.query.keyword + '%' : '%'

    let countNo = await pool.query(
      'SELECT COUNT(*) FROM items WHERE name LIKE ? OR description LIKE ?',
      [keyword, keyword]
    )
    countNo = countNo[0][0]

    // // get the first element of the obj, because count(*); the first name is not selectable
    const count = countNo[Object.keys(countNo)[0]]

    // console.log(keyword, pageSize * (page - 1))
    const items = await pool.query(
      'SELECT * FROM items WHERE name LIKE ? OR description LIKE ? ORDER BY createdAt LIMIT ? OFFSET ? ',
      [keyword, keyword, pageSize, pageSize * (page - 1)]
    )
    // console.log(items[0].length)

    //const allItems = await getAllItems()

    res
      .status(200)
      .json({ items: items[0], page, pages: Math.ceil(count / pageSize) })
  } catch (error) {
    res.status(401).send(error)
  }

  //getOneItem()
})

// get each item by id
const getItemID = asyncHandler(async (req, res) => {
  const id = req.params.id
  try {
    // const item = await getOneItem(id)
    let item = await pool.query(
      'SELECT DISTINCT * FROM items INNER JOIN categories ON items.categoryID = categories.categoryID WHERE items.itemId = ?',
      [id]
    )
    //item = item[0][0]
    if (item[0].length === 0) {
      res
        .status(404)
        .json({ status: 404, message: 'Invalid Id, Item not found' })
      return
    }
    //console.log(item[0][0])
    item = item[0][0]
    console.log(item)
    let currentPrice = await pool.query(
      'SELECT price FROM prices WHERE itemId OR itemID = ? ORDER BY createdAt Desc limit 1;',
      [item.itemId]
    )

    currentPrice = currentPrice[0][0].price ? currentPrice[0][0].price : 0
    console.log(currentPrice)

    let properties = await pool.query(
      'SELECT * FROM properties WHERE categoryID = ?',
      [item.categoryID]
    )
    // console.log(item.categoryID)
    properties = properties[0]

    console.log(item.categoryID)
    console.log(item)
    res.status(200).json({ ...item, currentPrice, properties })
  } catch (error) {
    res.status(401).send(error)
  }
})

const addItem = asyncHandler(async (req, res) => {
  try {
    const date = new Date()
    const { name, manufacturer, modelNo, description, categoryID, imageUrl } =
      req.body
    const newItem = pool.query(
      'INSERT into items SET name=?, manufacturer=?, modelNo=?, description=?, categoryID=?, image=?, createdAt=?',
      [name, manufacturer, modelNo, description, categoryID, imageUrl, date]
    )
  } catch (error) {
    res.status(401).send(error)
  }
})

export { getItems, getItemID, addItem }
