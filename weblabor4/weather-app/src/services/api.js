import axios from 'axios'

// FONTOS: Cseréld le a saját Firebase projekt URL-re!
const FUNCTION_BASE_URL = 'https://us-central1-YOUR-PROJECT-ID.cloudfunctions.net'

export const fetchWeather = async (city) => {
  try {
    const response = await axios.get(`${FUNCTION_BASE_URL}/getWeather`, {
      params: { city }
    })
    return response.data
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.error || 'Város nem található')
    }
    throw new Error('Hálózati hiba történt')
  }
}

export const fetchHistory = async () => {
  try {
    const response = await axios.get(`${FUNCTION_BASE_URL}/getSearchHistory`)
    return response.data
  } catch (error) {
    console.error('History fetch error:', error)
    return []
  }
}


