import asyncHandler from 'express-async-handler'
import pool from '../Config/db.js'

const getPropertiesKeys = asyncHandler(async (req, res) => {
  const categoryID = req.params.id
  try {
    const keys = await pool.query(
      'SELECT label, unit FROM properties_keys WHERE categoryID=?',
      [categoryID]
    )
    if (keys[0].length === 0) {
      res.status(404).send({ status: 404, message: 'Category is not found' })
      return
    }
    res.status(200).json(keys[0])
  } catch (error) {
    res.status(404).send(error)
  }
})

const getCategories = asyncHandler(async (req, res) => {
  try {
    const categories = await pool.query('SELECT * FROM categories')
    // console.log(categories)
    if (categories[0].length === 0) {
      res.status(404).send({ status: 404, message: 'No category is available' })
      return
    }
    res.status(200).json(categories[0])
  } catch (error) {
    res.status(404).send(error)
  }
})

const addCategories = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id
    const { label, value } = req.body
  } catch (error) {}
})

export { addCategories, getCategories, getPropertiesKeys }
