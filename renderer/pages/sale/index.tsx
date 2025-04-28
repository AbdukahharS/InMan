'use client'

import { useEffect, useRef, useState } from 'react'
import { useReactToPrint } from 'react-to-print'
import { useRouter } from 'next/router'

import useSale from '@/hooks/useSale'
import { updateSale, performSale } from '@/db/functions/saleFns'
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
import { round } from '@/lib/utils'

function today() {
  const d = new Date()
  const day = d.getDate()
  const month = d.getMonth() + 1 // Months are zero-indexed
  const year = d.getFullYear()

  return `${day}.${month}.${year}`
}

// Helper function to calculate price after discount
const calculateDiscountedPrice = (price: number, discount?: number) => {
  if (!discount || discount <= 0 || discount >= 100) {
    return price
  }
  return round(price * (1 - discount / 100))
}

// Helper to validate discount input
const isValidDiscount = (value: string): boolean => {
  // Check if it's a number and between 0-100 (inclusive)
  const num = parseFloat(value)
  if (isNaN(num) || num < 0 || num > 100) {
    return false
  }
  
  // Check if it has max 2 decimal places
  const decimalPart = value.includes('.') ? value.split('.')[1] : ''
  return decimalPart.length <= 2
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
    discount,
    setDiscount,
  } = useSale()
  const confirm = useConfirm()
  const { toast } = useToast()
  const [print, setPrint] = useState(false)
  const printRef = useRef<HTMLDivElement | null>(null)
  const [discountInput, setDiscountInput] = useState(discount?.toString() || '')

  useEffect(() => {
    setDiscountInput(discount?.toString() || '')
  }, [discount, setDiscountInput])  

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    onAfterPrint: () => {
      reload()
    },
  })

  const handleDiscountChange = (value: string) => {
    setDiscountInput(value)
    
    if (value === '') {
      setDiscount(undefined)
      return
    }
    
    if (isValidDiscount(value)) {
      setDiscount(parseFloat(value))
    }
  }

  const handleSubmit = async () => {
    if (!customer)
      return toast({ title: 'Mijoz tanlanmagan', variant: 'destructive' })
      
    // Validate discount if provided
    if (discountInput && !isValidDiscount(discountInput)) {
      return toast({ 
        title: 'Chegirma faqat 0% dan 100% gacha bo\'lishi mumkin va chegirmada nuqtadan keyin faqat 2ta son bo\'lishi mumkin', 
        variant: 'destructive' 
      })
    }
    
    const approval = await confirm(
      'Tanlangan mahsulotlar sotuvini tasdiqlaysizmi?'
    )
    if (!approval) return
    try {
      for (const p of saleProducts) {
        const prevSaleAmount =
          salePrev.products.find((b) => b._id === p._id)?.amount || 0
        console.log(prevSaleAmount)

        if (p.amount !== prevSaleAmount) {
          await subtractFromWarehouse(p._id, p.amount - prevSaleAmount)
        }
      }
      
      // Calculate amounts with discount
      const oldDiscountedTotal = calculateDiscountedPrice(salePrev.totalSellPrice, salePrev.discount)
      const newDiscountedTotal = calculateDiscountedPrice(totalSellPrice, discount)

      if (!!salePrev._id) {
        // Handle update case
        const oldDebtImpact = oldDiscountedTotal - salePrev.payment.cash - salePrev.payment.card
        const newDebtImpact = newDiscountedTotal - payment.cash - payment.card
        const debtChange = newDebtImpact - oldDebtImpact
        console.log('oldDebtImpact', oldDebtImpact);
        console.log('newDebtImpact', newDebtImpact);
        console.log('debtChange', debtChange);
                
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
          discount
        })
      } else {
        // Handle new sale case
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
          discount
        })

        updateCustomer({
          ...customer,
          debt: customer.debt + (newDiscountedTotal - payment.cash - payment.card)
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

  // Calculate discounted price for display
  const discountedPrice = calculateDiscountedPrice(totalSellPrice, discount)

  return (
    <div className='h-[100vh]'>
      <Navbar />
      <main className='h-full pt-10'>
        <ResizablePanelGroup
          direction='horizontal'
          className='z-10 bg-background'
        >
          <ResizablePanel minSize={30}>
            <div className='w-full h-full max-h-full overflow-x-auto flex flex-col overflow-y-auto'>
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
                  <div className='grid w-60 items-center gap-1.5'>
                    <Label>Chegirma (%):</Label>
                    <Input
                      placeholder='Chegirma'
                      value={discountInput}
                      onChange={(e) => handleDiscountChange(e.target.value)}
                    />
                  </div>
                </div>
                <div className='w-full flex justify-between px-4 py-2 items-center'>
                  <div className='flex flex-col'>
                    {discount && discount > 0 && discount < 100 ? (
                      <>
                        <span className='opacity-70'>
                          Umumiy narxi: {new Intl.NumberFormat('en-US').format(totalSellPrice)}
                        </span>
                        <span>
                          Umumiy narx chegirma bilan: {new Intl.NumberFormat('en-US').format(discountedPrice)}
                        </span>
                      </>
                    ) : (
                      <span>
                        Umumiy narxi: {new Intl.NumberFormat('en-US').format(totalSellPrice)}
                      </span>
                    )}
                  </div>
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