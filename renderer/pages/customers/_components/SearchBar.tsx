import { Input } from '@/components/ui/input'
import { Search, Printer } from 'lucide-react'
import { Button } from '@/components/ui/button'

const SearchBar = ({
  setSearch,
  onPrint,
}: {
  setSearch: (search: string) => void
  onPrint: () => void
}) => {
  return (
    <div className='w-full border-b relative flex items-center'>
      <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5' />
      <Input
        placeholder='Qidirish...'
        className='rounded-none border-b text-lg px-10 py-3'
        onChange={(e) => setSearch(e.target.value)}
      />
      <Button
        onClick={onPrint}
        variant='outline'
        size='icon'
        className='absolute right-2 top-1/2 -translate-y-1/2'
      >
        <Printer className='h-4 w-4' />
      </Button>
    </div>
  )
}

export default SearchBar