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
  parentId?: string
}) => {
  const { error } = folderSchema.validate(args)
  if (error) {
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
export const createFolder = async (name: string) => {
  const { error } = folderSchema.validate({ name })
  if (error) {
    throw new Error(error.message)
  }

  const document = {
    _id: uuidv4(), // Generate a unique ID for the new folder
    name,
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