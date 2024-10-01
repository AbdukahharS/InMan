// hooks/useConfirm.ts
import { useConfirmStore } from '../store/confirmStore'

export const useConfirm = () => {
  const openConfirm = useConfirmStore((state) => state.openConfirm)

  const confirm = (message: string): Promise<boolean> => {
    return new Promise((resolve) => {
      openConfirm(
        message,
        () => resolve(true), // Resolve true on confirmation
        () => resolve(false) // Resolve false on cancel
      )
    })
  }

  return confirm
}
