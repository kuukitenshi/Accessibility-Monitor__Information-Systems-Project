function validateUrl(urlString, parentUrlString) {
    if (urlString === undefined || urlString.includes(" "))
        return null;
    try {
        const url = new URL(urlString);
        if (url.protocol !== 'http:' && url.protocol !== 'https:')
            return null;
        if (parentUrlString) {
            try {
                const parentUrl = new URL(parentUrlString);
                return parentUrl.origin === url.origin ? url : null;
            } catch {
                return null;
            }
        }
        return url;
    } catch { }
    return null;
}

module.exports = { validateUrl }