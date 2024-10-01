// hooks/usePrompt.ts
import { usePromptStore } from '../store/promptStore'

const usePrompt = () => {
  const openPrompt = usePromptStore((state) => state.openPrompt)

  const prompt = (
    message: string,
    defaultValue: string = ''
  ): Promise<string | null> => {
    return new Promise((resolve) => {
      openPrompt(
        message,
        defaultValue || '',
        (value) => resolve(value), // Resolve with user input on confirm
        () => resolve(null) // Resolve with null on cancel
      )
    })
  }

  return prompt
}

export default usePrompt
