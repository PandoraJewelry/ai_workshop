import { useNotification } from '../../contexts';

export function NotificationToast() {
  const { notifications } = useNotification();

  return (
    <div className="fixed top-4 right-4 z-[9999] space-y-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className="px-6 py-4 rounded-lg shadow-2xl font-medium animate-fade-in min-w-[280px] text-white"
          style={{
            backgroundColor: notification.type === 'error' ? '#b91c1c' : '#16a34a',
          }}
        >
          {notification.message}
        </div>
      ))}
    </div>
  );
}
