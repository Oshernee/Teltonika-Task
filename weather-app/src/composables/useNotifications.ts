import { ref } from 'vue';

export interface Notification {
  id: number;
  message: string;
  type: 'success' | 'error';
}

const notifications = ref<Notification[]>([]);
let notificationId = 0;

function addNotification(message: string, type: 'success' | 'error' = 'success'): void {
  notificationId += 1;
  const id = notificationId;
  notifications.value.push({ id, message, type });
  setTimeout(() => {
    removeNotification(id);
  }, 5000);
}

function removeNotification(id: number): void {
  notifications.value = notifications.value.filter(n => n.id !== id);
}

export function useNotifications() {
  return {
    notifications,
    addNotification,
    removeNotification
  };
}
