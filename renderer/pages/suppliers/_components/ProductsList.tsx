import { useEffect } from 'react'

import SupplierProduct from './SupplierProduct'
import useSupplierStore from '@/store/useSupplierStore'
import useProductStore from '@/store/useProductStore'

const ProductsList = () => {
  const {active} = useSupplierStore()
  const {fetchProductsofSupplier, products} = useProductStore()
  if (!active) return null

  useEffect(() => {
    fetchProductsofSupplier(active._id)
  }, [active])

  return (
    <div className='flex-1 overflow-y-auto'>
      {products?.length ? (
        <table className='w-full overflow-y-auto table-auto'>
          <thead>
            <tr>
              <th>No</th>
              <th>Mahsulot nomi</th>
              <th>Sotib olish narxi</th>
              <th>Sotish narxi</th>
              <th>Birligi</th>
              <th>Papka</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((doc, i) => (
              <SupplierProduct key={doc._id} {...doc} i={i} />
            ))}
          </tbody>
        </table>
      ) : (
        <p className='text-center text-xl flex-1 mt-8'>
          Bu ta'minotchi uchun mahsulotlar topilmadi
        </p>
      )}
    </div>
  )
}

export default ProductsList
