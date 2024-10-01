import SaleItem from './SaleItem'
import useSale from '@/store/useSaleStore'

const SaleList = () => {
  const { products } = useSale()

  return (
    <div className='w-full flex-1 overflow-y-auto'>
      <table className='w-full overflow-y-auto table-auto'>
        <thead>
          <tr>
            <th>No</th>
            <th>Mahsulot nomi</th>
            <th>Mahsulot narxi</th>
            <th>Miqdori</th>
            <th>Umumiy narx</th>
          </tr>
        </thead>
        <tbody>
          {products?.map((doc, i) => <SaleItem key={i} {...doc} i={i} />)}
        </tbody>
      </table>
    </div>
  )
}

export default SaleList
