const mineflayer = require('mineflayer');
const express = require('express');

// === CONFIGURA TU BOT MINEFLAYER ===
const bot = mineflayer.createBot({
  host: 'Prueba-8qyM.aternos.me', // IP de tu servidor Aternos
  port: 23001,                     // Puerto personalizado
  username: 'Bot24_7',             // Nombre del bot
  version: '1.20.1'                // Versión compatible
});

bot.on('spawn', () => {
  console.log('✅ Bot conectado al servidor Minecraft');

  // Saltar cada 2 segundos
  setInterval(() => {
    bot.setControlState('jump', true);
    setTimeout(() => bot.setControlState('jump', false), 500);
  }, 2000);

  // Enviar mensaje cada 10 minutos
  setInterval(() => {
    bot.chat('✅ Bot activo 24/7');
  }, 10 * 60 * 1000);
});

// Reconexión automática si se cae
bot.on('end', () => {
  console.log('🔄 Bot desconectado. Reintentando en 5 segundos...');
  setTimeout(() => {
    require('child_process').spawn(process.argv.shift(), process.argv, {
      cwd: process.cwd(),
      detached: true,
      stdio: 'inherit'
    });
    process.exit();
  }, 5000);
});

bot.on('error', (err) => {
  console.log('❌ Error en el bot:', err);
});

// === SERVIDOR EXPRESS PARA RENDER Y UPTIMEROBOT ===
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('🤖 Bot Mineflayer está activo y funcionando');
});

app.listen(port, () => {
  console.log(`🌐 Servidor web activo en http://localhost:${port}`);
});
