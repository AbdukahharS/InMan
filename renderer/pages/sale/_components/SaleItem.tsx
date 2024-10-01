import useSale from '@/store/useSaleStore'
import usePrompt from '@/hooks/usePrompt'
import { cn } from '@/lib/utils'

interface SaleItemProps {
  i: number
  name: string
  _id: string
  amount: number
  sellPrice: number
  unit: 'piece' | 'm' | 'kg' | 'm2'
}

const SaleItem = ({ _id, name, amount, sellPrice, unit, i }: SaleItemProps) => {
  const { changeAmount, changeTotalSellPrice } = useSale()
  const prompt = usePrompt()

  const handleClick = async () => {
    let newAmount = await prompt(
      `${name} mahsulot miqdorini o'zgartirish (${
        unit === 'piece' ? 'dona' : unit
      }):`,
      amount.toString()
    )

    while (Number.isNaN(Number(newAmount))) {
      newAmount = await prompt(
        'Mahsulot miqdorini to`g`ri kiriting:',
        amount.toString()
      )
    }

    if (Number(newAmount) < 0) return

    changeAmount(_id, Number(newAmount))
    changeTotalSellPrice((amount - Number(newAmount)) * sellPrice)
  }

  return (
    <tr
      className={cn(
        'w-full h-8 cursor-pointer hover:bg-primary-foreground',
        amount === 0 && 'hidden'
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
      <td>
        <div className='text-foreground/60 truncate'>
          {amount} {unit === 'piece' ? 'dona' : unit}
        </div>
      </td>
      <td>
        <div className='text-foreground/60 truncate'>
          {new Intl.NumberFormat().format(sellPrice * amount)}
        </div>
      </td>
    </tr>
  )
}

export default SaleItem
