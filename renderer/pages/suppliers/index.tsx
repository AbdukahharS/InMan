'use client'

import { useEffect, useState } from 'react'

import useSupplierStore from '@/store/useSupplierStore'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import SupplierItem from './_components/SupplierItem'
import AddSupplier from './_components/AddSupplier'
import SearchSupplier from './_components/SearchSupplier'
import AddProduct from './_components/AddProduct'
import { cn } from '@/lib/utils'
import ProductsList from './_components/ProductsList'
import Navbar from '@/components/layout/Navbar'

const Page = () => {
  const { suppliers, active, fetchSuppliers } = useSupplierStore()
  const [search, setSearch] = useState('')

  useEffect(() => {}, [fetchSuppliers()])

  return (
    <div className='h-[100vh]'>
      <Navbar />
      <main className='h-full pt-10'>
        <ResizablePanelGroup direction='horizontal'>
          <ResizablePanel minSize={30}>
            <div className='w-full h-full overflow-x-auto flex flex-col'>
              <SearchSupplier setSearch={setSearch} />
              <div className='w-full flex-1 overflow-y-auto'>
                {suppliers?.map((supplier, i) => {
                  if (
                    !search ||
                    supplier.name.toLowerCase().includes(search.toLowerCase()) ||
                    supplier.phone.toLowerCase().includes(search.toLowerCase())
                  ) {
                    return (
                      <SupplierItem
                        key={i}
                        i={i}
                        {...supplier}

                      />
                    )
                  }
                })}
                {!suppliers?.length && (
                  <p className='text-center text-xl pt-6'>
                    Ta'minotchi topilmadi
                  </p>
                )}
              </div>
              <AddSupplier />
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={60} minSize={50}>
            <div
              className={cn(
                'w-full h-full flex flex-col overflow-y-auto',
                !active && 'justify-center'
              )}
            >
              {!active ? (
                <p className='text-center text-xl'>Ta'minotchi tanlang!</p>
              ) : (
                <>
                  <ProductsList />
                </>
              )}
              {!!active && <AddProduct />}
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>
    </div>
  )
}

export default Page
