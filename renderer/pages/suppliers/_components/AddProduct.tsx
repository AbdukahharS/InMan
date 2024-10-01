'use client'

import { useEffect, useState } from 'react'

import { useToast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import useFolderStore from '@/store/useFolderStore'
import useProductStore from '@/store/useProductStore'
import useSupplierStore from '@/store/useSupplierStore'
import usePrompt from '@/hooks/usePrompt'

const AddProduct = () => {
  const prompt = usePrompt()
  const { folders, fetchFolders, createFolder } = useFolderStore()
  const { active } = useSupplierStore()
  const { createProduct } = useProductStore()
  const [name, setName] = useState('')
  const [buyPrice, setBuyPrice] = useState(0)
  const [sellPrice, setSellPrice] = useState(0)
  const [unit, setUnit] = useState<'piece' | 'm' | 'kg' | 'm2'>('piece')
  const [category, setCategory] = useState<string | null>(
    folders[0] ? folders[0]._id : null
  )

  const { toast } = useToast()

  useEffect(() => {
    fetchFolders()
  }, [])

  const handleClick = async () => {
    if (!name) {
      toast({
        title: 'Iltimos, mahsulot nomini kiriting',
        variant: 'destructive',
      })
      return
    }

    if (!buyPrice) {
      toast({
        title: 'Iltimos, sotib olish narxini kiriting',
        variant: 'destructive',
      })
      return
    }

    if (!sellPrice) {
      toast({
        title: 'Iltimos, sotish narxini kiriting',
        variant: 'destructive',
      })
      return
    }

    if (!category) {
      toast({
        title: 'Iltimos, papkani tanlang',
        variant: 'destructive',
      })
      return
    }

    createProduct(name, buyPrice, sellPrice, active._id, category, unit)

    setName('')
    setBuyPrice(0)
    setSellPrice(0)
    setUnit('piece')
  }

  const handleFolderChange = async (v: string) => {
    if (v === null) {
      return
    } else if (v === 'new') {
      let name = await prompt('Papkani nomini kiriting')
      if (!name) return
      const newFodler = await createFolder(name)
      setCategory(newFodler._id)
    } else {
      setCategory(v)
    }
  }

  return (
    <div className='w-full p-2 border-t-2'>
      <div className='flex flex-row gap-2 items-center'>
        <div className='grid w-full items-center gap-1.5'>
          <Label htmlFor='name'>Mahsulot nomi</Label>
          <Input
            id='name'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className='grid w-full items-center gap-1.5'>
          <Label htmlFor='buyPrice'>Sotib olish narxi</Label>
          <Input
            id='buyPrice'
            value={buyPrice}
            type='number'
            onChange={(e) => setBuyPrice(Number(e.target.value))}
          />
        </div>
        <div className='grid w-full items-center gap-1.5'>
          <Label htmlFor='sellPrice'>Sotish narxi</Label>
          <Input
            id='sellPrice'
            value={sellPrice}
            type='number'
            onChange={(e) => setSellPrice(Number(e.target.value))}
          />
        </div>
        <div className='grid w-full items-center gap-1.5'>
          <Label>O'lchov birligi</Label>
          <Select
            value={unit}
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
        </div>
        <div className='grid w-full items-center gap-1.5'>
          <Label>Papkani tanlash</Label>
          <Select value={category || ''} onValueChange={handleFolderChange}>
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder='Papkani tanlang' />
            </SelectTrigger>
            <SelectContent>
              {folders?.map((c) => (
                <SelectItem key={c._id} value={c._id}>
                  {c.name}
                </SelectItem>
              ))}
              <SelectItem value='new'>Yangi papka qo'shish</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleClick}>Yangi mahsulot qo'shish</Button>
      </div>
    </div>
  )
}

export default AddProduct
