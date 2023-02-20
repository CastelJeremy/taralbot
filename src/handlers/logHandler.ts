function log(message: string) {
    const now = new Date();

    let timeString = '[';

    timeString += now.getFullYear() + '/';

    if (now.getMonth() + 1 < 10) {
        timeString += '0';
    }

    timeString += now.getMonth() + 1 + '/';

    if (now.getDate() < 10) {
        timeString += '0';
    }

    timeString += now.getDate() + ' ';

    if (now.getHours() < 10) {
        timeString += '0';
    }

    timeString += now.getHours() + ':';

    if (now.getMinutes() < 10) {
        timeString += '0';
    }

    timeString += now.getMinutes() + ':';

    if (now.getSeconds() < 10) {
        timeString += '0';
    }

    timeString += now.getSeconds() + '] ';

    console.log(timeString + message);
}

function info(message: string) {
    log(message);
}

function error(message: string) {
    log(message);
}

export default { info, error };
