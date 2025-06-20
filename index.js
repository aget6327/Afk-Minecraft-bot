const mineflayer = require('mineflayer');
const express = require('express');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const webhookURL = 'https://discord.com/api/webhooks/1385458533461393438/Sqh575Q4jnIQmZhKWwj7RFTGYHlojpcK84uFhJ2xQFRxYqoT9L4WQbrYhk5_n2t2uLSs';

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
    host: 'Prueba-8qyM.aternos.me', // sin puerto
    username: 'JugadorReal_24_7',
    version: '1.20.1'
  });

  bot.on('spawn', () => {
    console.log('✅ Bot conectado al servidor Minecraft');
    enviarLogDiscordEmbed('✅ Bot Conectado', 'El bot se ha conectado correctamente al servidor.');
    ultimoTick = bot.time.age;

    const acciones = ['forward', 'back', 'left', 'right'];
    setInterval(() => {
      const accion = acciones[Math.floor(Math.random() * acciones.length)];
      bot.setControlState(accion, true);
      bot.setControlState('jump', true);
      setTimeout(() => {
        bot.setControlState(accion, false);
        bot.setControlState('jump', false);
      }, 1000);
    }, 60 * 1000);

    setInterval(() => {
      const yaw = Math.random() * Math.PI * 2;
      const pitch = (Math.random() - 0.5) * Math.PI / 3;
      bot.look(yaw, pitch, true);
    }, 45 * 1000);

    setInterval(() => {
      bot.chat('✅ Bot activo 24/7');
    }, 10 * 60 * 1000);

    setInterval(() => {
      if (!bot || !bot.time || bot.time.age === ultimoTick) {
        console.log('🧊 Bot congelado. Reiniciando...');
        enviarLogDiscordEmbed('🧊 Bot congelado', 'El bot no respondió. Reiniciando...', 0xED4245);
        process.exit();
      }
      ultimoTick = bot.time.age;
    }, 60 * 1000);

    bot.on('playerJoined', (player) => {
      if (!player || !player.username || player.username === bot.username) return;
      const nombre = player.username;
      const total = Object.keys(bot.players).length;
      bot.chat(`👋 Bienvenido, ${nombre}`);
      bot.chat(`📊 Actualmente hay ${total} jugador(es)`);
      enviarLogDiscordEmbed(
        '👤 Jugador conectado',
        `**${nombre}** entró.\nJugadores conectados: **${total}**`,
        0x3498DB
      );
    });

    bot.on('playerLeft', (player) => {
      if (!player || !player.username || player.username === bot.username) return;
      const nombre = player.username;
      const total = Object.keys(bot.players).length - 1;
      enviarLogDiscordEmbed(
        '👋 Jugador salió',
        `**${nombre}** salió.\nJugadores conectados: **${total}**`,
        0x95A5A6
      );
    });
  });

  bot.on('error', (err) => {
    console.log('❌ Error:', err.message);
    if (err.code === 'ECONNREFUSED' || err.message.includes('Timed out')) {
      enviarLogDiscordEmbed('🔌 Servidor no disponible', 'No se pudo conectar.', 0xED4245);
    } else {
      enviarLogDiscordEmbed('❌ Error', `**Mensaje:** ${err.message}`, 0xED4245);
    }
  });

  bot.on('end', () => {
    console.log('🔁 Bot desconectado. Reintentando...');
    enviarLogDiscordEmbed('🔁 Bot desconectado', 'Reintentando en 10 segundos...', 0xFEE75C);
    esperarYReconectar();
  });
}

function esperarYReconectar() {
  setTimeout(() => {
    console.log('⏳ Reintentando conexión...');
    crearBot();
  }, 10000);
}

// Servidor web para UptimeRobot y Render
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  const hora = new Date().toLocaleTimeString('es-MX');
  res.send('🤖 Bot activo. UptimeRobot detectado.');
  enviarLogDiscordEmbed('🟢 UptimeRobot activo', `Ping recibido a las **${hora}**.`);
});

app.listen(port, () => {
  console.log(`🌍 Web activo en el puerto ${port}`);
});

// Iniciar bot
crearBot();
                                         
