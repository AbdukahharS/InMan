import React, { useEffect, useState } from 'react'

import { Intake, Sale, Supplier } from '@/db/schemas'
import { getSupplier } from '@/db/functions/supplierFns'

interface Props {
  active: Intake | Sale | null
}

const IntakeDetails = ({ active }: Props) => {
  const [intake, setIntake] = useState<Intake | null>(active as Intake | null) 
  const [supplier, setSupplier] = useState<Supplier | null>(null)
  
  useEffect(() => {
    if (intake) {
      getSupplier(intake.supplier).then(sup => setSupplier(sup as Supplier))
    }
  }, [intake])
  
  useEffect(() => {
    if ('supplier' in active) {
      setIntake(active as Intake)
    }
  }, [active])
  
  return (
    <div className='w-full p-6 overflow-y-auto'>
      <h1 className='text-3xl'>Ta'minot kirimi tafsilotlari</h1>
      <p>Ta'minotchi: {supplier?.name}</p>
      <p>Sana: {intake?.timeStamp}</p>

      <p>
        Jami summa:{' '}
        {new Intl.NumberFormat('en-US').format(intake?.totalBuyPrice as number)}
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
          {intake?.products.map((product, i) => (
            <tr key={product._id}>
              <td className='px-2'>{i + 1}</td>
              <td className='px-2'>{product.name}</td>
              <td className='px-2'>
                {product.amount}{' '}
                {product.unit === 'piece' ? 'dona' : product.unit}
              </td>
              <td className='px-2'>
                {new Intl.NumberFormat('en-US').format(product.buyPrice)}
              </td>
              <td className='px-2'>
                {new Intl.NumberFormat('en-US').format(
                  product.buyPrice * product.amount
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default IntakeDetails
