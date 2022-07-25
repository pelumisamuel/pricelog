import asyncHandler from 'express-async-handler'
import pool from '../Config/db.js'
import { getAllItems, getOneItem } from '../Models/itemModel.js'

const getItems = asyncHandler(async (req, res) => {
  try {
    const pageSize = 3
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

    console.log(keyword, pageSize * (page - 1))
    const items = await pool.query(
      'SELECT * FROM items WHERE name LIKE ? OR description LIKE ? ORDER BY created LIMIT ? OFFSET ? ',
      [keyword, keyword, pageSize, pageSize * (page - 1)]
    )
    console.log(items[0].length)

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
    const item = await getOneItem(id)
    if (item[0].length === 0) {
      res
        .status(404)
        .json({ status: 404, message: 'Invalid Id, Item not found' })
      return
    }

    // console.log(item[0].length)
    res.status(200).json(item[0][0])
  } catch (error) {
    res.status(401).send(error)
  }
})
export { getItems, getItemID }
