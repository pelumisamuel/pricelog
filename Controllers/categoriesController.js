import asyncHandler from 'express-async-handler'
import pool from '../Config/db.js'

//USERS

// A controller that fetches all the properties need for a particular category
// To be call after a category has been called
const getPropertiesKeys = asyncHandler(async (req, res) => {
  const categoryID = req.params.id
  try {
    const keys = await pool.query(
      'SELECT label, unit FROM properties_keys WHERE categoryID=?',
      [categoryID]
    )
    if (keys[0].length === 0) {
      res.status(204).send({ status: 404, message: 'Category has no property' })
      return
    }
    console.log(keys)
    res.status(200).json(keys[0])
  } catch (error) {
    res.status(404).send(error)
  }
})

// A controller that fetches all the categories available in the database
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

//FOR ADMIN
// A Controller that create a new category
//
const addCategoryName = asyncHandler(async (req, res) => {
  try {
    const { categoryName, categoryDescription } = req.body
    const categoryExist = await pool.query(
      'SELECT categoryName FROM categories WHERE categoryName =?',
      [categoryName]
    )
    if (!categoryName) {
      res
        .status(403)
        .json({ status: 403, message: 'You need to add Name to the category' })
    }
    if (categoryExist[0].length > 0) {
      return res
        .status(400)
        .send({ status: 400, message: 'Category already exist' })
    }
    //console.log(categoryExist[0].length)
    const category = await pool.query(
      'INSERT INTO categories SET categoryName=?, categoryDescription=?',
      [categoryName, categoryDescription]
    )
    res.send({
      status: 201,
      message: 'category created Successfully',
      categoryId: category[0].insertId,
    })
  } catch (error) {
    res.status().send(error)
  }
})

// controller that propperty keys that are needed to one category

const addPropertiesKeys = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id
    const properties = req.body

    const newProperty = properties.map(async (property) => {
      await pool.query(
        'INSERT INTO properties_keys SET categoryID=?, label=?, unit=?',
        [id, property.label, property.unit]
      )
    })

    // const data = await Promise.all(newProperty)
    // console.log(newProperty)
    //console.log(await promise.all(newProperty))
    res
      .status(201)
      .send({ status: 201, message: 'Properties created succesfully' })
  } catch (error) {
    throw new Error(error)
  }
})
/// create a controller that fetch existing property keys

export { addCategoryName, getCategories, getPropertiesKeys, addPropertiesKeys }
