/**
 * Created by nihilis on 3/4/17.
 */

module.exports = (function () {
    var g = require('./globals.json');

    function urlFilter(url) {
        url = url || '#';
        var baseUrl = g.vars.baseUrl.replace(/\/$/g, '');
        var currentUrl = typeof url === 'object' ? url.url : url;
        currentUrl = currentUrl.replace(/^\//g, '');

        return currentUrl === '#' ? '#' : baseUrl + '/' + currentUrl;
    }

    var twigConfig = {
        base: g.vars.base,
        data: {
            isGulp: true,
            'this': {
                pageH1: g.vars.siteName,
                getPageH1: function () {
                    return this.pageH1;
                },
                getPageHeadTitle: function () {
                    return this.pageH1;
                }
            },
            cms: {
                block: function (name, defaultValue) {
                    return g.blocks[name] || defaultValue || '';
                },
                settings: function (name1, name2, defaultValue) {
                    return g.settings[name1][name2] || defaultValue || '';
                },
                breadcrumbs: function () {
                    return g.breadcrumbs;
                },
                data: function (category) {
                    return g.data[category];
                }
            }
        },
        functions: [
            {
                name: 'registerThemeScript',
                func: function (src) {
                    return '<script src="{url}public/{src}"></script>'
                        .replace(/\{src}/g, src)
                        .replace(/\{url}/g, g.vars.baseUrl);
                }
            }, {
                name: 'registerThemeCss',
                func: function (src) {
                    return '<link rel="stylesheet" href="{url}public/{src}">'
                        .replace(/\{src}/g, src)
                        .replace(/\{url}/g, g.vars.baseUrl);
                }
            },
            {
                name: 'gen',
                func: function (item, iterationsCount, startValue) {
                    var total = [];
                    var start = startValue || 1;
                    for (var i = start; i < iterationsCount + start; i++) {
                        var totalItem = JSON.parse(JSON.stringify(item));
                        for (var key in totalItem) {
                            if (typeof totalItem[key] == 'string') {
                                totalItem[key] = totalItem[key].replace(/\{n}/g, '' + i);
                            }
                        }
                        total.push(totalItem);
                    }

                    return total;
                }
            }
        ],
        filters: [
            {
                name: 'url',
                func: urlFilter
            },
            {
                name: 'getimg',
                func: urlFilter
            },
            {
                name: 'nl2br',
                func: function (text, notValid) {
                    return text.replace('\n', '<br>');
                }
            },
            {
                name: 'phoneUrl',
                func: function (text) {
                    text = text || '';
                    return 'tel:' + text.replace('+7', '8').replace(/[^0-9]/g, '');
                }
            }
        ]
    };

    return {
        twigConfig: twigConfig
    }
})();
