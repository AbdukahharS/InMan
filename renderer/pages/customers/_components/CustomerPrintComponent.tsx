import React, { useEffect, useState } from 'react'

type Customer = {
  _id: string;
  name: string;
  phone?: string;
    debt: number;
  // Add other customer properties as needed
}

const CustomerPrintComponent = ({
  customers
}: {
  customers: Customer[]
}) => {
  const [currentDate, setCurrentDate] = useState<string>('')

  // Set the date only on the client side to avoid hydration mismatch
  useEffect(() => {
    setCurrentDate(new Date().toLocaleString())
  }, [])

  return (
    <div className='w-[50%] bg-background pt-6 text-[10px] mx-auto'>
      <div className='w-full flex justify-between border-b pb-2 mb-4'>
        <h1 className='text-xl font-bold'>Mijozlar Ro'yxati</h1>
        <div className='text-right'>
          {currentDate && (
            <div>
              <b>Sana:</b> {currentDate}
            </div>
          )}
          <div>
            <b>Jami mijozlar:</b> {customers?.length}
          </div>
        </div>
      </div>
      <table className='w-full table-auto mt-3 print-table'>
        <thead>
          <tr>
            <th className='px-2 py-1 text-left'>No</th>
            <th className='px-2 py-1 text-left'>Mijoz ismi</th>
            <th className='px-2 py-1 text-left'>Telefon raqami</th>
            <th className='px-2 py-1 text-left'>Mijozning qarzi</th>
          </tr>
        </thead>
        <tbody>
          {customers?.map((customer, i) => (
            <tr key={customer._id}>
              <td className='px-2 py-1'>{i + 1}</td>
              <td className='px-2 py-1'>{customer.name}</td>
              <td className='px-2 py-1'>{customer.phone}</td>
              <td className='px-2 py-1'>
                {new Intl.NumberFormat('en-US').format(customer.debt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default CustomerPrintComponent