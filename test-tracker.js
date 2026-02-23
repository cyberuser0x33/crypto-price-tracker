const CryptoPriceTracker = require('./crypto-price-tracker.js');

// Mock fetch for testing in Node.js
global.fetch = async (url) => {
    console.log(`Fetching: ${url}`);
    if (url.includes('diadata')) {
        return {
            ok: true,
            json: async () => ({ Symbol: "XMR", Price: 304.9248 })
        };
    }
    if (url.includes('coinbase')) {
        return {
            ok: true,
            json: async () => ({ data: { amount: "55000.12345" } })
        };
    }
    return { ok: false };
};

async function runTests() {
    console.log('--- Starting Verification ---');

    const tracker = new CryptoPriceTracker({ delay: 500 }); // Should be overridden to 120,000

    console.log('1. Verifying Minimum Delay (120s):');
    console.log(`   Configured delay: ${tracker.delayLoading}ms (Expected: 120000ms)`);

    console.log('\n2. Verifying getPrice() method:');

    console.log('   Testing BTC-USD:');
    const btcPrice = await tracker.getPrice('BTC-USD');
    console.log(`   Result: ${btcPrice}`);

    console.log('   Testing XMR-USD (Specific API):');
    const xmrUsd = await tracker.getPrice('XMR-USD');
    console.log(`   Result: ${xmrUsd}`);

    console.log('   Testing XMR-EUR (USD only restriction):');
    const xmrEur = await tracker.getPrice('XMR-EUR');
    console.log(`   Result: ${xmrEur}`);

    console.log('\n3. Verifying Network Mapping:');
    const testNetworks = ['polygon', 'ftm', 'sui', 'gnosis', 'zkEVM'];
    testNetworks.forEach(net => {
        const mapped = tracker.networkMapping[net];
        console.log(`   ${net} -> ${mapped}`);
    });

    console.log('\n--- Verification Complete ---');
}

runTests();
