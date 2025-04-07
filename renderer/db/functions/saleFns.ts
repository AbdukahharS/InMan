import PouchDB from 'pouchdb'
import { round } from '@/lib/utils' // Import your rounding utility function
import { Customer, Sale } from '../schemas'

function today() {
  const d = new Date()
  const day = d.getDate()
  const month = d.getMonth() + 1 // Months are zero-indexed
  const year = d.getFullYear()

  return `${day}.${month}.${year}`
}

const salesDB = new PouchDB('sales')
const customersDB = new PouchDB('customers')

// Get a single sale by ID
export const getSale = async (id: string) => {
  try {
    const document = await salesDB.get(id)
    return document
  } catch (error) {
    console.error('Sale not found', error)
    throw new Error('Sale not found')
  }
}

// Perform a sale and update customer debt
export const performSale = async (args: {
  customer: string
  products: {
    _id: string
    name: string
    amount: number
    sellPrice: number
    unit: 'piece' | 'm' | 'kg' | 'm2'
  }[]
  totalSellPrice: number
  payment: {
    cash: number
    card: number
  }
  timeStamp: string
}) => {
  try {
    // Get the customer document
    const cust = (await customersDB.get(args.customer)) as Customer
    if (!cust) throw new Error('Customer not found')

    // Insert the sale into salesDB
    const saleDocument = {
      timeStamp: args.timeStamp,
      customer: args.customer,
      preDebt: cust.debt,
      products: args.products,
      totalSellPrice: round(args.totalSellPrice),
      payment: args.payment,
    }

    const sale = await salesDB.post(saleDocument)

    // Update customer debt
    const updatedDebt = round(
      cust.debt +
        round(args.totalSellPrice) -
        args.payment.cash -
        args.payment.card
    )
    await customersDB.put({
      ...cust,
      debt: updatedDebt,
    })

    return sale
  } catch (error) {
    console.error('Error performing sale', error)
    throw new Error('Error performing sale')
  }
}

function parseDate(dateString: string) {
  const [day, month, year] = dateString.split('.').map(Number)
  return new Date(year, month - 1, day).getTime()
}

// Get sales within a date range
export const getSalesInDateRange = async (start: number, end: number) => {
  try {
    const allDocs = await salesDB.allDocs({ include_docs: true })
    const filteredDocs = allDocs.rows
      .map((row) => row.doc as any as Sale)
      .filter((row) => {
        if (row.timeStamp) {
          const date = parseDate(row.timeStamp)
          return date >= start && date <= end
        }
      })

    return filteredDocs
  } catch (error) {
    console.error('Error fetching sales in date range', error)
    throw new Error('Error fetching sales in date range')
  }
}

export const getCustomerSaleRanking = async (start: number, end: number) => {
  try {
    const allCustomerDocs = await customersDB.allDocs({ include_docs: true })
    const allSaleDocs = await salesDB.allDocs({ include_docs: true })
    const salesInRange = allSaleDocs.rows
      .map((row) => row.doc as any as Sale)
      .filter((row) => {
        if (row.timeStamp) {
          const date = parseDate(row.timeStamp)
          return date >= start && date <= end
        }
      })

    const customers = allCustomerDocs.rows.map(
      (row) => row.doc as any as Customer
    )
    const ranking: { _id: string; name: string; total: number }[] = []
    customers.forEach((cust) => {
      const doc = {
        _id: cust._id,
        name: cust.name,
        total: 0,
      }
      salesInRange.forEach((sale) => {
        if (sale.customer === doc._id) {
          doc.total += sale.totalSellPrice
        }
      })

      ranking.push(doc)
    })

    ranking.sort((a, b) => b.total - a.total)

    return ranking
  } catch (error) {
    throw new Error('Error fetching customer sale ranking', error)
    return []
  }
}

// Get sales of a customer for today
export const getSalesOfCustomerToday = async (customer: string) => {
  try {
    
    const allDocs = await salesDB.allDocs({ include_docs: true })
    const saleToday = allDocs.rows
      .map((row) => row.doc as any as Sale)
      .find((sale) => (
        sale.customer === customer && sale.timeStamp === today()
      ))

    return saleToday
  } catch (error) {
    console.error('Error fetching sales for today', error)
    throw new Error('Error fetching sales for today')
  }
}

// Update the payment of a sale
export const updateSalePayment = async (
  id: string,
  payment: { cash: number; card: number }
) => {
  try {
    const sale = await salesDB.get(id)
    const updatedSale = {
      ...sale,
      payment,
    }

    await salesDB.put(updatedSale)
    return updatedSale
  } catch (error) {
    console.error('Error updating sale payment', error)
    throw new Error('Error updating sale payment')
  }
}

// Update a sale's products and total price
export const updateSale = async (args: {
  _id: string
  products: {
    _id: string
    amount: number
    sellPrice: number
    name: string
    unit: 'piece' | 'm' | 'kg' | 'm2'
  }[]
  totalSellPrice: number
  payment: {
    cash: number
    card: number
  }
}) => {
  try {
    const sale = await salesDB.get(args._id)
    const updatedSale = {
      ...sale,
      products: args.products,
      totalSellPrice: round(args.totalSellPrice),
      payment: args.payment,
    }

    await salesDB.put(updatedSale)
    return updatedSale
  } catch (error) {
    console.error('Error updating sale', error)
    throw new Error('Error updating sale')
  }
}
