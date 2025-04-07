import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getSalesInDateRangeCustomer } from '@/db/functions/saleFns'
import { Customer, Sale } from '@/db/schemas'
import SaleItem from '@/pages/history/_components/SaleItem'
import { ArrowLeft } from 'lucide-react'
import React, { useEffect, useState } from 'react'

function today() {
  const d = new Date()
  const day = d.getDate()
  const month = d.getMonth() + 1 // Months are zero-indexed
  const year = d.getFullYear()

  return `${day}.${month}.${year}`
}

function parseDate(dateString: string) {
  // Split the string into day, month, and year
  const [day, month, year] = dateString.split('.').map(Number)

  // Create and return a new Date object
  return new Date(year, month - 1, day).getTime() // Month is zero-indexed
}

type Numbers = {
  summ: number
  cash: number
  card: number
  debt: number
}

const CustomerHistory = ({ customer }: { customer: Customer }) => {
  const [start, setStart] = React.useState(today())
  const [end, setEnd] = React.useState(today())
  const [sales, setSales] = useState<Sale[]>()
  const [active, setActive] = useState<Sale | null>(null)

  useEffect(() => {
    getSalesInDateRangeCustomer(
      parseDate(start),
      parseDate(end),
      customer?._id
    ).then(setSales)
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

  const handleClick = (sale: Sale) => {
    console.log(sale)

    setActive(sale)
  }

  return active ? (
    <div className='w-full p-6 overflow-y-auto bg-background border-t'>
      <div className='flex flex-row items-center gap-6 mb-2'>
        <Button onClick={() => setActive(null)}><ArrowLeft /></Button>
        <h1 className='text-3xl'>Savdo tafsilotlari</h1>
      </div>
      <p>
        Savdodan oldingi qarzi:{' '}
        {new Intl.NumberFormat('en-US').format(active?.preDebt as number)}
      </p>
      <p>Sana: {active.timeStamp}</p>
      <p>
        Naqd:{' '}
        {new Intl.NumberFormat('en-US').format(active?.payment?.cash as number)}{' '}
        <br />
        Karta:{' '}
        {new Intl.NumberFormat('en-US').format(active?.payment?.card as number)}
      </p>
      <p>
        Jami summa:{' '}
        {new Intl.NumberFormat('en-US').format(
          active?.totalSellPrice as number
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
          {active?.products.map((product, i) => (
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
  ) : (
    <div>
      <div className='w-full flex flex-row px-6 py-2 border-y gap-6 items-center'>
        <div className='flex flex-row items-center gap-3'>
          <Label htmlFor='start'>Boshlash:</Label>
          <Input
            value={start}
            name='start'
            onChange={(e) => setStart(e.target.value)}
            className='w-[100px]'
          />
        </div>
        <div className='flex flex-row items-center gap-3'>
          <Label htmlFor='end'>Tugash:</Label>
          <Input
            value={end}
            name='end'
            onChange={(e) => setEnd(e.target.value)}
            className='w-[100px]'
          />
        </div>
      </div>
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
          Bu mijozda kiritilgan vaqt ichida savdo topilmadi
        </p>
      )}
    </div>
  )
}

export default CustomerHistory
