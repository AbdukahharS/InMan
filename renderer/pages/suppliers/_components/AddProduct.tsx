'use client'

import { useEffect, useState } from 'react'

import { useToast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'

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
  const [folderName, setFolderName] = useState('')
  const [folderParent, setFolderParent] = useState('')
  const [isOpen, setOpen] = useState(false)
  const [buyPrice, setBuyPrice] = useState(0)
  const [sellPrice, setSellPrice] = useState(0)
  const [unit, setUnit] = useState<'piece' | 'm' | 'kg' | 'm2'>('piece')
  const [category, setCategory] = useState<string | null>(
    folders[0] ? folders[0]._id : null
  )

  const { toast } = useToast()

  // console.log(folders)

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
      setOpen(true)
      // let name = await prompt('Papkani nomini kiriting')
      // if (!name) return
      // const newFodler = await createFolder(name)
      // setCategory(newFodler._id)
    } else {
      setCategory(v)
    }
  }

  const handleConfirm = async () => {
    if (!folderName) return
    const newFodler = await createFolder(folderName, folderParent)
    setCategory(newFodler._id)
    setOpen(false)
    setFolderName('')
    setFolderParent('')
  }

  const handleCancel = () => {
    setOpen(false)
    setFolderName('')
    setFolderParent('')
  }

  return (
    <div className='w-full p-2 border-t-2'>
      <Dialog open={isOpen} onOpenChange={() => setOpen(false)}>
        <DialogContent aria-describedby={undefined}>
          <DialogTitle>Yangi Papka qo'shish</DialogTitle>
          <Input
            autoFocus
            type='text'
            value={folderName}
            placeholder='Yangi papka nomi'
            // onKeyDown={(e) => e.key === 'Enter' && handleConfirm()}
            onChange={(e) => setFolderName(e.target.value)}
          />
          <Select
            value={folderParent}
            onValueChange={(v) => setFolderParent(v)}
          >
            <SelectTrigger className='w-full mt-2'>
              <SelectValue placeholder='Yangi papka biror papkaning ichidami?' />
            </SelectTrigger>
            <SelectContent>
              {folders
                ?.filter((f) => !f.parent)
                .map((f) => (
                  <SelectItem key={f._id + 'create'} value={f._id}>
                    {f.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          <div className='mt-4 flex justify-between'>
            <Button onClick={handleConfirm}>OK</Button>
            <Button variant='secondary' onClick={handleCancel}>
              Bekor qilish
            </Button>
          </div>
        </DialogContent>
      </Dialog>
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
              {folders
                ?.filter((c) => !c.parent)
                .map((c) => (
                  <>
                    <SelectItem key={c._id} value={c._id}>
                      {c.name}
                    </SelectItem>
                    {folders
                      .filter((f) => f.parent === c._id)
                      .map((f) => (
                        <SelectItem
                          key={f._id}
                          value={f._id}
                          className='bg-gray-100/40'
                        >
                          - {f.name}
                        </SelectItem>
                      ))}
                  </>
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
