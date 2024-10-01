
import { cn } from '@/lib/utils'
import useFolderStore from '@/hooks/useSale'

const Folder = () => {
  const {folders, setFolder, folder} = useFolderStore()

  return (
    <div className='flex-1 max-h-[100vh] overflow-y-auto'>
      <p className='px-4 py-2 font-bold text-xl'>Papkalar</p>
      {folders?.map((doc) => (
        <div
          key={doc._id}
          className={cn(
            'flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100 border-t',
            doc._id === folder?._id ? 'bg-gray-100' : ''
          )}
          onClick={() => setFolder(doc)}
        >
          {doc.name}
        </div>
      ))}
    </div>
  )
}

export default Folder
