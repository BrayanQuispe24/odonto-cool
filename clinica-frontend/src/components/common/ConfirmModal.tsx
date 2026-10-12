import React from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { Button } from '../ui/Button';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  isDestructive = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 dark:bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-dark-bg rounded-xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200 border dark:border-primary/20">
        <div className="p-6 text-center flex flex-col items-center">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${isDestructive ? 'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400' : 'bg-primary/10 text-primary dark:bg-secondary/10 dark:text-secondary'}`}>
            <AlertTriangle size={24} />
          </div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-2">{title}</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">{message}</p>
          
          <div className="flex gap-3 w-full">
            <Button variant="outline" className="flex-1" onClick={onCancel}>
              {cancelText}
            </Button>
            <Button 
              className={`flex-1 ${isDestructive ? 'bg-red-600 hover:bg-red-700 text-white' : ''}`}
              onClick={onConfirm}
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
