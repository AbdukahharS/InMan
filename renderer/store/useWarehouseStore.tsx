// store/confirmStore.ts
import { create } from 'zustand'
import { Warehouse } from '@/db/schemas'

interface WarehouseStore {
  products: Warehouse[]
  setProducts: (products: Warehouse[]) => void
}

const useWarehouseStore = create<WarehouseStore>((set) => ({
  products: [],
  setProducts: (products) => {
    set({ products })
  },
}))

export default useWarehouseStore
