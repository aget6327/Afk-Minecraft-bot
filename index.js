const mineflayer = require('mineflayer');

const bot = mineflayer.createBot({
  host: 'Prueba-8qyM.aternos.me',
  port: 23001,
  username: 'Bot24_7',
  version: '1.20.1' // ✅ Versión compatible
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
       
