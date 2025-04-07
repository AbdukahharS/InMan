
import { cn } from '@/lib/utils'
import useFolderStore from '@/hooks/useSale'

const Folder = () => {
  const {folders, setFolder, folder} = useFolderStore()

  return (
    <div className='flex-1 max-h-full overflow-y-auto'>
      <p className='px-4 py-2 font-bold text-xl'>Papkalar</p>
      {folders
        ?.filter((f) => !f.parent)
        .map((doc) => (
          <>
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
            {(folder?._id === doc._id || folder?.parent === doc._id) &&
              folders
                ?.filter((f) => f.parent === doc._id)
                .map((f) => (
                  <div
                    key={f._id}
                    className={cn(
                      'flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100 border-t',
                      f._id === folder?._id ? 'bg-gray-100' : ''
                    )}
                    onClick={() => setFolder(f)}
                  >
                    - {f.name}
                  </div>
                ))}
          </>
        ))}
    </div>
  )
}

export default Folder
