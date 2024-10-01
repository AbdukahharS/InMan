'use client'

import { useState } from 'react'

import useSupplierStore from '@/store/useSupplierStore'
import { useToast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const AddSupplier = () => {
  const { addSupplier } = useSupplierStore()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const { toast } = useToast()

  const handleClick = () => {
    if (!name) {
      toast({
        title: "Iltimos, ta'minotchi ismini kiriting",
        variant: 'destructive',
      })
      return
    }

    addSupplier(name, phone )

    setName('')
    setPhone('')
  }

  return (
    <div className='w-full flex flex-row p-2 border-t-2 gap-2'>
      <Input
        placeholder="Ta'minotchi ismi"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Input
        placeholder="Ta'minotchi telefoni"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <Button onClick={handleClick}>Yangi ta'minotchi qo'shish</Button>
    </div>
  )
}

export default AddSupplier
