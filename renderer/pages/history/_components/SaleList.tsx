import React, { useEffect, useState } from 'react'

import SaleItem from './SaleItem'
import { Intake, Sale } from '@/db/schemas'
import { getSalesInDateRange } from '@/db/functions/saleFns'

function parseDate(dateString: string) {
  // Split the string into day, month, and year
  const [day, month, year] = dateString.split('.').map(Number)

  // Create and return a new Date object
  return new Date(year, month - 1, day).getTime() // Month is zero-indexed
}

interface Props {
  start: string
  end: string
  active: Sale | Intake | null
  handleClick: (_id: Sale | Intake) => void
}

type Numbers = {
  summ: number
  cash: number
  card: number
  debt: number
}

const SaleList = ({ start, end, active, handleClick }: Props) => {
  const [sales, setSales] = useState<Sale[]>()

  useEffect(() => {
    getSalesInDateRange(parseDate(start), parseDate(end)).then(setSales)
  }, [start, end])

  const [numbers, setNumbers] = useState<Numbers>({
    summ: 0,
    cash: 0,
    card: 0,
    debt: 0,
  })

  useEffect(() => {
    if (sales) {
      const summ = sales.reduce((a, b) => a + b.totalSellPrice, 0)
      const cash = sales.reduce((a, b) => a + b.payment.cash, 0)
      const card = sales.reduce((a, b) => a + b.payment.card, 0)
      const debt = summ - (cash + card)

      setNumbers({
        summ,
        cash,
        card,
        debt,
      })
    }
  }, [sales])

  return (
    <div className='w-full flex-1 overflow-y-auto'>
      {sales?.length ? (
        <>
          <table className='w-full overflow-y-auto table-auto'>
            <thead>
              <tr>
                <th>No</th>
                <th>Mijoz ismi</th>
                <th>Tovar summasi</th>
                <th>Naqd</th>
                <th>Karta</th>
                <th>Qarz</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((doc, i) => (
                <SaleItem
                  key={doc._id}
                  {...doc}
                  i={i}
                  handleClick={handleClick}
                  active={active}
                />
              ))}
            </tbody>
            <thead>
              <tr>
                <th></th>
                <th>Jami:</th>
                <th>{new Intl.NumberFormat('en-US').format(numbers.summ)}</th>
                <th>{new Intl.NumberFormat('en-US').format(numbers.cash)}</th>
                <th>{new Intl.NumberFormat('en-US').format(numbers.card)}</th>
                <th>{new Intl.NumberFormat('en-US').format(numbers.debt)}</th>
              </tr>
            </thead>
          </table>
        </>
      ) : (
        <p className='text-center text-xl flex-1 mt-8'>
          Sizda hech qanday mijoz mavjud emas
        </p>
      )}
    </div>
  )
}

export default SaleList
