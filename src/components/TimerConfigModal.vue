<template>
  <div class="modal-overlay">
    <div class="modal-content">
      <h2>Configurações</h2>
      <div class="inputs">
        <label for="workTime">Tempo de Trabalho (minutos):</label>
        <input type="number" id="workTime" v-model.number="localFocusTime" min="1" />
        <label for="breakTime">Tempo de Pausa (minutos):</label>
        <input type="number" id="breakTime" v-model.number="localBreakTime" min="1" />
      </div>
      <div class="buttons-container">
        <button @click="saveConfig">Salvar</button>
        <button @click="cancelConfig">Cancelar</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, defineProps, defineEmits } from 'vue'

interface Props {
  focusTime: number
  breakTime: number
}

const props = defineProps<Props>()
const emits = defineEmits<{
  (e: 'update-config', focusTime: number, breakTime: number): void
  (e: 'close-config'): void
}>()

const localFocusTime = ref(props.focusTime / 60)
const localBreakTime = ref(props.breakTime / 60)

watch(() => props.focusTime, (newVal) => {
  localFocusTime.value = newVal / 60
})
watch(() => props.breakTime, (newVal) => {
  localBreakTime.value = newVal / 60
})

function saveConfig() {
  emits('update-config', localFocusTime.value * 60, localBreakTime.value * 60)
}

function cancelConfig() {
  emits('close-config')
}
</script>

<style scoped>
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
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

.buttons-container {
  display: flex;
  gap: 10px; /* Adiciona espaçamento entre os botões */
  margin-top: 20px;
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
</style>
