import usePrompt from '@/hooks/usePrompt'
import useIntake from '@/store/useIntakeStore'


interface IntakeItemProps {
  i: number
  name: string
  _id: string
  amount: number
  buyPrice: number
  unit: 'piece' | 'm' | 'kg' | 'm2'
}

const IntakeItem = ({
  _id,
  name,
  amount,
  buyPrice,
  unit,
  i,
}: IntakeItemProps) => {
  const { changeAmount, removeItem } = useIntake()
  const prompt = usePrompt();

  const handleClick = async () => {
  
    // Prompt the user for a new amount
    let newAmount = Number(
      await prompt(
        `${name} mahsulot miqdorini o'zgartirish (${unit === 'piece' ? 'dona' : unit}):`,
        amount.toString()
      )
    );
  
    // Repeat prompt if input is not a valid number
    while (Number.isNaN(newAmount)) {
      newAmount = Number(
        await prompt('Mahsulot miqdorini to`g`ri kiriting:', amount.toString())
      );
    }

    if (newAmount < 0) return
  
    // Handle the conditions based on the new amount
    if (newAmount === 0) {
      removeItem(_id);
      return;
    }
  
    if (!newAmount || newAmount === amount) return;
  
    changeAmount(_id, newAmount);
  };
  

  return (
    <tr
      className='w-full h-8 cursor-pointer hover:bg-primary-foreground'
      onClick={handleClick}
    >
      <td className='px-2'>{i + 1}</td>
      <td className='px-2'>
        <div className='w-full truncate'>{name}</div>
      </td>
      <td className='px-2'>
        <div className='text-foreground/60 truncate'>
          {new Intl.NumberFormat().format(buyPrice)}
        </div>
      </td>
      <td className='px-2'>
        <div className='text-foreground/60 truncate'>
          {amount} {unit === 'piece' ? 'dona' : unit}
        </div>
      </td>
    </tr>
  )
}

export default IntakeItem
