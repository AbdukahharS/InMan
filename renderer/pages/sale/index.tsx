'use client'

import { useRef, useState } from 'react'
import { useReactToPrint } from 'react-to-print'
import { useRouter } from 'next/router'

import useSale from '@/hooks/useSale'
import { updateSale, performSale } from '@/db/functions/saleFns'
import { updateCustomerDebt } from '@/db/functions/customerFns'
import { subtractFromWarehouse } from '@/db/functions/warehouseFns'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import Folders from './_components/Folders'
import ProductList from './_components/ProductList'
import SaleList from './_components/SaleList'
import SelectCustomer from './_components/SelectCustomer'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import PrintComponent from './_components/PrintComponent'
import { Label } from '@/components/ui/label'
import Navbar from '@/components/layout/Navbar'
import { useConfirm } from '@/hooks/useConfirm'

function today() {
  const d = new Date()
  const day = d.getDate()
  const month = d.getMonth() + 1 // Months are zero-indexed
  const year = d.getFullYear()

  return `${day}.${month}.${year}`
}

const Page = () => {
  const { reload } = useRouter()
  const {
    customer,
    updateCustomer,
    totalSellPrice,
    saleProducts,
    payment,
    salePrev,
    paymentCard,
    paymentCash,
  } = useSale()
  const confirm = useConfirm()
  const { toast } = useToast()
  const [print, setPrint] = useState(false)
  const printRef = useRef<HTMLDivElement | null>(null)

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    onAfterPrint: () => {
      reload()
    },
  })

  const handleSubmit = async () => {
    if (!customer)
      return toast({ title: 'Mijoz tanlanmagan', variant: 'destructive' })
    const approval = await confirm(
      'Tanlangan mahsulotlar sotuvini tasdiqlaysizmi?'
    )
    if (!approval) return
    try {
      await Promise.all(
        saleProducts.map((p) => {
          const prevSaleAmount =
            salePrev.products.find((b) => b._id === p._id)?.amount || 0
          subtractFromWarehouse(p._id, p.amount - prevSaleAmount)
        })
      )

      if (!!salePrev._id) {
        await updateCustomerDebt(
          customer._id,
          totalSellPrice -
            salePrev.totalSellPrice +
            (salePrev.payment.cash - payment.cash) +
            (salePrev.payment.card - payment.card)
        )
        updateCustomer({
          ...customer,
          debt:
            customer.debt +
            totalSellPrice -
            salePrev.totalSellPrice +
            (salePrev.payment.cash - payment.cash) +
            (salePrev.payment.card - payment.card),
        })
        await updateSale({
          _id: salePrev._id,
          products: saleProducts
            .map((p) => ({
              amount: p.amount,
              sellPrice: p.sellPrice,
              _id: p._id,
              name: p.name,
              unit: p.unit,
            }))
            .filter((p) => p.amount > 0),
          totalSellPrice,
          payment: payment,
        })
      } else {
        await performSale({
          customer: customer._id,
          products: saleProducts.map((p) => ({
            amount: p.amount,
            sellPrice: p.sellPrice,
            _id: p._id,
            name: p.name,
            unit: p.unit,
          })),
          totalSellPrice,
          payment: payment,
          timeStamp: today(),
        })

        updateCustomer({
          ...customer,
          debt: totalSellPrice - payment.cash - payment.card,
        })
      }

      if (print) {
        handlePrint()
      } else {
        reload()
      }
    } catch (error) {
      toast({
        title: error.message,
        variant: 'destructive',
      })
    }
  }

  return (
    <div className='h-[100vh]'>
      <Navbar />
      <main className='h-full pt-10'>
        <ResizablePanelGroup
          direction='horizontal'
          className='z-10 bg-background'
        >
          <ResizablePanel minSize={30}>
            <div className='w-full h-full overflow-x-auto flex flex-col'>
              <ResizablePanelGroup direction='horizontal'>
                <ResizablePanel defaultSize={30} minSize={20}>
                  <Folders />
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={70} minSize={40}>
                  <ProductList />
                </ResizablePanel>
              </ResizablePanelGroup>
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel minSize={30}>
            <div className='w-full h-full overflow-x-auto flex flex-col'>
              <SelectCustomer />
              <SaleList />
              <div className='w-full'>
                <div className='w-full flex gap-4 px-4 py-2 border-t items-center'>
                  <div className='grid w-full max-w-sm items-center gap-1.5'>
                    <Label>Naqd:</Label>
                    <Input
                      placeholder='Naqd'
                      type='number'
                      value={payment.cash}
                      onChange={(e) => paymentCash(e.target.value)}
                    />
                  </div>
                  <div className='grid w-full max-w-sm items-center gap-1.5'>
                    <Label>Bank:</Label>
                    <Input
                      placeholder='Plastik'
                      value={payment.card}
                      type='number'
                      onChange={(e) => paymentCard(e.target.value)}
                    />
                  </div>
                </div>
                <div className='w-full flex justify-between px-4 py-2 items-center'>
                  <span>
                    Umumiy narxi:{' '}
                    {new Intl.NumberFormat('en-US').format(totalSellPrice)}
                  </span>
                  <div className='flex items-center'>
                    <Checkbox
                      defaultChecked={print}
                      onCheckedChange={(v) => setPrint(v as boolean)}
                      className='mr-2'
                    />
                    <label>Chop etish</label>
                  </div>
                  <Button disabled={!customer} onClick={handleSubmit}>
                    Savdoni tasdiqlash
                  </Button>
                </div>
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
        <div ref={printRef} className='w-full absolute top-0 z-[-10]'>
          {customer && <PrintComponent />}
        </div>
      </main>
    </div>
  )
}

export default Page
