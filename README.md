<h1 align="center">
<sub>
<img  src="https://github.com/gladly-team/goodblock/blob/master/src/img/icon_128.png"
      height="38"
      width="38">
</sub>
  Goodblock
</h1>
<p align="center">
  <sup> 
        The ad blocker with a purpose.
  </sup>
</p>

## About

Goodblock filters your ads so you only see one beautiful, charitable ad each day. By blocking ads, the Goodblock ad blocker protects your data from online trackers and loads webpages faster.

We don’t believe in "acceptable ads" that you see without consent. Instead, every day we provide one ad we think you’ll enjoy. You can choose to see it and then donate the revenue from that ad to a partnered charity, including Save the Children, Action Against Hunger and Water.org.

Learn more: [https://goodblock.gladly.io/](https://goodblock.gladly.io/)

## Installing

Visit the [Goodblock homepage](https://goodblock.gladly.io/) to install.

For Chrome, you can also download Goodblock directly from the [Chrome Web Store](https://chrome.google.com/webstore/detail/goodblock-ad-blocker/oihioooajpekhlgknlekbifgcjlfehje).

## About the required permissions

The Goodblock Chrome extension requires a handful of browser permissions to block ads and trackers. These permissions are similar to other extensions, including Privacy Badger, Adblock Plus, and uBlock Origin. Here's an overview of what they're used for:

#### "Access your data on all web sites"

- To be able to inspect all net requests so that they can be cancelled if needed.
- To hide ad containers on webpages to make pages less cluttered.

#### "Access your tabs and browsing activity"

This is necessary to be able to:

- Create new tabs (when you click on a filter list, to see its content)
- To detect when a tab is added or removed:
- To update badge
- To flush from memory internal data structures
- To find out which tab is currently active (to fill popup menu with associated stats/settings)
- To be able to inject the element picker script
- To implement the popup-blocker

#### "Change your privacy-related settings"

This is necessary to be able to:

- Disable _"Prefetch resources to load pages more quickly"_
    - This will ensure no TCP connection is opened **at all** for blocked requests, preventing leakage of your IP address to untrusted remote servers.
    - For pages with lots for blocked requests, this will actually remove overhead from page load (if you did not have the setting already disabled).
    - See the [`"privacy"`](https://developer.chrome.com/extensions/privacy) Chrome extension permission description
- Disable [hyperlink auditing/beacon](http://www.wilderssecurity.com/threads/hyperlink-auditing-aka-a-ping-and-beacon-aka-navigator-sendbeacon.364904/)

#### Other permissions
* [**browsingData**](https://developer.chrome.com/extensions/browsingData): to allow [clearing the browser cache](http://developer.chrome.com/extensions/browsingData#method-removeCache).
* [**contentSettings**](https://developer.chrome.com/extensions/contentSettings.html): to [enable javascript](http://developer.chrome.com/extensions/contentSettings#property-javascript) for all web pages so that uMatrix can fully control execution of javascript using the `Content-Security-Policy: script-src 'none'` header directive.
* [**cookies**](https://developer.chrome.com/extensions/cookies): to allow the removal of blocked cookies.
* [**privacy**](https://developer.chrome.com/extensions/privacy): for uMatrix to be able to disable the setting _"Prefetch resources to load pages more quickly"_. This is to ensure your IP address do not leak to the remote servers of blocked network requests.
* [**storage**](https://developer.chrome.com/extensions/storage): to store your own whitelist/blacklist domains/objects and all other settings.
* [**tabs**](https://developer.chrome.com/extensions/tabs): to enable forcing a reload of the content of a tab (when the content of the whitelist/blacklist change).
* [**unlimitedStorage**](https://developers.google.com/chrome/whitepapers/storage#unlimited): to allow a user to update various assets used by uMatrix (like preset blacklists, preset recipes, etc.) by fetching the latest versions from Github and saving them locally.
* [**webNavigation**](http://developer.chrome.com/extensions/webNavigation): to listen to [onBeforeNavigate](http://developer.chrome.com/extensions/webNavigation.html#event-onBeforeNavigate) events in order to set up HTTPSB's internal data structure for a specific web page.
* [**webRequest**](http://developer.chrome.com/extensions/webRequest): to allow intercepting all requests in order to inspect them.
* [**webRequestBlocking**](http://developer.chrome.com/extensions/webRequest#manifest): to be able to block a request if the object of the request is blacklisted.
* `http://*/*` & `https://*/*`: to be able to inspect HTTP net requests for all URLs (necessary in order to decide whether a block directive should be enforced).

## License

[GPLv3](https://github.com/gladly-team/goodblock/blob/master/LICENSE.txt).

## Acknowledgements

We're grateful to the contributers to [uBlock Origin](https://github.com/gorhill/uBlock) and [uBlock](https://github.com/chrisaljoudi/uBlock), who have written much of the open source code used here.

This wiki draws heavily on the work of contributers to the [uBlock Origin wiki](https://github.com/gorhill/uBlock/wiki) and the [uMatrix wiki](https://github.com/gorhill/uMatrix/wiki/About-the-required-permissions).

Thanks to the hundreds of people who help maintain the filter lists that power Goodblock and other ad blockers and privacy extensions.
