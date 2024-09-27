const express = require('express');
const cors = require('cors');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const qrcodeTerminal = require('qrcode-terminal');
const bodyParser = require('body-parser');

const app = express();
app.use(cors()); // Habilitar CORS para todas las rutas
app.use(bodyParser.json()); // Para poder leer el cuerpo de las solicitudes JSON
app.use(bodyParser.urlencoded({ extended: true }));


// Configuración de WhatsApp Web
const client = new Client({
    authStrategy: new LocalAuth()
});

let latestQr = ''; // Variable para almacenar el último código QR generado

// Evento para manejar el código QR
client.on('qr', async (qr) => {
    try {
        // Generar QR en formato imagen
        const qrImage = await qrcode.toDataURL(qr);
        console.log(`Access the QR code at: https://mensajesalus.onrender.com/qr`);

        // Generar QR en la terminal
        console.log('Escanea este código QR para iniciar sesión en WhatsApp:');
        qrcodeTerminal.generate(qr, { small: true });

        // Guardar el último código QR generado
        latestQr = qr;
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
    console.log('POST request received at /send-message');
    console.log('Request body:', req.body);

    const message = req.body.message;
    const chatId = '5492645161444@c.us';

    if (!message) {
        console.log('No message provided in the request');
        return res.status(400).json({ error: 'Mensaje no proporcionado' });
    }

    client.sendMessage(chatId, message)
        .then(() => {
            console.log('Mensaje enviado con éxito');
            res.json({ message: 'Mensaje enviado con éxito' });
        })
        .catch((err) => {
            console.error('Error al enviar el mensaje:', err);
            res.status(500).json({ error: 'Error al enviar el mensaje', details: err.message });
        });
});


// Ruta para acceder al QR en formato de imagen
app.get('/qr', async (req, res) => {
    try {
        // Usar el último código QR generado
        const qrImage = await qrcode.toDataURL(latestQr);
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

