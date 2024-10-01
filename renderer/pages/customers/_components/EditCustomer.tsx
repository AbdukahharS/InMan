import { useEffect, useState } from 'react'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Customer } from '@/db/schemas'
import useCustomerStore from '@/store/useCustomerStore'

const EditCustomer = ({ customer }: { customer: Customer}) => {
  const [name, setName] = useState(customer?.name || '')
  const [phone, setPhone] = useState(customer?.phone || '')
  const {editCustomer} = useCustomerStore()

  useEffect(() => {
    setName(customer?.name || '')
    setPhone(customer?.phone || '')
  }, [customer])

  const handleSubmit = () => {
    editCustomer(customer._id, name, phone)
  }

  return (
    <div className='w-full flex flex-col gap-4 p-6'>
      <div className='grid w-full items-center gap-1.5'>
        <Label htmlFor='name'>Mijoz ismi</Label>
        <Input
          id='name'
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className='grid w-full items-center gap-1.5'>
        <Label htmlFor='phone'>Mijoz raqami</Label>
        <Input
          id='phone'
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>
      <div>Qarz: {new Intl.NumberFormat('en-US').format(customer?.debt || 0)}</div>
      <Button onClick={handleSubmit}>O'zgartirish</Button>
    </div>
  )
}

export default EditCustomer
