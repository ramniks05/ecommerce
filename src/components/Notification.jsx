import { useNotification } from '../context/NotificationContext';
import { FiCheckCircle, FiInfo, FiAlertCircle, FiX } from 'react-icons/fi';

const Notification = () => {
  const { notification } = useNotification();

  if (!notification) return null;

  const icons = {
    success: <FiCheckCircle className="text-green-500" size={24} />,
    info: <FiInfo className="text-blue-500" size={24} />,
    error: <FiAlertCircle className="text-red-500" size={24} />,
  };

  const bgColors = {
    success: 'bg-green-50 border-green-200',
    info: 'bg-blue-50 border-blue-200',
    error: 'bg-red-50 border-red-200',
  };

  return (
    <div className="fixed top-20 right-4 z-50 animate-slide-in">
      <div className={`${bgColors[notification.type]} border rounded-lg shadow-lg p-4 flex items-center gap-3 min-w-80`}>
        {icons[notification.type]}
        <p className="flex-1 text-gray-900">{notification.message}</p>
        <button className="text-gray-400 hover:text-gray-600">
          <FiX size={20} />
        </button>
      </div>
    </div>
  );
};

export default Notification;

