const express = require("express");
const cors = require("cors");
const mqtt = require("mqtt");
const bodyParser = require("body-parser");

let data = "";
const app = express();
const port = 3000;
const clientId = "mqttjs_" + Math.random().toString(8).substr(2, 4);
const options = {
  username: "",
  password: "",
  clientId,
};
const client = mqtt.connect("http://localhost:1883", options);
const corsOptions = {
  origin: "http://localhost:3001",
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.set("views", "./views");

// Ruta de inicio
app.post("/", (req, res) => {
  console.log(req.body);
  const mensaje = req.body.mensaje;

  // Publica el mensaje en el tópico
  client.publish("test/topic", mensaje);
  res.send(data);
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor iniciado en http://localhost:${port}`);
});

// Manejar eventos de conexión
client.on("connect", () => {
  console.log("Conexión MQTT establecida");
  // Suscribirse a un tema
  client.subscribe("test/topic", (err) => {
    if (err) {
      console.error("Error al suscribirse al tema", err);
    } else {
      console.log("Suscripción al tema exitosa");
    }
  });
});

// Manejar mensajes recibidos
client.on("message", (topic, message) => {
  data = message.toString();
  console.log(`Mensaje recibido en el tema ${topic}: ${message.toString()}`);
});
