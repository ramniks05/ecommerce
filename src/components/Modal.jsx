import { useEffect } from 'react';
import { createPortal } from 'react-dom';

const modalRootId = 'modal-root';

const ensureModalRoot = () => {
  let root = document.getElementById(modalRootId);
  if (!root) {
    root = document.createElement('div');
    root.id = modalRootId;
    document.body.appendChild(root);
  }
  return root;
};

const Modal = ({ open, onClose, children }) => {
  const root = ensureModalRoot();

  useEffect(() => {
    if (!open) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    (
      <div className="fixed inset-0 z-50">
        <div
          className="absolute inset-0 bg-black/50"
          onClick={onClose}
        />
        <div className="absolute inset-0 overflow-y-auto">
          <div className="min-h-full w-full flex items-start justify-center p-4 sm:p-6 md:p-8">
            <div className="relative w-full max-w-5xl bg-white rounded-md shadow-lg">
              {children}
            </div>
          </div>
        </div>
      </div>
    ),
    root
  );
};

export default Modal;


