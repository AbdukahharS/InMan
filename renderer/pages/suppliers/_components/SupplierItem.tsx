'use client'

import { useState, useRef, useEffect } from 'react'
import { Check, Pencil } from 'lucide-react'

import useSupplierStore from '@/store/useSupplierStore'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { cn } from '@/lib/utils'

interface SupplierItemProps {
  _id: string
  i: number
  name: string
  phone: string
  _rev: string
}

const SupplierItem = ({
  _id,
  i,
  name,
  phone,
  _rev,
}: SupplierItemProps) => {
  const { active, setActive, editSupplier } = useSupplierStore()
  const [editing, setEditing] = useState(false)
  const nameInputRef = useRef<HTMLInputElement>(null)
  const phoneInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (active?._id !== _id) {
      setEditing(false)
    }
  }, [active, _id])

  const handleEdit = () => {
    setEditing(!editing)
  }

  const handleEditSubmit = () => {
    if (!nameInputRef.current || !phoneInputRef.current) return
    setEditing(false)
    const nameValue = nameInputRef.current.value
    const phoneValue = phoneInputRef.current.value
    if (nameValue === '') {
      toast({
        title: 'Xatolik',
        description: "Ta'minotchi ismini kiriting",
        variant: 'destructive',
      })
    }
    try {
      editSupplier(_id, nameValue, phoneValue )
    } catch (error) {
      toast({
        title: 'Xatolik',
        description: "Ta'minotchi o'zgartirishda xatolik yuz berdi",
        variant: 'destructive',
      })
    }
  }

  return (
    <div
      className={cn(
        'w-full border-b-2 flex items-center justify-between relative gap-4 cursor-pointer',
        active?._id === _id
          ? 'bg-slate-200/50 dark:bg-slate-800/50'
          : 'bg-background'
      )}
      onClick={() => setActive({ _id, name, phone, _rev })}
    >
      <div className='flex items-center gap-3'>
        <div className='border-r w-10 px-1'>{i + 1}</div>
        {editing ? (
          <input
            className='w-full border-none bg-transparent px-2'
            type='text'
            defaultValue={name}
            ref={nameInputRef}
          />
        ) : (
          <div className='w-full truncate'>{name}</div>
        )}
      </div>
      <div className='flex items-center gap-2'>
        {editing ? (
          <input
            className='w-full border-none bg-transparent px-2'
            type='text'
            defaultValue={phone}
            ref={phoneInputRef}
          />
        ) : (
          <div className='text-foreground/60 truncate'>{phone}</div>
        )}
        {editing ? (
          <Button variant='ghost' size='sm' onClick={handleEditSubmit}>
            <Check className='h-4 w-4' />
          </Button>
        ) : (
          <Button variant='ghost' size='sm' onClick={handleEdit}>
            <Pencil className='h-4 w-4' />
          </Button>
        )}
      </div>
    </div>
  )
}

export default SupplierItem
