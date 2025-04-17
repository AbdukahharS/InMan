import { create } from 'zustand'
import {
  createFolder as addFolder,
  getFolders,
  updateFolder as updateFolderFn,
} from '../db/functions/folderFns'
import { Folder } from '../db/schemas' // Import the types

interface FolderState {
  folders: Folder[]
  active: Folder | null
  fetchFolders: () => void
  createFolder: (name: string, parent?: string) => Promise<Folder>
  setActive: (folder: Folder | null) => void
  updateFolder: (args: {
    _id: string
    name?: string
    parent?: string | null
  }) => Promise<Folder>
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
  createFolder: async (name: string, parent: string | undefined) => {
    const newFolder = await addFolder(name, parent)
    set((state) => ({
      folders: [...state.folders, newFolder as Folder],
    }))
    return newFolder
  },

  // Update folder properties (including parent for adopting/un-adopting)
  updateFolder: async (args: {
    _id: string
    name?: string
    parent?: string | null
  }) => {
    const updatedFolder = await updateFolderFn(args)

    // Update the local state with the updated folder
    set((state) => ({
      folders: state.folders.map((folder) =>
        folder._id === updatedFolder._id ? (updatedFolder as Folder) : folder
      ),
    }))

    return updatedFolder as Folder
  },

  setActive: (folder: Folder | null) => set({ active: folder }),
}))

export default useFolderStore