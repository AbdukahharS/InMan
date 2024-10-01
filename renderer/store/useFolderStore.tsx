import { create } from 'zustand'
import { createFolder, getFolders } from '../db/functions/folderFns'
import { Folder } from '../db/schemas' // Import the types

interface FolderState {
  folders: Folder[]
  active: Folder | null
  fetchFolders: () => void
  createFolder: (name: string) => Promise<Folder>
  setActive: (folder: Folder | null) => void
}

const useFolderStore = create<FolderState>((set, get) => ({
  folders: [],
  active: null,

  // Fetch folders from LowDB
  fetchFolders: async () => {
    const folders = await getFolders()
    set({ folders })
  },

  // Create a new folder
  createFolder: async (name: string) => {
    const newFolder = await createFolder(name)
    set((state) => ({
      folders: [...state.folders, newFolder as Folder],
    }))
    return newFolder
  },

  setActive: (folder: Folder | null) => set({ active: folder }),
}))

export default useFolderStore
