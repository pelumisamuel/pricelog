import pool from '../Config/db.js'

const getAllItems = () => {
  try {
    return pool.query('SELECT * FROM items')
  } catch (error) {
    throw new Error()
  }
}

const getOneItem = (itemId) => {
  try {
    return pool.query('SELECT * FROM items WHERE itemId=?', [itemId])
  } catch (error) {
    throw new Error()
  }
}

export { getAllItems, getOneItem }
