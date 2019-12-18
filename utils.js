/**
 * Returns true if the input is a valid url
 * 
 * @param {string} url The url to test 
 */
function isValidUrl(url) {
    let expression = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
    let regex = new RegExp(expression);
    return url.match(regex);
}

module.exports = {
    isValidUrl
}