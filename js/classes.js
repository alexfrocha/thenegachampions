class Teste {
    constructor({ mensagem }) {
        this.mensagem = mensagem;
    }
    falar() {
        console.log(this.mensagem)
    }
}

class Sprite {
    constructor({position, imageSrc, scale = 1, framesMax = 1, offset = {x: 0, y: 0}}) {
        this.position = position
        this.height = 150
        this.width = 50
        this.image = new Image()
        this.image.src = imageSrc
        this.scale = scale
        this.framesMax = framesMax
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 5
        this.offset = offset
    }
    draw() {
        c.drawImage(
            this.image, 
            this.framesCurrent * (this.image.width / this.framesMax),
            0,
            this.image.width / this.framesMax,
            this.image.height,
            this.position.x - this.offset.x, 
            this.position.y - this.offset.y, 
            (this.image.width / this.framesMax) * this.scale, 
            this.image.height * this.scale
            )
    }

    animateFrame() {
        this.framesElapsed++

        if(this.framesElapsed % this.framesHold === 0) {
            if(this.framesCurrent < this.framesMax - 1) {
                this.framesCurrent++
            } else {
                this.framesCurrent = 0
            }
        }
    }

    changeDirection() {
        this.image.style.transform = 'scaleX(-1)'
    }

    update() {
        this.draw()
        this.animateFrame()

    }
}

class Fighter extends Sprite {
    constructor({position, name = 'random', _id, code, animation, direction = 'left', velocity, color = 'red', offset = {x: 0, y: 0}, scale = 1, framesMax = 1, imageSrc, sprites, rotation}) {
        super({
            position,
            imageSrc,
            scale,
            framesMax
        })
        this.position = position
        this.velocity = velocity
        this.direction = direction
        this.height = 150
        this.width = 50
        this._id = _id
        this.code = code
        this.name = name
        this.attacked = false
        this.attackBox = {  
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset,
            width: 130,
            height: 30
        }
        this.color = color
        this.isAttacking
        this.rotation = rotation
        this.cooldown = false
        this.health = 100
        this.animation = animation
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 5
        this.sprites = sprites
        this.dead = false
        
        for(const sprite in this.sprites) {
            sprites[sprite].image = new Image()
            sprites[sprite].image.src = sprites[sprite].imageSrc
        }

    }

    update() {
        this.draw()
        this.showName()
        if(!this.dead) this.animateFrame()
        
        this.position.y += this.velocity.y
        this.position.x += this.velocity.x
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x
        this.attackBox.position.y = this.position.y + this.attackBox.offset.y

        const onAir = this.position.y + this.height + this.velocity.y >= canvas.height - 97

        if(this.position.x < 0) {
            this.position.x = 0
        }
        if(this.position.x + this.width > canvas.width) {
            this.position.x = canvas.width - this.width
        }
        if(onAir) {
            this.velocity.y = 0
        } else this.velocity.y += gravity

    }

    draw() {
        c.save()
        if(this.rotation === 180) {
            c.translate((this.width * 3.45), (this.position.y + 10));
            c.scale(-1, 1); // inverte a imagem horizontalmente
        }
        c.drawImage(
            this.image, 
            this.framesCurrent * (this.image.width / this.framesMax),
            0,
            this.image.width / this.framesMax,
            this.image.height,
            this.rotation === 180 ? -(this.position.x - this.width) : this.position.x - this.width, // ajusta a posição do sprite para o centro
            this.rotation === 180 ? -(this.height / 2) : this.position.y - 10,
            (this.image.width / this.framesMax) * this.scale, 
            this.image.height * this.scale
        )
        c.restore()
    }

    hitbox() {
        c.fillStyle = 'red'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
        this.hitboxWidth = this.width * this.scale 
    }

    attackbox() {
        c.fillStyle = 'yellow'
        c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height)
    }

    attack() {
        if(!this.cooldown) {
            this.switchSprite('attack')
            this.isAttacking = true
            this.cooldown = true
            setTimeout(() => {
                this.isAttacking = false
            }, 50)
            setTimeout(() => {
                this.cooldown = false
            }, 1000);
        }   
    }

    takeHit() {
        this.health -= 3
        if(this.health <= 0) {
            this.switchSprite('death')
        } else this.switchSprite('hurt')
    }

    showName() {
        c.font = "14px 'Press Start 2P', cursive"

        c.shadowColor = 'black'
        c.shadowOffsetX = 3
        c.shadowOffsetY = 0
        c.shadowBlur = 0

        c.fillStyle = 'white'
        const centerX = this.position.x + (this.width / 2)
        const centerY = this.position.y + (this.height / 2)
        c.fillText(this.name, centerX - (c.measureText(this.name).width / 2), this.position.y + 15)
    }


    switchSprite(sprite) {
        if (this.image === this.sprites.death.image) {
          if (this.framesCurrent === this.sprites.death.framesMax - 1)
            this.dead = true
          return
        }
        if(this.image.isEqualNode(this.sprites.attack.image) && this.framesCurrent < this.sprites.attack.framesMax -1) return
        if(this.image.isEqualNode(this.sprites.hurt.image) && this.framesCurrent < this.sprites.hurt.framesMax -1) return
        switch(sprite) {
            case 'idle':
                if(this.image !== this.sprites.idle.image) {
                    this.image = this.sprites.idle.image
                    this.framesMax = this.sprites.idle.framesMax
                }
                break;
            case 'run':
                if(this.image !== this.sprites.run.image) {
                    this.image = this.sprites.run.image
                    this.framesMax = this.sprites.run.framesMax
                }
                break;
            case 'jump':
                if(this.image !== this.sprites.jump.image) {
                    this.image = this.sprites.jump.image
                    this.framesMax = this.sprites.jump.framesMax
                }
                break;
            case 'attack':
                if(this.image !== this.sprites.attack.image) {
                    this.image = this.sprites.attack.image
                    this.framesMax = this.sprites.attack.framesMax
                    this.framesCurrent = 0
                }
                break;  
            case 'hurt':
                if(this.image !== this.sprites.hurt.image) {
                    this.image = this.sprites.hurt.image
                    this.framesMax = this.sprites.hurt.framesMax
                    this.framesCurrent = 0
                }
                break;
            case 'death':
                if(this.image !== this.sprites.death.image) {
                    this.image = this.sprites.death.image
                    this.framesMax = this.sprites.death.framesMax
                    this.framesCurrent = 0
                }
                break
            case 'walk':
                if(this.image !== this.sprites.walk.image) {
                    this.image = this.sprites.walk.image
                    this.framesMax = this.sprites.walk.framesMax
                }
                break
        }
    }
}