<div align="center">
	<br>
	<img border=0 src="https://www.svgrepo.com/show/428658/ethereum-crypto-cryptocurrency-2.svg" height="200">
</div>
<h1 align="center">JS crypto price tracker library</h1>
<p align="center">
  <p align="center">JavaScript library for tracking cryptocurrency and token prices in real time.</p>
</p>


<h2>Installation</h2>
<h4>Add the script to your HTML file:</h4>

```html
<script src="crypto-price-tracker.js"></script>
```

<h3>CDN</h3>

```
https://cdn.jsdelivr.net/gh/cyberuser0x33/crypto-price-tracker@db391da/crypto-price-tracker.js
```
```html
<script src="https://cdn.jsdelivr.net/gh/cyberuser0x33/crypto-price-tracker@db391da/crypto-price-tracker.js"></script>
```
<br>
<h2>Basic Usage:</h2>

* <h4>To track cryptocurrency prices (Now supports any HTML tag):</h4>

```html
<span id="price-{cryptocurrency}-{currency}"></span>
<p id="price-BTC-USD"></p>
<div id="price-ETH-EUR"></div>
```
example:

```html
<span id="price-BTC-USD"></span>
<span id="price-ETH-EUR"></span>
<span id="price-XMR-USD"></span> <!-- XMR only supported in USD -->
```

* <h4>To track token prices by contract:</h4>

```html
<span id="price-contract-{network}-{token contract address on this network}"></span>
```
example:
```html
<span id="price-contract-sol-EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm"></span>
<span id="price-contract-ton-EQBlWgKnh_qbFYTXfKgGAQPxkxFsArDOSr9nlARSzydpNPwA"></span>
```
### In case of obtaining a price through a contract, there is a limit of [30 requests per minute](https://www.geckoterminal.com/dex-api)

<br>
<h2>Configuration</h2>
<h4>The library can be configured as follows:</h4>

```javascript
CryptoPriceTracker.configure({
    delay: 120000,          // Update price interval (min 120,000ms / 120s)
    autoInitialize: true  // Automatic initialization
});
```
> [!NOTE]
> The minimum update interval is fixed at **120 seconds** to ensure reliable data from various APIs.

<h3>Supported Networks</h3>
<table>
    <tr><th>ID Syntax</th><th>Network</th></tr>
    <tr><td>ton</td><td>TON</td></tr>
    <tr><td>sol</td><td>Solana</td></tr>
    <tr><td>eth</td><td>Ethereum</td></tr>
    <tr><td>bsc</td><td>BNB Smart Chain</td></tr>
    <tr><td>tron</td><td>TRON</td></tr>
    <tr><td>avalanche</td><td>Avalanche</td></tr>
    <tr><td>ethc</td><td>Ethereum Classic</td></tr>
    <tr><td>arb</td><td>Arbitrum</td></tr>
    <tr><td>celo</td><td>Celo</td></tr>
    <tr><td>op</td><td>Optimism</td></tr>
    <tr><td>evmos</td><td>Evmos</td></tr>
    <tr><td>arbn</td><td>Arbitrum Nova</td></tr>
    <tr><td>apt</td><td>Aptos</td></tr>
    <tr><td>base</td><td>Base</td></tr>
    <tr><td>polygon</td><td>Polygon POS</td></tr>
    <tr><td>ftm</td><td>Fantom</td></tr>
    <tr><td>zksync</td><td>zkSync Era</td></tr>
    <tr><td>sui</td><td>Sui</td></tr>
    <tr><td>linea</td><td>Linea</td></tr>
    <tr><td>blast</td><td>Blast</td></tr>
    <tr><td>scroll</td><td>Scroll</td></tr>
    <tr><td>mantle</td><td>Mantle</td></tr>
    <tr><td>gnosis</td><td>Gnosis (xDai)</td></tr>
    <tr><td>cro</td><td>Cronos</td></tr>
    <tr><td>manta</td><td>Manta Pacific</td></tr>
    <tr><td>mode</td><td>Mode</td></tr>
    <tr><td>zkEVM</td><td>Polygon zkEVM</td></tr>
    <tr><td>core</td><td>Core</td></tr>
    <tr><td>filecoin</td><td>Filecoin</td></tr>
    <tr><td>ronin</td><td>Ronin</td></tr>
    <tr><td>kava</td><td>Kava</td></tr>
    <tr><td>metis</td><td>Metis</td></tr>
</table>
*(And many more from GeckoTerminal)*

<br>
<h2>Advanced Usage:</h2>

```javascript
const tracker = CryptoPriceTracker.configure({
    autoInitialize: false,
    delay: 120000
});
tracker.initializeElements().start();

// Programmatic access
tracker.getPrice('BTC-USD').then(price => console.log('Current BTC:', price));
```
<h3>Methods</h3>
    <table>
        <tr>
            <th>Method</th>
            <th>Description</th>
        </tr>
        <tr>
            <td>getPrice(query)</td>
            <td>Get price programmatically (returns Promise)</td>
        </tr>
        <tr>
            <td>configure(options)</td>
            <td>Configure the library</td>
        </tr>
        <tr>
            <td>initializeElements()</td>
            <td>Initialize elements</td>
        </tr>
        ...
</table>
<br>
<h3>Price Formatting</h3>
<h4>The library automatically formats prices as follows:</h4>

* <h4>For prices ≥ 1: two decimal places (e.g., 345.03)</h4>
* <h4>For prices < 1: three significant digits after first non-zero (e.g., 0.00345)</h4>
    
<br>

## License
[GNU GPLv3](https://choosealicense.com/licenses/gpl-3.0/)

