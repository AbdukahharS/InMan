// import { Doc } from '@/convex/_generated/dataModel'
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
              <CustomerItem
                key={doc._id}
                {...doc}
                i={i}
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

export default CustomerList
