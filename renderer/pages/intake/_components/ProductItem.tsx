import { useEffect, useState } from 'react'

import useIntake from '@/store/useIntakeStore'
import { getFolder } from '@/db/functions/folderFns'
import { getWarehouseItem } from '@/db/functions/warehouseFns'
import { cn } from '@/lib/utils'
import { Folder } from '@/db/schemas'
import usePrompt from '@/hooks/usePrompt'

interface ProductItemProps {
  _id: string
  supplier: string
  name: string
  buyPrice: number
  sellPrice: number
  i: number
  unit: 'piece' | 'm' | 'kg' | 'm2'
  folder: string
}

const ProductItem = ({
  _id,
  name,
  buyPrice,
  sellPrice,
  i,
  unit,
  folder,
}: ProductItemProps) => {
  const { addItem, products } = useIntake()
  const [folderObj, setFolder] = useState<Folder | null>(null)
  const [remaining, setRemaining] = useState<number>(0)
  const prompt = usePrompt()

  useEffect(() => {
    const fetchFolder = async () => {
      const doc = await getFolder(folder)
      setFolder(doc as any as Folder)
    }

    fetchFolder()
  }, [folder])

  useEffect(() => {
    const fetchWarehouseItem = async () => {
      const doc = await getWarehouseItem(_id)

      if (doc) {
        setRemaining(doc.amount)
      }
    }
    fetchWarehouseItem()
  }, [_id])

  const handleClick = async () => {    
    let amount = await prompt(
      `${name} mahsulot miqdori(${unit === 'piece' ? 'dona' : unit}):`
    )

    while (Number.isNaN(Number(amount))) {
      amount = await prompt('Mahsulot miqdorini to`g`ri kiriting:')
    }

    if (!Number(amount) || Number(amount) <= 0) return

    addItem(_id, buyPrice, Number(amount), unit, name, sellPrice, folder)
  }
  return (
    <tr
      className={cn(
        'w-full h-8 cursor-pointer hover:bg-primary-foreground',
        products.some((p) => p._id === _id) && 'hidden'
      )}
      onClick={handleClick}
    >
      <td className='px-2'>{i + 1}</td>
      <td className='px-2'>
        <div className='w-full truncate'>{name}</div>
      </td>
      <td className='px-2'>
        <div className='w-full truncate'>{folderObj?.name}</div>
      </td>
      <td className='px-2'>
        <div className='text-foreground/60 truncate'>
          {new Intl.NumberFormat().format(buyPrice)}
        </div>
      </td>
      <td className='px-2'>
        <div className='text-foreground/60 truncate'>
          {new Intl.NumberFormat().format(sellPrice)}
        </div>
      </td>
      <td className='px-2'>
        <div className='text-foreground/60 truncate'>
          {remaining || 0} {unit === 'piece' ? 'dona' : unit}
        </div>
      </td>
    </tr>
  )
}

export default ProductItem
