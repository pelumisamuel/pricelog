import asyncHandler from 'express-async-handler'
import { getAllItems, getOneItem } from '../Models/itemModel.js'

const getItems = asyncHandler(async (req, res) => {
  try {
    const allItems = await getAllItems()

    res.status(200).json(allItems[0])
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
