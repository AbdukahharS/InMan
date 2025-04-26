import PouchDB from 'pouchdb'
import { v4 as uuidv4 } from 'uuid'
import { Folder, folderSchema } from '../schemas'

// Initialize PouchfoldersDB
const foldersDB = new PouchDB('folders')
const remoteCouch = false

// Function to get all folders
export const getFolders = async () => {
  try {
    const result = await foldersDB.allDocs({
      include_docs: true,
      descending: true,
    })
    const folders = result.rows
    .map((row) => {
      if ('name' in row.doc) {
        return row.doc as Folder
      }
    })
    .sort((a, b) => a.name.localeCompare(b.name))
    return folders
  } catch (error) {
    console.error('Error fetching folders:', error)
    return []
  }
}

// Function to update a folder
export const updateFolder = async (args: {
  _id: string
  name?: string
  parent?: string
}) => {
  const { error } = folderSchema.validate(args)
  if (error) {
    console.log(error)

    throw new Error('Invalid input')
  }

  try {
    const existingDocument = await foldersDB.get(args._id)

    if (!existingDocument) {
      throw new Error('Bunday folder topilmadi')
    }

    const updatedDocument = {
      ...existingDocument,
      ...args, // Merge updates
      _id: args._id,
      _rev: existingDocument._rev, // Required for PouchfoldersDB updates
    }

    const response = await foldersDB.put(updatedDocument)
    return { ...updatedDocument, _rev: response.rev } // Return updated document with new revision
  } catch (error) {
    console.error('Error updating folder:', error)
    throw new Error('Failed to update folder')
  }
}

// Function to create a new folder
export const createFolder = async (name: string, parent: string | null) => {
  const { error } = folderSchema.validate({ name })
  if (error) {
    throw new Error(error.message)
  }

  const document = {
    _id: uuidv4(), // Generate a unique ID for the new folder
    name,
    parent, // Set the parent folder ID
  }

  try {
    const response = await foldersDB.put(document)
    return { ...document, _rev: response.rev } // Return the created document with its new revision
  } catch (error) {
    console.error('Error creating folder:', error)
    throw new Error('Failed to create folder')
  }
}

export const getFolder = async (_id: string) => {
  try {
    const result = await foldersDB.get(_id)
    return result
  } catch (error) {
    console.error('Error fetching folder:', error)
    return null
  }
}

// Function to delete a folder
export const deleteFolder = async (_id: string): Promise<PouchDB.Core.Response> => {
  try {
    // 1. Check if any other folder has this folder as its parent
    const allDocs = await foldersDB.allDocs({ include_docs: true })
    const isParent = allDocs.rows.some(row => {
        // Ensure doc exists and has a parent property before checking
        return row.doc && typeof row.doc === 'object' && 'parent' in row.doc && row.doc.parent === _id;
    });


    if (isParent) {
      throw new Error('Cannot delete folder: It is the parent of one or more other folders.')
    }

    // 2. If it's not a parent, fetch the folder to get its _rev
    // This get() also implicitly checks if the folder exists.
    const folderToDelete = await foldersDB.get(_id)

    // 3. Delete the folder
    const response = await foldersDB.remove(folderToDelete)
    console.log(`Folder with id ${_id} deleted successfully.`)
    return response // Return the PouchDB response object on success

  } catch (error: any) {
    if (error.name === 'not_found') {
        console.error(`Error deleting folder: Folder with id ${_id} not found.`)
        throw new Error('Folder not found')
    }
     // Re-throw the specific "is parent" error or other caught errors
    console.error(`Error deleting folder with id ${_id}:`, error)
    // Throw the original error message or a generic one
    throw new Error(error.message || 'Failed to delete folder')
  }
}