<script lang="ts" setup>
import { ref } from 'vue'
import { useHotkeys } from 'vue-use-hotkeys'

const focusTime = ref<number>(1)
const breakTime = ref<number>(1)

const hours = ref<number>(Math.floor(focusTime.value / 60))
const minutes = ref<number>(focusTime.value % 60)
const seconds = ref<number>(0)

const interval = ref<number | null>(null)

const isBreakTime = ref<boolean>(false)

useHotkeys('enter', () => {
  if (allowChangeFlow.value) {
    flow.value = !flow.value
    allowChangeFlow.value = false
  }
  console.log(flow.value)
})

let flow = ref<boolean>(false)
let allowChangeFlow = ref<boolean>(false)

function checkFlow() {
  allowChangeFlow.value = true
  // tocar barulho
  // notificar o cara
  // ele escolhe entre:
  // - continuar (ativa o flow timer) -> aparece um timer que aumenta
  // - ir para o breakTime (ativa o break timer) -> continua o mesmo timer que já tinha
}

function checkTime() {
  if (hours.value === 0 && minutes.value === 0 && seconds.value === 58) {
    checkFlow()
  }
}

function startTimer() {
  if (!interval.value) {
    interval.value = setInterval(() => {
      if (seconds.value > 0) {
        seconds.value--
      } else if (minutes.value > 0) {
        seconds.value = 59
        minutes.value--
      } else if (hours.value > 0) {
        minutes.value = 59
        seconds.value = 59
        hours.value--
      }
      checkTime()
    }, 1000)
  }
}

function startBreak() {
  isBreakTime.value = true
  hours.value = Math.floor(breakTime.value / 60)
  minutes.value = breakTime.value % 60
  seconds.value = 0
  startTimer()
}

function pauseTimer() {
  if (interval.value) {
    clearInterval(interval.value)
    interval.value = null
  }
}

function resetTimer() {
  pauseTimer()
  isBreakTime.value = false
  hours.value = Math.floor(focusTime.value / 60)
  minutes.value = focusTime.value % 60
  seconds.value = 0
}

useHotkeys('space', () => {
  startTimer()
})

useHotkeys('p', () => {
  pauseTimer()
})
</script>

<template>
  <div id="container" :class="{ break: isBreakTime, focus: !isBreakTime }">
    <div>
      <p id="title">DEBUG PURPOUSE >> {{ isBreakTime ? 'Break time' : 'Focus time' }}</p>
      <p id="timer">
        {{ String(hours).padStart(2, '0') }}:{{ String(minutes).padStart(2, '0') }}:{{
          String(seconds).padStart(2, '0')
        }}
      </p>
      <p>🔥Flow state🔥</p>
      <p>Atual: 3min</p>
      <p>Total: 10min</p>
      <div id="buttons">
        <button @click="startTimer">Começar</button>
        <button @click="pauseTimer">Pausar</button>
        <button @click="resetTimer">Resetar</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
#container {
  border: 1px solid black;
  padding: 10px;
  margin-top: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
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

#timer {
  font-size: 3rem;
  font-weight: bold;
  text-align: center;
}

#buttons {
  display: flex;
  justify-content: center;
  gap: 10px;
}

#title {
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
}

.break {
  background-color: lightblue;
  color: darkblue;
}

.focus {
  background-color: lightcoral;
  color: darkred;
}
</style>
