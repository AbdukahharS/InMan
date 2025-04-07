import { Button } from '@/components/ui/button'
import { getCustomer } from '@/db/functions/customerFns'
import { Customer, Intake, Sale } from '@/db/schemas'
import PrintComponent from './PrintComponent'
import React, { useEffect, useRef, useState } from 'react'
import { useReactToPrint } from 'react-to-print'
import { returnProductFromSale } from '@/db/functions/saleFns'
import { useRouter } from 'next/router'

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'

interface Props {
  active: Sale | Intake | null
}

const SaleDetails = ({ active }: Props) => {
  const { toast } = useToast()
  const { reload } = useRouter()
  const [isOpen, setOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<string>('')
  const [returnAmount, setReturnAmount] = useState(0)
  const printRef = useRef<HTMLDivElement | null>(null)
  const [sale, setSale] = useState<Sale | null>(
    active && 'customer' in active ? (active as Sale) : null
  )
  const [customer, setCustomer] = useState<Customer | null>(null)

  useEffect(() => {
    if (active && 'customer' in active) {
      setSale(active as Sale)
    }
  }, [active])

  useEffect(() => {
    if (sale) {
      getCustomer(sale.customer).then((doc) => {
        setCustomer(doc)
      })
    }
  }, [sale])

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    onAfterPrint: () => {},
  })

  const handleConfirm = async () => {
    try {
      if (!selectedItem || !returnAmount) return
      if (
        returnAmount >
        sale?.products.find((p) => p._id === selectedItem)?.amount
      )
        return toast({
          title:
            "Qaytariladigan miqdor sotib olingan miqdordan ko'p bo'lmasligi kerak",
          variant: 'destructive',
        })
      if (returnAmount <= 0) return

      console.log('Selected item:', selectedItem)
      console.log('Return amount:', returnAmount)

      await returnProductFromSale(
        sale?._id as string,
        selectedItem,
        returnAmount
      )
      reload()
      // const newFodler = await createFolder(folderName, folderParent)
      // setCategory(newFodler._id)
    } catch (error) {
      console.error('Error returning product:', error)
      toast({
        title: 'Mahsulotni qaytarishda xatolik yuz berdi',
        variant: 'destructive',
      })
    }
  }

  const handleCancel = () => {
    setOpen(false)
    setSelectedItem('')
    setReturnAmount(0)
  }

  return (
    sale && (
      <>
        <Dialog open={isOpen} onOpenChange={() => setOpen(false)}>
          <DialogContent aria-describedby={undefined}>
            <DialogTitle>Tovarni qaytarish</DialogTitle>
            <Select
              value={selectedItem}
              onValueChange={(v) => setSelectedItem(v)}
            >
              <SelectTrigger className='w-full mt-2'>
                <SelectValue placeholder='Qaysi tovar qaytariladi?' />
              </SelectTrigger>
              <SelectContent>
                {sale?.products.map((f) => (
                  <SelectItem key={f._id + 'create'} value={f._id}>
                    {f.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              autoFocus
              type='number'
              value={returnAmount}
              min={0}
              max={sale?.products.find((p) => p._id === selectedItem)?.amount}
              placeholder='Qancha qaytariladi?'
              // onKeyDown={(e) => e.key === 'Enter' && handleConfirm()}
              onChange={(e) => setReturnAmount(Number(e.target.value))}
            />

            <div className='mt-4 flex justify-between'>
              <Button onClick={handleConfirm}>OK</Button>
              <Button variant='secondary' onClick={handleCancel}>
                Bekor qilish
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        <div ref={printRef} className='w-full absolute top-0 -z-50 left-0'>
          {sale?._id && customer?._id && (
            <PrintComponent customer={customer} sale={sale} />
          )}
        </div>
        <div className='w-full p-6 overflow-y-auto bg-background'>
          <div className='flex flex-row items-center justify-between'>
            <h1 className='text-3xl'>Savdo tafsilotlari</h1>
            <div>
              <Button className='mr-4' onClick={() => setOpen(true)}>
                Возврат
              </Button>
              <Button onClick={handlePrint}>Chop Etish</Button>
            </div>
          </div>
          <p>Mijoz: {customer?.name}</p>
          <p>
            Savdodan oldingi qarzi:{' '}
            {new Intl.NumberFormat('en-US').format(sale?.preDebt as number)}
          </p>
          <p>Sana: {sale.timeStamp}</p>
          <p>
            Naqd:{' '}
            {new Intl.NumberFormat('en-US').format(
              sale?.payment?.cash as number
            )}{' '}
            <br />
            Karta:{' '}
            {new Intl.NumberFormat('en-US').format(
              sale?.payment?.card as number
            )}
          </p>
          <p>
            Jami summa:{' '}
            {new Intl.NumberFormat('en-US').format(
              sale?.totalSellPrice as number
            )}
          </p>
          <table className='w-full overflow-y-auto table-auto mt-4'>
            <thead>
              <tr>
                <th>No</th>
                <th>Mahsulot nomi</th>
                <th>Miqdori</th>
                <th>Narxi</th>
                <th>Summa</th>
              </tr>
            </thead>
            <tbody>
              {sale?.products.map((product, i) => (
                <tr key={product._id}>
                  <td className='px-2'>{i + 1}</td>
                  <td className='px-2'>{product.name}</td>
                  <td className='px-2'>
                    {product.amount}{' '}
                    {product.unit === 'piece' ? 'dona' : product.unit}
                  </td>
                  <td className='px-2'>
                    {new Intl.NumberFormat('en-US').format(product.sellPrice)}
                  </td>
                  <td className='px-2'>
                    {new Intl.NumberFormat('en-US').format(
                      product.sellPrice * product.amount
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    )
  )
}

export default SaleDetails
