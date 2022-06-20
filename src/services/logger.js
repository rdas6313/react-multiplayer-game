import config from '../configs/tic_tac_toe/config.json';

function log(msg1, msg2 = null) {
   
    if(process.env.NODE_ENV === config.env)
        console.log(msg1, msg2);
}

export default log;