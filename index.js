const express = require('express');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    authStrategy: new LocalAuth()
});

const app = express();
app.use(express.json()); // Para poder recibir JSON en las solicitudes

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Cliente listo');
});

// Endpoint para enviar mensajes
app.post('/send-message', (req, res) => {
    const { number, message } = req.body; // Extrae número y mensaje del cuerpo de la solicitud
    
    client.sendMessage(`${number}@c.us`, message)
        .then(response => {
            res.json({ status: 'success', response });
        })
        .catch(error => {
            res.json({ status: 'error', error });
        });
});

client.initialize();

// Inicia el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

