// store/promptStore.ts
import { create } from 'zustand';

interface PromptState {
  isOpen: boolean;
  message: string;
  defaultValue: string;
  onConfirm: (value: string) => void;
  onCancel: () => void;
  openPrompt: (
    message: string,
    defaultValue: string,
    onConfirm: (value: string) => void,
    onCancel: () => void
  ) => void;
  closePrompt: () => void;
}

export const usePromptStore = create<PromptState>((set) => ({
  isOpen: false,
  message: '',
  defaultValue: '',
  onConfirm: () => {},
  onCancel: () => {},
  openPrompt: (message, defaultValue, onConfirm, onCancel) =>
    set({
      isOpen: true,
      message,
      defaultValue: defaultValue || '',
      onConfirm,
      onCancel,
    }),
  closePrompt: () =>
    set({
      isOpen: false,
      message: '',
      defaultValue: '',
      onConfirm: () => {},
      onCancel: () => {},
    }),
}));
