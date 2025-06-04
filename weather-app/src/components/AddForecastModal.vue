<template>
  <div class="modal is-active">
    <div class="modal-background" @click="closeModal"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Add New Forecast</p>
        <button class="delete" aria-label="close" @click="closeModal"></button>
      </header>
      <section class="modal-card-body">
        <div class="field">
          <label class="label">Lookup by</label>
          <div class="control">
            <div class="select is-fullwidth">
              <select v-model="selectedType">
                <option value="city">City Name</option>
                <option value="zip">ZIP Code</option>
                <option value="coords">Coordinates</option>
              </select>
            </div>
          </div>
        </div>
        <div v-if="selectedType === 'city'">
          <div class="field">
            <label class="label">City Name</label>
            <div class="control">
              <input class="input" type="text" placeholder="e.g. London" v-model.trim="cityName" />
            </div>
          </div>
          <div class="field">
            <label class="label">Country Code (optional)</label>
            <div class="control">
              <input class="input" type="text" placeholder="e.g. US or GB" v-model.trim="countryCodeCity" />
            </div>
            <p class="help">ISO 2-letter country code (optional for city lookup)</p>
          </div>
        </div>
        <div v-if="selectedType === 'zip'">
          <div class="field">
            <label class="label">ZIP Code</label>
            <div class="control">
              <input class="input" type="text" placeholder="e.g. 94040" v-model.trim="zipCode" />
            </div>
          </div>
          <div class="field">
            <label class="label">Country Code</label>
            <div class="control">
              <input class="input" type="text" placeholder="e.g. US" v-model.trim="countryCodeZip" />
            </div>
            <p class="help">Country code is required for ZIP lookup</p>
          </div>
        </div>
        <div v-if="selectedType === 'coords'">
          <div class="field">
            <label class="label">Latitude</label>
            <div class="control">
              <input class="input" type="number" step="any" placeholder="e.g. 37.389" v-model.trim="lat" />
            </div>
          </div>
          <div class="field">
            <label class="label">Longitude</label>
            <div class="control">
              <input class="input" type="number" step="any" placeholder="e.g. -122.083" v-model.trim="lon" />
            </div>
          </div>
          <p class="help">Provide latitude and longitude in decimal format</p>
        </div>
      </section>
      <footer class="modal-card-foot">
        <button class="button is-success" :disabled="submitting" @click="submit">
          <span v-if="submitting" class="loader mr-2"></span>
          Add
        </button>
        <button class="button" @click="closeModal">Cancel</button>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useForecasts } from '../composables/useForecasts'
import type { SavedLocation } from '../types/weather'   
import { useNotifications } from '../composables/useNotifications'

const emit = defineEmits<{
  (e: 'close'): void
}>()

const selectedType = ref<'city' | 'zip' | 'coords'>('city')
const cityName = ref('')
const countryCodeCity = ref('')
const zipCode = ref('')
const countryCodeZip = ref('')
const lat = ref('')
const lon = ref('')
const submitting = ref(false)

const { addNotification } = useNotifications()  

function closeModal() {
  if (!submitting.value) {
    emit('close')
  }
}

async function submit() {
  if (selectedType.value === 'city') {
    if (!cityName.value) {
      addNotification('City name is required.', 'error')
      return
    }
  } 
  else if (selectedType.value === 'zip') {
    if (!zipCode.value || !countryCodeZip.value) {
      addNotification('ZIP code and country code are required.', 'error')
      return
    }
  } 
  else {
    if (!lat.value || !lon.value) {
      addNotification('Both latitude and longitude are required.', 'error')
      return
    }
    const latNum = parseFloat(lat.value)
    const lonNum = parseFloat(lon.value)
    if (isNaN(latNum) || isNaN(lonNum) || latNum < -90 || latNum > 90 || lonNum < -180 || lonNum > 180) {
      addNotification('Please enter valid latitude and longitude values.', 'error')
      return
    }
  }

  let newLocation: SavedLocation

  if (selectedType.value === 'city') {
    newLocation = {
      type: 'city',
      city: cityName.value.trim(),
      country: countryCodeCity.value.trim().toUpperCase() || undefined
    }
  } else if (selectedType.value === 'zip') {
    newLocation = {
      type: 'zip',
      zip: zipCode.value.trim(),
      country: countryCodeZip.value.trim().toUpperCase()
    }
  } else {
    newLocation = {
      type: 'coords',
      lat: parseFloat(lat.value),
      lon: parseFloat(lon.value)
    }
  }

  submitting.value = true
  const success = await useForecasts().addForecast(newLocation)
  submitting.value = false

  if (success) {
    emit('close')
  }
}
</script>
