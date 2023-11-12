

export function toCamelCase(str) {
    if (str === "TINNumber") return str;
    return str.split(' ').map((word, index) => {
        if (index === 0) {
            return word.toLowerCase();
        } else {
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        }
    }).join('');
}



export function toInitialCase(camelCaseString) {
    if (camelCaseString === "TINNumber") return camelCaseString;
    return camelCaseString
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/^./, function(str) {
            return str.toUpperCase();
        });
}

export function getBase64FromServer (fileUrl) {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = fileUrl;
        img.onload = () => {
            resolve(fileUrl);
        };
    });
}