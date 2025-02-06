<template>
  <div id="box">
    <div id="instructions">
      <p><span class="key">space</span> para iniciar</p>
      <p><span class="key">enter</span> para manter o foco</p>
      <p><span class="key">n</span> para iniciar pausa</p>
    </div>
    <div id="buttons">
      <button :style="{ backgroundColor: `${stateColor}69` }" @click="startTimer">Iniciar</button>
      <button :style="{ backgroundColor: `${stateColor}69` }" @click="$emit('open-config')">⚙️</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'

interface Props {
  stateColor: string
  startTimer: () => void
}

const props = defineProps<Props>()
</script>

<style scoped>
#instructions {
  display: flex;
  flex-direction: column;
  gap: 5px;
  align-items: center;
  justify-content: center;
}

#instructions p {
  display: flex;
  align-items: center;
  gap: 5px;
}

.key {
  border: 1px solid rgb(221, 221, 221);
  box-shadow: 1px 1px rgb(221, 221, 221);
  font-size: 0.85em;
  line-height: 0.85em;
  display: inline-block;
  font-weight: 600;
  letter-spacing: 0.05em;
  padding: 3px 5px;
  white-space: nowrap;
  background-color: #333;
  color: #fff;
  border-radius: 4px;
  font-family: sans-serif;
}

#buttons {
  margin-top: 20px;
  display: flex;
  gap: 15px;
  align-items: center;
  justify-content: center;
}

button {
  all: unset;
  padding: 6px 12px;
  background-color: #262626;
  border: 1px solid #666;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out;
  border-radius: 5px;
}

button:hover {
  background-color: #5f5f5f;
}

#box {
  margin-top: 80px;
  border-radius: 10px;
  padding: 50px;
}
</style>
