import { getCustomer } from '@/db/functions/customerFns'
import { Customer, Intake, Sale } from '@/db/schemas'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'

interface SaleItemProps {
  _id: string
  totalSellPrice: number
  i: number
  timeStamp: string
  handleClick: (_id: Sale | Intake) => void
  active: Sale | Intake | null
  products: {
    _id: string
    name: string
    sellPrice: number
    unit: 'piece' | 'm' | 'kg' | 'm2'
    amount: number
  }[]
  payment: {
    card: number
    cash: number
  }
  customer: string
}

const SaleItem = ({
  _id,
  totalSellPrice,
  products,
  timeStamp,
  i,
  handleClick,
  active,
  payment,
  customer,
}: SaleItemProps) => {
  const [customerObj, setCustomerObj] = useState<Customer | null>(null)

  useEffect(() => {
    getCustomer(customer).then((doc) => {
      setCustomerObj(doc)
    })
  }, [customer])

  return (
    <tr
      className={cn(
        'w-full h-8 cursor-pointer hover:bg-primary-foreground',
        active?._id === _id && 'bg-primary-foreground'
      )}
      onClick={() => handleClick({ _id, totalSellPrice, timeStamp, products, customer, payment })}
    >
      <td className='px-2'>{i + 1}</td>
      <td className='px-2'>
        <div className='w-full truncate'>{customerObj?.name}</div>
      </td>
      <td className='px-2'>
        <div className='text-foreground/60 truncate'>
          {new Intl.NumberFormat('en-US').format(totalSellPrice)}
        </div>
      </td>
      <td className='px-2'>
        <div className='text-foreground/60 truncate'>
          {new Intl.NumberFormat('en-US').format(payment?.cash)}
        </div>
      </td>
      <td className='px-2'>
        <div className='text-foreground/60 truncate'>
          {new Intl.NumberFormat('en-US').format(payment?.card)}
        </div>
      </td>
      <td className='px-2'>
        <div className='text-foreground/60 truncate'>
          {new Intl.NumberFormat('en-US').format(
            totalSellPrice - payment?.cash - payment?.card
          )}
        </div>
      </td>
    </tr>
  )
}

export default SaleItem
