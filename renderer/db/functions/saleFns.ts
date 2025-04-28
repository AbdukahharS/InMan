import PouchDB from 'pouchdb'
import { round } from '@/lib/utils' // Import your rounding utility function
import { Customer, Sale, Warehouse } from '../schemas'

function today() {
  const d = new Date()
  const day = d.getDate()
  const month = d.getMonth() + 1 // Months are zero-indexed
  const year = d.getFullYear()

  return `${day}.${month}.${year}`
}

const salesDB = new PouchDB('sales')
const customersDB = new PouchDB('customers')
const warehouseDB = new PouchDB('warehouse')

// Helper function to calculate final price after discount
function calculateDiscountedPrice(price: number, discount?: number) {
  if (discount === undefined || discount <= 0 || discount >= 100) {
    return price
  }
  return round(price * (1 - discount / 100))
}

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
  discount?: number
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
      discount: args.discount,  // Add the optional discount
    }

    const sale = await salesDB.post(saleDocument)

    // Calculate the amount to add to debt (using discounted price if discount exists)
    const amountToAddToDebt = calculateDiscountedPrice(round(args.totalSellPrice), args.discount) - 
                             args.payment.cash - 
                             args.payment.card
    
    // Update customer debt
    const updatedDebt = round(cust.debt + amountToAddToDebt)
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
// Get sales within a date range of a customer
export const getSalesInDateRangeCustomer = async (start: number, end: number, customerId: string) => {
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

    return filteredDocs.filter((row) => row.customer === customerId)
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
      .find((sale) => sale.customer === customer && sale.timeStamp === today())

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
  discount?: number
}) => {
  try {
    const sale = await salesDB.get(args._id) as any as Sale
    const oldSale = { ...sale }
    
    const updatedSale = {
      ...sale,
      products: args.products,
      totalSellPrice: round(args.totalSellPrice),
      payment: args.payment,
      discount: args.discount !== undefined ? args.discount : sale.discount, // Preserve existing discount if not explicitly changed
    }

    // Get the customer to update their debt based on the changes
    if (sale.customer) {
      const customer = (await customersDB.get(sale.customer)) as Customer
      
      if (customer) {
        // Calculate old debt impact (original price minus payments, adjusted by discount)
        const oldDebtImpact = calculateDiscountedPrice(oldSale.totalSellPrice, oldSale.discount) - 
                             oldSale.payment.cash - 
                             oldSale.payment.card
        
        // Calculate new debt impact (new price minus payments, adjusted by discount)
        const newDebtImpact = calculateDiscountedPrice(updatedSale.totalSellPrice, updatedSale.discount) - 
                             updatedSale.payment.cash - 
                             updatedSale.payment.card
        
        // Calculate the net change to apply to customer debt
        const debtChange = newDebtImpact - oldDebtImpact
        
        // Update customer debt
        const updatedCustomer = {
          ...customer,
          debt: round(customer.debt + debtChange)
        }
        
        await customersDB.put(updatedCustomer)
      }
    }

    await salesDB.put(updatedSale)
    return updatedSale
  } catch (error) {
    console.error('Error updating sale', error)
    throw new Error('Error updating sale')
  }
}

/**
 * Return a specific product from a sale and update warehouse inventory
 * @param saleId - ID of the sale to return product from
 * @param productId - ID of the product to return
 * @param returnAmount - Amount of product to return (must be <= original amount)
 * @returns Updated sale document
 */
export const returnProductFromSale = async (
  saleId: string,
  productId: string,
  returnAmount: number
) => {
  try {
    // Get the sale document
    const sale = (await salesDB.get(saleId)) as any as Sale
    if (!sale) {
      throw new Error('Sale not found')
    }

    // Find the product in the sale
    const productIndex = sale.products.findIndex(
      (product) => product._id === productId
    )
    if (productIndex === -1) {
      throw new Error('Product not found in this sale')
    }

    const saleProduct = sale.products[productIndex]

    // Validate return amount
    if (returnAmount <= 0) {
      throw new Error('Return amount must be greater than zero')
    }

    if (returnAmount > saleProduct.amount) {
      throw new Error(
        `Cannot return more than originally sold (${saleProduct.amount} ${saleProduct.unit})`
      )
    }

    // Calculate refund amount based on returned quantity (original price)
    const originalRefundAmount = round(returnAmount * saleProduct.sellPrice)
    
    // Calculate discounted refund amount for customer debt adjustment
    const discountedRefundAmount = calculateDiscountedPrice(originalRefundAmount, sale.discount)

    // Get warehouse item to update inventory
    const warehouseResult = await warehouseDB.allDocs({
      include_docs: true,
    })

    console.log('Warehouse result:', warehouseResult)
    console.log('Warehouse rows:', warehouseResult.rows)

    const warehouseItem = warehouseResult.rows
      .map((row) => row.doc as any as Warehouse)
      .find((doc) => doc._id === productId)

    if (!warehouseItem) {
      throw new Error('Product not found in warehouse')
    }

    // Update warehouse inventory
    const updatedWarehouseItem = {
      ...warehouseItem,
      amount: round(warehouseItem.amount + returnAmount),
    }

    await warehouseDB.put(updatedWarehouseItem)

    // Update the sale document
    let updatedSale: any

    if (returnAmount === saleProduct.amount) {
      // Remove product entirely if all units are returned
      const updatedProducts = sale.products.filter(
        (product) => product._id !== productId
      )

      updatedSale = {
        ...sale,
        products: updatedProducts,
        totalSellPrice: round(sale.totalSellPrice - originalRefundAmount),
      }
    } else {
      // Reduce product amount if partial return
      const updatedProducts = [...sale.products]
      updatedProducts[productIndex] = {
        ...saleProduct,
        amount: round(saleProduct.amount - returnAmount),
      }

      updatedSale = {
        ...sale,
        products: updatedProducts,
        totalSellPrice: round(sale.totalSellPrice - originalRefundAmount),
      }
    }

    // Update customer debt if applicable
    if (sale.customer) {
      const customer = (await customersDB.get(sale.customer)) as Customer

      if (customer) {
        const updatedCustomer = {
          ...customer,
          debt: round(customer.debt - discountedRefundAmount),
        }
        await customersDB.put(updatedCustomer)
      }
    }

    // Save the updated sale document
    await salesDB.put(updatedSale)

    return updatedSale
  } catch (error) {
    console.error('Error processing product return:', error)
    throw new Error(error instanceof Error ? error.message : String(error))
  }
}