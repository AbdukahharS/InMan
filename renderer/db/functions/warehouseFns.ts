import PouchDB from 'pouchdb'
import { v4 as uuidv4 } from 'uuid'
import { round } from '@/lib/utils' // Assuming you have this utility function
import { Warehouse, warehouseSchema } from '../schemas'

// Define your PouchDB databases
const warehouseDB = new PouchDB('warehouse')

// Function to handle adding or updating warehouse data
export const addToWarehouse = async (args: {
  productId: string
  supplier: string
  amount: number
  name: string
  unit: 'piece' | 'm' | 'kg' | 'm2'
  sellPrice: number
  folder: string
}) => {
  try {
    // Validate incoming args using Joi schema
    const { error } = warehouseSchema.validate(args)
    if (error) {
      throw new Error('Invalid input')
    }

    // Check if the product already exists in the warehouse
    const result = await warehouseDB.allDocs({
      include_docs: true,
      descending: true,
    })
    const existingDocument = result.rows
      .map((row) => row.doc as any as Warehouse)
      .find((doc) => doc.productId === args.productId)

    if (!!existingDocument) {
      // Update the existing document by adding the new amount
      const updatedDoc = {
        ...existingDocument,
        amount: round(existingDocument.amount + args.amount),
      }

      await warehouseDB.put(updatedDoc)
    } else {
      // Insert a new document if it doesn't exist
      const newDocument = {
        _id: uuidv4(), // or use uuid for better id generation
        productId: args.productId,
        name: args.name,
        supplier: args.supplier,
        amount: round(args.amount),
        unit: args.unit,
        sellPrice: round(args.sellPrice),
        folder: args.folder,
      }

      await warehouseDB.put(newDocument)
    }
  } catch (error) {
    console.error(error)
    throw new Error('Failed to add to warehouse')
  }
}

// Function to get warehouse data
export const getWarehouse = async () => {
  try {
    const result = await warehouseDB.allDocs({
      include_docs: true,
      descending: true,
    })
    return result.rows
      .map((row) => row.doc as any as Warehouse)
      .sort((a, b) => a.name.localeCompare(b.name))
  } catch (error) {
    console.error('Error fetching warehouse:', error)
    return null
  }
}

// Function to get warehouse of specific folder
export const getWarehouseFolder = async (folder: string) => {
  try {
    const result = await warehouseDB.allDocs({
      include_docs: true,
      descending: true,
    })
    return result.rows
      .map((row) => row.doc as any as Warehouse)
      .filter((doc) => doc.folder === folder)
      .sort((a, b) => a.name.localeCompare(b.name))
  } catch (error) {
    console.error('Error fetching warehouse:', error)
    return null
  }
}

export const getWarehouseItem = async (_id: string) => {
  try {
    const result = await warehouseDB.allDocs({
      include_docs: true,
    })
    return result.rows
      .map((row) => row.doc as any as Warehouse)
      .find((doc) => doc.productId === _id)
  } catch (error) {
    console.error('Error fetching warehouse item:', error)
    return null
  }
}

// Subtract a specified amount from a warehouse item
export const subtractFromWarehouse = async (_id: string, amount: number) => {
  try {
    // Fetch the warehouse document by ID
    const existingDocument = await warehouseDB.get(_id) as Warehouse

    if (!existingDocument) {
      throw new Error('Bunday mahsulot omborda topilmadi') // Product not found in the warehouse
    }

    // Check if the amount is greater than the current amount
    if (existingDocument.amount < amount) {
      throw new Error(
        `${existingDocument.name} mahsulotdan omborda faqat ${
          existingDocument.amount
        } ${
          existingDocument.unit === 'piece' ? 'dona' : existingDocument.unit
        } mavjud`
      )
    }

    // Update the document with the new amount
    const updatedDocument = {
      ...existingDocument,
      amount: round(existingDocument.amount - amount),
    }

    // Save the updated document in PouchDB
    await warehouseDB.put(updatedDocument)
  } catch (error) {
    console.error('Error updating warehouse stock', error)
    throw new Error(error.message)
  }
}
