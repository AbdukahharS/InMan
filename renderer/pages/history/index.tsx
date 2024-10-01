'use client'

import { useState } from 'react'

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import FilterBar from './_components/FilterBar'
import SaleList from './_components/SaleList'
import IntakeList from './_components/IntakeList'
import SaleDetails from './_components/SaleDetails'
import IntakeDetails from './_components/IntakeDetails'
import { Intake, Sale } from '@/db/schemas'
import Navbar from '@/components/layout/Navbar'

function today() {
  const d = new Date()
  const day = d.getDate()
  const month = d.getMonth() + 1 // Months are zero-indexed
  const year = d.getFullYear()

  return `${day}.${month}.${year}`
}

const Page = () => {
  const [active, setActive] = useState<Intake | Sale | null>(null)
  const [type, setType] = useState<'sale' | 'intake'>('sale')
  const [start, setStart] = useState(today())
  const [end, setEnd] = useState(today())

  const handleClick = (act: Intake | Sale) => {
    setActive(act)
  }

  return (
    <div className='h-[100vh]'>
      <Navbar />
      <main className='h-full pt-10'>
        <ResizablePanelGroup direction='horizontal'>
          <ResizablePanel minSize={30}>
            <div className='w-full h-full overflow-x-auto flex flex-col'>
              <FilterBar
                setType={setType}
                setStart={setStart}
                setEnd={setEnd}
                type={type}
                start={start}
                end={end}
              />
              {type === 'sale' ? (
                <SaleList
                  start={start}
                  end={end}
                  active={active}
                  handleClick={handleClick}
                />
              ) : (
                <IntakeList
                  start={start}
                  end={end}
                  active={active}
                  handleClick={handleClick}
                />
              )}
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel minSize={30}>
            {!!active && (
              <>
                {type === 'sale' && <SaleDetails active={active} />}
                {type === 'intake' && <IntakeDetails active={active} />}
              </>
            )}
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>
    </div>
  )
}

export default Page
