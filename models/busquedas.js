const fs = require("node:fs");
const axios = require("axios");

class Busquedas {
  historial = [];
  dbPath = "./db/database.json";

  constructor() {
    //TODO: leer DB si existe
  }

  get paramsMapbox() {
    return {
      access_token: process.env.MAPBOX_KEY,
      limit: 5,
      language: "es",
    };
  }

  get paramsOpenWeather() {
    return {
      appid: process.env.OPENWEATHER_KEY,
      units: "metric",
      lang: "es",
    };
  }

  async ciudad(lugar = "") {
    try {
      const instance = axios.create({
        baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
        params: this.paramsMapbox,
        timeout: 1000,
        //headers: { "X-Custom-Header": "foobar" },
      });

      const resp = await instance.get();

      return resp.data.features.map((lugar) => ({
        id: lugar.id,
        nombre: lugar.place_name,
        lng: lugar.center[0],
        lat: lugar.center[1],
      }));
    } catch (error) {
      return [];
    }
  }

  async getWeather(lat, lon) {
    try {
      console.log(process.env.OPENWEATHER_KEY);
      const instance = axios.create({
        baseURL: `https://api.openweathermap.org/data/2.5/weather`,
        params: { ...this.paramsOpenWeather, lat, lon },
      });

      const resp = await instance.get();

      const { weather, main } = resp.data;

      return {
        desc: weather[0]?.description,
        min: main.temp_min,
        max: main.temp_max,
        temp: main.temp,
      };
    } catch (error) {
      console.log(error);
    }
  }

  agregarHistorial(lugar = "") {
    console.log(lugar);
    //prevenir duplicados
    if (this.historial.includes(lugar.toLocaleLowerCase)) return;
    //Como solo quiero tener 5, insertare al inicio
    //del arreglo los otros van saliendo
    this.historial.unshift(lugar.toLowerCase());

    //Guardar en DB
    this.guardarDB();
  }

  guardarDB() {
    const payload = {
      historial: this.historial,
    };
    console.log(payload);
    fs.writeFileSync(this.dbPath, JSON.stringify(payload));
  }

  leerBD() {}
}

module.exports = Busquedas;
