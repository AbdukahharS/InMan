import { create } from 'zustand'
import { createIntake} from '../db/functions/intakeFns'
import { addToWarehouse } from '@/db/functions/warehouseFns'

function today() {
  const d = new Date()
  const day = d.getDate()
  const month = d.getMonth() + 1 // Months are zero-indexed
  const year = d.getFullYear()

  return `${day}.${month}.${year}`
}

type IntakeStore = {
  supplier: string | null
  products: {
    _id: string
    name: string
    buyPrice: number
    sellPrice: number
    unit: 'piece' | 'm' | 'kg' | 'm2'
    amount: number
    folder: string
  }[] // Make products an array that can be empty
  totalBuyPrice: number
  addItem: (
    _id: string,
    buyPrice: number,
    amount: number,
    unit: 'piece' | 'm' | 'kg' | 'm2',
    name: string,
    sellPrice: number,
    folder: string
  ) => void
  removeItem: (_id: string) => void
  setSupplier: (_id: string | null) => void
  changeAmount: (_id: string, amount: number) => void
  clear: () => void
  createIntake: () => Promise<void>
  addToWarehouse: () => Promise<void>
}

const useIntake = create<IntakeStore>((set, get) => ({
  supplier: null,
  products: [],
  totalBuyPrice: 0,
  addItem: (_id, buyPrice, amount, unit, name,sellPrice, folder) => {
    set((prev) => ({
      supplier: prev.supplier,
      totalBuyPrice: prev.totalBuyPrice + buyPrice * amount,
      products: [...prev.products, { _id, name, buyPrice, unit, amount, sellPrice, folder }],
    }))
  },
  setSupplier: (_id) => {
    set({ supplier: _id })
  },
  changeAmount: (_id, amount) => {
    set((prev) => ({
      ...prev,
      products: prev.products.map((p) => {
        if (p._id === _id) {
          return { ...p, amount }
        }
        return p
      }),
    }))
  },
  clear: () => {
    set({ supplier: null, products: [], totalBuyPrice: 0 })
  },
  removeItem: (_id) => {
    set((prev) => ({
      ...prev,
      products: prev.products.filter((p) => p._id !== _id),
    }))
  },
  createIntake: async () => {
    const { supplier, products, totalBuyPrice } = get()
    await createIntake(supplier, products.map(p => ({_id: p._id, amount: p.amount, buyPrice: p.buyPrice, name: p.name, unit: p.unit})), totalBuyPrice, today())
  },
  addToWarehouse: async () => {
    const { products, supplier } = get()
    for (const p of products) {
      await addToWarehouse({
        productId: p._id,
        name: p.name,
        amount: p.amount,
        sellPrice: p.sellPrice,
        unit: p.unit,
        folder: p.folder,
        supplier: supplier,
      })
    }
  }
}))

export default useIntake
