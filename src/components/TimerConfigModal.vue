<template>
  <div class="modal-overlay" :class="{ modern: isModernUI, classic: !isModernUI }" @click.self="cancelConfig">
    <div class="modal-content" :class="{ modern: isModernUI, classic: !isModernUI }">
      <button v-if="isModernUI" class="close-btn" @click="cancelConfig">x</button>
      <h2>{{ $t('config.title') }}</h2>
      
      <div v-if="isModernUI" class="input-group">
        <div class="input-wrapper">
          <span class="input-icon focus-icon"></span>
          <div class="input-content">
            <label for="workTime">{{ $t('config.workTime') }}</label>
            <div class="input-row">
              <button class="stepper" @click="localFocusTime = Math.max(1, localFocusTime - 5)">-</button>
              <input type="number" id="workTime" v-model.number="localFocusTime" min="1" />
              <button class="stepper" @click="localFocusTime += 5">+</button>
            </div>
          </div>
        </div>
        
        <div class="input-wrapper">
          <span class="input-icon break-icon"></span>
          <div class="input-content">
            <label for="breakTime">{{ $t('config.breakTime') }}</label>
            <div class="input-row">
              <button class="stepper" @click="localBreakTime = Math.max(1, localBreakTime - 5)">-</button>
              <input type="number" id="breakTime" v-model.number="localBreakTime" min="1" />
              <button class="stepper" @click="localBreakTime += 5">+</button>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="inputs-classic">
        <label for="workTimeClassic">{{ $t('config.workTime') }}</label>
        <input type="number" id="workTimeClassic" v-model.number="localFocusTime" min="1" />
        <label for="breakTimeClassic">{{ $t('config.breakTime') }}</label>
        <input type="number" id="breakTimeClassic" v-model.number="localBreakTime" min="1" />
      </div>

      <div class="buttons-container" :class="{ modern: isModernUI, classic: !isModernUI }">
        <button class="save-btn" :class="{ modern: isModernUI, classic: !isModernUI }" @click="saveConfig">{{ $t('config.save') }}</button>
        <button v-if="!isModernUI" class="cancel-btn" @click="cancelConfig">{{ $t('config.cancel') }}</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'

interface Props {
  focusTime: number
  breakTime: number
  isModernUI: boolean
}

const props = defineProps<Props>()
const emits = defineEmits<{
  (e: 'update-config', focusTime: number, breakTime: number): void
  (e: 'close-config'): void
}>()

const localFocusTime = ref(Math.floor(props.focusTime / 60))
const localBreakTime = ref(Math.floor(props.breakTime / 60))

watch(() => props.focusTime, (newVal) => {
  localFocusTime.value = Math.floor(newVal / 60)
})
watch(() => props.breakTime, (newVal) => {
  localBreakTime.value = Math.floor(newVal / 60)
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
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-overlay.modern {
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(4px);
  animation: fadeIn 0.2s ease;
}

.modal-overlay.classic {
  background: rgba(0, 0, 0, 0.6);
  animation: fadeIn 0.3s ease;
}

.modal-content {
  position: relative;
  color: white;
}

.modal-content.modern {
  background: linear-gradient(145deg, #1a1a1a 0%, #242424 100%);
  padding: 32px;
  border-radius: 16px;
  width: 340px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 
    0 24px 48px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  animation: slideUp 0.3s ease;
}

.modal-content.classic {
  background: #262626;
  padding: 20px;
  border-radius: 10px;
  width: 320px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  animation: scaleIn 0.3s ease;
}

.close-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 28px;
  height: 28px;
  border: none;
  background: rgba(255, 255, 255, 0.05);
  color: #888;
  font-size: 16px;
  cursor: pointer;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: rgba(255, 77, 77, 0.2);
  color: #ff4d4d;
}

.modal-content.modern h2 {
  margin: 0 0 28px 0;
  font-size: 1.1rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.modal-content.classic h2 {
  margin-top: 0;
  font-size: 1.5rem;
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
  margin-bottom: 15px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.input-wrapper {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  transition: all 0.2s ease;
}

.input-wrapper:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
}

.input-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  flex-shrink: 0;
}

.focus-icon {
  background: linear-gradient(135deg, #ff4d4d 0%, #ff6b6b 100%);
  box-shadow: 0 4px 12px rgba(255, 77, 77, 0.3);
}

.break-icon {
  background: linear-gradient(135deg, #4dff4d 0%, #6bff6b 100%);
  box-shadow: 0 4px 12px rgba(77, 255, 77, 0.3);
}

.input-content {
  flex: 1;
}

.input-content label {
  display: block;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.input-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.input-row input {
  flex: 1;
  padding: 8px 12px;
  border: none;
  background: rgba(0, 0, 0, 0.3);
  color: white;
  border-radius: 8px;
  font-size: 1.25rem;
  font-weight: 600;
  text-align: center;
  width: 60px;
  -moz-appearance: textfield;
}

.input-row input::-webkit-outer-spin-button,
.input-row input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.input-row input:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.1);
}

.stepper {
  width: 32px;
  height: 32px;
  border: none;
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.7);
  font-size: 18px;
  cursor: pointer;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
  font-weight: 300;
}

.stepper:hover {
  background: rgba(255, 255, 255, 0.15);
  color: white;
}

.stepper:active {
  transform: scale(0.95);
}

.inputs-classic {
  margin-bottom: 15px;
}

.inputs-classic label {
  display: flex;
  margin-bottom: 5px;
  font-weight: 600;
}

.inputs-classic input {
  width: 50%;
  padding: 8px;
  border: none;
  background: #666;
  color: white;
  border-radius: 5px;
  font-size: 1rem;
  margin-bottom: 15px;
}

.inputs-classic input:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.2);
}

.buttons-container.modern {
  margin-top: 0;
}

.buttons-container.classic {
  display: flex;
  gap: 10px;
  margin-top: 5px;
}

.save-btn.modern {
  width: 100%;
  margin-top: 24px;
  padding: 14px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(10px);
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  border-radius: 10px;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.2s ease;
}

.save-btn.modern:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.15);
}

.save-btn.classic,
.cancel-btn {
  all: unset;
  padding: 6px 12px;
  background: #262626;
  border: 1px solid #666;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease;
  border-radius: 5px;
}

.save-btn.classic:hover,
.cancel-btn:hover {
  background: #5f5f5f;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { 
    opacity: 0; 
    transform: translateY(20px) scale(0.98); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0) scale(1); 
  }
}

@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
</style>
