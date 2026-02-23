class CryptoPriceTracker {
    static instance = null;
    static autoInitialize = true;

    constructor(options = {}) {
        if (CryptoPriceTracker.instance) {
            return CryptoPriceTracker.instance;
        }

        // Minimum delay is 120 seconds (120000 ms) as per requirements
        this.delayLoading = Math.max(options.delay || 120000, 120000);
        this.baseUrl = options.baseUrl || 'https://api.coinbase.com/v2/prices';
        this.geckoUrl = 'https://api.geckoterminal.com/api/v2/simple/networks';
        this.diaUrl = 'https://api.diadata.org/v1/assetQuotation/Monero/0x0000000000000000000000000000000000000000';
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
            'base': 'base',
            'polygon': 'polygon_pos',
            'ftm': 'ftm',
            'zksync': 'zksync',
            'sui': 'sui-network',
            'linea': 'linea',
            'blast': 'blast',
            'scroll': 'scroll',
            'mantle': 'mantle',
            'gnosis': 'xdai',
            'cro': 'cro',
            'manta': 'manta-pacific',
            'mode': 'mode',
            'zkEVM': 'polygon-zkevm',
            'core': 'core',
            'filecoin': 'filecoin',
            'ronin': 'ronin',
            'kava': 'kava',
            'metis': 'metis'
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
        if (isNaN(numPrice)) return "Pending";
        if (numPrice >= 1) {
            return Number(numPrice.toFixed(2)).toString();
        } else {
            const decimals = numPrice.toFixed(10).split('.')[1];
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

    initializeElements(selector = "[id^='price-']") {
        this.priceElementsMap = new Map();
        document.querySelectorAll(selector).forEach(element => {
            const parsed = this._parseId(element.id);
            if (parsed) {
                this.priceElementsMap.set(element.id, { element, ...parsed });
            }
        });
        return this;
    }

    _parseId(id) {
        const cleanId = id.replace("price-", "");
        if (cleanId.startsWith('contract-')) {
            const parts = cleanId.split('-');
            if (parts.length >= 3) {
                return { type: 'contract', network: parts[1], contract: parts[2] };
            }
        } else {
            const parts = cleanId.split("-");
            if (parts.length >= 2) {
                return { type: 'coin', coin: parts[0].toUpperCase(), currency: parts[1].toUpperCase() };
            }
        }
        return null;
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

        // Handle XMR specifically as per requirements
        if (coin === 'XMR') {
            if (currency !== 'USD') {
                return "supported only in USD";
            }
            return this.fetchXMRPrice();
        }

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

    async fetchXMRPrice() {
        try {
            const response = await fetch(this.diaUrl);
            if (!response.ok) throw new Error("DIA API Error");
            const data = await response.json();
            const price = this.formatPrice(data.Price);
            this.cache.set('XMR-USD', price);
            return price;
        } catch (error) {
            console.error("Error for XMR:", error);
            return this.cache.get('XMR-USD') || "Not found";
        }
    }

    async fetchContractPrice(network, contract) {
        const cacheKey = `contract-${network}-${contract}`;
        const mappedNetwork = this.networkMapping[network] || network;
        const url = `${this.geckoUrl}/${mappedNetwork}/token_price/${contract}`;

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error("Gecko API Error");
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
        const updatePromises = Array.from(this.priceElementsMap.entries()).map(async ([id, item]) => {
            const price = await this.fetchPrice(item);
            if (item.element) {
                item.element.textContent = price;
            }
            return { id, price };
        });

        const results = await Promise.all(updatePromises);
        this.callbacks.forEach(callback => callback(results));
        return results;
    }

    async getPrice(queryString) {
        const item = this._parseId(queryString.startsWith('price-') ? queryString : `price-${queryString}`);
        if (!item) return "Invalid format";
        return this.fetchPrice(item);
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
        if (this.intervalId) clearInterval(this.intervalId);
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

