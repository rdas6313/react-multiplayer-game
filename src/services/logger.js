import config from '../configs/tic_tac_toe/config.json';

function log(msg1, msg2 = null) {
    if(config.env && config.env === "dev")
        console.log(msg1, msg2);
}

export default log;