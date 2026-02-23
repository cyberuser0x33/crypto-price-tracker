document.addEventListener("DOMContentLoaded", async () => {
    const tracker = new CryptoPriceTracker({ delay: 100000 });
    tracker.initializeElements().onPriceUpdate(updates => { }).start();


    const btcPrice = await tracker.getPrice('BTC-USD');
    console.log(btcPrice);

    const xmrPrice = await tracker.getPrice('XMR-USD');
    console.log(xmrPrice);
});
