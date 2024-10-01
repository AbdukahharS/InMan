import { create } from 'zustand'
import {
  createProduct,
  getProducts,
  getProductsofSupplier,
  updateProduct,
} from '../db/functions/productFns'
import { Product } from '../db/schemas' // Import the types

interface ProductState {
  products: Product[]
  active: Product | null
  fetchProducts: () => void
  fetchProductsofSupplier: (supplier: string) => void
  editProduct: (args: {
    _id: string
    name?: string
    buyPrice?: number
    sellPrice?: number
    supplier?: string
    folder?: string
    unit?: 'piece' | 'm' | 'kg' | 'm2'
  }) => void
  createProduct: (
    name: string,
    buyPrice: number,
    sellPrice: number,
    supplier: string,
    folder: string,
    unit: 'piece' | 'm' | 'kg' | 'm2'
  ) => void
  setProducts: (products: Product[]) => void
}

const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  active: null,

  // Fetch products from LowDB
  fetchProducts: async () => {
    const products = await getProducts()
    set({ products })
  },

  // Fetch products of a supplier
  fetchProductsofSupplier: async (supplier: string) => {
    const products = await getProductsofSupplier(supplier)
    set({ products })
  },

  // Update an existing supplier
  editProduct: async (args) => {
    const updatedProduct = await updateProduct(args)
    set((state) => ({
      products: state.products.map((product) =>
        product._id === args._id ? (updatedProduct as Product) : product
      ),
    }))
  },

  // Create a new product
  createProduct: async (
    name: string,
    buyPrice: number,
    sellPrice: number,
    supplier: string,
    folder: string,
    unit: 'piece' | 'm' | 'kg' | 'm2'
  ) => {
    const newProduct = await createProduct(
      name,
      buyPrice,
      sellPrice,
      supplier,
      folder,
      unit
    )
    set((state) => ({
      products: [...state.products, newProduct as Product],
    }))
  },

  setProducts: (products) => {
    set({ products })
  },
}))

export default useProductStore
