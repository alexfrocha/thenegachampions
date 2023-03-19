const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)
const gravity = 0.7

let player1, player2

socket.on('battleStart', () => {
    console.log('batalha inicou no game.js')
    console.log(socket.id)
    let oponentes;
    let personagens;
    let player, enemy

    socket.on('oponentes', (data) => {
        oponentes = data
        let entity;

        player = new Fighter({
            position: {
                x: oponentes[0].position.x,
                y: oponentes[0].position.y
            },
            velocity: {
                x: 0,
                y: 0
            },
            offset: {
                x: 0,
                y: 70
            },
            animation: oponentes[0].animation,
            scale: 1.7,
            name: oponentes[0].nick,
            sprites: sprites('peasant'),
            _id: oponentes[0]._id,
            code: oponentes[0].code
        })

        enemy = new Fighter({
            position: {
                x: oponentes[1].position.x ? oponentes[1].position.x : canvas.width,
                y: oponentes[1].position.y
            },
            velocity: {
                x: 0,
                y: 0
            },
            offset: {
                x: -80,
                y: 50
            },
            scale: 1.7,
            rotation: 180,
            animation: oponentes[1].animation,
            name: oponentes[1].nick,
            sprites: sprites('samurai'),
            _id: oponentes[1]._id,
            code: oponentes[1].code
        })

        personagens = {
            player: player,
            enemy: enemy
        }

        const keys = {
            a: {
                pressed: false
            },
            d: {
                pressed: false
            },
            w: {
                pressed: false
            },
    
            ArrowRight: {
                pressed: false
            },
            ArrowLeft: {
                pressed: false
            },
            ArrowUp: {
                pressed: false
            },
    
            attack: {
                pressed: false
            }
        }

        let entityEnemy;
        let enemyObject;
        if(oponentes[0]._id === socket.id) {
            entity = player
            entityEnemy = enemy
            oponentes[0].sprite = 'player'
            enemyObject = oponentes[1]
        }
        if(oponentes[1]._id === socket.id) {
            entity = enemy
            entityEnemy = player
            oponentes[1].sprite = 'enemy'
            enemyObject = oponentes[0]
        }

    
        // ################################################################################################## UTILS
            
        function rectangularCollision({ rectangle1, rectangle2 }) {
            return (
              rectangle1.attackBox.position.x + rectangle1.attackBox.width >=
                rectangle2.position.x &&
              rectangle1.attackBox.position.x <=
                rectangle2.position.x + rectangle2.width &&
              rectangle1.attackBox.position.y + rectangle1.attackBox.height >=
                rectangle2.position.y &&
              rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
            )
          }
          
        function determineWinner({ player, enemy, timerId }) {
            clearTimeout(timerId)
            document.querySelector('#tie').style.display = 'flex'
            if(player.health === enemy.health) {
                document.querySelector('#tie').innerHTML = `<span class='nick'>EMPATE</span>`
            } else if (player.health > enemy.health) {
                document.querySelector('#tie').innerHTML = `<span class='nick'>${player.name.toUpperCase()}</span> GANHOU`
            } else {
                document.querySelector('#tie').innerHTML = `<span class='nick'>${enemy.name.toUpperCase()}</span> GANHOU`
            }
            setTimeout(stopGame, 5000)
        }
        
        let timer = 60
        let timerId
        function decreaseTimer() {
            if (timer > 0) {
                timerId = setTimeout(decreaseTimer, 1000);
                timer--
                document.querySelector('#timer').innerHTML = timer
            }
            if(timer === 0) {
                determineWinner({ player, enemy, timerId })
            }
        }
    
        // ################################################################################################## UTILS
    
        decreaseTimer()
    
        function jump(entity) {
            const onAir = entity.position.y + entity.height + entity.velocity.y >= canvas.height - 100
            if(onAir) entity.velocity.y = -14
            entity.switchSprite('jump')
        }   
        
        

        let entityPositionSaved = entity.position;
        function animate() {
            window.requestAnimationFrame(animate)
            c.fillStyle = 'black'
            c.fillRect(0, 0, canvas.width, canvas.height)
            background.update()
            shop.update()
            player.update()
            enemy.update()
            
            // MOVIMENTAÇÃO DO JOGADOR
    
            player.velocity.x = 0
            enemy.velocity.x = 0
            // player.switchSprite('idle')
            // enemy.switchSprite('idle')
            entity.switchSprite('idle')
            entityEnemy.switchSprite('idle')


            let lastSent = 0;
            const SEND_INTERVAL = 20000;
    
            if(!entity.dead) {
                if(keys.a.pressed) {
                    entity.lastKey = 'a'
                    entity.velocity.x = -5
                    
                    if(entity.rotation === 180) {
                        entity.switchSprite('run')
                    } else {
                        entity.switchSprite('walk')
                    }
                    const now = Date.now();
                    if (now - lastSent >= SEND_INTERVAL) {
                        socket.emit('playerMoved', {entity: entity, lastKey: 'a'});
                        lastSent = now;
                    } else {
                        setTimeout(() => {
                        socket.emit('playerMoved', {entity: entity, lastKey: 'a'});
                        lastSent = Date.now();
                        }, SEND_INTERVAL - (now - lastSent));
                    }
                }

                if(keys.d.pressed) {
                    entity.lastKey = 'd'
                    entity.velocity.x = 5
                    if(entity.rotation === 180) {
                        entity.switchSprite('walk')
                    } else {
                        entity.switchSprite('run')
                    }
                    const now = Date.now();
                    if (now - lastSent >= SEND_INTERVAL) {
                        socket.emit('playerMoved', {entity: entity, lastKey: 'd'});
                        lastSent = now;
                    } else {
                        setTimeout(() => {
                        socket.emit('playerMoved', {entity: entity, lastKey: 'd'});
                        lastSent = Date.now();
                        }, SEND_INTERVAL - (now - lastSent));
                    }
                }
                
                if(keys.w.pressed) {
                    entity.lastKey = 'w'
                    jump(entity)
                    const now = Date.now();
                    if (now - lastSent >= SEND_INTERVAL) {
                        socket.emit('playerMoved', {entity: entity, lastKey: 'w'});
                        lastSent = now;
                    } else {
                        setTimeout(() => {
                        socket.emit('playerMoved', {entity: entity, lastKey: 'w'});
                        lastSent = Date.now();
                        }, SEND_INTERVAL - (now - lastSent));
                    }
                }
            }

            
            socket.on('oponentePosition', (data) => {
                entityEnemy.position = data.position
            })

            socket.on('keyPressed', (key) => {
                switch(key) {
                    case 'a':
                        if(entity.lastKey === 'a') break;
                        if(entityEnemy.rotation === 180) {
                            entityEnemy.switchSprite('run')
                        } else {
                            entityEnemy.switchSprite('walk')
                        }
                        break;
                    case 'd':
                        if(entity.lastKey === 'd') break;
                        if(entityEnemy.rotation === 180) {
                            entityEnemy.switchSprite('walk')
                        } else {
                            entityEnemy.switchSprite('run')
                        }
                        break;
                    case 'w':
                        if(entity.lastKey === 'w') break;
                        jump(entityEnemy)
                        break;
                    case 'click':
                        entityEnemy.attack()
                        break;
                }
            })

    
            // COLISÃO
            if( 
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: enemy
                }) 
                &&
                player.isAttacking
            ) {
                player.isAttacking = false
                enemy.takeHit()
                document.querySelector('#enemy-health').style.width = enemy.health + '%'
                console.log('Você atacou')
            }
    
            if( 
                rectangularCollision({
                    rectangle1: enemy,
                    rectangle2: player
                }) 
                &&
                enemy.isAttacking
            ) {
                enemy.isAttacking = false
                player.takeHit()
                document.querySelector('#player-health').style.width = player.health + '%'
                console.log('Inimigo te atacou')
            }
    
    
            if(enemy.health <= 0 || player.health <= 0) {
                determineWinner({ player, enemy, timerId })
            }
    
            }
    
            animate()
            window.addEventListener('keydown', (event) => {
                switch(event.key) {
                    case 'd':
                        keys.d.pressed = true
                        break;
                    case 'a':
                        keys.a.pressed = true
                        break;
                    case 'w':
                        keys.w.pressed = true
                        break;
                    // case ' ':
                    //     player.attack()
                    //     break;
                }
            })
    
            window.addEventListener('keyup', (event) => {
                lastKey = event.key
                switch(event.key) {
                    case 'd':
                        keys.d.pressed = false
                        break;
                    case 'a':
                        keys.a.pressed = false
                        break;
                    case 'w':
                        setTimeout(() => {
                            keys.w.pressed = false
                        }, 400)
                        break;
                }
            })
    
            window.addEventListener('click', () => {
                if(!entity.dead) {
                    socket.emit('playerMoved', {entity: entity, lastKey: 'click'});
                    entity.attack()
                }
            })

            socket.on('exited', (player) => {
                console.log('Jogador que desconectou: ' + player.nick)
                stopGame()
            })
    
    })

    

})