class CryptoPriceTracker {
    static instance = null;
    static autoInitialize = true;

    constructor(options = {}) {
        if (CryptoPriceTracker.instance) {
            return CryptoPriceTracker.instance;
        }
        
        this.delayLoading = options.delay || 500;
        this.baseUrl = options.baseUrl || 'https://api.coinbase.com/v2/prices';
        this.geckoUrl = 'https://api.geckoterminal.com/api/v2/simple/networks';
        this.cache = new Map();
        this.priceElementsMap = new Map();
        this.callbacks = new Set();
        this.intervalId = null;
        this.networkMapping = {
            'ton': 'ton',
            'sol': 'solana',
            'eth': 'eth',
            'bsc': 'bsc',
            'tron': 'tron',
            'avalanche': 'avax',
            'ethc': 'ethereum_classic',
            'arb': 'arbitrum',
            'celo': 'celo',
            'op': 'optimism',
            'evmos': 'evmos',
            'arbn': 'arbitrum_nova',
            'apt': 'aptos',
            'base': 'base'
        };

        CryptoPriceTracker.instance = this;
        
        if (CryptoPriceTracker.autoInitialize && typeof window !== 'undefined') {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.autoInit());
            } else {
                this.autoInit();
            }
        }
    }

    formatPrice(price) {
        const numPrice = parseFloat(price);
        if (numPrice >= 1) {
            return Number(numPrice.toFixed(2)).toString();
        } else {
            const decimals = numPrice.toString().split('.')[1];
            let significantDigits = '';
            let leadingZeros = 0;
            
            for (let i = 0; i < decimals.length; i++) {
                if (decimals[i] !== '0') {
                    significantDigits = decimals.substr(i, 3);
                    break;
                }
                leadingZeros++;
            }
            return `0.${'0'.repeat(leadingZeros)}${significantDigits}`;
        }
    }

    initializeElements(selector = "span[id^='price-']") {
        this.priceElementsMap = new Map(
            Array.from(document.querySelectorAll(selector))
                .map(element => {
                    const id = element.id.replace("price-", "");
                    if (id.startsWith('contract-')) {
                        const [, network, contract] = id.split('-');
                        return [element.id, { element, type: 'contract', network, contract }];
                    } else {
                        const [coin, currency] = id.split("-");
                        return [element.id, { element, type: 'coin', coin: coin.toLowerCase(), currency: currency.toLowerCase() }];
                    }
                })
        );
        return this;
    }

    async fetchPrice(item) {
        if (item.type === 'coin') {
            return this.fetchCoinPrice(item.coin, item.currency);
        } else {
            return this.fetchContractPrice(item.network, item.contract);
        }
    }

    async fetchCoinPrice(coin, currency) {
        const cacheKey = `${coin}-${currency}`;
        const url = `${this.baseUrl}/${coin}-${currency}/buy`;
        
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error("Not found");
            const data = await response.json();
            const price = this.formatPrice(data.data.amount);
            this.cache.set(cacheKey, price);
            return price;
        } catch (error) {
            console.error(`Error for ${coin}:`, error);
            return this.cache.get(cacheKey) || "Not found";
        }
    }

    async fetchContractPrice(network, contract) {
        const cacheKey = `contract-${network}-${contract}`;
        const mappedNetwork = this.networkMapping[network] || network;
        const url = `${this.geckoUrl}/${mappedNetwork}/token_price/${contract}`;

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error("Not found");
            const data = await response.json();
            const price = this.formatPrice(data.data.attributes.token_prices[contract]);
            this.cache.set(cacheKey, price);
            return price;
        } catch (error) {
            console.error(`Error for contract ${contract}:`, error);
            return this.cache.get(cacheKey) || "Not found";
        }
    }

    async updatePrices() {
        const updates = [];
        for (const [id, item] of this.priceElementsMap) {
            const price = await this.fetchPrice(item);
            item.element.textContent = price;
            updates.push({ id, price });
        }
        
        this.callbacks.forEach(callback => callback(updates));
        return updates;
    }

    autoInit() {
        this.initializeElements().start();
    }

    static configure(options = {}) {
        CryptoPriceTracker.autoInitialize = options.autoInitialize ?? true;
        return new CryptoPriceTracker(options);
    }

    onPriceUpdate(callback) {
        this.callbacks.add(callback);
        return this;
    }

    offPriceUpdate(callback) {
        this.callbacks.delete(callback);
        return this;
    }

    start() {
        this.updatePrices();
        this.intervalId = setInterval(() => this.updatePrices(), this.delayLoading);
        return this;
    }

    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        return this;
    }

    getCachedPrice(id) {
        return this.cache.get(id);
    }

    clearCache() {
        this.cache.clear();
        return this;
    }
}

if (typeof window !== 'undefined') {
    window.CryptoPriceTracker = CryptoPriceTracker;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = CryptoPriceTracker;
}
