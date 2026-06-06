import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-100/40 backdrop-blur-sm p-4">
      <div className="bg-white border border-indigo-200 rounded-lg shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-indigo-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-indigo-600">{title}</h2>

          <button
            onClick={onClose}
            className="text-slate-600 hover:text-indigo-500 transition"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
