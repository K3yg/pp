<template>
  <div id="box" :class="{ modern: isModernUI, classic: !isModernUI }">
    <div v-if="isModernUI" id="instructions-modern">
      <div class="instruction" @click="startTimer">
        <span class="key">space</span>
        <span class="label">{{ $t('controls.toStart') }}</span>
      </div>
      <div class="instruction">
        <span class="key">enter</span>
        <span class="label">{{ $t('controls.toKeepFocus') }}</span>
      </div>
      <div class="instruction">
        <span class="key">n</span>
        <span class="label">{{ $t('controls.toStartBreak') }}</span>
      </div>
    </div>

    <div v-else id="instructions-classic">
      <p><span class="key-classic" :style="{ backgroundColor: `${stateColor}99` }">space</span> {{ $t('controls.toStart') }}</p>
      <p><span class="key-classic" :style="{ backgroundColor: `${stateColor}99` }">enter</span> {{ $t('controls.toKeepFocus') }}</p>
      <p><span class="key-classic" :style="{ backgroundColor: `${stateColor}99` }">n</span> {{ $t('controls.toStartBreak') }}</p>
    </div>

    <div id="buttons">
      <button v-if="!isModernUI" class="start-btn" :style="{ backgroundColor: `${stateColor}99` }" @click="startTimer">
        {{ $t('controls.start') }}
      </button>
      <button class="config-btn" :class="{ modern: isModernUI }" @click="$emit('open-config')">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  stateColor: string
  startTimer: () => void
  isModernUI: boolean
}

defineProps<Props>()
</script>

<style scoped>
#box {
  display: flex;
  flex-direction: column;
  align-items: center;
}

#box.modern {
  margin-top: 40px;
  gap: 24px;
}

#box.classic {
  margin-top: 80px;
  padding: 50px;
  gap: 20px;
}

#instructions-modern {
  display: flex;
  gap: 12px;
}

.instruction {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px 20px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 90px;
}

.instruction:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.12);
  transform: translateY(-2px);
}

.key {
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 6px 10px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  color: rgba(255, 255, 255, 0.9);
  font-family: 'SF Mono', monospace;
}

.label {
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.5);
  text-align: center;
  line-height: 1.3;
}

#instructions-classic {
  display: flex;
  flex-direction: column;
  gap: 5px;
  align-items: center;
}

#instructions-classic p {
  display: flex;
  align-items: center;
  gap: 5px;
}

.key-classic {
  border: 1px solid rgb(221, 221, 221);
  box-shadow: 1px 1px rgb(221, 221, 221);
  font-size: 0.85em;
  line-height: 0.85em;
  display: inline-block;
  font-weight: 600;
  letter-spacing: 0.05em;
  padding: 3px 5px;
  white-space: nowrap;
  color: #fff;
  border-radius: 4px;
  font-family: sans-serif;
}

#buttons {
  display: flex;
  gap: 15px;
  align-items: center;
}

.start-btn {
  all: unset;
  padding: 6px 12px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 5px;
  box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.3);
}

.start-btn:hover {
  filter: brightness(1.2);
}

.config-btn {
  all: unset;
  padding: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.config-btn.modern {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 10px;
  color: rgba(255, 255, 255, 0.5);
}

.config-btn.modern:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.12);
  color: rgba(255, 255, 255, 0.8);
}

.config-btn:not(.modern) {
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 5px;
  color: rgba(255, 255, 255, 0.7);
  box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.3);
}

.config-btn:not(.modern):hover {
  background: rgba(255, 255, 255, 0.2);
}
</style>
