// import { addEventListenerTag, removeEventListenerTag } from './eventListenerTagger.js';
import { game } from './game.js'

const functions = {
    click: {
        playGame,
    }
}

function playGame() {
    game.play()
}


export { functions }