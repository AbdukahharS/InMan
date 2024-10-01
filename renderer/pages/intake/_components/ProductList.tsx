import { useEffect } from 'react'
import { ArrowLeft } from 'lucide-react'

import ProductItem from './ProductItem'
import useIntake from '@/store/useIntakeStore'
import useProductStore from '@/store/useProductStore'
import { Button } from '@/components/ui/button'

const ProductList = ({ search }: { search: string }) => {
  const { supplier, setSupplier } = useIntake()
  const { products, fetchProductsofSupplier } = useProductStore()
  if (!supplier) return null

  useEffect(() => {
    fetchProductsofSupplier(supplier)
  }, [search])

  return (
    <div className='flex-1 overflow-y-auto'>
      <table className='w-full overflow-y-auto table-auto'>
        <thead>
          <tr>
            <th>
              <Button
                size='icon'
                className='h-8'
                onClick={() => setSupplier(null)}
              >
                <ArrowLeft className='w-5 h-5' />
              </Button>
            </th>
            <th>Mahsulot nomi</th>
            <th>Papka</th>
            <th>Sotib olish narxi</th>
            <th>Sotish narxi</th>
            <th>Qoldiq</th>
          </tr>
        </thead>
        <tbody>
          {products.length ?
            products.map((doc, i) => {
              if (
                !search ||
                doc.name.toLowerCase().includes(search.toLowerCase())
              ) {
                return <ProductItem key={doc._id} {...doc} i={i} />
              }
            }) : null}
        </tbody>
      </table>
      {!products.length && (
        <p className='text-center text-xl flex-1 mt-8'>
          Bu ta'minotchi uchun mahsulotlar topilmadi
        </p>
      )}
    </div>
  )
}

export default ProductList
