'use client'

import { useEffect, useState, useRef } from 'react'
import { useReactToPrint } from 'react-to-print'

import useCustomerStore from '@/store/useCustomerStore'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import SearchBar from './_components/SearchBar'
import CustomerList from './_components/CustomerList'
import AddCustomer from './_components/AddCustomer'
import EditCustomer from './_components/EditCustomer'
import Navbar from '@/components/layout/Navbar'
import CustomerHistory from './_components/CustomerHistory'
import CustomerPrintComponent from './_components/CustomerPrintComponent'

const Page = () => {
  const { customers, active, fetchCustomers } = useCustomerStore()
  const [docs, setDocs] = useState(customers)
  const [search, setSearch] = useState('')
  const printRef = useRef<HTMLDivElement | null>(null)

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    onAfterPrint: () => {},
  })

  useEffect(() => {
    fetchCustomers()
  }, [])

  useEffect(() => {
    if (customers) {
      setDocs(
        customers.filter(
          (doc) =>
            doc.name.toLowerCase().includes(search.toLowerCase()) ||
            doc.phone.toLowerCase().includes(search.toLowerCase())
        )
      )
    }
  }, [customers, search])

  return (
    <div className='h-[100vh] bg-background'>
      <Navbar />
      <main className='h-full pt-10'>
        <ResizablePanelGroup direction='horizontal'>
          <ResizablePanel minSize={30}>
            <div className='w-full h-full overflow-x-auto flex flex-col'>
              <SearchBar setSearch={setSearch} onPrint={handlePrint} />
              <CustomerList customers={docs} />
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel minSize={30}>
            <div className='w-full h-full overflow-x-auto flex flex-col overflow-y-auto'>
              <div className='w-full flex-1'>
                {!!active && <EditCustomer customer={active} />}
                {!!active && <CustomerHistory customer={active} />}
              </div>
              <AddCustomer />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>

        {/* Hidden print component */}
        <div className='hidden'>
          <div ref={printRef}>
            <CustomerPrintComponent customers={docs} />
          </div>
        </div>
      </main>
    </div>
  )
}

export default Page