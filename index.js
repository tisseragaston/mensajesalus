const express = require('express');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcodeTerminal = require('qrcode-terminal');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json()); // Para poder leer el cuerpo de las solicitudes JSON

// Configuración de WhatsApp Web
const client = new Client({
    authStrategy: new LocalAuth()
});

// Evento para manejar el código QR
client.on('qr', (qr) => {
    // Mostrar el código QR en la terminal
    qrcodeTerminal.generate(qr, { small: true });
    console.log('QR Code generado. Escanea el código en WhatsApp.');
});

// Evento que se dispara cuando el cliente está listo
client.on('ready', () => {
    console.log('Cliente listo');
});

// Ruta para manejar el envío de mensajes
app.post('/send-message', (req, res) => {
    const message = req.body.message; // Toma el mensaje del cuerpo de la solicitud
    const chatId = '5492645161444@c.us'; // Cambia esto al ID del chat o número de teléfono de destino

    client.sendMessage(chatId, message).then(response => {
        res.json({ message: 'Mensaje enviado' });
    }).catch(err => {
        console.error(err);
        res.status(500).json({ error: 'Error al enviar el mensaje' });
    });
});

// Inicia el cliente y el servidor
client.initialize();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
