const { Utils } = require('./Utils');

const { SauceSearch } = require('./SauceSearch');

class Sauce {
    constructor(options) {
        this.options = options;
        
        this._utils = new Utils();

        this.RESPONSE_TYPE = {
            ORIGINAL: 0,
            DEFAULT: 1,
            HIGHSIMILARITY: 2,
            ASSIGNED: 3 
        };
    }

    generateDBMask(indexes) {
        return indexes.reduce((acc, index) => acc + (1 << Number(index)), 0).toString();
    }

    setOptions(options) {
        this.options = Object.assign({}, this.options, options);

        return this.options;
    }

    async getSauce(source, response_type = this.RESPONSE_TYPE.DEFAULT) {
        const search = new SauceSearch(this.options, response_type);

        if (Buffer.isBuffer(source))
            return await search.bufferSearch(source)
        
        return this._utils.detectStringType(source) === 'url' ?  await search.urlSearch(source) : await search.fileSearch(source);
    }
}

module.exports = {
    Sauce
};