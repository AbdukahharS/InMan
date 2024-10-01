// components/ConfirmDialog.tsx
import { useConfirmStore } from '../store/confirmStore';
import { Dialog, DialogContent, DialogTitle } from './ui/dialog'
import { Button } from './ui/button'

const ConfirmDialog = () => {
  const { isConfirmOpen, confirmMessage, onConfirm, onCancel, closeConfirm } = useConfirmStore();

  if (!isConfirmOpen) return null;

  return (
    <Dialog open={isConfirmOpen} onOpenChange={closeConfirm}>
      <DialogContent className='pt-10' aria-describedby={undefined}>
        <DialogTitle>{confirmMessage}</DialogTitle>
        <div className="mt-4 flex justify-center space-x-10">
          <Button autoFocus onClick={() => { onConfirm(); closeConfirm(); }}>Ha</Button>
          <Button variant="secondary" onClick={() => { onCancel(); closeConfirm(); }}>Yo'q</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDialog;
