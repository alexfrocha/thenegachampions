const io = require('socket.io')(3001)

let jogadores = {}

io.on('connection', (socket) => {
    jogadores[socket.id] = socket
    
    socket.on('disconnect', () => {
        console.log('Usuário desconectado');
    });

    socket.emit('obterJogadores', Object.keys(jogadores))
});