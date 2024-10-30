# crypto-price-tracker
crypto price tracker in JS with api coinbase

usage: 

in html file
<span id="price-{cryptocurrency}-{currency}"></span>

example:
<span id="price-BTC-USD"></span>
<span id="price-ETH-EUR"></span>
in this construction, the word “price” is always in small letters.


in you js file 

example:
document.addEventListener("DOMContentLoaded", () => {
    const tracker = new CryptoPriceTracker({delay: 1000});
    tracker.initializeElements().onPriceUpdate(updates => {}).start();
});

delay: 1000 - time after which the price will be updated 
recommended to write through the construction document.addEventListener(“DOMContentLoaded”....)
-------------------

original api: https://docs.cdp.coinbase.com/cdp-apis/docs/welcome

cdn: https://cdn.jsdelivr.net/gh/cyberuser0x33/crypto-price-tracker@main/crypto-price-tracker.js

