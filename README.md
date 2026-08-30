# Fidenz Weather App

## Project Contents

This project has two repositories:

1. The **frontend** has the Vite/React Application, the setup process is straight forward, copy the contents inside the ```.env.example``` file to the ```.env``` file, ```npm install``` to install all the packages before you run the application with ```npm run dev``` command.

2. The **backend** is an Express.js based Application, for the setup process for this repository is the same as the **frontend**, all you have to do is copy the ```.env.example``` file to the ```.env``` again, ```npm install``` to install all the packages before you run the server finally with ```npm run server```.

## Technologies Used

- **TypeScript**
- **Vite/React**
- **TailwindCSS**
- **Node.js**

## Two Local Processes

- Vite Frontend: `http://localhost:5173`
- Express API: `http://localhost:3001`

## Comfort Index Justification

- The Comfort Index is a custom simplified model inspired by established thermal-comfort concepts. 
- Temperature is given the highest weight because it is a primary environmental factor in thermal comfort. 
- Relative humidity is incorporated because it affects evaporative cooling and perceived heat. 
- Wind speed is considered because air movement influences heat exchange, 
- While cloudiness is assigned a smaller weight because it is an indirect factor. 
- The model is simplified because of the requirements of this assignment 
- And the available OpenWeatherMap data does not provide all variables required by comprehensive thermal-comfort models such as UTCI.

| Factor | Condition | Ideal Range | Tolerance | Weight |
|--------|-----------|-------------|-----------|--------|
| Temperature | All | 20–26°C | 15° | 55% |
| Humidity | All | 40–60% | 40% | 20% |
| Wind Speed | Warm (≥24°C) | ≤3 m/s | 10 m/s | 15% |
| Wind Speed | Cool (<24°C) | ≤1.5 m/s | 8 m/s | 15% |
| Cloudiness | Hot (≥28°C) | 20–70% | 40% | 10% |
| Cloudiness | Moderate (<28°C) | 0–50% | 50% | 10% |