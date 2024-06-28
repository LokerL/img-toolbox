<script setup>
  import { ref, onMounted } from 'vue';

  const isDark = ref(false);

  const updateTheme = (dark) => {
    window.darkMode.toggle(dark);
    localStorage.setItem('arco-dark-mode', `${dark}`);
    if (dark) {
      document.body.setAttribute('arco-theme', 'dark');
    } else {
      document.body.removeAttribute('arco-theme');
    }
    isDark.value = dark;
  };

  onMounted(() => {
    const darkMode = localStorage.getItem('arco-dark-mode') === 'true';
    updateTheme(darkMode);
  });

  const toggleDark = () => {
    updateTheme(!isDark.value);
  };
</script>

<template>
  <div class="toggle-dark-btn" @click="toggleDark">
    <icon-moon v-if="isDark" />
    <icon-sun v-else />
  </div>
</template>

<style scoped>
  .toggle-dark-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    border-right: 170px;
    -webkit-app-region: no-drag;
    float: right;
    height: 30px;
    border-radius: 50%;
    width: 30px;
    &:hover {
      cursor: pointer;
      background-color: var(--color-fill-2);
    }
  }
</style>
