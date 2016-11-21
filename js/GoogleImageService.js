// It would be more preferable to hide these server-side so people can't just
// willy-nilly inspect Page Source and kidnap them. That would be a liability.
const KEY = 'AIzaSyAbN5opB6x2HVmfXP5E10SEVjN7K9yZQO0';
const CX = '011476009962251898743:ulicglunr7o';
const ORIGIN = 'https://www.googleapis.com/customsearch/v1'
const PARAMS = {
    cx: CX,
    key: KEY,
    searchType: 'image',
};

class GoogleImageService {
    constructor() {
        this.dataset = null;
    }

    _cleanData(q, response) {
        if (typeof (response) == 'string') {
            response = JSON.parse(response);
        }

        // Make the data Google responds with a little cleaner for UI use
        const newResponse = extendObject({
            q: q,
            items: [],
        }, response.searchInformation, [
            'searchTime',
            'totalResults',
        ]);

        response.items.map(item => {
            newResponse.items.push(extendObject({}, item, [
                'title',
                'displayLink',
                'mime',
                'image',
            ]));
        });

        return newResponse;
    }

    query(q) {
        // If someone tries to query the exact same thing again,
        // don't search again. That's just silly.
        if (this.dataset && q == this.dataset.q) {
            return new Promise((resolve, reject) => {
                resolve(this.dataset);
            });
        }

        const newParams = extendObject(PARAMS, {
            q: q,
        });
        const url = ORIGIN + formatParams(newParams);
        return new Promise((resolve, reject) => {
            let request = new XMLHttpRequest();

            if ('withCredentials' in request) {
                // XMLHTTPRequest2 objets have 'withCredentials'
                request.open('GET', url);
            } else if (typeof XDomainRequest != 'undefined') {
                // IE's way of doing CORS
                request = new XDomainRequest();
                request.open('GET', url);
            } else {
                request = null;
            }

            if (!request) {
                throw new Error('I can\'t even do this.');
            }
            request.setRequestHeader('Access-Control-Allow-Origin', ORIGIN);
            request.onload = () => {
                const status = request.status;
                if (status >= 200 && status < 300) {
                    this.dataset = this._cleanData(q, request.response);
                    resolve(this.dataset);
                } else {
                    reject({
                        status: status,
                        statusText: request.statusText,
                    });
                }
            };

            request.onerror = () => {
                reject({
                    status: request.status,
                    statusText: request.statusText,
                });
            }

            request.send();
        });
    }
};