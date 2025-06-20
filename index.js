const mineflayer = require('mineflayer');

// Crear el bot
const bot = mineflayer.createBot({
  host: 'Prueba-8qyM.aternos.me',
  port: 23001,
  username: 'Bot24_7',
  version: '1.20.1' // Versión compatible con Mineflayer
});

bot.on('spawn', () => {
  console.log('✅ Bot conectado al servidor');

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

bot.on('error', (err) => {
  console.log('❌ Error:', err);
});

bot.on('end', () => {
  console.log('📤 Bot desconectado, intentando reconectar...');
  setTimeout(() => {
    require('child_process').spawn(process.argv.shift(), process.argv, {
      cwd: process.cwd(),
      detached: true,
      stdio: 'inherit'
    });
    process.exit();
  }, 5000);
});

// Servidor web para evitar que Render apague el bot
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('🤖 Bot Mineflayer activo 24/7');
});

app.listen(port, () => {
  console.log(`🌐 Servidor web activo en el puerto ${port}`);
});
        
