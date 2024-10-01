// store/confirmStore.ts
import { create } from 'zustand'

interface ConfirmState {
  isConfirmOpen: boolean
  confirmMessage: string
  onConfirm: () => void
  onCancel: () => void

  openConfirm: (
    message: string,
    onConfirm: () => void,
    onCancel: () => void
  ) => void
  closeConfirm: () => void
}

export const useConfirmStore = create<ConfirmState>((set) => ({
  isConfirmOpen: false,
  confirmMessage: '',
  onConfirm: () => {},
  onCancel: () => {},

  openConfirm: (message, onConfirm, onCancel) =>
    set({
      isConfirmOpen: true,
      confirmMessage: message,
      onConfirm,
      onCancel,
    }),

  closeConfirm: () =>
    set({
      isConfirmOpen: false,
      confirmMessage: '',
      onConfirm: () => {},
      onCancel: () => {},
    }),
}))
