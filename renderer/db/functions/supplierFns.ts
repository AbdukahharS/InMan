import PouchDB from 'pouchdb';
import { v4 as uuidv4 } from 'uuid'
import { Supplier, supplierSchema } from '../schemas';

// Initialize PouchsuppliersDB
const suppliersDB = new PouchDB('suppliers');
const remoteCouch = false;

// Function to get all suppliers
export const getSuppliers = async () => {
  try {
    const result = await suppliersDB.allDocs({ include_docs: true, descending: true });
    const suppliers = result.rows.map(row => row.doc as Supplier).sort((a, b) => a.name.localeCompare(b.name));
    return suppliers;
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    return [];
  }
};

// // Function to update a supplier
export const updateSupplier = async (args: { _id: string, name?: string, phone?: string }) => {
  const { error } = supplierSchema.validate(args);
  if (error) {
    throw new Error('Invalid input');
  }

  try {
    const existingDocument = await suppliersDB.get(args._id);

    if (!existingDocument) {
      throw new Error("Bunday ta'minotchi topilmadi");
    }

    const updatedDocument = {
      ...existingDocument,
      ...args, // Merge updates
      _id: args._id,
      _rev: existingDocument._rev, // Required for PouchsuppliersDB updates
    };

    const response = await suppliersDB.put(updatedDocument);
    return { ...updatedDocument, _rev: response.rev }; // Return updated document with new revision
  } catch (error) {
    console.error('Error updating supplier:', error);
    throw new Error('Failed to update supplier');
  }
};

// Function to create a new supplier
export const createSupplier = async (name: string, phone?: string ) => {
  const { error } = supplierSchema.validate({ name, phone });
  if (error) {
    throw new Error(error.message);
  }

  const document = {
    _id: uuidv4(), // Generate a unique ID for the new supplier
    name,
    phone
  };

  try {
    const response = await suppliersDB.put(document);
    return { ...document, _rev: response.rev }; // Return the created document with its new revision
  } catch (error) {
    console.error('Error creating supplier:', error);
    throw new Error('Failed to create supplier');
  }
};

export const getSupplier = async (_id: string) => {
  try {
    const result = await suppliersDB.get(_id);
    return result;
  } catch (error) {
    console.error('Error fetching supplier:', error);
    return null;
  }
};
