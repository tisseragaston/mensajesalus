const express = require('express');
const cors = require('cors');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const bodyParser = require('body-parser');

const app = express();
app.use(cors()); // Habilitar CORS para todas las rutas
app.use(bodyParser.json()); // Para poder leer el cuerpo de las solicitudes JSON

// Configuración de WhatsApp Web
const client = new Client({
    authStrategy: new LocalAuth()
});

// Evento para manejar el código QR
client.on('qr', async (qr) => {
    try {
        const qrImage = await qrcode.toDataURL(qr);
        console.log(`QR Code generated: ${qrImage}`);
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
    const message = req.body.message;
    const chatId = '5492645161444@c.us';

    client.sendMessage(chatId, message).then(response => {
        res.json({ message: 'Mensaje enviado' });
    }).catch(err => {
        console.error('Error al enviar el mensaje:', err);
        res.status(500).json({ error: 'Error al enviar el mensaje' });
    });
});

// Ruta para acceder al QR en formato de imagen
app.get('/qr', async (req, res) => {
    try {
        const qrImage = await qrcode.toDataURL(qr);
        res.send(`<img src="${qrImage}" alt="QR Code">`);
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

const http = require('http');

// Espera 5 minutos (300000 ms) antes de empezar a enviar pings
setTimeout(() => {
    setInterval(() => {
        http.get('https://mensajesalus.onrender.com'); // Cambia a tu URL de producción
        console.log('Ping enviado al servidor para mantenerlo activo.');
    }, 60000); // 1 minuto
}, 600000); // Espera 10 minutos

