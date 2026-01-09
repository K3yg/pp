import { ref, watch } from 'vue'

const isModernUI = ref(localStorage.getItem('modernUI') !== 'false')

watch(isModernUI, (value) => {
  localStorage.setItem('modernUI', String(value))
})

export function useUITheme() {
  function toggleUI() {
    isModernUI.value = !isModernUI.value
  }

  return {
    isModernUI,
    toggleUI
  }
}
