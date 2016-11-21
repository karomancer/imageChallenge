function formatParams(params) {
  return "?" + Object
        .keys(params)
        .map(function(key) { return key+"="+params[key]; })
        .join("&");
}

// Takes two objects and combines into one object,
// Note: The second provided object overwrites fields in the first.
// Also takes a whitelist if you only want to combine certain fields from object 2.
function extendObject(obj, extraObj, fieldWhitelist) {
    const newObj = {};
    Object.keys(obj).map(key => { newObj[key] = obj[key]; });
    Object.keys(extraObj).map(key => {
        if (fieldWhitelist && fieldWhitelist.indexOf(key) == -1) { return; }
        return newObj[key] = extraObj[key];
    });
    return newObj;
}
