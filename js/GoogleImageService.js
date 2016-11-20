// api key = AIzaSyAbN5opB6x2HVmfXP5E10SEVjN7K9yZQO0
const KEY = 'AIzaSyAbN5opB6x2HVmfXP5E10SEVjN7K9yZQO0';
const CX = '011476009962251898743:ulicglunr7o';
const ORIGIN = 'https://www.googleapis.com/customsearch/v1'
const PARAMS = {
    cx: CX,
    key: KEY,
    searchType: 'image',
};

var GoogleImageService = {
    initialize: function() {
        this.start = 0;
        this.query('Jack Conte');
    },

    query: function(q) {
        const newParams = extendObject(PARAMS, {
            q: q,
        });
        const url = ORIGIN + formatParams(newParams);
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
        request.onload = _loadImages;
        request.send();
    },
};

function _loadImages() {
    console.log(this.responseText);
}

function loadImages() {
    GoogleImageService.initialize();
}

function formatParams(params) {
  return "?" + Object
        .keys(params)
        .map(function(key) { return key+"="+params[key]; })
        .join("&");
}

function extendObject(obj, extraObj) {
    const newObj = {};
    Object.keys(obj).map(function(key) { return newObj[key] = obj[key]; });
    Object.keys(extraObj).map(function(key) { return newObj[key] = obj[key]; });
    return newObj;
}
