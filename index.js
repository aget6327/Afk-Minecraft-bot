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
let servidorCaido = false;
let reintento46Minutos = null;

function crearBot() {
  bot = mineflayer.createBot({
    host: 'Prueba-8qyM.aternos.me',
    port: 23001,
    username: 'Agent_24_7',
    auth: 'offline',
    version: '1.20.1'
  });

  bot.on('spawn', () => {
    console.log('✅ Bot conectado');
    enviarLogDiscordEmbed('✅ Bot Conectado', 'Se ha conectado al servidor correctamente.');
    ultimoTick = bot.time.age;
    servidorCaido = false;

    if (reintento46Minutos) {
      clearTimeout(reintento46Minutos);
      reintento46Minutos = null;
    }

    bot.chat('/register 123456 123456');
    bot.chat('/login 123456');

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
    }, 45000);

    setInterval(() => {
      bot.chat('✅ Bot activo 24/7');
    }, 10 * 60 * 1000);

    setInterval(() => {
      if (!bot || !bot.time || bot.time.age === ultimoTick) {
        console.log('🧊 Bot congelado. Reiniciando...');
        enviarLogDiscordEmbed('🧊 Bot congelado', 'Reiniciando proceso...', 0xED4245);
        process.exit();
      }
      ultimoTick = bot.time.age;
    }, 60000);

    bot.on('playerJoined', (player) => {
      if (!player || !player.username || player.username === bot.username) return;
      const nombre = player.username;
      const total = Object.keys(bot.players).length;
      bot.chat(`👋 Bienvenido, ${nombre}`);
      enviarLogDiscordEmbed('👤 Jugador conectado', `**${nombre}** entró. Total: **${total}**`, 0x3498DB);
    });

    bot.on('playerLeft', (player) => {
      if (!player || !player.username || player.username === bot.username) return;
      const nombre = player.username;
      const total = Object.keys(bot.players).length - 1;
      enviarLogDiscordEmbed('👋 Jugador salió', `**${nombre}** salió. Quedan: **${total}**`, 0x95A5A6);
    });
  });

  bot.on('error', (err) => {
    console.log('❌ Error:', err.message);
    if (!servidorCaido && (err.code === 'ECONNREFUSED' || err.message.includes('Timed out'))) {
      servidorCaido = true;
      console.log('📴 Servidor posiblemente apagado');
      enviarLogDiscordEmbed('📴 Servidor caído', 'El servidor no responde. Esperando 46 minutos...', 0xED4245);

      reintento46Minutos = setTimeout(() => {
        console.log('⏳ 46 minutos pasaron. Intentando reconectar...');
        enviarLogDiscordEmbed('⏳ Intentando activar servidor', 'Han pasado 46 minutos. Reintentando conexión...', 0xFEE75C);
        crearBot(); // intenta conectar de nuevo
      }, 46 * 60 * 1000); // 46 minutos
    } else {
      enviarLogDiscordEmbed('❌ Error', `Mensaje: ${err.message}`, 0xED4245);
    }
  });

  bot.on('end', () => {
    console.log('🔁 Desconectado. Intentando reconectar...');
    enviarLogDiscordEmbed('🔁 Bot desconectado', 'Intentando reconectar en 10 segundos...', 0xFEE75C);
    setTimeout(crearBot, 10000);
  });
}

// 🌐 Express para Render/UptimeRobot
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  const hora = new Date().toLocaleTimeString('es-MX');
  res.send('🤖 Bot activo');
  enviarLogDiscordEmbed('🟢 UptimeRobot activo', `Ping recibido a las **${hora}**.`);
});

app.listen(port, () => {
  console.log(`🌍 Web activa en el puerto ${port}`);
});

crearBot();
          
