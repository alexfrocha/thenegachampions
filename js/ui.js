const entrar = document.querySelector('#enter-modal')
const criar = document.querySelector('#create-modal')
const editar = document.querySelector('#edit-modal')
const ui = document.querySelector('.enter-ui')
const game2 = document.querySelector('canvas')

const homeEntrarBtn = document.querySelector('.ui-enter')
const homeEditarBtn = document.querySelector('.ui-user-edit')
const homeCreateBtn = document.querySelector('.ui-create')
const modalBtn = document.querySelectorAll('.ui-button')

const code = document.querySelector('.ui-code')

const entrarBtn = document.querySelector('#entrar-btn')
const editarBtn = document.querySelector('#editar-btn')
const createBtn = document.querySelector('#criar-btn')

const nickInput = document.querySelector('#edit-name')

const nickname = document.querySelector('.ui-user')

function geraStringAleatoria(tamanho) {
    var stringAleatoria = '';
    var caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < tamanho; i++) {
        stringAleatoria += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    return stringAleatoria;
}


let randomNick = geraStringAleatoria(8)

function startGame() {
    game2.classList.remove('ui-none')
    ui.classList.add('ui-none')
    var script = document.createElement('script')
    script.src = './js/game.js'
    document.body.appendChild(script)
}

code.innerHTML = geraStringAleatoria(6).toUpperCase()
nickname.innerHTML = randomNick
nickInput.value = randomNick
var nicknameGlobal = randomNick

function abrirModal(element) {
    element.classList.remove('ui-none')
}

function fecharModal(element) {
    element.classList.add('ui-none')
}

modalBtn.forEach(btn => {
    btn.addEventListener('click', () => {
        const elements = [
            entrar,
            criar,
            editar
        ]
        elements.forEach(e => fecharModal(e)) 
    })
})

homeCreateBtn.addEventListener('click', () => {
    abrirModal(criar)
})

homeEditarBtn.addEventListener('click', () => {
    abrirModal(editar)
})

editarBtn.addEventListener('click', () => {
    randomNick = nickInput.value
    nickInput.innerHTML = randomNick
    nickname.innerHTML = randomNick
    nicknameGlobal = randomNick
})

homeEntrarBtn.addEventListener('click', () => {
    abrirModal(entrar)
})

entrarBtn.addEventListener(`click`, () => {
    startGame()
})