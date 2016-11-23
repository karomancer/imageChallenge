// It would be more preferable to hide these server-side so people can't just
// willy-nilly inspect Page Source and kidnap them. That would be a liability.
// But I guess for the purpose of this challenge, it'll just sit here
const KEY = 'AIzaSyAbN5opB6x2HVmfXP5E10SEVjN7K9yZQO0';
const CX = '011476009962251898743:ulicglunr7o';
const ORIGIN = 'https://www.googleapis.com/customsearch/v1'
const PARAMS = {
    cx: CX,
    key: KEY,
    searchType: 'image',
};

// Needed for if API blows up on you
const BACKUP_IMAGES = [{
        title: 'Bunny rolling over',
        image: {
            contextLink: 'http://boredpanda.com/',
            thumbnailLink: 'http://static.boredpanda.com/blog/wp-content/uploads/2015/09/cute-bunnies-25__605.jpg'
        }
    }, {
        title: 'Bunny clapping',
        image: {
            contextLink: 'http://blogspot.com/',
            thumbnailLink: 'http://4.bp.blogspot.com/-HTvSYzA-pO4/UgQb4Zh_u0I/AAAAAAAAEuI/XwhtogT_1tA/s1600/3+cute2.jpg'
        }
    }, {
        title: 'Bunny bad advice',
        image: {
            contextLink: 'http://huffpost.com',
            thumbnailLink: 'http://i.huffpost.com/gen/1170610/images/o-BUNNIES-BAD-ADVICE-facebook.jpg'
        }
    }, {
        title: 'Lionhead buns',
        image: {
            contextLink: 'http://warrenphotographic.co.uk',
            thumbnailLink: 'http://www.warrenphotographic.co.uk/photography/bigs/26687-Two-baby-Lionhead-cross-bunnies-wearing-bells-white-background.jpg'
        }
    },
];

class GoogleImageService {
    constructor() {
        this.dataset = null;
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

    _cleanData(q, response) {
        if (response.match('dailyLimitExceeded')) {
            return {
                q: q,
                items: BACKUP_IMAGES,
                formattedSearchTime: '0.2',
                totalResults: '4',
            };
        };

        if (typeof (response) == 'string') {
            response = JSON.parse(response);
        }

        // Make the data Google responds with a little cleaner for UI use
        const newResponse = extendObject({
            q: q,
            items: [],
        }, response.searchInformation, [
            'formattedSearchTime',
            'totalResults',
        ]);

        response.items.map(item => {
            newResponse.items.push(extendObject({}, item, [
                'title',
                'htmlTitle',
                'link',
                'displayLink',
                'mime',
                'image',
            ]));
        });

        return newResponse;
    }
};