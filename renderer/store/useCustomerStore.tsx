import { create } from 'zustand';
import { createCustomer, getCustomers, updateCustomer } from '../db/functions/customerFns'; // Import customer functions
import { Customer } from '../db/schemas'; // Import customer types

interface CustomerState {
  customers: Customer[];
  active: Customer | null;
  fetchCustomers: () => void;
  addCustomer: (name: string, phone?: string) => void;
  editCustomer: (_id: string, name?: string, phone?: string) => void;
  setActive: (customer: string | null) => void;
}

const useCustomerStore = create<CustomerState>((set, get) => ({
  customers: [],
  active: null,

  // Fetch customers from PouchDB
  fetchCustomers: async () => {
    const customers = await getCustomers();
    set({ customers: customers as any as Customer[] });
  },

  // Create a new customer
  addCustomer: async (name: string, phone?: string) => {
    const response = await createCustomer({name, phone});
    if (response.ok) {

        set((state) => ({
            customers: [...state.customers, {_id: response.id, name, phone, debt: 0} as Customer],
        }));
    }
  },

  // Update an existing customer
  editCustomer: async (_id: string, name?: string, phone?: string) => {
    const updatedCustomer = await updateCustomer({ _id, name, phone });
    set((state) => ({
      customers: state.customers.map((customer) =>
        customer._id === _id ? { ...updatedCustomer, ...customer} : customer
      ),
    }));
    get().fetchCustomers()
  },

  // Select active customer
  setActive: (customer) => set({ active: get().customers.find((c) => c._id === customer) }),
}));

export default useCustomerStore;
