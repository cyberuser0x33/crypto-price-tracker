# JS crypto price tracker library
crypto price tracker in JS with api coinbase

## usage: 

---
### in html file
```html
<span id="price-{cryptocurrency}-{currency}"></span>
```
example:
```html
<span id="price-BTC-USD"></span>
<span id="price-ETH-EUR"></span>
```
*in this construction, the word “price” is always in small letters.*

---

### in javascript file 

```javascript
document.addEventListener("DOMContentLoaded", () => {
    const tracker = new CryptoPriceTracker({delay: 1000});
    tracker.initializeElements().onPriceUpdate(updates => {}).start();
});
```
*delay: 1000 - time after which the price will be updated*

recommended to write through the construction 
```javascript
document.addEventListener(“DOMContentLoaded”,() =>{});
```
---
### CDN: 

```
https://cdn.jsdelivr.net/gh/cyberuser0x33/crypto-price-tracker@main/crypto-price-tracker.js
```
---
### original api:
```
https://docs.cdp.coinbase.com/cdp-apis/docs/welcome
```
## License
[GNU GPLv3](https://choosealicense.com/licenses/gpl-3.0/)
