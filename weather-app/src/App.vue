<template>
  <router-view></router-view>
  <Notifications />
</template>

<script setup lang="ts">
import Notifications from './components/Notification.vue';
</script>