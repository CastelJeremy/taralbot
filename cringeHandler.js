/**
 * Checks wether the given message is cringe or acceptable.
 * 
 * Cringe message defines messages which contains too much emoji.
 * 
 * @param {String} message 
 * 
 * @return {Boolean} True if cringe, else False
 */
function isCringe(message) {
    let size = 0;
    let nbCringe = 0;
    let nbCringeWord = 0;
    let coCringe = 0;       // Current number of consecutive cringe character
    let maxCoCringe = 0;    // Maximum number of consecutive cringe character

    let words = message.split(' ');

    words.forEach((word) => {
        for (const c of word) {
            size++;

            if (c.codePointAt(1) !== undefined) {
                nbCringe++;
                coCringe++;

                if (coCringe == 1) {
                    nbCringeWord++;
                }
    
                if (coCringe > maxCoCringe) {
                    maxCoCringe = coCringe;
                }
            } else {
                coCringe = 0;
            }
        }

        size++;
    });

    // Debug Info
    // console.log({
    //     'size': size,
    //     'nbWord': words.length,
    //     'nbCringe': nbCringe,
    //     'nbCringeWord': nbCringeWord,
    //     'coCringe': coCringe,
    //     'maxCoCringe': maxCoCringe
    // });

    return (((nbCringeWord / words.length) > 0.1) || ((nbCringe / size) > 0.1) || (maxCoCringe > 5));
}

export { isCringe };