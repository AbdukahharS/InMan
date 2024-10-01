import React, { useEffect, useState } from 'react'

import IntakeItem from './IntakeItem'
import { Intake, Sale } from '@/db/schemas'
import { getIntakesinDateRange } from '@/db/functions/intakeFns'

function parseDate(dateString: string) {
  const [day, month, year] = dateString.split('.').map(Number)
  return new Date(year, month - 1, day).getTime()
}

interface Props {
  start: string
  end: string
  active: Sale | Intake | null
  handleClick: (_id: Sale | Intake) => void
}

const IntakeList = ({ start, end, active, handleClick }: Props) => {
  const [intakes, setIntakes] = useState<Intake[]>([])

  useEffect(() => {
    getIntakesinDateRange(parseDate(start), parseDate(end)).then(setIntakes)
  }, [start, end])


  return (
    <div className='w-full flex-1 overflow-y-auto'>
      {intakes?.length ? (
        <table className='w-full overflow-y-auto table-auto'>
          <thead>
            <tr>
              <th>No</th>
              <th>Ta'minotchi ismi</th>
              <th>Sana</th>
              <th>Umumiy narx</th>
            </tr>
          </thead>
          <tbody>
            {intakes.map((doc, i) => (
              <IntakeItem
                key={doc._id}
                {...doc}
                i={i}
                handleClick={handleClick}
                active={active}
              />
            ))}
          </tbody>
        </table>
      ) : (
        <p className='text-center text-xl flex-1 mt-8'>
          Sizda hech qanday mijoz mavjud emas
        </p>
      )}
    </div>
  )
}

export default IntakeList
