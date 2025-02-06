import { ref, computed, watch, onMounted } from 'vue'
import { useHotkeys } from 'vue-use-hotkeys'

export function useTimer() {
  // Estados e variáveis
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

  // Computeds
  const currentState = computed(() => {
    if (isFocus.value) return 'Focus'
    if (isFlow.value) return 'Flow'
    if (isBreak.value) return 'Break'
    return 'Idle'
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
      current = seconds.value
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

  // Variáveis para controle de tempo
  let startTime = 0
  let pauseStart = 0
  let pauseOffset = 0

  // Funções
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
    isFocus.value = true
    isBreak.value = false
    startTime = Date.now()
    pauseOffset = 0
    seconds.value = focusTime.value
    isPaused.value = false
  }

  function formatTime(totalSeconds: number): string {
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

  //Persistência
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
      expiry: new Date().getTime() + 3600000, // expira em 1 hora
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
          localStorage.removeItem('timerState')
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

  watch(
    [seconds, isFlow, isBreak, isFocus, isPaused, timerStarted, focusTime, breakTime, allowAnswer, continueFocus],
    () => {
      saveTimerState()
    },
    { deep: true }
  )

  onMounted(() => {
    restoreTimerState()
    if (timerStarted.value && !interval) {
      startInterval()
    }
  })

  return {
    seconds,
    currentState,
    stateColor,
    progress,
    startTimer,
    pauseTimer,
    resumeTimer,
    unbreak,
    formatTime,
    isFlow,
    isBreak,
    isFocus,
    isPaused,
    timerStarted,
    focusTime,
    breakTime,
    allowAnswer,
    continueFocus,
  }
}
