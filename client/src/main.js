import * as ui from "./uiEffects.js"
import * as jsonDatabase from './databaseLoader.js'

const init = () => {
    ui.init();
    jsonDatabase.init();
}

init();