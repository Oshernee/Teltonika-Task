import { ref } from 'vue';
import type { SavedLocation, WeatherData } from '../types/weather';
import { fetchWeatherForLocation } from '../services/weatherService';
import { useNotifications } from './useNotifications';

const savedLocations = ref<SavedLocation[]>([]); 
const weatherList = ref<WeatherData[]>([]);      

const stored = localStorage.getItem('weatherLocations');
if (stored) {
  try {
    savedLocations.value = JSON.parse(stored);
  } catch (e) {
    savedLocations.value = [];
  }
}

const { addNotification } = useNotifications();

async function loadAllForecasts(): Promise<void> {
  weatherList.value = [];
  for (const loc of savedLocations.value) {
    try {
      const data = await fetchWeatherForLocation(loc);
      weatherList.value.push(data);
    } catch (err: any) {
      const locName = loc.type === 'city' ? loc.city : loc.type === 'zip' ? `${loc.zip}, ${loc.country}` : `(${loc.lat}, ${loc.lon})`;
      addNotification(`Failed to load weather for ${locName}`, 'error');
    }
  }
}

async function addForecast(newLoc: SavedLocation): Promise<boolean> {
  try {
    const data = await fetchWeatherForLocation(newLoc);
    if (weatherList.value.some(w => w.id === data.id)) {
      addNotification(`${data.name}, ${data.country} is already added.`, 'error');
      return false;
    }
    if (newLoc.type === 'city') {
      newLoc.country = data.country;
    }
    savedLocations.value.push(newLoc);
    localStorage.setItem('weatherLocations', JSON.stringify(savedLocations.value));
    weatherList.value.push(data);
    addNotification(`Added forecast for ${data.name}, ${data.country}`, 'success');
    return true;
  } catch (err: any) {
    if (err.response && err.response.status === 404) {
      addNotification(`Location not found. Please check the input and try again.`, 'error');
    } else {
      addNotification(`Failed to fetch weather data. Please try again.`, 'error');
    }
    return false;
  }
}

function removeForecast(index: number): void {
  const removedData = weatherList.value[index];
  weatherList.value.splice(index, 1);
  savedLocations.value.splice(index, 1);
  localStorage.setItem('weatherLocations', JSON.stringify(savedLocations.value));
  if (removedData) {
    addNotification(`Removed forecast for ${removedData.name}, ${removedData.country}`, 'success');
  }
}

async function refreshForecasts(): Promise<void> {
  const promises = savedLocations.value.map((loc, index) =>
    fetchWeatherForLocation(loc)
      .then(data => {
        weatherList.value[index] = data;
      })
      .catch(err => {
        const locationName = weatherList.value[index]?.name || 'location';
        addNotification(`Failed to refresh data for ${locationName}`, 'error');
      })
  );
  await Promise.all(promises);
}

export function useForecasts() {
  return {
    savedLocations,
    weatherList,
    loadAllForecasts,
    addForecast,
    removeForecast,
    refreshForecasts
  };
}
