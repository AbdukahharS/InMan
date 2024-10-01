// components/PromptDialog.tsx
import { useEffect, useState } from 'react'
import { usePromptStore } from '../store/promptStore'
import { Dialog, DialogContent, DialogTitle } from './ui/dialog'
import { Input } from './ui/input'
import { Button } from './ui/button'

const PromptDialog = () => {
  const { isOpen, message, defaultValue, onConfirm, onCancel, closePrompt } =
    usePromptStore()
  const [inputValue, setInputValue] = useState(defaultValue || '')

  useEffect(() => {
    setInputValue(defaultValue || '')
  }, [defaultValue])

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm(inputValue)
    }
    setInputValue('')
    closePrompt()
  }

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    }
    setInputValue('')
    closePrompt()
  }

  return (
    <Dialog open={isOpen} onOpenChange={closePrompt}>
      <DialogContent aria-describedby={undefined}>
        {message && <DialogTitle>{message}</DialogTitle>}
        <Input
          autoFocus
          type='text'
          value={inputValue}
          onKeyDown={(e) => e.key === 'Enter' && handleConfirm()}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <div className='mt-4 flex justify-between'>
          <Button onClick={handleConfirm}>OK</Button>
          <Button variant='secondary' onClick={handleCancel}>
            Bekor qilish
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default PromptDialog
