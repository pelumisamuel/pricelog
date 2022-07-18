import pool from '../config/db.js'

const getAllItems = () => {
  try {
    return pool.query('SELECT * FROM items')
  } catch (error) {
    throw new Error()
  }
}

const getOneItem = (itemId) => {
  try {
    return pool.query('SELECT * FROM items WHERE id=?', [itemId])
  } catch (error) {
    throw new Error()
  }
}

return { getAllItems, getOneItem }
