const indexes = require('./struct/indexes');

const { Utils } = require('./Utils')

class Handler {
    constructor() {
        this.utils = new Utils();
    }
    handleResults(results) {
        return results.map((result) => {
            const { header, data } = result;

            const indexNameRegEx = /((Index #\d+\:\s)|(\s-\s\S+)|([!@#$%^&*(),.?":{}|<>]))/gi;
            header.index_name = header.index_name.replace(indexNameRegEx, '');

            let data_obj = {}
            switch (header.index_id) {
                // FAKKU(16) & 2D-Market(19) & AniDB (21|22) & Madokami(36) & MangaDex(37)
                case 16:
                case 19:
                case 21:
                case 22:
                case 36:
                case 37:
                    data_obj = this.renameOwnObjectProperties(data, [
                        ['source', 'title']
                    ]);
                    break;
                // Danbooru(9) & Yande.re(12) & FAKKU(16) & H-misc(18) & 2D-Market(19) & Gelbooru(25) & Konachan(26) & Sankaku Channel(27) & e621(29)
                case 9:
                case 12:
                case 16:
                case 18:
                case 19:
                case 25:
                case 26:
                case 27:
                case 29:
                    data_obj = this.renameOwnObjectProperties(data, [
                        ['creator', 'author']
                    ]);
                    break;
                // Pixiv(5|6) & Nico Nico Seiga(8) & drawr Images(10) & Nijie Images(11) & MediBang(20) & bcy.net(31|32)
                case 5:
                case 6:
                case 8:
                case 10:
                case 11:
                case 20:
                case 31:
                case 32:
                    data_obj = this.renameOwnObjectProperties(data, [
                        ['member_name', 'author'],
                        ['member_id', 'pixiv_author_id']
                    ]);
                    break;
                // deviantArt(34)
                case 34:
                    data_obj = this.renameOwnObjectProperties(data, [
                        ['author_name', 'author']
                    ]);
                    break;
                // MediBang(20)
                case 20:
                    data_obj = this.renameOwnObjectProperties(data, [
                        ['url', 'source']
                    ]);
                    break;
                // Pawoo(35)
                case 35:
                    data_obj = this.renameOwnObjectProperties(data, [
                        ['pawoo_user_display_name', 'author']
                    ]);
                    break;
                // H-Misc(18)
                case 18:
                    data_obj.title = data.eng_name ? data.eng_name : data.jp_name;
                    break;
            }

            if (data.ext_urls)
                data_obj.ext_urls = this.handleExtUrls(data.ext_urls);

            if (data_obj.source) {
                if (data_obj.source.match(/pximg/g)) {
                    const [pixivIllustId] = data_obj.source.split('/').slice(-1);

                    data_obj.source = `https://www.pixiv.net/member_illust.php?mode=medium&illust_id=${pixivIllustId}`;
                }
            }

            return {
                header,
                data: data_obj
            };
        });
    }

    getHighSimilarityResults(header, results) {
        const handled_results = this.handleResults(results);

        return handled_results.filter(result => parseFloat(result.header.similarity) > header.minimum_similarity);
    }

    getAssignedResults(header, results) {
        const handled_results = this.getHighSimilarityResults(header, results);

        return handled_results.reduce((acc, result) => {
            const objEntries = Object.entries(result.data);

            if (!acc.similarity)
                acc.similarity = Number(result.header.similarity);

            for (const [key, value] of objEntries) {
                if (!acc[key]) {
                    acc = Object.assign(acc, { [key]: value });
                } else
                    if (key === 'ext_urls') {
                        acc[key] = this.utils.uniqueArray([...acc[key], ...value], 'index_name');
                    }
            }

            return acc;
        }, {});
    }

    handleData(data, response_type) {
        const { header, results } = data;

        let arr = [];
        switch (response_type) {
            case 1:
                arr = this.handleResults(results);
                break;
            case 2:
                arr = this.getHighSimilarityResults(header, results);
                break;
            case 3:
                arr = this.getAssignedResults(header, results);
                break;
            default:
                arr = results;
                break;
        }

        return { header, results: arr };
    }

    handleExtUrls(ext_urls) {
        const external_urls = Array.from(new Set(ext_urls)).map(url => {
            const index = indexes.find(({ index_domain }) => url.includes(index_domain));

            if (!index)
                return;

            return {
                index_name: index.index_name,
                url: url
            }
        });

        return external_urls;
    }

    renameOwnObjectProperties(obj, properties) {
        const object = new Object(obj)

        for (const [oldp, newp] of properties) {
            if ((oldp === newp) || !object.hasOwnProperty(oldp))
                continue;

            object[newp] = object[oldp];
            delete object[oldp];
        }
        return object;
    }
}

module.exports = {
    Handler
};