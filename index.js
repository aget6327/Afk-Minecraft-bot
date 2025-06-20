const mineflayer = require('mineflayer');
const express = require('express');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

// === CONFIGURACIÓN DEL WEBHOOK DE DISCORD ===
const webhookURL = 'https://discord.com/api/webhooks/1385458533461393438/Sqh575Q4jnIQmZhKWwj7RFTGYHlojpcK84uFhJ2xQFRxYqoT9L4WQbrYhk5_n2t2uLSs';

// Función para enviar embeds bonitos a Discord
function enviarLogDiscordEmbed(titulo, descripcion, color = 0x57F287) {
  fetch(webhookURL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      embeds: [{
        title: titulo,
        description: descripcion,
        color: color,
        timestamp: new Date().toISOString()
      }]
    })
  }).catch(console.error);
}

// === BOT MINEFLAYER ===
const bot = mineflayer.createBot({
  host: 'Prueba-8qyM.aternos.me',
  port: 23001,
  username: 'Bot24_7',
  version: '1.20.1'
});

bot.on('spawn', () => {
  console.log('✅ Bot conectado al servidor Minecraft');
  enviarLogDiscordEmbed('✅ Bot Conectado', 'El bot se ha conectado exitosamente al servidor.');

  // Saltar cada 2 segundos
  setInterval(() => {
    bot.setControlState('jump', true);
    setTimeout(() => bot.setControlState('jump', false), 500);
  }, 2000);

  // Enviar mensaje en el chat cada 10 minutos
  setInterval(() => {
    bot.chat('✅ Bot activo 24/7');
  }, 10 * 60 * 1000);
});

bot.on('error', (err) => {
  console.log('❌ Error en el bot:', err);
  enviarLogDiscordEmbed('❌ Error detectado', `**Mensaje:** ${err.message}`, 0xED4245);
});

bot.on('end', () => {
  console.log('🔄 Bot desconectado. Intentando reconectar...');
  enviarLogDiscordEmbed('🔄 Bot desconectado', 'El bot se desconectó y se intentará reconectar en 5 segundos.', 0xFEE75C);

  setTimeout(() => {
    require('child_process').spawn(process.argv.shift(), process.argv, {
      cwd: process.cwd(),
      detached: true,
      stdio: 'inherit'
    });
    process.exit();
  }, 5000);
});

// === SERVIDOR WEB PARA UPTIMEROBOT ===
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  const hora = new Date().toLocaleTimeString('es-MX');
  res.send('🤖 Bot activo. Visita detectada desde UptimeRobot');

  enviarLogDiscordEmbed(
    '🟢 UptimeRobot activo',
    `Se detectó una visita de monitoreo a las **${hora}**.\nEl bot está funcionando correctamente.`
  );
});

app.listen(port, () => {
  console.log(`🌍 Servidor web activo en puerto ${port}`);
});
        
