const express = require('express');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json()); // Para poder leer el cuerpo de las solicitudes JSON

// Configuración de WhatsApp Web
const client = new Client({
    authStrategy: new LocalAuth()
});

// Evento para manejar el código QR
client.on('qr', async (qr) => {
    try {
        // Generar el QR como imagen de datos
        const qrImage = await qrcode.toDataURL(qr);
        console.log(`QR Code generated: ${qrImage}`); // Muestra la URL en el log
        // Puedes también agregar una ruta para mostrar el QR
        console.log(`Access the QR code at: https://mensajesalus.onrender.com/qr`);
    } catch (err) {
        console.error('Error generating QR code:', err);
    }
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

// Ruta para acceder al QR en formato de imagen
app.get('/qr', async (req, res) => {
    try {
        const qrImage = await qrcode.toDataURL(qr); // Genera el QR
        res.send(`<img src="${qrImage}" alt="QR Code">`); // Muestra el QR como imagen
    } catch (err) {
        res.status(500).send('Error generating QR image.');
    }
});

// Inicia el cliente y el servidor
client.initialize();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});