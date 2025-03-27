import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface ToastProps {
  category: "global" | "register" | "login" | "logout" | "removeUserById";
  status: "success" | "error" | "info";
  message: string;
  onClose: () => void;
}

const ToastNotification = ({ category, status, message, onClose }: ToastProps) => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => {
      setIsVisible(true);
    });

    // Auto-close timer
    const autoCloseTimer = setTimeout(() => {
      setIsClosing(true);
      category === 'register' && status === 'success' && navigate('/login');
    }, 4000);

    return () => {
      clearTimeout(autoCloseTimer);
    };
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    category === 'register' && status === 'success' && navigate('/login');
  };

  const handleTransitionEnd = () => {
    if (isClosing) {
      onClose();
    }
  };

  const getColorClasses = () => {
    switch (status) {
      case 'success':
        return 'bg-green-600';
      case 'error':
        return 'bg-red-500';
      case 'info':
        return 'bg-sky-700';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div
      className={`${getColorClasses()} fixed bottom-4 right-4 min-w-[300px] max-w-[400px] w-full rounded-lg shadow-lg transform transition-all duration-500 ease-in-out ${isVisible && !isClosing ? 'translate-y-0 opacity-100' : 'translate-y-[200%] opacity-0'} z-50`} onTransitionEnd={handleTransitionEnd}>
      <div className="w-full flex justify-between items-center p-4">
        <p className="text-white flex-grow">{message}</p>
        <button onClick={handleClose} className="cursor-pointer text-white hover:bg-opacity-20 rounded-full p-1 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ToastNotification;
