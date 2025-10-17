<template>
  <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl text-white">
    <!-- Fejléc -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-4xl font-bold">{{ weather.name }}</h2>
        <p class="text-blue-100 flex items-center gap-1 mt-1">
          📍 {{ weather.sys.country }}
        </p>
      </div>
      <div class="text-right text-sm text-blue-100">
        {{ currentDate }}
      </div>
    </div>

    <!-- Főbb adatok -->
    <div class="flex items-center justify-between mb-8 pb-8 border-b border-white/20">
      <div>
        <div class="text-7xl font-bold mb-2">
          {{ Math.round(weather.main.temp) }}°C
        </div>
        <p class="text-2xl capitalize text-blue-100">
          {{ weather.weather[0].description }}
        </p>
        <p class="text-blue-200 text-sm mt-2">
          Érzett: {{ Math.round(weather.main.feels_like) }}°C
        </p>
      </div>
      <div class="text-8xl">
        {{ getWeatherEmoji(weather.weather[0].main) }}
      </div>
    </div>

    <!-- Részletek grid -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="bg-white/10 rounded-xl p-4">
        <div class="text-blue-200 text-sm mb-1">💧 Páratartalom</div>
        <div class="text-2xl font-bold">{{ weather.main.humidity }}%</div>
      </div>

      <div class="bg-white/10 rounded-xl p-4">
        <div class="text-blue-200 text-sm mb-1">💨 Szélsebesség</div>
        <div class="text-2xl font-bold">{{ weather.wind.speed }} m/s</div>
      </div>

      <div class="bg-white/10 rounded-xl p-4">
        <div class="text-blue-200 text-sm mb-1">🌡️ Légnyomás</div>
        <div class="text-2xl font-bold">{{ weather.main.pressure }} hPa</div>
      </div>

      <div class="bg-white/10 rounded-xl p-4">
        <div class="text-blue-200 text-sm mb-1">👁️ Látótávolság</div>
        <div class="text-2xl font-bold">{{ (weather.visibility / 1000).toFixed(1) }} km</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  weather: {
    type: Object,
    required: true
  }
})

const currentDate = computed(() => {
  return new Date().toLocaleDateString('hu-HU', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

const getWeatherEmoji = (condition) => {
  const emojiMap = {
    Clear: '☀️',
    Clouds: '☁️',
    Rain: '🌧️',
    Drizzle: '🌦️',
    Thunderstorm: '⛈️',
    Snow: '❄️',
    Mist: '🌫️',
    Fog: '🌫️'
  }
  return emojiMap[condition] || '🌤️'
}
</script>

