import useIntake from '@/store/useIntakeStore'
import IntakeItem from './IntakeItem'

const IntakeList = () => {
  const { products } = useIntake()

  return (
    <div className='w-full flex-1 overflow-y-auto'>
      <table className='w-full overflow-y-auto table-auto'>
        <thead>
          <tr>
            <th>No</th>
            <th>Mahsulot nomi</th>
            <th>Mahsulot sotib olish narxi</th>
            <th>Miqdori</th>
          </tr>
        </thead>
        <tbody>
          {products?.map((doc, i) => <IntakeItem key={i} {...doc} i={i} />)}
        </tbody>
      </table>
    </div>
  )
}

export default IntakeList
