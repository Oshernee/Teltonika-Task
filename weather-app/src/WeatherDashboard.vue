<template>
  <section class="section">
    <div class="container">
      <div style="display:flex; align-items:center; width:100%; padding-bottom: 1.5rem;">
        <input
          v-model="searchQuery"
          placeholder="Search by city or country name..."
          class="input is-medium"
          style="
            flex:1;
            margin-right:5rem;
            border-radius:9999px;
            padding:0.75rem 1rem;
          "
        />
        <button
          @click="openAddModal"
          class="button is-info is-medium"
          style="
            border-radius:9999px;
            padding:0.75rem 1.5rem;
          "
        >
          <span class="icon"><i class="fas fa-plus"></i></span>
          <span>Add Location</span>
        </button>
      </div>
      <div v-if="weatherList.length === 0" class="has-text-centered">
        <p>No forecasts added yet. Use the search above to add a location.</p>
      </div>
      <div v-else>
        <table class="table is-fullwidth is-striped is-hoverable">
          <thead>
            <tr>
              <th>City</th>
              <th>Country</th>
              <th>Icon</th>
              <th>Temp (°C)</th>
              <th>Humidity (%)</th>
              <th>Wind (m/s)</th>
              <th>Pressure (hPa)</th>
              <th>Sunrise</th>
              <th>Sunset</th>
              <th>Remove</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(w, i) in paginatedForecasts" :key="w.id">
              <td>{{ w.name }}</td>
              <td>{{ w.country }}</td>
              <td>
                <img
                  :src="`https://openweathermap.org/img/wn/${w.icon}@2x.png`"
                  class="weather-icon"
                  :alt="w.description"
                  width="40"
                  height="40"
                />
              </td>
              <td>{{ w.temp.toFixed(1) }}</td>
              <td>{{ w.humidity }}</td>
              <td>{{ w.windSpeed }}</td>
              <td>{{ w.pressure }}</td>
              <td>{{ new Date(w.sunrise * 1000).toLocaleTimeString() }}</td>
              <td>{{ new Date(w.sunset * 1000).toLocaleTimeString() }}</td>
              <td>
                <button
                  class="button is-danger is-small is-rounded"
                  @click="removeForecast((currentPage - 1) * pageSize + i)"
                >
                  ✕
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <nav
          class="pagination is-centered"
          role="navigation"
          aria-label="pagination"
          v-if="pageCount > 1"
        >
          <a
            class="pagination-previous"
            @click="prevPage"
            :class="{ 'is-disabled': currentPage === 1 }"
          >
            Previous
          </a>
          <a
            class="pagination-next"
            @click="nextPage"
            :class="{ 'is-disabled': currentPage === pageCount }"
          >
            Next
          </a>
          <ul class="pagination-list">
            <li v-for="p in pagesArray" :key="p">
              <a
                class="pagination-link"
                :class="{ 'is-current': p === currentPage }"
                @click="gotoPage(p)"
              >
                {{ p }}
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </section>
  <AddForecastModal v-if="showModal" @close="closeAddModal" />
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import AddForecastModal from './components/AddForecastModal.vue'
import { useForecasts } from './composables/useForecasts'

const { weatherList, loadAllForecasts, removeForecast, refreshForecasts } = useForecasts()

const searchQuery = ref('')
const showModal = ref(false)

const filteredForecasts = computed(() => {
  if (!searchQuery.value.trim()) {
    return weatherList.value
  }
  const q = searchQuery.value.trim().toLowerCase()
  return weatherList.value.filter(w =>
    w.name.toLowerCase().includes(q) || w.country.toLowerCase().includes(q)
  )
})

const pageSize = 10
const currentPage = ref(1)
const pageCount = computed(() => Math.ceil(filteredForecasts.value.length / pageSize))
const paginatedForecasts = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredForecasts.value.slice(start, start + pageSize)
})

const pagesArray = computed(() =>
  Array.from({ length: pageCount.value }, (_, i) => i + 1)
)

function gotoPage(page: number) {
  if (page >= 1 && page <= pageCount.value) {
    currentPage.value = page
  }
}

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

function nextPage() {
  if (currentPage.value < pageCount.value) {
    currentPage.value++
  }
}

function openAddModal() {
  showModal.value = true
}

function closeAddModal() {
  showModal.value = false
}

let refreshInterval: number

onMounted(async () => {
  await loadAllForecasts()
  refreshInterval = window.setInterval(() => {
    refreshForecasts()
  }, 300000)
})

onUnmounted(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval)
  }
})

watch(
  () => weatherList.value.length,
  () => {
    if (currentPage.value > pageCount.value) {
      currentPage.value = pageCount.value
    }
  }
)
</script>
