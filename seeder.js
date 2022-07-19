import pool from './config/db.js'
import items from './items.js'

const importData = async () => {
  try {
    const date = new Date()
    // let x = b
    // console.log(x)
    const sampleItem = items.map(async (x) => {
      //await setTimeout(() => {}, 5000)
      await pool.query(
        'INSERT into items SET name=?, priceId=?, category=?, description=?, vendorName=?, vendorAddr=?, image=?, manufacturerId=?, created=?',
        [
          x.name,
          x.category,
          x.priceId,
          x.description,
          x.vendorName,
          x.vendorAddr,
          x.image,
          x.manufacturerId,
          date,
        ]
      )
    })
    // console.log(samplemovie)
    const send = await Promise.all(sampleItem)
    console.log(send)
    console.log('data imported')
    process.exit(1)
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

importData()
