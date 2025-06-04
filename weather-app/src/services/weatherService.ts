import axios from 'axios';
import type { OWMWeatherResponse, WeatherData, SavedLocation } from '../types/weather';

const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const API_KEY = import.meta.env.VITE_API_KEY as string;

function transformResponse(data: OWMWeatherResponse): WeatherData {
  return {
    id: data.id,
    name: data.name,
    country: data.sys.country,
    description: data.weather[0]?.description || '',
    icon: data.weather[0]?.icon || '01d',
    temp: data.main.temp,
    humidity: data.main.humidity,
    windSpeed: data.wind.speed,
    pressure: data.main.pressure,
    sunrise: data.sys.sunrise,
    sunset: data.sys.sunset
  };
}

export async function fetchWeatherForLocation(loc: SavedLocation): Promise<WeatherData> {
  const params: Record<string, string | number> = {
    appid: API_KEY,
    units: 'metric'
  };

  if (loc.type === 'city') {
    const cityQuery = loc.country
      ? `${loc.city},${loc.country}`
      : loc.city!;
    params.q = cityQuery; 
  } else if (loc.type === 'zip') {
    params.zip = `${loc.zip!},${loc.country!}`;
  } else {
    params.lat = loc.lat!;
    params.lon = loc.lon!;
  }

  const { data } = await axios.get<OWMWeatherResponse>(`${BASE_URL}/weather`, {params});

  return transformResponse(data);
}
