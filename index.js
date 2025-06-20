const mineflayer = require('mineflayer');
const express = require('express');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

// === CONFIGURACIÓN DEL WEBHOOK DE DISCORD ===
const webhookURL = 'https://discord.com/api/webhooks/1385458533461393438/Sqh575Q4jnIQmZhKWwj7RFTGYHlojpcK84uFhJ2xQFRxYqoT9L4WQbrYhk5_n2t2uLSs';

// Función para enviar embeds a Discord
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

let bot;
let ultimoTick = null;

function crearBot() {
  bot = mineflayer.createBot({
    host: 'Prueba-8qyM.aternos.me',
    port: 23001,
    username: 'FK24_7',
    version: '1.20.1'
  });

  bot.on('spawn', () => {
    console.log('✅ Bot conectado al servidor Minecraft');
    enviarLogDiscordEmbed('✅ Bot Conectado', 'El bot se ha conectado correctamente al servidor.');

    // Guardar tick para detectar congelamiento
    ultimoTick = bot.time.age;

    // Saltar cada 1 minuto
    setInterval(() => {
      bot.setControlState('jump', true);
      setTimeout(() => bot.setControlState('jump', false), 500);
    }, 60 * 1000);

    // Enviar mensaje al chat cada 10 minutos
    setInterval(() => {
      bot.chat('✅ Bot activo 24/7');
    }, 10 * 60 * 1000);

    // Detectar si el bot se congela (cada 1 minuto)
    setInterval(() => {
      if (!bot || !bot.time || bot.time.age === ultimoTick) {
        console.log('🧊 Bot congelado. Reiniciando...');
        enviarLogDiscordEmbed(
          '🧊 Bot congelado',
          'El bot no respondió en el último minuto. Reiniciando...',
          0xED4245
        );
        process.exit(); // Render reinicia automáticamente
      }
      ultimoTick = bot.time.age;
    }, 60 * 1000);

    // 👋 Detectar cuando un jugador entra
    bot.on('playerJoined', (player) => {
      if (!player || !player.username || player.username === bot.username) return;

      const nombre = player.username;
      const total = Object.keys(bot.players).length;

      bot.chat(`👋 Bienvenido, ${nombre}`);
      bot.chat(`📊 Actualmente hay ${total} jugador(es) en el servidor`);

      console.log(`👤 ${nombre} se unió al servidor.`);

      enviarLogDiscordEmbed(
        '👤 Jugador conectado',
        `El jugador **${nombre}** entró al servidor.\n📊 Jugadores conectados: **${total}**`,
        0x3498DB
      );
    });

    // 👋 Detectar cuando un jugador se va
    bot.on('playerLeft', (player) => {
      if (!player || !player.username || player.username === bot.username) return;

      const nombre = player.username;
      const total = Object.keys(bot.players).length - 1;

      console.log(`👋 ${nombre} salió del servidor.`);

      enviarLogDiscordEmbed(
        '👋 Jugador salió',
        `El jugador **${nombre}** salió del servidor.\n📊 Jugadores conectados: **${total}**`,
        0x95A5A6
      );
    });
  });

  bot.on('error', (err) => {
    console.log('❌ Error:', err.message);
    if (err.code === 'ECONNREFUSED' || err.message.includes('Timed out')) {
      enviarLogDiscordEmbed(
        '🔌 Servidor no disponible',
        'El bot no pudo conectarse. Es posible que el servidor esté apagado.',
        0xED4245
      );
    } else {
      enviarLogDiscordEmbed('❌ Error', `**Mensaje:** ${err.message}`, 0xED4245);
    }
  });

  bot.on('end', () => {
    console.log('🔁 Bot desconectado. Intentando reconexión...');
    enviarLogDiscordEmbed(
      '🔁 Bot desconectado',
      'El bot se desconectó. Intentando reconexión cada 10 segundos...',
      0xFEE75C
    );
    esperarYReconectar();
  });
}

function esperarYReconectar() {
  setTimeout(() => {
    console.log('⏳ Reintentando conexión...');
    crearBot();
  }, 10000);
}

// === Servidor Express para mantener activo con Render y UptimeRobot ===
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

// Iniciar bot
crearBot();
          
