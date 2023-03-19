const entrar = document.querySelector('#enter-modal')
const criar = document.querySelector('#create-modal')
const editar = document.querySelector('#edit-modal')
const ui = document.querySelector('.enter-ui')
const game2 = document.querySelector('canvas')

const homeEntrarBtn = document.querySelector('.ui-enter')
const homeEditarBtn = document.querySelector('.ui-user-edit')
const homeCreateBtn = document.querySelector('.ui-create')
const modalBtn = document.querySelectorAll('.ui-button')
const inputCode = document.querySelector('#input-code')
const errorCode = document.querySelector('#error-code')


const code = document.querySelector('.ui-code')

const entrarBtn = document.querySelector('#entrar-btn')
const editarBtn = document.querySelector('#editar-btn')
const createBtn = document.querySelector('#criar-btn')

const nickInput = document.querySelector('#edit-name')

const nickname = document.querySelector('.ui-user')



var room;

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
}
function stopGame() {
    game2.classList.add('ui-none')
    ui.classList.remove('ui-none')
    socket.emit('closeRoom', code.innerHTML)
}

nickname.innerHTML = randomNick
nickInput.value = randomNick
var nicknameGlobal = randomNick

function abrirModal(element) {
    element.classList.remove('ui-none')
}

function fecharModal(element) {
    element.classList.add('ui-none')
}

// function showError(message) {
//     errorCode.innerHTML = message
//     errorCode.classList.remove('ui-none')
// }


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
    code.innerHTML = geraStringAleatoria(6).toUpperCase()
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
    document.querySelector('#tie').innerHTML = ''
    let dataCodes = []
    
    socket.on('getCodes', (codes) => {
        dataCodes = codes
    })

    if(!inputCode.value) {
        errorCode.innerHTML = 'Insire um código válido'
        return
    }

    // if(!dataCodes.includes(inputCode.value)) {
    //     errorCode.innerHTML = 'Sala inexistente'
    //     return
    // }

    socket.emit('join', {
        roomName: inputCode.value,
        playerNick: nicknameGlobal
    })
    
    socket.on('joined', (room) => {
        console.log(`Acaba de entrar 1 jogador na sala ${room}`)
    })

    socket.on('battleStart', () => {
        startGame()
    })
    inputCode.value = ''

})
