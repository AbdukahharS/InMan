import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import useSale from '@/hooks/useSale'

const SelectCustomer = () => {
  const { customer, customers, selectCustomer } = useSale()

  return (
    <div className='w-full border-b relative'>
      <Select
        onValueChange={selectCustomer}
        value={customer?._id || ''}
      >
        <SelectTrigger className='w-full'>
          <SelectValue placeholder='Mijozni tanlang' />
        </SelectTrigger>
        <SelectContent>
          {customers?.map((customer) => (
            <SelectItem value={customer._id} key={customer._id}>
              <div className='flex items-center gap-2 justify-between w-full'>
                <span>
                  {customer.name} ({customer.phone})
                </span>
                <span>{new Intl.NumberFormat().format(customer.debt)}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export default SelectCustomer
