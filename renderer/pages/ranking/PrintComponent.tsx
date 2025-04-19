import React, { useEffect, useState } from 'react'

type Ranking = { _id: string; name: string; total: number }[]

const RankingPrintComponent = ({
  ranking,
  start,
  end
}: {
  ranking: Ranking
  start: string
  end: string
}) => {
  const [currentDate, setCurrentDate] = useState<string>('')

  // Set the date only on the client side to avoid hydration mismatch
  useEffect(() => {
    setCurrentDate(new Date().toLocaleString())
  }, [])

  return (
    <div className='w-[50%] bg-background pt-6 text-[10px] mx-auto'>
      <div className='w-full flex justify-between border-b pb-2 mb-4'>
        <h1 className='text-xl font-bold'>Mijoz Savdo Reytingi</h1>
        <div className='text-right'>
          <div>
            <b>Davr:</b> {start} - {end}
          </div>
          {currentDate && (
            <div>
              <b>Sana:</b> {currentDate}
            </div>
          )}
        </div>
      </div>
      <table className='w-full table-auto mt-3 print-table'>
        <thead>
          <tr>
            <th className='px-2 py-1 text-left'>No</th>
            <th className='px-2 py-1 text-left'>Mijoz ismi</th>
            <th className='px-2 py-1 text-right'>Umumiy savdo summasi</th>
          </tr>
        </thead>
        <tbody>
          {ranking?.map((doc, i) => (
            <tr key={doc._id}>
              <td className='px-2 py-1'>{i + 1}</td>
              <td className='px-2 py-1'>{doc.name}</td>
              <td className='px-2 py-1 text-right'>
                {new Intl.NumberFormat('en-US').format(doc.total)}
              </td>
            </tr>
          ))}
          <tr>
            <td colSpan={2} className='px-2 py-1 font-bold text-right'>
              Jami savdo summasi:
            </td>
            <td className='px-2 py-1 font-bold text-right'>
              {new Intl.NumberFormat('en-US').format(
                ranking?.reduce((a, b) => a + b.total, 0)
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default RankingPrintComponent