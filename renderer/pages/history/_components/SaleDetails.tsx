import { Button } from '@/components/ui/button'
import { getCustomer } from '@/db/functions/customerFns'
import { Customer, Intake, Sale } from '@/db/schemas'
import PrintComponent from './PrintComponent'
import React, { useEffect, useRef, useState } from 'react'
import { useReactToPrint } from 'react-to-print'

interface Props {
  active: Sale | Intake | null
}

const SaleDetails = ({ active }: Props) => {
  const printRef = useRef<HTMLDivElement | null>(null)
  const [sale, setSale] = useState<Sale | null>(
    active && 'customer' in active ? (active as Sale) : null
  )
  const [customer, setCustomer] = useState<Customer | null>(null)

  useEffect(() => {
    if (active && 'customer' in active) {
      setSale(active as Sale)
    }
  }, [active])

  useEffect(() => {
    if (sale) {
      getCustomer(sale.customer).then((doc) => {
        setCustomer(doc)
      })
    }
  }, [sale])

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    onAfterPrint: () => {},
  })

  return (
    sale && (
      <>
        <div ref={printRef} className='w-full absolute top-0 -z-50 left-0'>
          {sale?._id && customer?._id && (
            <PrintComponent customer={customer} sale={sale} />
          )}
        </div>
        <div className='w-full p-6 overflow-y-auto bg-background'>
          <div className='flex flex-row items-center justify-between'>
            <h1 className='text-3xl'>Savdo tafsilotlari</h1>
            <div>
              <Button className='mr-4'>Возврат</Button>
              <Button onClick={handlePrint}>Chop Etish</Button>
            </div>
          </div>
          <p>Mijoz: {customer?.name}</p>
          <p>
            Savdodan oldingi qarzi:{' '}
            {new Intl.NumberFormat('en-US').format(sale?.preDebt as number)}
          </p>
          <p>Sana: {sale.timeStamp}</p>
          <p>
            Naqd:{' '}
            {new Intl.NumberFormat('en-US').format(
              sale?.payment?.cash as number
            )}{' '}
            <br />
            Karta:{' '}
            {new Intl.NumberFormat('en-US').format(
              sale?.payment?.card as number
            )}
          </p>
          <p>
            Jami summa:{' '}
            {new Intl.NumberFormat('en-US').format(
              sale?.totalSellPrice as number
            )}
          </p>
          <table className='w-full overflow-y-auto table-auto mt-4'>
            <thead>
              <tr>
                <th>No</th>
                <th>Mahsulot nomi</th>
                <th>Miqdori</th>
                <th>Narxi</th>
                <th>Summa</th>
              </tr>
            </thead>
            <tbody>
              {sale?.products.map((product, i) => (
                <tr key={product._id}>
                  <td className='px-2'>{i + 1}</td>
                  <td className='px-2'>{product.name}</td>
                  <td className='px-2'>
                    {product.amount}{' '}
                    {product.unit === 'piece' ? 'dona' : product.unit}
                  </td>
                  <td className='px-2'>
                    {new Intl.NumberFormat('en-US').format(product.sellPrice)}
                  </td>
                  <td className='px-2'>
                    {new Intl.NumberFormat('en-US').format(
                      product.sellPrice * product.amount
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    )
  )
}

export default SaleDetails
