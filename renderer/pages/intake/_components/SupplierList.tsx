import { useEffect, useState } from 'react'

import SupplierItem from './SupplierItem'
import useSupplierStore from '@/store/useSupplierStore'

interface SupplierListProps {
  search: string
}

const SupplierList = ({ search }: SupplierListProps) => {
  const {suppliers, fetchSuppliers} = useSupplierStore()

  useEffect(() => {
    fetchSuppliers()
  }, [])

  return (
    <div className='w-full flex-1 overflow-y-auto'>
      <table className='w-full overflow-y-auto table-auto'>
        <thead>
          <tr>
            <th>No</th>
            <th>Ta'minotchi ismi</th>
            <th>Telefon raqam</th>
          </tr>
        </thead>
        <tbody>
          {suppliers?.map((doc, i) => {
            if (!search || doc.name.toLowerCase().includes(search.toLowerCase())) {
              return (
                <SupplierItem key={i} {...doc} i={i} />
              )
            }
          })}
        </tbody>
      </table>
      {!suppliers?.length && (
        <p className='text-center text-xl pt-6'>Ta'minotchi topilmadi</p>
      )}
    </div>
  )
}

export default SupplierList
