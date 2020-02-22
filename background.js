function getQueryVariable(url, variable) {
    const search = url.split('?')[1];
    if (!search) {
        return null;
    }
    const vars = search.split('&');
    for (let i = 0; i < vars.length; i++) {
        const pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) === variable) {
            return decodeURIComponent(pair[1]);
        }
    }

    return null;
}

function updateQueryStringParameter(uri, key, value) {
    const re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
    const separator = uri.indexOf('?') !== -1 ? "&" : "?";
    if (uri.match(re)) {
        return uri.replace(re, '$1' + key + "=" + value + '$2');
    }
    else {
        return uri + separator + key + "=" + value;
    }
}

let settings = null;

function syncSettings() {
    chrome.storage.sync.get({
        enabled: true,
        authuser: 0,
        force: false,
    }, function (input) {
        console.log('settings', input);
        settings = input;
    });
}


chrome.storage.onChanged.addListener(function (changes, namespace) {
    syncSettings();
});

chrome.webRequest.onBeforeRequest.addListener(function (info) {
        const url = info.url;
        const authUser = getQueryVariable(url, 'authuser');

        if (!settings.enabled || authUser === settings.authuser) return {cancel: false};
        if (!settings.force && authUser) return {cancel: false};

        return {redirectUrl: updateQueryStringParameter(url, 'authuser', settings.authuser)};

    },
    {
        urls: ['https://*.cloud.google.com/*'],
        types: ['main_frame'],
    },
    ['blocking'],
);

syncSettings();
