import * as ui from "./uiEffects.js"
import * as jsonDatabase from './databaseLoader.js'
import * as teamInteractor from './teamInteractor.js'

const init = () => {
    ui.init();
    jsonDatabase.init();
    teamInteractor.init();
    teamInteractor.assignTeamClick();
}

init();