<script lang="ts" setup>
import { ref } from 'vue'
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

let subSecondCounter = 0 // Conta os ciclos de 100ms

function clock() {
  if (!action.value) {
    subSecondCounter++
    if (subSecondCounter >= 10) { // A cada 10 ciclos de 100ms → 1 segundo
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
  const seconds = totalSeconds % 60

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}
</script>


<template>
  <div id="container">
    <div>
      <p id="status">
        {{ isFocus ? 'Focus' : isFlow ? 'Flow' : isBreak ? 'Break' : '' }}
      </p>
      <p id="title"></p>
      <p id="timer">
        {{ formatTime(seconds) }}
      </p>
      <p>'Space' to start</p>
      <p>'Enter' to keep on focus</p>
      <p>'n' to start break</p>
      <div id="buttons">
        <button @click="timer">Começar</button>
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
