<script lang="ts" setup>
import { ref } from 'vue'
import { useHotkeys } from 'vue-use-hotkeys'

const focusTime = ref<number>(5)
const breakTime = ref<number>(2)

const hours = ref<number>(Math.floor(focusTime.value / 60))
const minutes = ref<number>(0)
const seconds = ref<number>(focusTime.value % 60)

const interval = ref<number | null>(null)
const isBreakTime = ref<boolean>(false)

const allowAnswer = ref<boolean>(false)
const continueFocus = ref<boolean | null>(null)

useHotkeys('enter', () => {
  if (allowAnswer.value) {
    continueFocus.value = true
    allowAnswer.value = false
  }
})

useHotkeys('n', () => {
  if (allowAnswer.value) {
    continueFocus.value = false
    allowAnswer.value = false
  }
})

function waitForResponse(): Promise<boolean> {
  return new Promise((resolve) => {
    const stopWatch = setInterval(() => {
      if (continueFocus.value !== null) {
        clearInterval(stopWatch)
        resolve(continueFocus.value)
        continueFocus.value = null
      }
    }, 100)
  })
}

async function checkFlow() {
  pauseTimer()
  allowAnswer.value = true

  const shouldContinueFocus = await waitForResponse()

  if (shouldContinueFocus) {
    seconds.value += 2
    isBreakTime.value = false
    startTimer()
  } else {
    startBreak()
  }
}

function checkTime() {
  if (hours.value === 0 && minutes.value === 0 && seconds.value === 0) {
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
  hours.value = 0
  minutes.value = 0
  seconds.value = breakTime.value % 60
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

useHotkeys('space', startTimer)
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
      <p>'Space' to start</p>
      <p>'Enter' to keep on focus</p>
      <p>'n' to start break</p>
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
