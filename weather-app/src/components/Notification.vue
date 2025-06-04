<template>
  <div class="notification-container">
    <TransitionGroup name="notification-fade">
      <div 
        v-for="notif in notifications" 
        :key="notif.id"  
        class="notification" 
        :class="notif.type === 'success' ? 'is-success' : 'is-danger'"
        role="alert"
      >
        <button class="delete" aria-label="delete" @click="removeNotification(notif.id)"></button>
        {{ notif.message }}
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { useNotifications } from '../composables/useNotifications';
import { onMounted, onUnmounted } from 'vue';

const { notifications, removeNotification } = useNotifications();

onMounted(() => {
  const interval = setInterval(() => {
    if (notifications.value.length > 0) {
      const oldestNotif = notifications.value[0];
      removeNotification(oldestNotif.id);
    }
  }, 5000);

  onUnmounted(() => {
    clearInterval(interval);
  });
});
</script>