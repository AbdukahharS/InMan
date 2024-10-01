'use client'

import useSale from '@/hooks/useSale'

const PrintComponent = () => {
  const { customer, saleProducts, totalSellPrice, payment } = useSale()

  return (
    <div className='w-full bg-background p-6 '>
      <div className='w-full flex justify-between border-b pb-1'>
        <b>{customer?.name}</b>
        <span>
          Qarz: {new Intl.NumberFormat('en-US').format(customer?.debt || 0)}
        </span>
        <span>{new Date().toLocaleString()}</span>
      </div>
      <table
        className='w-full table-auto mt-3
      '
      >
        <thead>
          <tr>
            <th className='w-12'>No</th>
            <th>Mahsulot nomi</th>
            <th>Narx</th>
            <th>Miqdor</th>
            <th>Summa</th>
          </tr>
        </thead>
        <tbody>
          {saleProducts.map((p, i) => (
            <tr key={p._id}>
              <td className='px-2'>{i + 1}</td>
              <td className='px-2'>{p.name}</td>
              <td className='px-2'>
                {new Intl.NumberFormat('en-US').format(p.sellPrice)}
              </td>
              <td className='px-2'>
                {p.amount} {p.unit === 'piece' ? 'dona' : p.unit}
              </td>
              <td>
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
