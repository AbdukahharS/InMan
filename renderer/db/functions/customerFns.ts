import PouchDB from 'pouchdb'
import { Customer, customerSchema } from '../schemas'

// Initialize your PouchDB databases
const customersDB = new PouchDB('customers')

// 1. Get All Customers
export const getCustomers = async () => {
  try {
    const result = await customersDB.allDocs({
      include_docs: true,
      descending: false,
    })

    // Return the list of customer documents
    return result.rows.map((row) => row.doc as any as Customer).sort((a, b) => a.name.localeCompare(b.name))
  } catch (error) {
    console.error('Error fetching customers:', error)
    throw new Error('Failed to get customers')
  }
}

// 2. Create a Customer
export const createCustomer = async (args: { name: string; phone?: string }) => {
  try {
    // Validate input
    const validated = await customerSchema.validateAsync({ ...args, debt: 0 })

    // Insert a new customer document
    const response = await customersDB.post(validated)

    return response
  } catch (error) {
    console.error('Error creating customer:', error)
    throw new Error('Failed to create customer')
  }
}

// 3. Get a Customer by ID
export const getCustomer = async (id: string) => {
  try {
    const document = await customersDB.get(id) as Customer
    return document
  } catch (error) {
    console.error('Error fetching customer:', error)
    throw new Error('Customer not found')
  }
}

// 7. Update a Customer
export const updateCustomer = async (args: {
  _id: string
  name?: string
  phone?: string
  debt?: number
}) => {
  try {
    const { _id, ...rest } = args

    // Fetch the existing customer document
    const existingDocument = await customersDB.get(_id)

    // Update the document with the new fields
    const updatedDocument = {
      ...existingDocument,
      ...rest,
    }

    // Put the updated document back into the database
    const response = await customersDB.put(updatedDocument)
    return response
  } catch (error) {
    console.error('Error updating customer:', error)
    throw new Error('Failed to update customer')
  }
}

// Update a customer's debt
export const updateCustomerDebt = async (_id: string, change: number) => {
  try {
    // Get the customer document by ID
    const document = await customersDB.get(_id) as any;
    if (!document) {
      throw new Error('Customer not found');
    }

    // Calculate the new debt
    const newDebt = document.debt + change;

    // Update the customer document with the new debt
    const updatedDocument = {
      ...document,
      debt: newDebt,
    };

    // Save the updated document back to PouchDB
    const response = await customersDB.put(updatedDocument);

    return response;
  } catch (error) {
    console.error('Error updating customer debt', error);
    throw new Error('Error updating customer debt');
  }
};
