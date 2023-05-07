import { DateTime } from "luxon";

function log(message: string) {
    let timeString  = DateTime.now().toFormat('[yyyy/LL/dd HH:mm:ss] ');

    console.log(timeString + message);
}

function info(message: string) {
    log(message);
}

function error(message: string) {
    log(message);
}

export default { info, error };
