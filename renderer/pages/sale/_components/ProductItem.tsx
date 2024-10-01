import useSale from '@/hooks/useSale'
import { cn } from '@/lib/utils'
import usePrompt from '@/hooks/usePrompt'
import { useToast } from '@/components/ui/use-toast'
import { useEffect, useState } from 'react'

interface ProductItemProps {
  _id: string
  supplier: string
  name: string
  amount: number
  sellPrice: number
  i: number
  unit: 'piece' | 'm' | 'kg' | 'm2'
}

const ProductItem = ({
  _id,
  name,
  amount,
  sellPrice,
  i,
  unit,
}: ProductItemProps) => {
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
  return (
    <tr
      className={cn(
        'w-full h-8 cursor-pointer hover:bg-primary-foreground',
        amount === 0 ? 'cursor-default' : '',
        saleProducts.find((p) => p._id === _id) &&
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
  )
}

export default ProductItem
