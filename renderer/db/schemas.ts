import Joi from 'joi';
import { v4 as uuidv4 } from 'uuid';

// Define the structure of your data using TypeScript interfaces
export interface Supplier {
  _id: string;
  name: string;
  phone: string;
  _rev: string;
}

export interface Product {
  _id: string;
  name: string;
  buyPrice: number;
  sellPrice: number;
  supplier: string;
  folder: string;
  unit: 'piece' | 'm' | 'kg' | 'm2';
  _rev: string;
}

export interface Intake {
  _id: string;
  supplier: string;
  products: {
    _id: string;
    name: string;
    buyPrice: number;
    unit: 'piece' | 'm' | 'kg' | 'm2';
    amount: number;
  }[];
  totalBuyPrice: number;
  timeStamp: string
}

export interface Warehouse {
  _id: string;
  productId: string;
  supplier: string;
  folder: string;
  name: string;
  amount: number;
  unit: 'piece' | 'm' | 'kg' | 'm2';
  sellPrice: number;
}

export interface Customer {
  _id: string;
  name: string;
  phone?: string;
  debt: number;
}

export interface Sale {
  _id: string;
  customer: string;
  products: {
    _id: string;
    name: string;
    amount: number;
    sellPrice: number;
    unit: 'piece' | 'm' | 'kg' | 'm2';
  }[];
  totalSellPrice: number;
  payment: {
    cash: number;
    card: number;
  };
  timeStamp: string
}

export interface Folder {
  _id: string;
  name: string;
}

// Define the schema for validation using Joi
export const supplierSchema = Joi.object<Supplier>({
  _id: Joi.string().default(() => uuidv4()), // Generate a default ID
  name: Joi.string().required(),
  phone: Joi.string().allow(''),
  _rev: Joi.string(),
});

export const productSchema = Joi.object<Product>({
  _id: Joi.string().default(() => uuidv4()), // Generate a default ID
  name: Joi.string().required(),
  buyPrice: Joi.number().required(),
  sellPrice: Joi.number().required(),
  supplier: Joi.string().required(),
  folder: Joi.string().required(),
  unit: Joi.string().valid('piece', 'm', 'kg', 'm2').required(),
});

function today() {
  const d = new Date()
  const day = d.getDate()
  const month = d.getMonth() + 1 // Months are zero-indexed
  const year = d.getFullYear()

  return `${day}.${month}.${year}`
}

export const intakeSchema = Joi.object<Intake>({
  _id: Joi.string().default(() => uuidv4()), // Generate a default ID
  supplier: Joi.string().required(),
  products: Joi.array().items(
    Joi.object({
      _id: Joi.string().required(),
      name: Joi.string().required(),
      buyPrice: Joi.number().required(),
      unit: Joi.string().valid('piece', 'm', 'kg', 'm2').required(),
      amount: Joi.number().required(),
    })
  ).required(),
  totalBuyPrice: Joi.number().required(),
  timeStamp: Joi.string().default(today)
});

export const warehouseSchema = Joi.object<Warehouse>({
  _id: Joi.string().default(() => uuidv4()),
  productId: Joi.string().required(),
  supplier: Joi.string().required(),
  folder: Joi.string().required(),
  name: Joi.string().required(),
  amount: Joi.number().required(),
  unit: Joi.string().valid('piece', 'm', 'kg', 'm2').required(),
  sellPrice: Joi.number().required(),
});

export const customerSchema = Joi.object<Customer>({
  _id: Joi.string().default(() => uuidv4()), // Generate a default ID
  name: Joi.string().required(),
  phone: Joi.string().allow(''),
  debt: Joi.number().required(),
});

export const saleSchema = Joi.object<Sale>({
  _id: Joi.string().default(() => uuidv4()), // Generate a default ID
  customer: Joi.string().required(),
  products: Joi.array().items(
    Joi.object({
      _id: Joi.string().required(),
      name: Joi.string().required(),
      amount: Joi.number().required(),
      sellPrice: Joi.number().required(),
      unit: Joi.string().valid('piece', 'm', 'kg', 'm2').required(),
    })
  ).required(),
  totalSellPrice: Joi.number().required(),
  payment: Joi.object({
    cash: Joi.number().required(),
    card: Joi.number().required(),
  }).required(),
  timeStamp: Joi.string().default(today)
});

export const folderSchema = Joi.object<Folder>({
  _id: Joi.string().default(() => uuidv4()), // Generate a default ID
  name: Joi.string().required(),
});
