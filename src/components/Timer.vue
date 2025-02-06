<template>
  <div id="container">
    <div class="content">
      <p id="title" 
      :style="{ color: stateColor }"      
      >{{ currentState }}</p>

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
          <p><span class="key">space</span> para iniciar</p>
          <p><span class="key">enter</span> para manter o foco</p>
          <p><span class="key">n</span> para iniciar pausa</p>
        </div>

        <div id="buttons">
          <button :style="{ backgroundColor: `${stateColor}69)` }"   @click="startTimer">Iniciar</button>
          <button :style="{ backgroundColor: `${stateColor}69)` }"   @click="openConfigModal">⚙️</button>
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
import { ref, computed, watch, onMounted } from 'vue'
import { useHotkeys } from 'vue-use-hotkeys'

const seconds = ref<number>(0)
let interval: ReturnType<typeof setInterval> | null = null

const isFlow = ref(false)
const isBreak = ref(false)
const isFocus = ref(false)
const isPaused = ref(false)
const timerStarted = ref(false)
const focusTime = ref(2)  // tempo em segundos para teste
const breakTime = ref(3)  // tempo em segundos para teste
const allowAnswer = ref(false)
const continueFocus = ref<boolean | null>(null)

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
    total = 1
    current = seconds.value // Flow: contagem ascendente
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

/* Controle de tempo com Date */
let startTime = 0
let pauseStart = 0
let pauseOffset = 0

function startInterval() {
  interval = setInterval(() => {
    if (!isPaused.value) {
      const elapsed = Math.floor((Date.now() - startTime - pauseOffset) / 1000)
      if (isFlow.value) {
        seconds.value = elapsed
      } else if (isFocus.value) {
        seconds.value = focusTime.value - elapsed
      } else if (isBreak.value) {
        seconds.value = breakTime.value - elapsed
      }
      // Verifica término apenas em Focus e Break
      if (!isFlow.value && seconds.value <= 0) {
        playSound()
        if (isFocus.value) {
          pauseTimer()
          allowAnswer.value = true
        } else {
          unbreak()
        }
      }
    }
  }, 250)
}

function startTimer() {
  if (!timerStarted.value) {
    timerStarted.value = true
    // Se nenhum estado definido, inicia em Focus
    if (!isFocus.value && !isFlow.value && !isBreak.value) {
      isFocus.value = true
      seconds.value = focusTime.value
      startTime = Date.now()
    }
    pauseOffset = 0
    startInterval()
  }
}

useHotkeys('space', () => {
  startTimer()
})

useHotkeys('enter', () => {
  if (allowAnswer.value) {
    continueFocus.value = true
    allowAnswer.value = false
    // Transição para o modo Flow sem adicionar offset
    isFlow.value = true
    isFocus.value = false
    startTime = Date.now()
    pauseOffset = 0
    seconds.value = 0
    isPaused.value = false
  }
})

useHotkeys('n', () => {
  if (allowAnswer.value || isFlow.value) {
    pauseTimer()
    continueFocus.value = false
    allowAnswer.value = false
    // Transição para o modo Break sem adicionar offset
    isBreak.value = true
    isFlow.value = false
    isFocus.value = false
    startTime = Date.now()
    pauseOffset = 0
    seconds.value = breakTime.value
    isPaused.value = false
  }
})

function pauseTimer() {
  if (!isPaused.value) {
    isPaused.value = true
    pauseStart = Date.now()
  }
}

function resumeTimer() {
  if (isPaused.value) {
    isPaused.value = false
    pauseOffset += Date.now() - pauseStart
  }
}

function unbreak() {
  pauseTimer()
  // Transição de Break para Focus
  isFocus.value = true
  isBreak.value = false
  startTime = Date.now()
  pauseOffset = 0
  seconds.value = focusTime.value
  isPaused.value = false
}

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

function saveTimerState() {
  const state = {
    seconds: seconds.value,
    isFlow: isFlow.value,
    isBreak: isBreak.value,
    isFocus: isFocus.value,
    isPaused: isPaused.value,
    timerStarted: timerStarted.value,
    startTime,
    pauseOffset,
    focusTime: focusTime.value,
    breakTime: breakTime.value,
    allowAnswer: allowAnswer.value,
    continueFocus: continueFocus.value,
    expiry: new Date().getTime() + 3600000, // Expira em 1 hora (3600000ms)
  }
  localStorage.setItem('timerState', JSON.stringify(state))
}

function restoreTimerState() {
  const savedState = localStorage.getItem('timerState')
  if (savedState) {
    try {
      const state = JSON.parse(savedState)
      const now = new Date().getTime()

      if (now > state.expiry) {
        localStorage.removeItem('timerState') // Remove se expirado
        return
      }

      seconds.value = state.seconds
      isFlow.value = state.isFlow
      isBreak.value = state.isBreak
      isFocus.value = state.isFocus
      isPaused.value = state.isPaused
      timerStarted.value = state.timerStarted
      startTime = state.startTime
      pauseOffset = state.pauseOffset
      focusTime.value = state.focusTime
      breakTime.value = state.breakTime
      allowAnswer.value = state.allowAnswer
      continueFocus.value = state.continueFocus
    } catch (error) {
      console.error('Erro ao restaurar o estado do timer:', error)
    }
  }
}

// Salva o estado sempre que houver mudança
watch(
  [seconds, isFlow, isBreak, isFocus, isPaused, timerStarted, focusTime, breakTime, allowAnswer, continueFocus],
  () => {
    saveTimerState()
  },
  { deep: true }
)

// Restaura o estado ao montar o componente e retoma o timer se necessário
onMounted(() => {
  restoreTimerState()
  if (timerStarted.value && !interval) {
    startInterval()
  }
})

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
  font-weight: bold;
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
#instructions {
  display: flex;
  flex-direction: column;
  gap: 5px;
  align-items: center;
  justify-content: center;
}

#instructions p {
  display: flex;
  align-items: center;
  gap: 5px;
}

.key {
  border: 1px solid rgb(221, 221, 221);
  box-shadow: 1px 1px rgb(221, 221, 221);
  font-size: 0.85em;
  line-height: 0.85em;
  display: inline-block;
  font-weight: 600;
  letter-spacing: 0.05em;
  padding: 3px 5px;
  white-space: nowrap;
  background-color: #333;
  color: #fff;
  border-radius: 4px;
  font-family: sans-serif;
}

#buttons {
  margin-top: 20px;
  display: flex;
  gap: 15px;
  align-items: center;
  justify-content: center;
}

button {
  all: unset;
  padding: 6px 12px;
  background-color: #262626;
  border: 1px solid #666;
  color: white;
  cursor: pointer;
  transition:
    background-color 0.3s ease-in-out,
    color 0.3s ease-in-out;
  border-radius: 5px;
  
}

button:hover {
  background-color: #5f5f5f;
}

#box {
  margin-top: 80px;
  border-radius: 10px;
  padding: 50px;
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
