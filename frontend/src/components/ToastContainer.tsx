import { useToastStore } from '@/store/toastStore';
import ToastNotification from './ToastNotification';

const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <ToastNotification key={toast.id} category={toast.category} status={toast.status} message={toast.message} onClose={() => removeToast(toast.id)}/>
      ))}
    </div>
  );
};

export default ToastContainer;
