
document.addEventListener("DOMContentLoaded", () => {
    const tracker = new CryptoPriceTracker({delay: 1000});
    tracker.initializeElements().onPriceUpdate(updates => {}).start();
});



  