import React, { useEffect, useState } from 'react'

type Customer = {
  _id: string
  name: string
  phone?: string
  debt: number
}

const CustomerPrintComponent = ({ customers }: { customers: Customer[] }) => {
  const [currentDate, setCurrentDate] = useState<string>('')

  // Set the date on mount
  useEffect(() => {
    setCurrentDate(new Date().toLocaleString())
  }, [])

  const renderRows = (start: number, count: number) => {
    return customers.slice(start, start + count).map((customer, index) => (
      <tr key={`${customer._id}-${start + index}`}>
        <td className="px-2 py-1">{start + index + 1}</td>
        <td className="px-2 py-1">{customer.name}</td>
        <td className="px-2 py-1">{customer.phone}</td>
        <td className="px-2 py-1">
          {new Intl.NumberFormat('en-US').format(customer.debt)}
        </td>
      </tr>
    ))
  }

  const renderTables = () => {
    const tables = []
    const initialPageCount = 29
    const subsequentPageCount = 31

    // First 29 customers
    tables.push(
      <table key="initial" className="w-full table-auto print-table mb-[50%]">
        <thead>
          <tr>
            <th className="px-2 py-1 text-left">No</th>
            <th className="px-2 py-1 text-left">Mijoz ismi</th>
            <th className="px-2 py-1 text-left">Telefon raqami</th>
            <th className="px-2 py-1 text-left">Mijozning qarzi</th>
          </tr>
        </thead>
        <tbody>{renderRows(0, initialPageCount)}</tbody>
      </table>
    )

    // Remaining customers
    for (
      let start = initialPageCount;
      start < customers.length;
      start += subsequentPageCount
    ) {
      tables.push(
        <table
          key={`subsequent-${start}`}
          className="w-full table-auto print-table mb-[57%]"
        >
          <tbody>{renderRows(start, subsequentPageCount)}</tbody>
        </table>
      )
    }

    return tables
  }

  return (
    <div className="w-[68%] aspect-[210/297] bg-background pt-2 text-[10px] mx-auto flex flex-col items-center justify-start">
      <div className="w-full flex justify-between border-b pb-2 mb-4">
        <h1 className="text-xl font-bold">Mijozlar Ro'yxati</h1>
        <div className="text-right">
          {currentDate && (
            <div>
              <b>Sana:</b> {currentDate}
            </div>
          )}
          <div>
            <b>Jami mijozlar:</b> {customers.length}
          </div>
        </div>
      </div>
      {renderTables()}
    </div>
  )
}

export default CustomerPrintComponent
