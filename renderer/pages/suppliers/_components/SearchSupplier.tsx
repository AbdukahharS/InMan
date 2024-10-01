import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

const SearchSupplier = ({
  setSearch,
}: {
  setSearch: (search: string) => void
}) => {
  return (
    <div className='w-full border-b relative'>
      <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5' />
      <Input
        placeholder='Qidirish...'
        className='rounded-none border-b text-lg px-10 py-3'
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  )
}

export default SearchSupplier
