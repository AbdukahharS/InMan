import { useEffect } from 'react'

import { getWarehouseFolder } from '@/db/functions/warehouseFns'
import useFolderStore from '@/store/useFolderStore'
import useWarehouseStore from '@/store/useWarehouseStore'
import useCustomerStore from '@/store/useCustomerStore'
import useSaleStore from '@/store/useSaleStore'
import { Sale, Warehouse } from '@/db/schemas'
import { getSalesOfCustomerToday } from '@/db/functions/saleFns'

const useSale = () => {
  const {
    folders,
    fetchFolders,
    setActive: setFolder,
    active: folder,
  } = useFolderStore()
  const { products: warehouse, setProducts } = useWarehouseStore()
  const {
    active: customer,
    setActive: setCustomer,
    customers,
    fetchCustomers,
  } = useCustomerStore()
  const {
    addItem,
    products: saleProducts,
    totalSellPrice,
    payment,
    setPrev,
    setCustomer: setSaleCustomer,
    prev: salePrev,
    paymentCard,
    paymentCash,
    clear: clearSale,
  } = useSaleStore()

  useEffect(() => {
    fetchFolders()
    fetchCustomers()
  }, [])

  useEffect(() => {}, [customer])
  useEffect(() => {
    fetchProducts()
  }, [folder])

  const fetchProducts = async () => {
    if (folder?._id) {
      const docs = await getWarehouseFolder(folder._id)
      setProducts(docs as any as Warehouse[])
    }
  }

  const selectCustomer = async (v: string) => {
    if (v === customer?._id) return

    clearSale()

    const todaySale = await getSalesOfCustomerToday(v)

    if (!!todaySale) {
      setSaleCustomer(v)
      setCustomer(v)
      setPrev({
        _id: todaySale._id,
        products: todaySale.products,
        totalSellPrice: todaySale.totalSellPrice,
        payment: todaySale.payment,
      })
    } else {
      setSaleCustomer(v)
      setCustomer(v)
      setPrev
    }
  }

  return {
    folders,
    setFolder,
    folder,
    warehouse,
    customer,
    customers,
    addItem,
    saleProducts,
    selectCustomer,
    salePrev,
    totalSellPrice,
    payment,
    clearSale,
    paymentCard,
    paymentCash,
  }
}

export default useSale
