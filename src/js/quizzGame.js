import { addCssFileToDom } from './misc.esm.js'

const el = document.getElementById('quizz_game_root')
if (el) {
  addCssFileToDom('../../lib/quizz-game/style.css')
  addCssFileToDom('../../lib/quizz-game/quizz-game.css')
  import('../lib/quizz-game/quizz-game.js').then(mod => {
    const { init } = mod
    init({ inline: '#quizz_game_data', autoStart: false })
  })
}
