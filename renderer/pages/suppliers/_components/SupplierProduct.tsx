import { useEffect, useRef, useState } from 'react'
import { Check, Pencil } from 'lucide-react'

import { useToast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import useProductStore from '@/store/useProductStore'
import useFolderStore from '@/store/useFolderStore'

interface SupplierProductProps {
  _id: string
  supplier: string
  name: string
  buyPrice: number
  sellPrice: number
  i: number
  unit: 'piece' | 'm' | 'kg' | 'm2'
  folder: string
}

const SupplierProduct = ({
  _id,
  supplier,
  name,
  buyPrice,
  sellPrice,
  i,
  unit,
  folder,
}: SupplierProductProps) => {
  const [editing, setEditing] = useState(false)
  const [unitstate, setUnit] = useState<'piece' | 'm' | 'kg' | 'm2'>(unit)
  const {editProduct} = useProductStore()
  const {folders} = useFolderStore()

  const nameInputRef = useRef<HTMLInputElement>(null)
  const buyPriceInputRef = useRef<HTMLInputElement>(null)
  const sellPriceInputRef = useRef<HTMLInputElement>(null)
  const [folderState, setfolderState] = useState<string | undefined>(folder)

  useEffect(() => {
    if (folderState === undefined) {
      setfolderState(folder)
    }
  }, [folder])

  const { toast } = useToast()

  const handleEdit = () => {
    setEditing(!editing)
  }

  const handleEditSubmit = () => {
    if (
      !nameInputRef.current ||
      !buyPriceInputRef.current ||
      !sellPriceInputRef.current
    )
      return
    setEditing(false)
    const nameValue = nameInputRef.current.value
    const buyPriceValue = Number(buyPriceInputRef.current.value)
    const sellPriceValue = Number(sellPriceInputRef.current.value)

    const updatedProduct = {
      _id,
      name: nameValue,
      supplier,
      buyPrice: buyPriceValue,
      sellPrice: sellPriceValue,
      unit: unitstate,
      folder: folderState,
    }

    try {
      editProduct(updatedProduct)
    } catch (error) {
      toast({
        title: 'Xatolik',
        description: "Mahsulotni o'zgartirishda xatolik yuz berdi",
        variant: 'destructive',
      })
    }
  }

  return (
    <tr className='w-full h-8'>
      <td className='px-2'>{i + 1}</td>
      <td className='px-2'>
        {editing ? (
          <Input type='text' defaultValue={name} ref={nameInputRef} />
        ) : (
          <div className='w-full truncate'>{name}</div>
        )}
      </td>
      <td className='px-2'>
        {editing ? (
          <Input type='text' defaultValue={buyPrice} ref={buyPriceInputRef} />
        ) : (
          <div className='text-foreground/60 truncate'>{buyPrice}</div>
        )}
      </td>
      <td className='px-2'>
        {editing ? (
          <Input type='text' defaultValue={sellPrice} ref={sellPriceInputRef} />
        ) : (
          <div className='text-foreground/60 truncate'>{sellPrice}</div>
        )}
      </td>
      <td className='px-2'>
        {editing ? (
          <Select
            value={unitstate}
            onValueChange={(v) => setUnit(v as 'piece' | 'm' | 'kg' | 'm2')}
          >
            <SelectTrigger>
              <SelectValue placeholder="O'lchov birligi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='piece'>dona</SelectItem>
              <SelectItem value='kg'>kg</SelectItem>
              <SelectItem value='m'>m</SelectItem>
              <SelectItem value='m2'>
                m<sup>2</sup>
              </SelectItem>
            </SelectContent>
          </Select>
        ) : (
          <div className='text-foreground/60 truncate'>
            {unit === 'piece' ? 'dona' : unit}
          </div>
        )}
      </td>
      <td className='px-2'>
        {editing ? (
          <Select
            value={folderState || ''}
            onValueChange={setfolderState}
          >
            <SelectTrigger>
              <SelectValue placeholder="O'lchov birligi" />
            </SelectTrigger>
            <SelectContent>
              {folders?.map((c) => (
                <SelectItem key={c._id} value={c._id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <div className='text-foreground/60 truncate'>
            {folders?.find((c) => c._id === folder)?.name}
          </div>
        )}
      </td>
      <td className='px-2'>
        {editing ? (
          <Button variant='ghost' size='sm' onClick={handleEditSubmit}>
            <Check className='h-4 w-4' />
          </Button>
        ) : (
          <Button variant='ghost' size='sm' onClick={handleEdit}>
            <Pencil className='h-4 w-4' />
          </Button>
        )}
      </td>
    </tr>
  )
}

export default SupplierProduct
