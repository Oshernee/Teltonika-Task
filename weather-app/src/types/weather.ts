export interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface OWMWeatherResponse {
  id: number;            
  name: string;          
  timezone: number;        
  sys: {
    country: string;         
    sunrise: number;          
    sunset: number;            
  };
  main: {
    temp: number;
    pressure: number;
    humidity: number;
  };
  wind: {
    speed: number;
    deg?: number;
  };
  weather: WeatherCondition[];  
  cod: number;                 
}

export interface WeatherData {
  id: number;
  name: string;
  country: string;
  description: string;
  icon: string;
  temp: number;
  humidity: number;
  windSpeed: number;
  pressure: number;
  sunrise: number;
  sunset: number;
}

export interface SavedLocation {
  type: 'city' | 'zip' | 'coords';
  city?: string;
  country?: string;
  zip?: string;
  lat?: number;
  lon?: number;
}
