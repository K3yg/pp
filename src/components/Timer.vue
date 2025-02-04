<template>
  <div id="container">
    <div class="content">
      <p id="title">{{ currentState }}</p>

      <div class="timer-container" :style="{ filter: `drop-shadow(0 0 50px ${stateColor}69)` }">
        <svg viewBox="0 0 36 36" class="circular-chart">
          <!-- Fundo do círculo -->
          <path
            class="circle-bg"
            d="M18 2.0845
               a 15.9155 15.9155 0 0 1 0 31.831
               a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <!-- Progresso (colorido conforme estado) -->
          <path
            class="circle"
            :stroke-dasharray="`${progress}, 100`"
            :stroke="stateColor"
            d="M18 2.0845
               a 15.9155 15.9155 0 0 1 0 31.831
               a 15.9155 15.9155 0 0 1 0 -31.831"
            transform="rotate(-90 18 18)"
          />
          <!-- Tempo centralizado (garante que fique dentro do círculo) -->
          <text
            x="18"
            y="18"
            text-anchor="middle"
            dominant-baseline="middle"
            :fill="stateColor"
            class="percentage"
          >
            {{ formatTime(seconds) }}
          </text>
        </svg>
      </div>

      <div id="box">
        <div id="instructions">
          <p>'Space' para iniciar</p>
          <p>'Enter' para manter o foco</p>
          <p>'n' para iniciar pausa</p>
        </div>

        <div id="buttons">
          <button @click="timer">Começar</button>
          <button @click="openConfigModal">Config</button>
        </div>
      </div>
    </div>
  </div>

  <div class="modal-overlay" v-if="showConfigModal">
    <div class="modal-content">
      <h2>Configurações</h2>
      <div class="inputs">
        <label for="workTime">Tempo de Trabalho (minutos):</label>
        <input type="number" id="workTime" v-model.number="newFocusTime" min="1" />

        <label for="breakTime">Tempo de Pausa (minutos):</label>
        <input type="number" id="breakTime" v-model.number="newBreakTime" min="1" />
      </div>
      <div>
        <button @click="saveConfig">Salvar</button>
        <button @click="cancelConfig">Cancelar</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useHotkeys } from 'vue-use-hotkeys'

const seconds = ref<number>(0)
let interval: ReturnType<typeof setInterval> | null = null

const isFlow = ref(false)
const isBreak = ref(false)
const isFocus = ref(false)
const isPaused = ref(false)
const timerStarted = ref(false)
const action = ref(false)
const focusTime = ref(5 * 60)
const breakTime = ref(3 * 60)
const allowAnswer = ref(false)
const continueFocus = ref<boolean | null>(null)

let subSecondCounter = 0 // Conta ciclos de 100ms

const currentState = computed(() => {
  if (isFocus.value) return 'Focus'
  if (isFlow.value) return 'Flow'
  if (isBreak.value) return 'Break'
  return 'Idle'
})

watch([seconds, currentState], () => {
  document.title = `${formatTime(seconds.value)} - ${currentState.value}`
})

const stateColor = computed(() => {
  if (isFocus.value) return '#ff4d4d'
  if (isFlow.value) return '#4d94ff'
  if (isBreak.value) return '#4dff4d'
  return '#666'
})

const progress = computed(() => {
  let total = 0
  let current = 0
  if (isFlow.value) {
    total = focusTime.value
    current = total
  } else if (isBreak.value) {
    total = breakTime.value
    current = breakTime.value - seconds.value
  } else if (isFocus.value) {
    total = focusTime.value
    current = focusTime.value - seconds.value
  }
  if (total <= 0) return 0
  let perc = (current / total) * 100
  if (perc > 100) perc = 100
  if (perc < 0) perc = 0
  return perc
})

function clock() {
  if (!action.value) {
    subSecondCounter++
    if (subSecondCounter >= 10) {
      if (isFlow.value) {
        seconds.value++
      } else {
        seconds.value--
      }
      subSecondCounter = 0
    }
  }
}

function unbreak() {
  pauseTimer()
  isFocus.value = true
  isBreak.value = false
  seconds.value = focusTime.value
  resumeTimer()
}

function timer() {
  if (!timerStarted.value) {
    timerStarted.value = true
    interval = setInterval(() => {
      if (!isPaused.value) {
        if (seconds.value === 0) {
          playSound()
          if (isFocus.value) {
            pauseTimer()
            allowAnswer.value = true
          } else {
            unbreak()
          }
        }
        clock()
      }
    }, 100)
  }
}

useHotkeys('enter', () => {
  if (allowAnswer.value) {
    continueFocus.value = true
    allowAnswer.value = false
    isFlow.value = true
    isFocus.value = false
    seconds.value = 1
    resumeTimer()
  }
})

useHotkeys('n', () => {
  if (allowAnswer.value || isFlow.value) {
    pauseTimer()
    continueFocus.value = false
    allowAnswer.value = false
    isBreak.value = true
    isFocus.value = false
    isFlow.value = false
    seconds.value = breakTime.value
    resumeTimer()
  }
})

function resumeTimer() {
  isPaused.value = false
}

function pauseTimer() {
  isPaused.value = true
}

useHotkeys('space', () => {
  timer()
})

function formatTime(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const secs = totalSeconds % 60
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

function playSound() {
  const audio = new Audio('/sounds/bell.mp3')
  audio.volume = 0.25
  audio.play()
}

const showConfigModal = ref(false)
const newFocusTime = ref(focusTime.value)
const newBreakTime = ref(breakTime.value)

function openConfigModal() {
  newFocusTime.value = focusTime.value / 60
  newBreakTime.value = breakTime.value / 60
  showConfigModal.value = true
}

function saveConfig() {
  focusTime.value = newFocusTime.value * 60
  breakTime.value = newBreakTime.value * 60
  showConfigModal.value = false
}

function cancelConfig() {
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
}

.timer-container {
  width: 300px;
  height: 300px;
  margin: 70px auto 20px auto;
  border-radius: 50%;
}

.circular-chart {
  width: 100%;
  height: 100%;
}

.circle-bg {
  fill: none;
  stroke: #f0f0f0;
  stroke-width: 1;
}

.circle {
  fill: none;
  stroke-width: 2;
  stroke-linecap: round;
  transition: stroke-dasharray 0.3s ease;
}

.percentage {
  font-size: 5px;
  font-weight: bold;
}

#instructions p {
  margin: 5px 0;
  font-size: 1rem;
  color: #ffffff;
}

#buttons {
  margin-top: 10px;
  display: flex;
  justify-content: space-evenly;
}

button {
  all: unset;
  padding: 5px;
  border: 1px solid black;
  cursor: pointer;
  transition:
    background-color 0.3s ease-in-out,
    color 0.3s ease-in-out;
  border-radius: 5px;
}

button:hover {
  background-color: white;
  color: black;
}

#box {
  background-color: #333;
  padding: 30px;
  margin-top: 80px;
  border-radius: 10px;
}

/* Estilos do Modal aprimorado */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeInOverlay 0.3s ease;
}

.modal-content {
  background-color: #262626;
  color: white;
  padding: 20px;
  border-radius: 10px;
  width: 320px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  animation: scaleIn 0.3s ease;
}

.modal-content h2 {
  margin-top: 0;
  font-size: 1.5rem;
  border-bottom: 1px solid #dddddd;
  padding-bottom: 10px;
}

.modal-content div {
  margin-bottom: 15px;
}

.modal-content label {
  display: flex;
  margin-bottom: 5px;
  font-weight: 600;
}

.modal-content input {
  width: 50%;
  padding: 8px;
  border: none;
  background-color: #666;
  color: white;
  border-radius: 5px;
  box-sizing: border-box;
  font-size: 1rem;
}

@keyframes fadeInOverlay {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
