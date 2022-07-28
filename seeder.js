import pool from './config/db.js'
import items from './items.js'
import prices from './prices.js'

const importData = async () => {
  try {
    const date = new Date()
    // let x = b
    // console.log(x)
    // const sampleItem = items.map(async (x) => {
    //   //await setTimeout(() => {}, 5000)
    //   await pool.query(
    //     'INSERT into items SET name=?, priceId=?, category=?, description=?, vendorName=?, vendorAddr=?, image=?, manufacturerId=?, created=?',
    //     [
    //       x.name,
    //       x.priceId,
    //       x.category,
    //       x.description,
    //       x.vendorName,
    //       x.vendorAddr,
    //       x.image,
    //       x.manufacturerId,
    //       date,
    //     ]
    //   )
    // })

    await pool.query('TRUNCATE TABLE prices')

    const samplePrice = prices.map(async (x) => {
      //await setTimeout(() => {}, 5000)
      await pool.query(
        'INSERT into prices SET price=?, vendorName=?, vendorAddr=?, quantity=?, itemID=?, createdDate=?',
        [x.price, x.vendorName, x.vendorAddr, x.quantity, x.itemID, date]
      )
    })

    // console.log(samplemovie)
    // const send = await Promise.all(sampleItem)
    //console.log(send)
    const send = await Promise.all(samplePrice)
    console.log('data imported')
    process.exit(1)
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

importData()
