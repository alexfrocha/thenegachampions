const {Server} = require('socket.io')
const io = new Server(3001)

const rooms = new Map()
const codes = []

io.on('connection', (socket) => {
    console.log(`${socket.id} Entrou no jogo`)


    socket.on('register', ({code}) => {
        codes.push(code)
    })

    socket.emit('getCodes', codes)


    socket.on('join', ({roomName, playerNick}) => {
        
        console.log(`${playerNick} deseja entrar na sala ${roomName}`)
        
        let room = rooms.get(roomName)

        if(!room) {
            room = new Map()
            rooms.set(roomName, room)
        } else if (room.size === 2) {
            socket.emit('roomFull')
            console.log('a sala está cheia')
            return
        }

        const existingPlayer = Array.from(room.values()).find(player => player.nick === playerNick)
        if(existingPlayer) {
            room.delete(existingPlayer._id)
        }

        room.set(socket.id, { _id: socket.id, nick: playerNick, health: 100, position: {x: 0, y: 0}, code: roomName, animation: 'idle' })
        console.log(room)
        socket.join(roomName)
        socket.emit('joined', roomName)

        if(room.size === 2) {
            const oponentes = []
            room.forEach((value, key) => {
                oponentes.push({ _id: value._id, nick: value.nick, health: value.health, position: value.position, code: value.code })
            })

            io.to(roomName).emit('battleStart')
            io.to(roomName).emit('oponentes', oponentes)
        }

    })

    socket.on('playerMoved', function({entity, lastKey}) {
        const room = rooms.get(entity.code)
        if(room) {
            const player = room.get(entity._id)
            if(player) {
                player.position = entity.position
                room.set(entity._id, player)
                room.forEach((value, key) => {
                    if(key !== entity._id) {
                        io.to(key).emit('oponentePosition', {_id: entity._id, position: entity.position})
                        io.to(key).emit('keyPressed', lastKey)
                    }
                })
            }
        }
    })


    socket.on('disconnect', () => {
        console.log(`Jogador desconectado com o ID: ${socket.id}`);

        let room;
        rooms.forEach((value, roomName) => {
            if(value.has(socket.id)) {
                room = value
            }
        })

        if(room) {
            room.delete(socket.id)
            if(room.size === 0) {
                rooms.delete(room)
            } else {
                room.forEach((player, socketId) => {
                    if(socketId !== socket.id) {
                        io.to(socketId).emit('exited', player)
                        rooms.delete(player.code)
                    }
                })
            }
        }

    });

});