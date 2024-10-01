import PouchDB from 'pouchdb'
import { v4 as uuidv4 } from 'uuid'
import { Intake, intakeSchema } from '../schemas'

// Initialize PouchintakesDB
const intakesDB = new PouchDB('intakes')

// Function to get all intakes
export const getIntakes = async () => {
  try {
    const result = await intakesDB.allDocs({
      include_docs: true,
      descending: true,
    })
    const intakes = result.rows
      .map((row) => {
        if ('supplier' in row.doc) {
          return row.doc as any as Intake
        }
      })
      .sort((a, b) => a.supplier.localeCompare(b.supplier))
    return intakes
  } catch (error) {
    console.error('Error fetching intakes:', error)
    return []
  }
}

// Function to create a new intake
export const createIntake = async (supplier: string, products: Intake['products'], totalBuyPrice: number, timeStamp: string) => {
  const { error } = intakeSchema.validate({ supplier, products, totalBuyPrice, timeStamp })
  if (error) {
    throw new Error(error.message)
  }

  const document = {
    _id: uuidv4(), // Generate a unique ID for the new intake
    supplier,
    products,
    totalBuyPrice,
    timeStamp
  }

  try {
    const response = await intakesDB.put(document)
    return { ...document, _rev: response.rev } // Return the created document with its new revision
  } catch (error) {
    console.error('Error creating intake:', error)
    throw new Error('Failed to create intake')
  }
}

export const getIntake = async (_id: string) => {
  try {
    const result = await intakesDB.get(_id)
    return result
  } catch (error) {
    console.error('Error fetching intake:', error)
    return null
  }
}

function parseDate(dateString: string) {
  const [day, month, year] = dateString.split('.').map(Number)
  return new Date(year, month - 1, day).getTime()
}

export const getIntakesinDateRange = async (start: number, end: number) => {
  try {
    const allDocs = await intakesDB.allDocs({ include_docs: true })
    const filteredDocs = allDocs.rows.map(row => row.doc as any as Intake).filter(
      (row) =>
        parseDate(row.timeStamp) >= start &&
        parseDate(row.timeStamp) <= end
    )
    return filteredDocs
  } catch (error) {
    console.error('Error fetching intakes in date range:', error)
    return []
  }
}