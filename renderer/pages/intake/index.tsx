'use client'

import { useState } from 'react'

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import SearchBar from './_components/SearchBar'
import SupplierList from './_components/SupplierList'
import ProductList from './_components/ProductList'
import IntakeList from './_components/IntakeList'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import useIntake from '@/store/useIntakeStore'
import Navbar from '@/components/layout/Navbar'
import { useConfirm } from '@/hooks/useConfirm'

const Page = () => {
  const confirm = useConfirm()
  const [search, setSearch] = useState('')
  const {
    supplier,
    totalBuyPrice,
    clear,
    products,
    createIntake,
    addToWarehouse,
  } = useIntake()
  const { toast } = useToast()

  const handleSubmit = async () => {
    if (!supplier) return
    const approval = await confirm(
      'Tanlangan mahsulotlarni omborga kiritishni tasdiqlaysizmi?'
    )
    if (!approval) return
    try {
      await createIntake()
      await addToWarehouse()
      setSearch('')
      clear()
    } catch (error) {
      toast({
        title: 'Qandaydir xatolik yuz berdi',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className='h-[100vh]'>
      <Navbar />
      <main className='h-full pt-10'>
        <ResizablePanelGroup direction='horizontal'>
          <ResizablePanel minSize={30}>
            <div className='w-full h-full overflow-x-auto flex flex-col'>
              <SearchBar setSearch={setSearch} />
              {!supplier ? (
                <SupplierList search={search} />
              ) : (
                <ProductList search={search} />
              )}
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel minSize={30}>
            <div className='w-full h-full overflow-x-auto flex flex-col'>
              <IntakeList />
              <div className='w-full flex justify-between px-4 py-2 border-t items-center'>
                <span>
                  Umumiy narxi:{' '}
                  {new Intl.NumberFormat('en-US').format(totalBuyPrice)}
                </span>
                <Button disabled={!products?.length} onClick={handleSubmit}>
                  Kirimni tasdiqlash
                </Button>
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>
    </div>
  )
}

export default Page
