import PouchDB from 'pouchdb';
import { v4 as uuidv4 } from 'uuid'
import { Product, productSchema } from '../schemas';

// Initialize PouchproductsDB
const productsDB = new PouchDB('products');
const remoteCouch = false;

// Function to get all products
export const getProducts = async () => {
  try {
    const result = await productsDB.allDocs({ include_docs: true, descending: true });
    const products = result.rows.map(row => row.doc as Product).sort((a, b) => a.name.localeCompare(b.name));
    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

// Function to get products of a supplier
export const getProductsofSupplier = async (supplier: string) => {
    try {
      const result = await productsDB.allDocs({ include_docs: true, descending: true });
      const products = result.rows.map(row => row.doc as Product).filter(prod => prod.supplier === supplier).sort((a, b) => a.name.localeCompare(b.name));
      return products;
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  };

// Function to update a product
export const updateProduct = async (args: { _id: string, name?: string, buyPrice?: number, sellPrice?: number, supplier?: string, folder?: string, unit?: 'piece' | 'm' | 'kg' | 'm2' }) => {
  const { error } = productSchema.validate(args);
  if (error) {
    throw new Error('Invalid input');
  }

  try {
    const existingDocument = await productsDB.get(args._id);

    if (!existingDocument) {
      throw new Error("Bunday product topilmadi");
    }

    const updatedDocument = {
      ...existingDocument,
      ...args, // Merge updates
      _id: args._id,
      _rev: existingDocument._rev, // Required for PouchproductsDB updates
    };

    const response = await productsDB.put(updatedDocument);
    return { ...updatedDocument, _rev: response.rev }; // Return updated document with new revision
  } catch (error) {
    console.error('Error updating product:', error);
    throw new Error('Failed to update product');
  }
};

// Function to create a new product
export const createProduct = async (name: string, buyPrice: number, sellPrice: number, supplier: string, folder: string, unit: 'piece' | 'm' | 'kg' | 'm2') => {
  const { error } = productSchema.validate({ name, buyPrice, sellPrice, supplier, folder, unit });
  if (error) {
    throw new Error(error.message);
  }

  const document = {
    _id: uuidv4(), // Generate a unique ID for the new product
    name,
    buyPrice,
    sellPrice,
    supplier,
    folder,
    unit
  };

  try {
    const response = await productsDB.put(document);
    return { ...document, _rev: response.rev }; // Return the created document with its new revision
  } catch (error) {
    console.error('Error creating product:', error);
    throw new Error('Failed to create product');
  }
};