require("dotenv").config();
const {
  inquirerMenu,
  pausa,
  leerInput,
  listarLugares,
} = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");

//console.log(process.env);
const main = async () => {
  const busquedas = new Busquedas();
  let opt;

  do {
    opt = await inquirerMenu();

    switch (opt) {
      case 1:
        //Mostrar mensaje
        const termino = await leerInput("Ciudad: ");
        //Buscar los lugares
        const lugares = await busquedas.ciudad(termino);
        //Seleccionar Lugar
        const idSeleccionado = await listarLugares(lugares);
        if (idSeleccionado === "0") continue;

        const lugarSeleccionado = lugares.find(
          (lugar) => lugar.id == idSeleccionado
        );
        //Guardar en DB
        busquedas.agregarHistorial(lugarSeleccionado.nombre);
        //clima
        const clima = await busquedas.getWeather(
          lugarSeleccionado.lat,
          lugarSeleccionado.lng
        );

        //Mostrar resultados
        console.clear();
        console.log("Informacion de la ciudad \n".green);
        console.log(`Ciudad: ${lugarSeleccionado.nombre.green}`);
        console.log(`Lat: ${lugarSeleccionado.lat}`);
        console.log(`Lng: ${lugarSeleccionado.lng}`);
        console.log(`Temperatura: ${clima.temp}`);
        console.log(`Min: ${clima.min}`);
        console.log(`Max: ${clima.max}`);
        console.log(`Como esta el clima: ${clima.desc}`);

        break;
      case 2:
        busquedas.historial.forEach((lugar, i) => {
          const idx = `${i + 1}.`.green;
          console.log(`${idx} ${lugar}`);
        });
        break;
    }

    if (opt !== 0) await pausa();
  } while (opt !== 0);
};

main();
