import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import useSale from '@/hooks/useSale'
import { cn } from '@/lib/utils'
import usePrompt from '@/hooks/usePrompt'
import { useToast } from '@/components/ui/use-toast'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'
import {
  subtractFromWarehouse,
  updateItemSellPrice,
} from '@/db/functions/warehouseFns'

interface ProductItemProps {
  _id: string
  productId: string
  supplier: string
  name: string
  amount: number
  sellPrice: number
  i: number
  unit: 'piece' | 'm' | 'kg' | 'm2'
}

const ProductItem = ({
  _id,
  productId,
  name,
  amount,
  sellPrice,
  i,
  unit,
}: ProductItemProps) => {
  const { reload } = useRouter()
  const { addItem, saleProducts, salePrev, customer } = useSale()
  const { toast } = useToast()
  const prompt = usePrompt()
  const [remaining, setRemaining] = useState<number>(0)

  useEffect(() => {
    const prevSaleAmount =
      salePrev?.products.find((p) => p._id === _id)?.amount || 0
    const saleAmount = saleProducts.find((p) => p._id === _id)?.amount || 0
    setRemaining(amount - (saleAmount - prevSaleAmount))
  }, [saleProducts])

  const handleClick = async () => {
    if (!customer)
      return toast({ title: 'Mijoz tanlanmagan', variant: 'destructive' })
    if (saleProducts.find((p) => p._id === _id)) return
    let newAmount = await prompt(
      `${name} mahsulot miqdori(${unit === 'piece' ? 'dona' : unit}):`
    )

    while (Number.isNaN(Number(newAmount))) {
      newAmount = await prompt('Mahsulot miqdorini to`g`ri kiriting:')
    }

    while (Number(newAmount) > amount) {
      newAmount = await prompt(
        'Mahsulot miqdorini ombordagidan oshmasligi kerak:'
      )
    }

    if (Number(newAmount) === 0) return

    addItem(_id, Number(newAmount), unit, name, sellPrice)
  }

  const removeDefective = async () => {
    const defectiveAmount = await prompt(
      'Nuqsonli(брак) tovar miqdorini kiriting:'
    )

    if (!Number(defectiveAmount) || Number(defectiveAmount) > amount) {
      return toast({
        title: 'Miqdor notog`ri kiritildi',
        variant: 'destructive',
      })
    }

    await subtractFromWarehouse(_id, Number(defectiveAmount))
      .then(() => {
        reload()
      })
      .catch((error) => {
        toast({ title: error.toString(), variant: 'destructive' })
      })
  }

  const changeSellPrice = async () => {
    const newSellPrice = await prompt(
      'Sotish narxini kiriting:',
      sellPrice.toString()
    )
    if (!newSellPrice) return
    if (Number.isNaN(Number(newSellPrice))) {
      return toast({
        title: 'Sotish narx notog`ri kiritildi',
        variant: 'destructive',
      })
    }

    await updateItemSellPrice(productId, Number(newSellPrice))
      .then(() => {
        reload()
      })
      .catch((error) => {
        toast({ title: error.toString(), variant: 'destructive' })
      })
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <tr
          className={cn(
            'w-full h-8 cursor-pointer hover:bg-primary-foreground',
            amount === 0 ? 'cursor-default' : '',
            saleProducts.find((p) => p._id === _id && p.amount > 0) &&
              'cursor-default hover:bg-background'
          )}
          onClick={handleClick}
        >
          <td className='px-2'>{i + 1}</td>
          <td className='px-2'>
            <div className='w-full truncate'>{name}</div>
          </td>
          <td className='px-2'>
            <div className='text-foreground/60 truncate'>
              {new Intl.NumberFormat().format(sellPrice)}
            </div>
          </td>
          <td className='px-2'>
            <div className='text-foreground/60 truncate'>
              {remaining} {unit === 'piece' ? 'dona' : unit}
            </div>
          </td>
        </tr>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={removeDefective}>
          Nuqsonli(брак) tovar
        </ContextMenuItem>
        <ContextMenuItem onClick={changeSellPrice}>
          Narxni o'zgartirish
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}

export default ProductItem
