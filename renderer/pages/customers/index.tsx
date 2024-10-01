'use client'

import { useEffect, useState } from 'react'
// import { useQuery } from 'convex/react'

import useCustomerStore from '@/store/useCustomerStore'
// import { Doc } from '@/convex/_generated/dataModel'
// import { api } from '@/convex/_generated/api'
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

const Page = () => {
  // const docs = useQuery(api.documents.getCustomers)
  const { customers, active, fetchCustomers } = useCustomerStore()
  const [docs, setDocs] = useState(customers)
  const [search, setSearch] = useState('')

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
    <div className='h-[100vh]'>
      <Navbar />
      <main className='h-full pt-10'>
        <ResizablePanelGroup direction='horizontal'>
          <ResizablePanel minSize={30}>
            <div className='w-full h-full overflow-x-auto flex flex-col'>
              <SearchBar setSearch={setSearch} />
              <CustomerList customers={docs} />
              {/* <AddSupplier /> */}
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel minSize={30}>
            <div className='w-full h-full overflow-x-auto flex flex-col'>
              <div className='w-full flex-1'>
                {!!active && <EditCustomer customer={active} />}
              </div>
              <AddCustomer />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>
    </div>
  )
}

export default Page
