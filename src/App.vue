<template>
  <div id="container">
    <div class="content">
      <p id="title" :style="{ color: stateColor }">{{ currentState }}</p>
      <TimerDisplay
        :seconds="seconds"
        :progress="progress"
        :stateColor="stateColor"
        :formatTime="formatTime"
      />
      <TimerControls :stateColor="stateColor" :startTimer="startTimer" @open-config="openConfigModal" />
    </div>
  </div>
  <TimerConfigModal
    v-if="showConfigModal"
    :focusTime="focusTime"
    :breakTime="breakTime"
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
#container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.content {
  text-align: center;
}

#title {
  font-size: 2rem;
  margin-bottom: 20px;
  font-weight: bold;
}
</style>
