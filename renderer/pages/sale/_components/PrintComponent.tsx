'use client'

import useSale from '@/hooks/useSale'

const PrintComponent = () => {
  const { customer, saleProducts, totalSellPrice, payment } = useSale()

  return (
    <div className='w-[50%] bg-background pt-6 text-[10px] mx-auto'>
      <div className='w-full flex justify-between border-b pb-1'>
        <b>{customer?.name}</b>
        <span>
          Qarz: {new Intl.NumberFormat('en-US').format(customer?.debt || 0)}
        </span>
        <span>{new Date().toLocaleString()}</span>
      </div>
      <table className='w-full table-auto mt-3 print-table'>
        <thead>
          <tr>
            <th>No</th>
            <th>Mahsulot nomi</th>
            <th>Narx</th>
            <th>Miqdor</th>
            <th>Summa</th>
          </tr>
        </thead>
        <tbody>
          {saleProducts.map((p, i) => (
            <tr key={p._id}>
              <td className='px-1'>{i + 1}</td>
              <td className='px-1'>{p.name}</td>
              <td className='px-1'>
                {new Intl.NumberFormat('en-US').format(p.sellPrice)}
              </td>
              <td className='px-1'>
                {p.amount} {p.unit === 'piece' ? 'ta' : p.unit}
              </td>
              <td className='px-1'>
                {new Intl.NumberFormat('en-US').format(p.sellPrice * p.amount)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className='w-full flex items-center gap-6 mt-2'>
        <span className='pr-2 border-r'>
          Umumiy summa: {new Intl.NumberFormat('en-US').format(totalSellPrice)}
        </span>
        <span>Naqd: {new Intl.NumberFormat('en-US').format(payment.cash)}</span>
        <span>
          Plastik: {new Intl.NumberFormat('en-US').format(payment.card)}
        </span>
      </div>
    </div>
  )
}

export default PrintComponent
