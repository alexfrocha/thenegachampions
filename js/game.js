const canvas = document.querySelector('canvas')
var socket = io('http://localhost:3001/')
console.log(socket)
const nickUsuario = document.querySelector('.ui-user')
const c = canvas.getContext('2d')
canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)
const gravity = 0.7

const player = new Fighter({
    position: {
        x: -40,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: 0,
        y: 70
    },
    imageSrc: './img/peasant/Idle.png',
    scale: 1.7,
    framesMax: 6,
    name: nicknameGlobal,
    sprites: {
        idle: {
            imageSrc: './img/peasant/Idle.png',
            framesMax: 6
        },
        run: {
            imageSrc: './img/peasant/Run.png',
            framesMax: 6
        },
        jump: {
            imageSrc: './img/peasant/Jump.png',
            framesMax: 8
        },
        attack: {
            imageSrc: './img/peasant/Attack_2.png',
            framesMax: 4
        },
        secondAttack: {
            imageSrc: './img/peasant/Attack_2.png',
            framesMax: 4
        },
        hurt: {
            imageSrc: './img/peasant/Hurt.png',
            framesMax: 2
        },
        death: {
            imageSrc: './img/peasant/Dead.png',
            framesMax: 4
        },
        walk: {
            imageSrc: './img/peasant/Walk.png',
            framesMax: 8
        }
    }
})

const enemy = new Fighter({
    position: {
        x: canvas.width,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: -80,
        y: 50
    },
    color: 'blue',
    imageSrc: './img/samurai/Idle.png',
    scale: 1.7,
    framesMax: 5,
    rotation: 180,
    sprites: {
        idle: {
            imageSrc: './img/samurai/Idle.png',
            framesMax: 5
        },
        run: {
            imageSrc: './img/samurai/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './img/samurai/Jump.png',
            framesMax: 7
        },
        attack: {
            imageSrc: './img/samurai/Attack_1.png',
            framesMax: 4
        },
        secondAttack: {
            imageSrc: './img/samurai/Attack_2.png',
            framesMax: 5
        },
        hurt: {
            imageSrc: './img/samurai/Hurt.png',
            framesMax: 2
        },
        death: {
            imageSrc: './img/samurai/Dead.png',
            framesMax: 6
        },
        walk: {
            imageSrc: './img/samurai/Walk.png',
            framesMax: 9
        }
    }
})

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

decreaseTimer()

function jump(entity) {
    const onAir = entity.position.y + entity.height + entity.velocity.y >= canvas.height - 100
    if(onAir) entity.velocity.y = -14
    entity.switchSprite('jump')
}   

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
    player.switchSprite('idle')
    enemy.switchSprite('idle')

    if(!player.dead) {

        if(keys.a.pressed) {
            player.velocity.x = -5
            player.switchSprite('walk')
        }
        if(keys.d.pressed) {
            player.velocity.x = 5
            player.switchSprite('run')
        }
        
        if(keys.w.pressed) jump(player)
    }


    // MOVIMENTAÇÃO DO INIMIGO
    if(!enemy.dead) {
        if(keys.ArrowLeft.pressed) {
            enemy.velocity.x = -5
            enemy.switchSprite('run')
        }
        if(keys.ArrowRight.pressed) {
            enemy.velocity.x = 5
            enemy.switchSprite('walk')
        }
        if(keys.ArrowUp.pressed) jump(enemy)
    }

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


        case 'ArrowRight':
            keys.ArrowRight.pressed = true
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true
            break;
        case 'ArrowUp':
            keys.ArrowUp.pressed = true
            break;
        case 'ArrowDown':
            enemy.attack()
            break
    }
})

window.addEventListener('keyup', (event) => {
    lastKey = event.key
    switch(event.key) {
        case 'd':
            keys.d.pressed = false
            player.lastKey = event.key
            break;
        case 'a':
            keys.a.pressed = false
            player.lastKey = event.key
            break;
        case 'w':
            setTimeout(() => {
                keys.w.pressed = false
            }, 400)
            player.lastKey = event.key
            break;


        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            enemy.lastKey = event.key
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            enemy.lastKey = event.key
            break;
        case 'ArrowUp':
            keys.ArrowUp.pressed = false
            enemy.lastKey = event.key
            break;
        case 'ArrowDown':
            enemy.isAttacking = false
            break
    }
})

window.addEventListener('click', () => {
    if(!player.dead) player.attack()
})