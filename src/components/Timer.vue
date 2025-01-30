<script lang="ts" setup>
import { ref } from 'vue'
import { useHotkeys } from 'vue-use-hotkeys'

const seconds = ref<number>(0)
let interval = null
const isFlow = ref<boolean>(false)
const isBreak = ref<boolean>(false)
const isFocus = ref<boolean>(false)
const isPaused = ref<boolean>(false)

const focusTime = ref<number>(5)
const breakTime = ref<number>(3)

const allowAnswer = ref<boolean>(false)
const continueFocus = ref<boolean | null>(null)

function clock() {
  if (isFlow.value) {
    seconds.value++
  } else {
    seconds.value--
  }
}

function timer() {
  interval = setInterval(async () => {
    if (seconds.value === 0) {
      if (isFocus.value) {
        const ans = await checkFlow()
        resumeTimer()
        if (ans) {
          isFlow.value = true
          isFocus.value = false
          seconds.value = 0
        } else {
          isFocus.value = false
          isBreak.value = true
          seconds.value = breakTime.value
        }
      } else {
        isFocus.value = true
        isBreak.value = false
        seconds.value = focusTime.value
      }
    }
    if (!isPaused.value) {
      clock()
    }
  }, 1000)
}

useHotkeys('enter', () => {
  if (allowAnswer.value) {
    continueFocus.value = true
    allowAnswer.value = false
  }
})

useHotkeys('n', () => {
  if (isFlow.value) {
    continueFocus.value = false
    allowAnswer.value = false
    isBreak.value = true
    isFocus.value = false
    isFlow.value = false
    seconds.value = breakTime.value
  }
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

  return await waitForResponse()
}

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
