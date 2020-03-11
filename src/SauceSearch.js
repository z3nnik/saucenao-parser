const fetch = require('node-fetch');
global.Headers = fetch.Headers;

const { stringify } = require('querystring');

const fs = require('fs');
const FormData = require('form-data')
const { fromBuffer } = require('file-type');

const { Handler } = require('./Handler');
const { Utils } = require('./Utils');

class SauceSearch {
    constructor(options, response_type) {
        this.options = options;
        this.response_type = response_type;

        this.handler = new Handler()
        this.utils= new Utils();

        this.sauce_search_url = 'https://saucenao.com/search.php';
    }

    async bufferSearch(source) {
        const data = new FormData();
        const filedata = await fromBuffer(source);

        const filename = `image.${filedata.ext}`; 
        data.append('file', source, filename);

        const params = {
            method: "POST",
            body: stringify(this.options),
            headers: data.getHeaders()
        };

        return this.start(params);
    }

    fileSearch(path) {
        const buffer = fs.readFileSync(path);

        return this.bufferSearch(buffer);
    }

    async urlSearch(source) {
        this.options = Object.assign({}, this.options, {
            url: source
        });

        const headers = new Headers();
        headers.set('Content-Type', 'application/x-www-form-urlencoded');

        this.sauce_search_url += `?${stringify(this.options)}`;

        const params = {
            method: 'POST',
            body: stringify(this.options),
            headers: headers
        };

        return this.start(params);
    }

    async start({ method, body, headers }) {
        const params = {
            method,
            headers
        }

        this.sauce_search_url = this.utils.addURLParams(this.sauce_search_url, body);
        const response = await fetch(this.sauce_search_url, params);

        if (!response.ok)
            throw new Error(response.statusText);

        const data = await response.json();

        return this.handler.handleData(data, this.response_type);
    }
}

module.exports = {
    SauceSearch
};