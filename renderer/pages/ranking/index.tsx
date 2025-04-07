import React, { useState } from 'react'

import Navbar from '@/components/layout/Navbar'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { getCustomerSaleRanking } from '@/db/functions/saleFns'
import { useToast } from '@/components/ui/use-toast'

function today() {
  const d = new Date()
  const day = d.getDate()
  const month = d.getMonth() + 1 // Months are zero-indexed
  const year = d.getFullYear()

  return `${day}.${month}.${year}`
}

function parseDate(dateString: string) {
  // Split the string into day, month, and year
  const [day, month, year] = dateString.split('.').map(Number)

  // Create and return a new Date object
  return new Date(year, month - 1, day).getTime() // Month is zero-indexed
}

type Ranking = { _id: string; name: string; total: number }[]

const Ranking = () => {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [ranking, setRanking] = useState<Ranking>([])
  const [start, setStart] = useState(today())
  const [end, setEnd] = useState(today())

  const handleClick = async () => {
    setLoading(true)
    const res = await getCustomerSaleRanking(parseDate(start), parseDate(end))
      .then((res) => res as Ranking)
      .catch((error) => {
        toast({
          title: 'Xatolik',
          description: error.message,
          variant: 'destructive',
        })
        return []
      })

    if (res.length) {
      setRanking(res)
    }

    setLoading(false)
  }

  return (
    <div className='h-[100vh]'>
      <Navbar />
      <main className='h-full pt-10 flex flex-col'>
        <div className='w-full flex flex-row px-6 py-2 border-b gap-6 items-center'>
          <div className='flex flex-row items-center gap-3'>
            <Label htmlFor='start'>Boshlash:</Label>
            <Input
              value={start}
              name='start'
              onChange={(e) => setStart(e.target.value)}
            />
          </div>
          <div className='flex flex-row items-center gap-3'>
            <Label htmlFor='end'>Tugash:</Label>
            <Input
              value={end}
              name='end'
              onChange={(e) => setEnd(e.target.value)}
            />
          </div>
          <Button onClick={handleClick}>Qidirish</Button>
        </div>
        {loading ? (
          <div className='h-full flex items-center justify-center text-2xl'>
            Kutib turing...
          </div>
        ) : ranking.length ? (
          <table className='w-full overflow-y-auto table-auto max-h-full'>
            <thead>
              <tr>
                <th>No</th>
                <th>Mijoz ismi</th>
                <th>Umumiy savdo summasi</th>
              </tr>
            </thead>
            <tbody>
              {ranking.map((doc, i) => (
                <tr className='w-full h-8'>
                  <td className='px-2'>{i + 1}</td>
                  <td className='px-2'>
                    <div className='w-full truncate'>{doc.name}</div>
                  </td>
                  <td className='px-2'>
                    <div className='text-foreground/60 truncate'>
                      {new Intl.NumberFormat('en-US').format(doc.total)}
                    </div>
                  </td>
                </tr>
              ))}
              <tr>
                <td></td>
                <td className='px-2 font-bold'>Jami savdo summasi:</td>
                <td className='px-2 font-bold'>
                  {new Intl.NumberFormat('en-US').format(
                    ranking.reduce((a, b) => a + b.total, 0)
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        ) : (
          ''
        )}
      </main>
    </div>
  )
}

export default Ranking
