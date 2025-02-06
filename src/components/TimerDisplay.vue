<template>
    <div class="timer-container" :style="{ filter: `drop-shadow(0 0 50px ${stateColor}69)` }">
      <svg viewBox="0 0 36 36" class="circular-chart">
        <path
          class="circle-bg"
          d="M18 2.0845
             a 15.9155 15.9155 0 0 1 0 31.831
             a 15.9155 15.9155 0 0 1 0 -31.831"
        />
        <path
          class="circle"
          :stroke-dasharray="`${progress}, 100`"
          :stroke="stateColor"
          d="M18 2.0845
             a 15.9155 15.9155 0 0 1 0 31.831
             a 15.9155 15.9155 0 0 1 0 -31.831"
          transform="rotate(-90 18 18)"
        />
        <text
          x="18"
          y="18"
          text-anchor="middle"
          dominant-baseline="middle"
          :fill="stateColor"
          class="percentage"
        >
          {{ formatTime(seconds) }}
        </text>
      </svg>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { defineProps } from 'vue'
  
  interface Props {
    seconds: number
    progress: number
    stateColor: string
    formatTime: (seconds: number) => string
  }
  
  defineProps<Props>()
  </script>
  
  <style scoped>
  .timer-container {
    width: 300px;
    height: 300px;
    margin: 70px auto 20px auto;
    border-radius: 50%;
  }
  
  .circular-chart {
    width: 100%;
    height: 100%;
  }
  
  .circle-bg {
    fill: none;
    stroke: #f0f0f0;
    stroke-width: 1;
  }
  
  .circle {
    fill: none;
    stroke-width: 2;
    stroke-linecap: round;
    transition: stroke-dasharray 0.3s ease;
  }
  
  .percentage {
    font-size: 5px;
    font-weight: bold;
  }
  </style>
  