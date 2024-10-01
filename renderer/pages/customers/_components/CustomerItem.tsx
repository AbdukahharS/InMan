// import { Doc, Id } from '@/convex/_generated/dataModel'
import { cn } from '@/lib/utils'
import useCustomerStore from '@/store/useCustomerStore'

interface CustomerItemProps {
  _id: string
  name: string
  phone?: string
  debt: number
  i: number
}

const CustomerItem = ({
  _id,
  name,
  phone,
  debt,
  i,
}: CustomerItemProps) => {
  const {setActive, active} = useCustomerStore()
  return (
    <tr
      className={cn(
        'w-full h-8 cursor-pointer hover:bg-primary-foreground',
        active?._id === _id && 'bg-primary-foreground'
      )}
      onClick={() => setActive(_id)}
    >
      <td className='px-2'>{i + 1}</td>
      <td className='px-2'>
        <div className='w-full truncate'>{name}</div>
      </td>
      <td className='px-2'>
        <div className='text-foreground/60 truncate'>{phone}</div>
      </td>
      <td className='px-2'>
        <div className='text-foreground/60 truncate'>
          {new Intl.NumberFormat('en-US').format(debt)}
        </div>
      </td>
    </tr>
  )
}

export default CustomerItem
