import useIntake from '@/store/useIntakeStore'

interface SupplierItemProps {
  _id: string
  name: string
  phone: string
  i: number
}

const SupplierItem = ({ _id, name, phone, i }: SupplierItemProps) => {
  const { setSupplier } = useIntake()

  const handleClick = () => {
    setSupplier(_id)
  }

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
        <div className='text-foreground/60 truncate'>{phone}</div>
      </td>
    </tr>
  )
}

export default SupplierItem
