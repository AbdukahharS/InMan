import { create } from 'zustand'
import { createSupplier, getSuppliers, updateSupplier } from '../db/functions/supplierFns'
import { Supplier } from '../db/schemas' // Import the types

interface SupplierState {
  suppliers: Supplier[]
  active: Supplier | null
  fetchSuppliers: () => void
  addSupplier: (name: string, phone?: string) => void
  editSupplier: (id: string, name?: string, phone?: string) => void
  setActive: (supplier: Supplier | null) => void
}

const useSupplierStore = create<SupplierState>((set, get) => ({
  suppliers: [],
  active: null,

  // Fetch suppliers from LowDB
  fetchSuppliers: async () => {
    const suppliers = await getSuppliers()
    set({ suppliers })
  },

  // Create a new supplier
  addSupplier: async (name: string, phone?: string) => {
    const newSupplier = await createSupplier(name, phone)
    set((state) => ({
      suppliers: [...state.suppliers, newSupplier as Supplier],
    }))
  },

  // Update an existing supplier
  editSupplier: async (_id: string, name?: string, phone?: string) => {
    const updatedSupplier = await updateSupplier({_id, name, phone})
    set((state) => ({
      suppliers: state.suppliers.map((supplier) =>
        supplier._id === _id ? (updatedSupplier as Supplier) : supplier
      ),
    }))
  },

  // Select active supplier
  setActive: (supplier: Supplier | null) => set({ active: supplier }),
}))

export default useSupplierStore
