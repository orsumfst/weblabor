<template>
  <div id="app" class="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600">
    <div class="container mx-auto px-4 py-8">
      <header class="text-center mb-8">
        <h1 class="text-5xl font-bold text-white mb-2 flex items-center justify-center gap-3">
          <span>☁️</span>
          Időjárás App
        </h1>
        <p class="text-blue-100">Vue 3 + Firebase Cloud Functions</p>
      </header>

      <div class="max-w-2xl mx-auto">
        <!-- Keresés -->
        <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6 shadow-2xl">
          <div class="flex gap-3">
            <input
              v-model="searchCity"
              @keyup.enter="searchWeather"
              type="text"
              placeholder="Város neve (pl. Budapest)..."
              class="flex-1 px-4 py-3 bg-white/20 text-white placeholder-white/60 rounded-xl border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <button
              @click="searchWeather"
              :disabled="loading"
              class="px-6 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-all disabled:opacity-50"
            >
              {{ loading ? '⏳ Keresés...' : '🔍 Keresés' }}
            </button>
          </div>

          <div v-if="error" class="mt-4 p-3 bg-red-500/20 border border-red-300 rounded-lg text-white">
            {{ error }}
          </div>
        </div>

        <!-- Időjárás kártya -->
        <WeatherCard v-if="weather" :weather="weather" />

        <!-- Keresési előzmények -->
        <div v-if="history.length > 0" class="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mt-6 shadow-2xl">
          <h3 class="text-white font-semibold mb-3 flex items-center gap-2">
            <span>🕐</span>
            Keresési előzmények
          </h3>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="item in history"
              :key="item.id"
              @click="selectFromHistory(item.city)"
              class="px-3 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all"
            >
              {{ item.city }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import WeatherCard from './components/WeatherCard.vue'
import { fetchWeather, fetchHistory } from './services/api'

const searchCity = ref('')
const weather = ref(null)
const loading = ref(false)
const error = ref('')
const history = ref([])

const searchWeather = async () => {
  if (!searchCity.value.trim()) {
    error.value = 'Kérlek adj meg egy várost!'
    return
  }

  loading.value = true
  error.value = ''

  try {
    const data = await fetchWeather(searchCity.value)
    weather.value = data
    loadHistory()
  } catch (err) {
    error.value = err.message || 'Hiba történt az időjárás lekérésekor'
  } finally {
    loading.value = false
  }
}

const selectFromHistory = (city) => {
  searchCity.value = city
  searchWeather()
}

const loadHistory = async () => {
  try {
    const data = await fetchHistory()
    history.value = data
  } catch (err) {
    console.error('Előzmények betöltése sikertelen:', err)
  }
}

onMounted(() => {
  loadHistory()
})
</script>