import { create } from 'zustand'

type SaleStore = {
  customer: string | null
  products: {
    _id: string
    name: string
    amount: number
    sellPrice: number
    unit: 'piece' | 'm' | 'kg' | 'm2'
  }[] // Make products an array that can be empty
  totalSellPrice: number
  payment: {
    cash: number
    card: number
  }
  prev: {
    _id: string
    products: {
      _id: string
      name: string
      amount: number
      sellPrice: number
      unit: 'piece' | 'm' | 'kg' | 'm2'
    }[]
    totalSellPrice: number
    payment: {
      cash: number
      card: number
    }
  }
  addItem: (
    _id: string,
    amount: number,
    unit: 'piece' | 'm' | 'kg' | 'm2',
    name: string,
    sellPrice: number
  ) => void
  setCustomer: (id: string) => void
  changeTotalSellPrice: (totalSellPrice: number) => void
  changeAmount: (id: string, amount: number) => void
  clear: () => void
  removeItem: (id: string) => void
  paymentCash: (cash?: string) => void
  paymentCard: (card?: string) => void
  setPrev: ({
    _id,
    products,
    totalSellPrice,
    payment,
  }: {
    _id: string
    products: {
      _id: string
      name: string
      amount: number
      sellPrice: number
      unit: 'piece' | 'm' | 'kg' | 'm2'
    }[]
    totalSellPrice: number
    payment: {
      cash: number
      card: number
    }
  }) => void
}

const useSale = create<SaleStore>((set, get) => ({
  customer: null,
  products: [],
  totalSellPrice: 0,
  payment: { cash: 0, card: 0 },
  prev: {
    _id: '',
    products: [],
    totalSellPrice: 0,
    payment: {
      cash: 0,
      card: 0,
    },
  },
  addItem: (_id, amount, unit, name, sellPrice) => {
    const doesExist = get().products.some((p) => p._id === _id)
    if (!doesExist) {
      set((prev) => ({
        ...prev,
        totalSellPrice: prev.totalSellPrice + sellPrice * amount,
        products: [
          ...prev.products,
          {
            _id,
            amount,
            unit,
            name,
            sellPrice,
          },
        ],
      }))
    } else {
      set((prev) => ({
        ...prev,
        products: prev.products.map((p) => {
          if (p._id === _id) {
            return {
              ...p,
              amount: p.amount + amount,
            }
          }
          return p
        }),
      }))
    }
  },
  setCustomer: (id) => {
    set({ customer: id })
  },
  setPrev: ({ _id, products, totalSellPrice, payment }) => {
    set(prev => ({
      customer: prev.customer,
      products,
      totalSellPrice,
      payment,
      prev: {
        _id,
        products,
        totalSellPrice,
        payment,
      },
    }))
  },
  changeAmount: (id, amount) => {
    set((prev) => ({
      ...prev,
      products: prev.products.map((p) => {
        if (p._id === id) {
          return {
            ...p,
            amount,
          }
        }
        return p
      }),
    }))
  },
  clear: () => {
    set({
      prev: {
        _id: '',
        products: [],
        totalSellPrice: 0,
        payment: {
          cash: 0,
          card: 0,
        },
      },
      customer: null,
      products: [],
      totalSellPrice: 0,
      payment: { cash: 0, card: 0 },
    })
  },
  paymentCash: (cash) => {
    set((prev) => ({
      ...prev,
      payment: {
        cash: Number(cash),
        card: prev.payment.card,
      },
    }))
  },
  paymentCard(card) {
    set((prev) => ({
      ...prev,
      payment: {
        card: Number(card),
        cash: prev.payment.cash,
      },
    }))
  },
  removeItem: (id) => {
    set((prev) => ({
      ...prev,
      products: prev.products.filter((p) => p._id !== id),
    }))
  },
  changeTotalSellPrice: (totalSellPrice) => {
    set((prev) => ({
      ...prev,
      totalSellPrice: prev.totalSellPrice - totalSellPrice,
    }))
  },
}))

export default useSale
