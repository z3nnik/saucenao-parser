const path = require('path');

class Utils {
    constructor() {
        this.available_file_extensions = ['.png', '.jpg', '.bmp', '.svg', '.gif', '.webp'];
    }

    uniqueArray(array, key) {
        return array.filter((el, i, arr) => {
            return arr.map(e => e[key]).indexOf(el[key]) === i;
        });
    }

    addURLParams(url, stringifyParams) {
        url += `?${stringifyParams}`;

        return url;
    }

    isURL(str) {
        const pattern = new RegExp('^(https?:\\/\\/)?' +
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
            '((\\d{1,3}\\.){3}\\d{1,3}))' +
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
            '(\\?[;&a-z\\d%_.~+=-]*)?' +
            '(\\#[-a-z\\d_]*)?$', 'i');

        return !!pattern.test(str);
    }

    isBuffer(obj) {
        return Buffer.isBuffer(obj);
    }

    fileExtIsAvailable(filepath) {
        const filename = path.basename(filepath);
        const ext = path.extname(filename);

        return this.available_file_extensions.includes(ext);
    }

    detectStringType(string) {
        if (this.isURL(string))
            return 'url';
        if (this.fileExtIsAvailable(string))
            return 'file'
        else throw new Error('Oops... Something went wrong!');
    }
}

module.exports = {
    Utils
};