export function numberToEmoji(number: number): string {
    if (number == 1) {
        return '1️⃣';
    } else if (number == 2) {
        return '2️⃣';
    } else if (number == 3) {
        return '3️⃣';
    } else if (number == 4) {
        return '4️⃣';
    } else if (number == 5) {
        return '5️⃣';
    } else if (number == 6) {
        return '6️⃣';
    } else if (number == 7) {
        return '7️⃣';
    } else if (number == 8) {
        return '8️⃣';
    } else if (number == 9) {
        return '9️⃣';
    } else if (number >= 10) {
        return '🔟';
    }

    return '0️⃣';
}
