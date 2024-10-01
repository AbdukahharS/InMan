import { getSupplier } from '@/db/functions/supplierFns'
import { Intake, Sale, Supplier } from '@/db/schemas'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'

interface IntakeItemProps {
  _id: string
  totalBuyPrice: number
  i: number
  timeStamp: string
  handleClick: (_id: Sale | Intake) => void
  active: Sale | Intake | null
  products: {
    _id: string
    name: string
    buyPrice: number
    unit: 'piece' | 'm' | 'kg' | 'm2'
    amount: number
  }[]
  supplier: string
}



const IntakeItem = ({
  _id,
  totalBuyPrice,
  timeStamp,
  products,
  i,
  handleClick,
  active,
  supplier,
}: IntakeItemProps) => {
  const [supplierObj, setSupplierObj] = useState<Supplier | null>(null)

  useEffect(() => {
    getSupplier(supplier).then(sup => setSupplierObj(sup as Supplier))
  }, [supplier])

  return (
    <tr
      className={cn(
        'w-full h-8 cursor-pointer hover:bg-primary-foreground',
        active?._id === _id && 'bg-primary-foreground'
      )}
      onClick={() => handleClick({ _id, totalBuyPrice, timeStamp, products, supplier })}
    >
      <td className='px-2'>{i + 1}</td>
      <td className='px-2'>
        <div className='w-full truncate'>{supplierObj?.name}</div>
      </td>
      <td className='px-2'>
        <div className='text-foreground/60 truncate'>
          {timeStamp}
        </div>
      </td>
      <td className='px-2'>
        <div className='text-foreground/60 truncate'>
          {new Intl.NumberFormat('en-US').format(totalBuyPrice)}
        </div>
      </td>
    </tr>
  )
}

export default IntakeItem
