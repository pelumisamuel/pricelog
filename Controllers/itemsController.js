import asyncHandler from 'express-async-handler'
import pool from '../Config/db.js'
import { uploads } from '../Utils/cloudinary.js'
import { getAllItems, getOneItem } from '../Models/itemModel.js'

// FOR USERS
// controller that fetches all the items available in the database
const getItems = asyncHandler(async (req, res) => {
  try {
    const pageSize = 10
    console.log(process.env.DOMAIN)
    // get the current Page number from the url i.e GET/api/items?pageNumber=2
    // where pagenumber is the identifier and 2 the value
    const page = Number(req.query.pageNumber) || 1
    //console.log(req.query.pageNumber, req.query.keyword)
    let keyword = req.query.keyword ? '%' + req.query.keyword + '%' : '%'
    const categoryID = req.query.category

    // check filter by a category if it was choosen other was filter using the like
    const query = categoryID
      ? 'categoryId=' + categoryID
      : `name LIKE '${keyword}' OR description LIKE '${keyword}'`
    console.log(query)

    let countNo = await pool.query(
      `SELECT COUNT(*) FROM items WHERE ${query}`,
      [keyword, keyword]
    )
    countNo = countNo[0][0]
    // // get the first element of the obj, because count(*); the first name is not selectable
    const count = countNo[Object.keys(countNo)[0]]

    //keyword = null
    // console.log(keyword, pageSize * (page - 1))
    const items = await pool.query(
      `SELECT * FROM items WHERE ${query} ORDER BY createdAt LIMIT ? OFFSET ? `,
      [pageSize, pageSize * (page - 1)]
    )

    res
      .status(200)
      .json({ items: items[0], page, pages: Math.ceil(count / pageSize) })
  } catch (error) {
    res.status(401).send(error)
  }

  //getOneItem()
})

// A controller that get each item by id
const getItemID = asyncHandler(async (req, res) => {
  const id = req.params.id
  try {
    // const item = await getOneItem(id)
    let item = await pool.query(
      'SELECT DISTINCT * FROM items INNER JOIN categories ON items.categoryID = categories.categoryID WHERE items.itemId = ?',
      [id]
    )
    // QUERY TO fetch MULTIPLE categories with an item
    //;('SELECT DISTINCT * FROM items INNER JOIN category_item ON items.itemId = category_item.itemId JOIN categories ON category_item.categoryID = categories.categoryID WHERE items.itemId =?')
    if (item[0].length === 0) {
      res
        .status(404)
        .json({ status: 404, message: 'Invalid Id, Item not found' })
      return
    }

    item = item[0][0]

    let currentPrice = await pool.query(
      'SELECT price FROM prices WHERE itemId OR itemID = ? ORDER BY createdAt Desc limit 1;',
      [item.itemId]
    )

    currentPrice = currentPrice[0][0].price ? currentPrice[0][0].price : 0

    let properties = await pool.query(
      'SELECT * FROM properties WHERE categoryID = ?',
      [item.categoryID]
    )

    properties = properties[0]

    // console.log(item)
    res.status(200).json({ ...item, currentPrice, properties })
  } catch (error) {
    res.status(401).send(error)
  }
})

/// ADD NEW ITEM TO THE DATABASE
const addItem = asyncHandler(async (req, res) => {
  const { name, manufacturer, imgUrl, modelNo, description, categoryID } =
    req.body
  const date = new Date()
  try {
    const newItem = await pool.query(
      'INSERT into items SET name=?, manufacturer=?, modelNo=?, description=?, categoryID=?, image=?, createdAt=?',
      [name, manufacturer, modelNo, description, categoryID, imgUrl, date]
    )
    res.status(201).send({
      status: 201,
      message: 'Item created Succesfully',
      item: {
        id: newItem[0].insertId,
        name,
        manufacturer,
        imgUrl,
        modelNo,
        description,
        categoryID,
      },
    })
  } catch (error) {
    res.status(401).send(error)
    //throw new Error(error)
  }
})

// DELETE ONE ITEM
const deleteItem = asyncHandler(async (req, res) => {
  try {
    await pool.query('DELETE FROM items WHERE itemId=?', [req.params.id])
    res.status(200).json('Item deleted succesfully')
  } catch (error) {
    res.status(404).json(error)
  }
})

// ADD PROPERTIES TO ONE ITEM
const addPropertiesToItem = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id
    const properties = req.body

    properties.map(async (property) => {
      await pool.query(
        'INSERT INTO properties SET categoryID=?, label=?, value=?',
        [id, property.label, property.value]
      )
    })
    res.status(200).send('properties added succesfully')
  } catch (error) {
    res.status(401).send(error)
  }
})

export { getItems, getItemID, addItem, addPropertiesToItem, deleteItem }
