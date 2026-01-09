<template>
  <div v-if="isModernUI" class="bg-gradient"></div>
  <div v-if="isModernUI" class="noise"></div>
  
  <button class="ui-toggle" @click="toggleUI" :title="isModernUI ? 'Classic UI' : 'Modern UI'">
    <svg v-if="isModernUI" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <path d="M9 3v18M3 9h6"/>
    </svg>
    <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M12 3v1m0 16v1m-9-9h1m16 0h1m-2.636-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m11.314 11.314l.707.707"/>
      <circle cx="12" cy="12" r="4"/>
    </svg>
  </button>

  <div id="container" :class="{ modern: isModernUI, classic: !isModernUI }">
    <div class="card" :class="{ 'glass-card': isModernUI }">
      <p id="title" :style="{ color: stateColor }">{{ currentState }}</p>
      <TimerDisplay
        :seconds="seconds"
        :progress="progress"
        :stateColor="stateColor"
        :formatTime="formatTime"
      />
      <TimerControls 
        :stateColor="stateColor" 
        :startTimer="startTimer" 
        :isModernUI="isModernUI"
        @open-config="openConfigModal" 
      />
    </div>
  </div>
  <TimerConfigModal
    v-if="showConfigModal"
    :focusTime="focusTime"
    :breakTime="breakTime"
    :isModernUI="isModernUI"
    @update-config="updateConfig"
    @close-config="closeConfigModal"
  />
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import TimerDisplay from './components/TimerDisplay.vue'
import TimerControls from './components/TimerControls.vue'
import TimerConfigModal from './components/TimerConfigModal.vue'
import { useTimer } from './composables/useTimer'
import { useUITheme } from './composables/useUITheme'

const {
  seconds,
  currentState,
  stateColor,
  progress,
  startTimer,
  formatTime,
  focusTime,
  breakTime,
} = useTimer()

const { isModernUI, toggleUI } = useUITheme()

const showConfigModal = ref(false)

function openConfigModal() {
  showConfigModal.value = true
}

function updateConfig(newFocusTime: number, newBreakTime: number) {
  focusTime.value = newFocusTime
  breakTime.value = newBreakTime
  showConfigModal.value = false
}

function closeConfigModal() {
  showConfigModal.value = false
}
</script>

<style scoped>
.ui-toggle {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 100;
  padding: 10px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ui-toggle:hover {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.9);
}

#container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
}

#container.classic {
  background: #1f1f1f;
}

.card {
  text-align: center;
  padding: 40px 60px;
}

.glass-card {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

#title {
  font-size: 1.8rem;
  margin-bottom: 10px;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.modern #title {
  text-shadow: 0 2px 20px currentColor;
}
</style>
