import ProductItem from './ProductItem'
import useSale from '@/hooks/useSale'

const ProductList = () => {
  const { warehouse, folder } = useSale()

  return (
    <div className='flex-1 overflow-y-auto'>
      {!folder?._id ? (
        <p className='text-center text-xl flex-1 mt-8'>Papka tanlang</p>
      ): warehouse?.length ? (
        <table className='w-full overflow-y-auto table-auto'>
          <thead>
            <tr>
              <th>No</th>
              <th>Mahsulot nomi</th>
              <th>Narxi</th>
              <th>Qoldiq</th>
            </tr>
          </thead>
          <tbody>
            {warehouse.map((doc, i) => (
              <ProductItem key={doc._id} {...doc} i={i} />
            ))}
          </tbody>
        </table>
      ) : (
        <p className='text-center text-xl flex-1 mt-8'>
          Bu papkada mahsulotlar topilmadi
        </p>
      )}
    </div>
  )
}

export default ProductList
