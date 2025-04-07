import CustomerItem from './CustomerItem'
import { Customer } from '@/db/schemas'

interface Props {
  customers: Customer[]
}

const CustomerList = ({ customers }: Props) => {
  return (
    <div className='w-full flex-1 overflow-y-auto'>
      {customers?.length ? (
        <table className='w-full overflow-y-auto table-auto'>
          <thead>
            <tr>
              <th>No</th>
              <th>Mijoz ismi</th>
              <th>Telefon raqami</th>
              <th>Qarz</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((doc, i) => (
              <CustomerItem key={doc._id} {...doc} i={i} />
            ))}
            <tr>
              <td className='px-2'>{customers.length + 1}</td>
              <td className='px-2'>
                <b>Jami qarz:</b>
              </td>
              <td></td>
              <td className='px-2'>
                <b>
                  {new Intl.NumberFormat('en-US').format(
                    customers.reduce((acc, cur) => acc + cur.debt, 0)
                  )}
                </b>
              </td>
            </tr>
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

export default CustomerList
