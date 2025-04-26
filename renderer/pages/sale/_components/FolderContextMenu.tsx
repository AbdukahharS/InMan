import { Folder as FolderType } from '@/db/schemas'

interface FolderContextMenuProps {
    x: number
    y: number
    folder: FolderType
    onClose: () => void
    onRename: (folder: FolderType) => void
    onDelete: (folder: FolderType) => void
}

const FolderContextMenu: React.FC<FolderContextMenuProps> = ({
    x,
    y,
    folder,
    onClose,
    onRename,
    onDelete,
}) => {
    return (
        <div
            className='absolute z-10 bg-white border shadow-lg rounded py-1'
            style={{ top: y, left: x }}
            onClick={(e) => e.stopPropagation()}
        >
            <button
                className='block w-full text-left px-4 py-1 hover:bg-gray-100'
                onClick={() => {
                    onRename(folder)
                    onClose()
                }}
            >
                Nomini o'zgartirish
            </button>
            <button
                className='block w-full text-left px-4 py-1 hover:bg-gray-100 text-red-600'
                onClick={() => {
                    onDelete(folder)
                    onClose()
                }}
            >
                O'chirish
            </button>
        </div>
    )
}

export default FolderContextMenu