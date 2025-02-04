<template>
  <div id="container">
    <div class="content">
      <!-- Título com o estado atual -->
      <p id="title">{{ currentState }}</p>

      <!-- Círculo de Progresso Minimalista -->
      <div class="timer-container">
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

      <!-- Instruções -->
      <div id="instructions">
        <p>'Space' para iniciar</p>
        <p>'Enter' para manter o foco</p>
        <p>'n' para iniciar pausa</p>
      </div>

      <!-- Botão para iniciar -->
      <div id="buttons">
        <button @click="timer">Começar</button>
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
const focusTime = ref(5)
const breakTime = ref(3)
const allowAnswer = ref(false)
const continueFocus = ref<boolean | null>(null)

let subSecondCounter = 0 // Conta ciclos de 100ms

// Computa o estado atual para exibição no título
const currentState = computed(() => {
  if (isFocus.value) return 'Focus'
  if (isFlow.value) return 'Flow'
  if (isBreak.value) return 'Break'
  return 'Idle'
})

// Retorna a cor conforme o estado
const stateColor = computed(() => {
  if (isFocus.value) return '#ff4d4d' // vermelho
  if (isFlow.value) return '#4d94ff' // azul
  if (isBreak.value) return '#4dff4d' // verde
  return '#666' // cinza para Idle
})

// Cálculo do progresso (percentual) do círculo
const progress = computed(() => {
  let total = 0
  let current = 0
  if (isFlow.value) {
    total = focusTime.value
    current = total // crescente
  } else if (isBreak.value) {
    total = breakTime.value
    current = breakTime.value - seconds.value // decrescente
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
      // 10 ciclos de 100ms → 1 segundo
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
</script>

<style scoped>
/* Container centralizado com espaçamento adequado */
#container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.content {
  text-align: center;
}

/* Título com o estado atual */
#title {
  font-size: 1.5rem;
  margin-bottom: 20px;
}

/* Estilo do círculo de progresso */
.timer-container {
  width: 220px;
  height: 220px;
  margin: 0 auto 20px auto;
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

/* Reduz o font-size para garantir que o tempo fique contido */
.percentage {
  font-size: 5px;
  font-weight: bold;
}

/* Instruções e botão */
#instructions p {
  margin: 5px 0;
  font-size: 0.9rem;
  color: #ffffff;
}

#buttons {
  margin-top: 10px;
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
</style>
