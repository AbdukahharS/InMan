import React, { useRef, useState, useEffect, useCallback } from 'react' // Added useEffect, useCallback
import { cn } from '@/lib/utils'
import useFolderStore from '@/hooks/useSale' // Assuming this store holds folder state
import { getProductsByFolder } from '@/db/functions/productFns'
import { updateFolder, deleteFolder } from '@/db/functions/folderFns' // Using your specific functions
import { Folder as FolderType } from '@/db/schemas'
import { Product } from '@/db/schemas' // Assuming Product type is available for getProductsByFolder
import FolderContextMenu from './FolderContextMenu'

// Import your UI hooks
import { useToast } from '@/components/ui/use-toast'
import { useConfirm } from '@/hooks/useConfirm' // Assuming path is correct

// Main Folder Component
const Folder = () => {
    const { folders, setFolder, folder: selectedFolder, fetchFolders } = useFolderStore()
    const [draggingId, setDraggingId] = useState<string | null>(null)
    const [dropTargetId, setDropTargetId] = useState<string | null>(null)
    const papkalarRef = useRef<HTMLParagraphElement>(null)

    // --- UI Hook Instantiation ---
    const { toast } = useToast()
    const confirm = useConfirm() // Instantiate the confirmation hook

    // --- Context Menu State ---
    const [contextMenu, setContextMenu] = useState<{
        x: number
        y: number
        folder: FolderType
    } | null>(null)

    // --- Inline Renaming State ---
    const [editingFolderId, setEditingFolderId] = useState<string | null>(null)
    const [editingFolderName, setEditingFolderName] = useState<string>('')
    const renameInputRef = useRef<HTMLInputElement>(null)

    // --- Drag and Drop Handlers (Modified error handling) ---

    const handleFolderUpdate = async (
        folderId: string,
        parentId?: string | null
    ) => {
        const currentFolder = folders.find((f) => f._id === folderId)
        if (!currentFolder) return

        try {
            await updateFolder({
                _id: folderId,
                name: currentFolder.name, // Keep name when changing parent
                parent: parentId === undefined ? currentFolder.parent : parentId,
            })
             toast({ title: 'Papka ko\'chirildi', description: `"${currentFolder.name}" papkasi muvaffaqiyatli ko'chirildi.` }); // Folder moved successfully
            fetchFolders()
        } catch (error: any) {
            console.error('Error updating folder parent:', error)
            toast({
                title: 'Xatolik yuz berdi', // Error occurred
                description: `Papkani ko'chirishda xatolik: ${error.message || 'Noma\'lum xato'}`, // Error moving folder: Unknown error
                variant: 'destructive',
            })
        }
    }

    // handleDragStart, handleDragEnd, handleDragOver, handlePapkalarDragOver, handleDrop, handlePapkalarDrop
    // remain largely the same as the previous version, focusing on drop logic validation.
    // (Including them again for completeness, ensure they match the logic you need)
    const handleDragStart = (
        e: React.DragEvent<HTMLDivElement>,
        doc: FolderType
      ) => {
        if (editingFolderId === doc._id) {
            e.preventDefault();
            return;
        }
        setDraggingId(doc._id)
        e.dataTransfer.setData('folderId', doc._id)
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
        if (!draggingId) return

        if (targetId === draggingId) {
            e.dataTransfer.dropEffect = 'none'
            setDropTargetId(null)
            return
        }

        const isDescendant = (folderId: string | null, parentId: string): boolean => {
            if (!folderId) return false;
            const folder = folders.find(f => f._id === folderId);
            if (!folder) return false;
            if (folder.parent === parentId) return true;
            return isDescendant(folder.parent, parentId);
        };

        if (targetId && isDescendant(targetId, draggingId)) {
            e.dataTransfer.dropEffect = 'none';
            setDropTargetId(null);
            return;
        }

        const targetFolder = folders.find((f) => f._id === targetId);
        if (targetId && targetFolder?.parent) {
             e.dataTransfer.dropEffect = 'none';
             setDropTargetId(null);
        } else {
            setDropTargetId(targetId || 'papkalar')
            e.dataTransfer.dropEffect = 'move'
        }
    }

    const handlePapkalarDragOver = (e: React.DragEvent<HTMLParagraphElement>) => {
        e.preventDefault()
        if (!draggingId) return

        const draggingFolder = folders.find((f) => f._id === draggingId)
        if (draggingFolder?.parent) {
          setDropTargetId('papkalar')
          e.dataTransfer.effectAllowed = 'move' // Indicate valid drop target
          e.dataTransfer.dropEffect = 'move'
        } else {
          e.dataTransfer.effectAllowed = 'none' // Indicate invalid drop target
          e.dataTransfer.dropEffect = 'none'
        }
      }

      const handleDrop = (
        e: React.DragEvent<HTMLDivElement>,
        targetId?: string | null
      ) => {
        e.preventDefault()
        const folderId = e.dataTransfer.getData('folderId')
        if (!folderId || folderId === targetId || !draggingId) {
            setDropTargetId(null);
            return;
        }

        const isDescendant = (checkFolderId: string | null, parentId: string): boolean => {
          if (!checkFolderId) return false;
          const folder = folders.find(f => f._id === checkFolderId);
          if (!folder) return false;
          if (folder.parent === parentId) return true;
          return isDescendant(folder.parent, parentId);
        };

        if (targetId && isDescendant(targetId, folderId)) {
            setDropTargetId(null);
            return;
        }


        const targetFolder = folders.find((f) => f._id === targetId)
        if (targetId && targetFolder?.parent) {
            setDropTargetId(null);
            return;
        }

        handleFolderUpdate(folderId, targetId)
        setDropTargetId(null)
        setDraggingId(null)
      }

      const handlePapkalarDrop = (e: React.DragEvent<HTMLParagraphElement>) => {
        e.preventDefault()
        const folderId = e.dataTransfer.getData('folderId')
        if (!folderId || !draggingId) {
            setDropTargetId(null);
            return;
        }

        const draggingFolder = folders.find(f => f._id === folderId);
        if (draggingFolder?.parent) {
           handleFolderUpdate(folderId, null)
        }
        setDropTargetId(null)
        setDraggingId(null)
      }

    // --- Context Menu Handlers ---
    const handleContextMenu = (
        e: React.MouseEvent<HTMLDivElement>,
        folder: FolderType
    ) => {
        e.preventDefault()
        if (editingFolderId === folder._id) {
            return;
        }
        setContextMenu({ x: e.clientX, y: e.clientY, folder })
    }

    const closeContextMenu = useCallback(() => {
        setContextMenu(null)
    }, [])

    // --- Rename Handlers (Modified error/success handling) ---
    const handleRenameStart = (folder: FolderType) => {
        setEditingFolderId(folder._id)
        setEditingFolderName(folder.name)
    }

    useEffect(() => {
        if (editingFolderId && renameInputRef.current) {
            renameInputRef.current.focus()
            renameInputRef.current.select();
        }
    }, [editingFolderId])

    const handleRenameCancel = () => {
        setEditingFolderId(null)
        setEditingFolderName('')
    }

    const handleRenameSave = async () => {
        if (!editingFolderId || !editingFolderName.trim()) {
            handleRenameCancel()
            return
        }

        const folderToUpdate = folders.find((f) => f._id === editingFolderId)
        if (!folderToUpdate) return

        const newNameTrimmed = editingFolderName.trim();

        if (folderToUpdate.name === newNameTrimmed) {
            handleRenameCancel()
            return
        }

        try {
            await updateFolder({
                _id: editingFolderId,
                name: newNameTrimmed,
                parent: folderToUpdate.parent,
            })
            toast({ title: 'Papka nomi o\'zgartirildi', description: `Papka "${newNameTrimmed}" deb qayta nomlandi.` }); // Folder name changed, Folder renamed to "newName"
            fetchFolders()
            handleRenameCancel()
        } catch (error: any) {
            console.error('Error renaming folder:', error)
            toast({
                title: 'Xatolik yuz berdi', // Error occurred
                description: `Papkani qayta nomlashda xatolik: ${error.message || 'Noma\'lum xato'}`, // Error renaming folder: Unknown error
                variant: 'destructive',
            })
        }
    }

    const handleRenameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleRenameSave()
        } else if (e.key === 'Escape') {
            handleRenameCancel()
        }
    }

    // Handle clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            // Close context menu if clicking outside
            if (contextMenu && !(event.target as Element).closest('.absolute.z-10')) {
                 closeContextMenu();
            }
            // Save/Cancel rename if clicking outside input
            if (editingFolderId && renameInputRef.current && !renameInputRef.current.contains(event.target as Node)) {
                 handleRenameSave(); // Auto-save on click outside
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [editingFolderId, contextMenu, closeContextMenu, handleRenameSave]); // Dependencies updated


    // --- Delete Handler (Using useConfirm, useToast, and updated logic) ---
    const handleDelete = async (folderToDelete: FolderType) => {
        // 1. Check if it has products inside (Parent check is now done by DB function)
        try {
            const productsInFolder: Product[] = await getProductsByFolder(folderToDelete._id);
            if (productsInFolder && productsInFolder.length > 0) {
                 toast({
                    title: 'O\'chirish mumkin emas', // Cannot delete
                    description: `"${folderToDelete.name}" papkasida mahsulotlar mavjud.`, // Folder contains products.
                    variant: 'destructive',
                 });
                return; // Stop deletion process
            }
        } catch (error: any) {
            console.error('Error checking products in folder:', error);
            toast({
                title: 'Xatolik yuz berdi', // Error occurred
                description: `Papka tarkibini tekshirishda xatolik: ${error.message || 'Noma\'lum xato'}`, // Error checking folder contents: Unknown error
                variant: 'destructive',
            });
            return; // Stop deletion process
        }

        // 2. Confirmation Dialog using useConfirm
        const confirmMessage = `Papkani "${folderToDelete.name}" o'chirib tashlamoqchimisiz? Bu amalni qaytarib bo'lmaydi.`; // "Do you want to delete the folder '{name}'? This action cannot be undone."
        const approval = await confirm(confirmMessage);

        if (!approval) {
            return; // User cancelled
        }

        // 3. Perform Deletion (DB function handles parent check)
        try {
            await deleteFolder(folderToDelete._id); // Call your DB function

            toast({ title: 'Papka o\'chirildi', description: `"${folderToDelete.name}" papkasi muvaffaqiyatli o'chirildi.` }); // Folder deleted successfully

            // If the deleted folder was the currently selected one, clear selection
            if (selectedFolder?._id === folderToDelete._id) {
                setFolder(null);
            }
            fetchFolders(); // Refresh list

        } catch (error: any) {
            console.error('Error deleting folder:', error);
            // Display the specific error message thrown by deleteFolder or a generic one
            toast({
                title: 'Xatolik yuz berdi', // Error occurred
                description: `Papkani o'chirishda xatolik: ${error.message || 'Noma\'lum xato'}`, // Error deleting folder: Unknown error
                variant: 'destructive',
            });
        }
    };

    // --- Render Logic (Mostly unchanged, ensure it uses updated handlers) ---
     const renderFolder = (doc: FolderType, isSubfolder: boolean = false) => {
        const isEditing = editingFolderId === doc._id
        const isSelected = doc._id === selectedFolder?._id
        const isDropTarget = doc._id === dropTargetId
        const isDragging = draggingId === doc._id

        return (
          <div
            key={doc._id}
            className={cn(
              'flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100 border-t',
              isSubfolder ? 'pl-8' : '',
              isSelected ? 'bg-gray-100' : '',
              isDropTarget ? 'bg-blue-100' : '',
              isDragging ? 'opacity-50' : '',
              isEditing ? 'bg-blue-50' : ''
            )}
            onClick={(e) => {
                if (!isEditing) setFolder(doc);
                e.stopPropagation(); // Prevent event bubbling that might close context menu prematurely
            }}
            onContextMenu={(e) => !isEditing && handleContextMenu(e, doc)}
            draggable={!isEditing}
            onDragStart={(e) => handleDragStart(e, doc)}
            onDragEnd={handleDragEnd}
            onDragOver={(e) => handleDragOver(e, doc._id)}
            onDrop={(e) => handleDrop(e, doc._id)}
          >
            {isSubfolder && !isEditing && '- '}
            {isEditing ? (
              <input
                ref={renameInputRef}
                type='text'
                value={editingFolderName}
                onChange={(e) => setEditingFolderName(e.target.value)}
                onKeyDown={handleRenameKeyDown}
                onBlur={(e) => {
                    // Delay save slightly on blur to allow clicks on context menu/other elements
                    // setTimeout(handleRenameSave, 100);
                    handleRenameSave(); // Direct save might be fine depending on event timing
                }}
                onClick={(e) => e.stopPropagation()} // Prevent folder selection click
                className='flex-1 p-0 m-0 border border-blue-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500'
                style={{ lineHeight: 'inherit' }}
              />
            ) : (
              <span className='flex-1 truncate'>{doc.name}</span>
            )}
          </div>
        )
      }

      return (
        <div className='flex-1 max-h-full overflow-y-auto '>
          <p
            ref={papkalarRef}
            className={cn(
              'px-4 py-2 font-bold text-xl sticky top-0 bg-white z-5 border-b', // Added border-b
              dropTargetId === 'papkalar' ? 'bg-blue-100' : ''
            )}
            onDragOver={handlePapkalarDragOver}
            onDrop={handlePapkalarDrop}
            onDragEnter={(e) => {
               e.preventDefault();
               const draggingFolder = folders.find((f) => f._id === draggingId);
               if (draggingFolder?.parent) {
                 setDropTargetId('papkalar');
               }
            }}
            onDragLeave={(e) => {
                 // Check if the related target is outside the Papkalar element
                if (!(papkalarRef.current && papkalarRef.current.contains(e.relatedTarget as Node))) {
                    if (dropTargetId === 'papkalar') {
                       setDropTargetId(null);
                    }
                 }
            }}
          >
            Papkalar {/* Or "Folders" */}
          </p>

          {folders
            ?.filter((f) => !f.parent)
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((doc) => (
              <div key={doc._id}>
                {renderFolder(doc)}
                {(selectedFolder?._id === doc._id || selectedFolder?.parent === doc._id) && folders
                  ?.filter((f) => f.parent === doc._id)
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((subDoc) => renderFolder(subDoc, true))}
              </div>
            ))}

          {contextMenu && (
            <FolderContextMenu
              x={contextMenu.x}
              y={contextMenu.y}
              folder={contextMenu.folder}
              onClose={closeContextMenu}
              onRename={handleRenameStart}
              onDelete={handleDelete}
            />
          )}
        </div>
      )
}

export default Folder