function sprites(sprite) {
    const animations = {
        peasant: {
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
        },
        samurai: {
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
    }
    return animations[sprite]
}