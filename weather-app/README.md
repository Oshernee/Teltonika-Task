Weather Dashboard App
=====================

Table of Contents
-----------------

-   [About The Project](#about-the-project)

    -   [Built With](#built-with)

-   [Getting Started](#getting-started)

    -   [Prerequisites](#prerequisites)

    -   [Installation](#installation)

-   [Usage](#usage)

About The Project
-----------------

A responsive weather dashboard built with Vue 3 and TypeScript that allows users to search for and save multiple locations. The app fetches live data from the OpenWeatherMap API and displays current conditions, including temperature, humidity, wind speed, and a brief description. Users can add or remove forecasts through modal dialogs, and real-time notifications inform them of success or errors.

Here's why this project exists:

-   You should be able to see current weather for any city or ZIP code in one place.

-   Saved locations persist between sessions, so you don't need to re-enter them every time.

-   Live notifications provide feedback (e.g., when a city is not found).

### Built With

-   [Vue 3](https://vuejs.org/) (Composition API, Single File Components)

-   [TypeScript](https://www.typescriptlang.org/)

-   [Vite](https://vitejs.dev/)

-   [Sass](https://sass-lang.com/) (for styling)

-   OpenWeatherMap API (weather data provider)

-   [Axios](https://axios-http.com/) (HTTP client)

Getting Started
---------------

Follow these instructions to set up and run the project locally.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v14 or higher recommended)

-   npm (comes bundled with Node.js) or Yarn

### Installation

1.  **Clone the repository**

    bash

    CopyEdit

    `git clone https://github.com/your-username/weather-dashboard.git
    cd weather-dashboard`

2.  **Install dependencies**

    bash

    CopyEdit

    `npm install

3.  **Set up environment variables**\
    Create a `.env` file in the root directory containing your OpenWeatherMap API key:

    ini

    CopyEdit

    `VITE_API_KEY=your_openweathermap_api_key`

    Replace `your_openweathermap_api_key` with a valid key from [OpenWeatherMap](https://openweathermap.org/).

4.  **Run the development server**

    bash

    CopyEdit

    `npm run dev

    The app will be available at `http://localhost:5173` (or another port displayed in the terminal).

5.  **Build for production**

    bash

    CopyEdit

    `npm run build

    Production-ready assets will be generated in the `dist/` folder.

6.  **Run on HTTP**

    bash

    CopyEdit

    `npx http-server ./dist

    Production-ready assets will be generated in the `dist/` folder.

Usage
-----

Once the app is running locally:

1.  **Search for a location**

    -   Click the **Add Forecast** button to open a modal where you can enter a city name (e.g., "Paris") or ZIP code (e.g., "10001,US").

    -   Submit to fetch the current weather for that location.

2.  **View saved forecasts**

    -   All added locations appear in a dashboard table with their current temperature, humidity, wind speed, and a weather icon.

    -   The list of saved locations is persisted in `localStorage`, so it stays even if you close the browser.

3.  **Refresh or remove entries**

    -   Click the **Refresh** button next to any row to fetch the latest data for that location.

    -   Click the **Remove** (trash icon) to delete a location from the list.

4.  **Notifications**

    -   Success notifications confirm that a location was added or data was refreshed.

    -   Error notifications alert you if a location cannot be found or if the API call fails. Notifications auto-dismiss after 5 seconds.
