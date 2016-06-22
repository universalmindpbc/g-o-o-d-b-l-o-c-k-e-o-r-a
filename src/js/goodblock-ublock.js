
/******************************************************************************/

// Goodblock logging

µBlock.goodblock.log = {};

/******************************************************************************/

function getGladlyHostnamesFromConfig() {
    return µBlock.goodblock.config.gladlyHostnames;
}

function getGladlyAdUrlsFromConfig() {
    return µBlock.goodblock.config.gladlyAdUrls;
}

µBlock.goodblock.gladlyHostnames = getGladlyHostnamesFromConfig();
µBlock.goodblock.gladlyAdServerDomains = getGladlyHostnamesFromConfig();
µBlock.goodblock.gladlyAdUrls = getGladlyAdUrlsFromConfig();

/******************************************************************************/

µBlock.goodblock.isGladlyHostname = function(hostname) {
    return (µBlock.goodblock.gladlyHostnames.indexOf(hostname) > -1);
}

/******************************************************************************/

µBlock.goodblock.isGladlyAdServer = function(hostname) {
    return (µBlock.goodblock.gladlyAdServerDomains.indexOf(hostname) > -1);
}

/******************************************************************************/

// Make sure this extension version is logged to the DB.
µBlock.goodblock.syncExtensionVersion = function() {
    µBlock.goodblock.API.getLoggedExtensionVersion().then(function(data) {

        // If the current version doesn't match the remote version,
        // update the remote version.
        var version = chrome.app.getDetails().version;
        if (version !== data.version) {
            µBlock.goodblock.API.logExtensionVersion(version);
        }
    });
}

/******************************************************************************/

function fetchWhitelistFromStorage(callback) {
    vAPI.storage.get({'netWhitelist': ''}, function(response) {
        callback(µBlock.whitelistFromString(response.netWhitelist));
    });
}

// Send net whitelist filter to the DB if needed.
µBlock.goodblock.syncWhitelist = function() {
    var whitelistSynced = (
        localStorage['whitelistSynced'] === 'true' ? true : false
    );

    // We've already synced the whitelist.
    if (whitelistSynced) {
        return;
    }

    // If we don't have a user auth token, we can't log
    // right now.
    var token = µBlock.goodblock.getUserAuthToken();
    if (!token) {
        return;
    }

    fetchWhitelistFromStorage(function(whitelist) {
        Object.keys(whitelist).forEach(function(url) {
            µBlock.goodblock.API.logWhiteListDomain(url);
        });
        localStorage['whitelistSynced'] = 'true';
    })
}

/******************************************************************************/

µBlock.goodblock.setIfShouldEnableGoodblock = function(shouldEnable) {
    localStorage['enableGbContentScript'] = shouldEnable.toString();
};

// Determine whether we should enable Goodblock for this extension version.
µBlock.goodblock.checkIfShouldEnableGoodblock = function() {

    var version = chrome.app.getDetails().version;

    µBlock.goodblock.API.getGooblockEnabledStatus().then(function(data) {
        var versionStatuses = data.results;
        var isVersionEnabled = false;
        versionStatuses.forEach(function(versionStatus) {
            if (versionStatus.version === version && versionStatus.status) {
                isVersionEnabled = true;
            } 
        });

        var currentContentScriptEnableStatus = (
            localStorage['enableGbContentScript'] === 'true' ? true : false
        );

        µBlock.goodblock.setIfShouldEnableGoodblock(isVersionEnabled);

        if(!currentContentScriptEnableStatus && isVersionEnabled) {
            //if going from false to true, destroy and recreate GB elems
            vAPI.injectGoodblockContentScriptsInAllTabs();
        }
    });
};

/******************************************************************************/

µBlock.goodblock.postLogin = function() {
};

/******************************************************************************/

var TOKEN_LOCAL_STORAGE_KEY = 'goodblockToken';

µBlock.goodblock.setUserAuthToken = function(token) {
  var currentToken = µBlock.goodblock.getUserAuthToken();

  // If the new token is different from the old one, set it.
  if (token != currentToken) {
    vAPI.localStorage.setItem(TOKEN_LOCAL_STORAGE_KEY, token);

    // Handle anything we need to do after logging in.
    µBlock.goodblock.postLogin();
  } 
};

µBlock.goodblock.getUserAuthToken = function() {
  return vAPI.localStorage.getItem(TOKEN_LOCAL_STORAGE_KEY)
};

/******************************************************************************/

// API access
µBlock.goodblock.API = {};
µBlock.goodblock.API.baseUrl = µBlock.goodblock.config.baseUrl + '/api';
µBlock.goodblock.API.fetchEndpoint = function(method, endpoint, data) {
  var dataToSend = data;
  return new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open(method, endpoint);

    xhr.setRequestHeader('Accept', 'application/json');
    xhr.setRequestHeader('Content-Type', 'application/json');

    // If we have a token, use it.
    var token = µBlock.goodblock.getUserAuthToken();
    if (token) {
        xhr.setRequestHeader('Authorization', 'Token ' + token);
    }
    xhr.onload = function () {
      if (this.status >= 200 && this.status < 300) {
        resolve(JSON.parse(xhr.response));
      } else {
        reject({
          status: this.status,
          statusText: xhr.statusText
        });
      }
    };
    xhr.onerror = function () {
      reject({
        status: this.status,
        statusText: xhr.statusText
      });
    };

    // Add the body to the request if it's not a GET or HEAD request.
    if (['GET', 'HEAD'].indexOf(method) === -1) {
        // `data` parameter is optional.
        var data = dataToSend || {};
        xhr.send(JSON.stringify(data));
    } else {
      xhr.send();
    }
  });
};

µBlock.goodblock.API.getLoggedExtensionVersion = function() {
    var url = µBlock.goodblock.API.baseUrl + '/log-extversion/get-user-extension-version/';
    return µBlock.goodblock.API.fetchEndpoint('GET', url);
};

µBlock.goodblock.API.logExtensionVersion = function(version) {
    var data = {
        version: version,
    };
    var url = µBlock.goodblock.API.baseUrl + '/log-extversion/';
    return µBlock.goodblock.API.fetchEndpoint('POST', url, data);
};

µBlock.goodblock.API.getUserData = function() {
    var url = µBlock.goodblock.API.baseUrl + '/me/';
    return µBlock.goodblock.API.fetchEndpoint('GET', url);
};

// Get the extension versions that should have the Goodblock
// content script enabled.
µBlock.goodblock.API.getGooblockEnabledStatus = function() {
    var url = µBlock.goodblock.API.baseUrl + '/goodblock-status/';
    return µBlock.goodblock.API.fetchEndpoint('GET', url);
};

// Log a white list domain
µBlock.goodblock.API.logWhiteListDomain = function(pageUrl) {
    
    var domain = pageUrl;
    
    // Uncomment this to log only the domain instead of the complete url.
    // if (pageUrl.indexOf("://") > -1) {
    //     domain = pageUrl.split('/')[2];
    // }
    // else {
    //     domain = pageUrl.split('/')[0];
    // }
    // domain = domain.split(':')[0];

    console.log('Whitelisted: ' + domain);
    var data = {
        whitelist_url: domain,
    };

    var url = µBlock.goodblock.API.baseUrl + '/log-whitelist-url/';
    return µBlock.goodblock.API.fetchEndpoint('POST', url, data);
};

/******************************************************************************/

µBlock.goodblock.syncExtensionVersion();
µBlock.goodblock.syncWhitelist();

var syncData = function() {
     // console.log('Polling server.');
    µBlock.goodblock.checkIfShouldEnableGoodblock();
};
syncData();

// Check every once in a while to get the latest time to wake.
// The time may have changed via interaction on another device, or
// it may have changed server-side.
var poller = setInterval(syncData, µBlock.goodblock.config.timeMsToPollServer);

/******************************************************************************/

module.exports = µBlock.goodblock;
