import { cn } from '@/lib/utils'
import useFolderStore from '@/hooks/useSale'
import { useRef, useState } from 'react'
import { updateFolder } from '@/db/functions/folderFns'
import { Folder as FolderType } from '@/db/schemas'

const Folder = () => {
  const { folders, setFolder, folder, fetchFolders } = useFolderStore()
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [dropTargetId, setDropTargetId] = useState<string | null>(null)
  const papkalarRef = useRef<HTMLParagraphElement>(null)

  // Handle folder adoption/unadoption
  const handleFolderUpdate = async (
    folderId: string,
    parentId?: string | null
  ) => {
    try {
      await updateFolder({
        _id: folderId,
        name: folders.find((f) => f._id === folderId)?.name || '',
        parent: parentId || null,
      })
      // Refresh folders after update
      fetchFolders()
    } catch (error) {
      console.error('Error updating folder:', error)
    }
  }

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    doc: FolderType
  ) => {
    setDraggingId(doc._id)
    // Set data for drag operation
    e.dataTransfer.setData('folderId', doc._id)
    // Set drag image (optional)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragEnd = () => {
    setDraggingId(null)
    setDropTargetId(null)
  }

  const handleDragOver = (
    e: React.DragEvent<HTMLDivElement>,
    targetId?: string | null
  ) => {
    e.preventDefault()

    // Don't allow dropping on itself
    if (targetId === draggingId) return

    // Don't allow dropping on a folder that already has a parent (avoid double nesting)
    const draggingFolder = folders.find((f) => f._id === draggingId)
    const targetFolder = folders.find((f) => f._id === targetId)

    if (targetId && targetFolder?.parent) {
      // Target already has a parent, so we can't nest further
      e.dataTransfer.dropEffect = 'none'
      return
    }

    // Don't allow dropping a parent into its own child
    if (
      targetId &&
      draggingFolder &&
      folders.some((f) => f.parent === draggingFolder._id && f._id === targetId)
    ) {
      e.dataTransfer.dropEffect = 'none'
      return
    }

    setDropTargetId(targetId || null)
    e.dataTransfer.dropEffect = 'move'
  }

  const handlePapkalarDragOver = (e: React.DragEvent<HTMLParagraphElement>) => {
    e.preventDefault()

    // Only allow dropping folders that have a parent (for un-adopting)
    const draggingFolder = folders.find((f) => f._id === draggingId)
    if (draggingFolder?.parent) {
      setDropTargetId('papkalar')
      e.dataTransfer.dropEffect = 'move'
    } else {
      e.dataTransfer.dropEffect = 'none'
    }
  }

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    targetId?: string | null
  ) => {
    e.preventDefault()
    const folderId = e.dataTransfer.getData('folderId')

    // Skip if dropping on itself
    if (targetId === folderId) return

    // Check if target is valid (not already nested)
    const targetFolder = folders.find((f) => f._id === targetId)
    if (targetId && targetFolder?.parent) return

    // Don't allow dropping a parent into its own child
    const draggingFolder = folders.find((f) => f._id === folderId)
    if (
      targetId &&
      draggingFolder &&
      folders.some((f) => f.parent === draggingFolder._id && f._id === targetId)
    ) {
      return
    }

    // Don't allow dropping parent to any other folder, prevent double nesting
    const isParent = folders.some((f) => f.parent === folderId)
    if (isParent) {
      return
    }

    // Update folder with new parent
    handleFolderUpdate(folderId, targetId)
    setDropTargetId(null)
  }

  const handlePapkalarDrop = (e: React.DragEvent<HTMLParagraphElement>) => {
    e.preventDefault()
    const folderId = e.dataTransfer.getData('folderId')

    // Un-adopt folder (set parent to null)
    handleFolderUpdate(folderId, null)
    setDropTargetId(null)
  }

  return (
    <div className='flex-1 max-h-full overflow-y-auto'>
      <p
        ref={papkalarRef}
        className={cn(
          'px-4 py-2 font-bold text-xl',
          dropTargetId === 'papkalar' ? 'bg-blue-100' : ''
        )}
        onDragOver={handlePapkalarDragOver}
        onDrop={handlePapkalarDrop}
      >
        Papkalar
      </p>

      {folders
        ?.filter((f) => !f.parent)
        .map((doc) => (
          <div key={doc._id}>
            <div
              className={cn(
                'flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100 border-t',
                doc._id === folder?._id ? 'bg-gray-100' : '',
                doc._id === dropTargetId ? 'bg-blue-100' : '',
                draggingId === doc._id ? 'opacity-50' : ''
              )}
              onClick={() => setFolder(doc)}
              draggable
              onDragStart={(e) => handleDragStart(e, doc)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => handleDragOver(e, doc._id)}
              onDrop={(e) => handleDrop(e, doc._id)}
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
                      'flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100 border-t pl-8',
                      f._id === folder?._id ? 'bg-gray-100' : '',
                      f._id === dropTargetId ? 'bg-blue-100' : '',
                      draggingId === f._id ? 'opacity-50' : ''
                    )}
                    onClick={() => setFolder(f)}
                    draggable
                    onDragStart={(e) => handleDragStart(e, f)}
                    onDragEnd={handleDragEnd}
                    onDragOver={(e) => handleDragOver(e, f._id)}
                    onDrop={(e) => handleDrop(e, f._id)}
                  >
                    - {f.name}
                  </div>
                ))}
          </div>
        ))}
    </div>
  )
}

export default Folder
